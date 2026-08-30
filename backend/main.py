"""
Tarini — AI Voice Livelihood Assessment Platform
SIH 2026 Problem Statement #26097

Backend: FastAPI + pandas (reference data) + SQLite (user profiles/sessions)

Run locally:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Deploy (Render/Railway etc.):
    uvicorn main:app --host 0.0.0.0 --port $PORT
"""

import ast
import difflib
import os
import re
import sqlite3
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Optional

import pandas as pd
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from extraction.extract_skills import extract_skills, generate_llm_response

load_dotenv()  # reads GROQ_API_KEY from a local .env file if present

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = Path("/tmp/tarini.db") if os.environ.get("VERCEL") else BASE_DIR / "tarini.db"


GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_TRANSCRIBE_URL = "https://api.groq.com/openai/v1/audio/transcriptions"
GROQ_STT_MODEL = "whisper-large-v3-turbo"  # fast + strong multilingual accuracy, good for Hindi/Hinglish

app = FastAPI(title="Tarini API", version="1.0.0")

# Allow the GitHub Pages frontend (and local dev) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your exact GitHub Pages origin before final submission
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Load reference data
# ---------------------------------------------------------------------------

qp_df = pd.read_csv(DATA_DIR / "qp_codes.csv", keep_default_na=False)
occ_df = pd.read_csv(DATA_DIR / "occupations.csv")
phrase_df = pd.read_csv(DATA_DIR / "phrase_variations.csv")

# occupations.csv stores linked_qp_codes as a python-list-looking string -> parse it
occ_df["linked_qp_codes"] = occ_df["linked_qp_codes"].apply(ast.literal_eval)

# phrase_variations.csv: user_phrase_variations is also a stringified list
phrase_df["user_phrase_variations"] = phrase_df["user_phrase_variations"].apply(ast.literal_eval)

# The phrase file uses slightly different skill-cluster names than occupations.csv
# (e.g. "Allied Agricultural & Livestock Worker" vs "Farmer / Agricultural Worker").
# Map every phrase-cluster name to the closest real occupation_name so we can pull QP codes.
SKILL_ALIAS_TO_OCCUPATION = {
    "healthcare worker": "Healthcare Worker",
    "traditional handicraft & textile worker": "Textile / Handicraft Worker",
    "allied agricultural & livestock worker": "Farmer / Agricultural Worker",
    "basic infrastructure construction worker": "Construction Worker",
    "retail worker": "Retail Worker",
}

# Flatten phrase table into (phrase, mapped_skill, intent) rows for fast fuzzy search
FLAT_PHRASES = []
for _, row in phrase_df.iterrows():
    for phrase in row["user_phrase_variations"]:
        FLAT_PHRASES.append(
            {"phrase": phrase.lower().strip(), "mapped_skill": row["mapped_skill"], "intent": row["intent"]}
        )


def normalize(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\u0900-\u097F\s]", " ", text)  # keep Devanagari + latin + digits
    text = re.sub(r"\s+", " ", text)
    return text


def match_phrase(user_text: str):
    """
    Fuzzy-match free-form user speech/text against known phrase variations.
    Returns (mapped_skill, intent, confidence, matched_example) or (None, None, 0, None).
    """
    norm_input = normalize(user_text)
    if not norm_input:
        return None, None, 0.0, None

    best = {"score": 0.0, "row": None}

    for entry in FLAT_PHRASES:
        norm_phrase = normalize(entry["phrase"])

        # 1) token overlap score (handles word-order differences, partial matches)
        input_tokens = set(norm_input.split())
        phrase_tokens = set(norm_phrase.split())
        if phrase_tokens:
            overlap = len(input_tokens & phrase_tokens) / len(phrase_tokens)
        else:
            overlap = 0.0

        # 2) sequence similarity (handles typos / STT mis-transcription)
        seq_ratio = difflib.SequenceMatcher(None, norm_input, norm_phrase).ratio()

        score = max(overlap, seq_ratio)
        if score > best["score"]:
            best = {"score": score, "row": entry}

    if best["row"] and best["score"] >= 0.42:
        r = best["row"]
        return r["mapped_skill"], r["intent"], round(best["score"], 2), r["phrase"]
    return None, None, round(best["score"], 2) if best["row"] else 0.0, None


def get_courses_for_skill(mapped_skill: str, education_level: Optional[str] = None):
    occ_name = SKILL_ALIAS_TO_OCCUPATION.get(mapped_skill.lower(), mapped_skill)
    match = occ_df[occ_df["occupation_name"].str.lower() == occ_name.lower()]
    if match.empty:
        return [], occ_name

    qp_codes = match.iloc[0]["linked_qp_codes"]
    courses = qp_df[qp_df["qp_code"].isin(qp_codes)].to_dict(orient="records")

    if education_level:
        courses = [c for c in courses if is_eligible(education_level, c["eligibility"])]

    return courses, occ_name


EDU_RANK = {"none": 0, "5th pass": 5, "8th pass": 8, "10th pass": 10, "12th pass": 12, "8th pass + iti": 9}


def is_eligible(user_edu: str, required_edu: str) -> bool:
    user_key = user_edu.strip().lower()
    req_key = str(required_edu).strip().lower()
    if req_key in ("none", "nan"):
        return True
    return EDU_RANK.get(user_key, 0) >= EDU_RANK.get(req_key, 99)


# ---------------------------------------------------------------------------
# Conversational reply generation (bilingual Hindi + English, friendly tone)
# ---------------------------------------------------------------------------

INTENT_OPENERS = {
    "course_enquiry": [
        "Bahut badhiya! Is field mein kuch achhe courses hain jo aapke liye perfect ho sakte hain 🙂",
        "Great choice! Yeh raha kuch options jo isi kaam se juday hain —",
    ],
    "skill_learning": [
        "Wah, naya hunar seekhna bahut accha decision hai! Yeh courses aapko step-by-step sikhayenge —",
        "Sure! Chaliye dekhte hain aap yeh skill kaise seekh sakte hain —",
    ],
    "business_startup": [
        "Apna khud ka kaam shuru karna badi baat hai — main aapki poori madad karunga! Yeh courses self-employment ke liye best hain —",
        "Great, apna business shuru karna chahte hain! Yeh training aapko dhanda set karna sikhayegi —",
    ],
}

NO_MATCH_REPLIES = [
    "Maaf kijiye, main abhi thoda confuse ho gaya 🙈 — kya aap thoda aur detail mein bata sakte hain aap kaunsa kaam seekhna chahte hain? Jaise — silai, kheti, healthcare, ya construction?",
    "Hmm, mujhe pura samajh nahi aaya. Aap yeh bata sakte hain — aap kis field mein kaam ya training dhoondh rahe hain? (health, retail, kheti, construction, IT, textile...)",
]

FOLLOWUP_BY_INTENT = {
    "course_enquiry": "Aap abhi kitni padhai tak pahunche hain? (jaise 8th pass, 10th pass, 12th pass) — isse main sahi course dikha paunga.",
    "skill_learning": "Aap yeh kaam ghar baithe seekhna chahte hain ya training center jaake?",
    "business_startup": "Aapke paas is kaam ke liye jagah/zameen ya thoda paisa lagane ki suvidha hai kya? Isse main sahi scheme bhi bata sakta hoon.",
}


def build_reply(mapped_skill, intent, confidence, courses, occ_name):
    import random

    opener = random.choice(INTENT_OPENERS.get(intent, ["Yeh raha jo aapke liye best hoga —"]))
    lines = [opener]

    if not courses:
        lines.append(
            f"'{occ_name}' field ke liye abhi detailed courses list nahi mil paayi, lekin main aapko sahi jagah bhej sakta hoon."
        )
    else:
        for c in courses[:4]:
            duration_days = round(c["duration_hours"] / 8)
            self_emp = "Ismein aap apna khud ka kaam bhi shuru kar sakte hain 💪" if c["self_employment_possible"] else ""
            lines.append(
                f"• **{c['job_role']}** ({c['qp_code']}) — NSQF Level {c['nsqf_level']}, "
                f"lagbhag {c['duration_hours']} ghante (~{duration_days} din) ka course, "
                f"eligibility: {c['eligibility']}. {self_emp}"
            )

    followup = FOLLOWUP_BY_INTENT.get(intent, "Kya aap chahenge main aapko iska syllabus ya nearest training center bhi bataun?")
    lines.append(followup)

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# SQLite: user profiles + chat session log
# ---------------------------------------------------------------------------

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """CREATE TABLE IF NOT EXISTS profiles (
            user_id TEXT PRIMARY KEY,
            name TEXT,
            age INTEGER,
            gender TEXT,
            education TEXT,
            location TEXT,
            phone TEXT,
            interests TEXT,
            preferred_language TEXT,
            updated_at TEXT
        )"""
    )
    conn.execute(
        """CREATE TABLE IF NOT EXISTS chat_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            user_id TEXT,
            user_message TEXT,
            matched_skill TEXT,
            intent TEXT,
            confidence REAL,
            bot_reply TEXT,
            created_at TEXT
        )"""
    )
    conn.commit()
    conn.close()


init_db()


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    message: str
    education_level: Optional[str] = None  # optional context to filter eligible courses


class ChatResponse(BaseModel):
    session_id: str
    reply_text: str
    matched_skill: Optional[str]
    intent: Optional[str]
    confidence: float
    courses: List[dict]
    is_fallback: bool


class ProfileIn(BaseModel):
    user_id: Optional[str] = None
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    education: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    interests: Optional[str] = None
    preferred_language: Optional[str] = "hi-en"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Tarini API"}


@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...), language: Optional[str] = Form(None)):
    """
    Speech-to-text via Groq's hosted Whisper endpoint.
    Frontend records mic audio (webm/wav) with MediaRecorder and POSTs it here.
    `language` should be "hi" or "en" (ISO-639-1) — omit to let Whisper auto-detect.
    """
    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not set on the server. Add it to backend/.env or your host's env vars.",
        )

    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Empty audio file received.")

    files = {"file": (file.filename or "audio.webm", audio_bytes, file.content_type or "audio/webm")}
    data = {"model": GROQ_STT_MODEL, "response_format": "json"}
    if language:
        data["language"] = language

    try:
        resp = requests.post(
            GROQ_TRANSCRIBE_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            data=data,
            files=files,
            timeout=30,
        )
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        detail = getattr(e.response, "text", str(e)) if getattr(e, "response", None) is not None else str(e)
        raise HTTPException(status_code=502, detail=f"Groq transcription failed: {detail}")

    text = resp.json().get("text", "").strip()
    if not text:
        raise HTTPException(status_code=422, detail="Could not understand the audio — please try again.")

    return {"text": text}


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    session_id = req.session_id or str(uuid.uuid4())

    mapped_skill, intent, confidence, matched_example = match_phrase(req.message)

    # Try LLM skill extraction if Groq API key is present
    llm_extracted = None
    if GROQ_API_KEY:
        try:
            detected_lang = "hi" if any("\u0900" <= c <= "\u097F" for c in req.message) else "en"
            llm_extracted = extract_skills(req.message, detected_language=detected_lang)
            if not mapped_skill and llm_extracted and llm_extracted.get("skills"):
                for s in llm_extracted["skills"]:
                    ms, it, conf, _ = match_phrase(s)
                    if ms:
                        mapped_skill, intent, confidence = ms, it, conf
                        break
        except Exception as e:
            print(f"Groq LLM extraction fallback notice: {e}")

    if not mapped_skill:
        import random

        reply = random.choice(NO_MATCH_REPLIES)
        courses = []
        is_fallback = True
    else:
        courses, occ_name = get_courses_for_skill(mapped_skill, req.education_level)
        
        # Try generating spoken LLM response via Groq if available
        llm_reply = None
        if GROQ_API_KEY:
            try:
                detected_lang = "hi" if any("\u0900" <= c <= "\u097F" for c in req.message) else "en"
                prof = llm_extracted or {"skills": [mapped_skill]}
                llm_reply = generate_llm_response(
                    text=req.message,
                    profile=prof,
                    top_occupation_title=occ_name,
                    detected_language=detected_lang
                )
            except Exception as e:
                print(f"Groq LLM voice reply fallback notice: {e}")
        
        if llm_reply:
            reply = llm_reply
        else:
            reply = build_reply(mapped_skill, intent, confidence, courses, occ_name)
        
        is_fallback = False

    conn = get_conn()
    conn.execute(
        "INSERT INTO chat_log (session_id, user_id, user_message, matched_skill, intent, confidence, bot_reply, created_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (session_id, req.user_id, req.message, mapped_skill, intent, confidence, reply, datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()

    return ChatResponse(
        session_id=session_id,
        reply_text=reply,
        matched_skill=mapped_skill,
        intent=intent,
        confidence=confidence,
        courses=courses,
        is_fallback=is_fallback,
    )



@app.get("/api/courses")
def list_all_courses():
    return qp_df.to_dict(orient="records")


@app.get("/api/occupations")
def list_occupations():
    return occ_df.to_dict(orient="records")


@app.get("/api/courses/by-occupation/{occupation_name}")
def courses_by_occupation(occupation_name: str):
    courses, occ_name = get_courses_for_skill(occupation_name)
    if not courses:
        raise HTTPException(status_code=404, detail=f"No courses found for '{occupation_name}'")
    return {"occupation": occ_name, "courses": courses}


@app.get("/api/schemes")
def list_schemes():
    """
    Curated real government scheme / portal links.
    NOTE: verify these before your final demo — govt portal URLs occasionally change.
    """
    return [
        {"name": "Skill India Digital (courses + certification)", "url": "https://www.skillindiadigital.gov.in/"},
        {"name": "PMKVY - Pradhan Mantri Kaushal Vikas Yojana", "url": "https://www.pmkvyofficial.org/"},
        {"name": "National Career Service (jobs + counselling)", "url": "https://www.ncs.gov.in/"},
        {"name": "myScheme - all central & state govt schemes", "url": "https://www.myscheme.gov.in/"},
        {"name": "PM-AJAY (SC welfare & livelihood scheme)", "url": "https://socialjustice.gov.in/schemes/46"},
        {"name": "e-Shram (unorganised worker registration)", "url": "https://eshram.gov.in/"},
        {"name": "Mudra Yojana (business/self-employment loans)", "url": "https://www.mudra.org.in/"},
        {"name": "NSDC Training Partner Locator", "url": "https://www.nsdcindia.org/"},
    ]


@app.post("/api/profile")
def save_profile(profile: ProfileIn):
    user_id = profile.user_id or str(uuid.uuid4())
    conn = get_conn()
    conn.execute(
        """INSERT INTO profiles (user_id, name, age, gender, education, location, phone, interests, preferred_language, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(user_id) DO UPDATE SET
             name=excluded.name, age=excluded.age, gender=excluded.gender, education=excluded.education,
             location=excluded.location, phone=excluded.phone, interests=excluded.interests,
             preferred_language=excluded.preferred_language, updated_at=excluded.updated_at""",
        (
            user_id, profile.name, profile.age, profile.gender, profile.education,
            profile.location, profile.phone, profile.interests, profile.preferred_language,
            datetime.utcnow().isoformat(),
        ),
    )
    conn.commit()
    conn.close()
    return {"user_id": user_id, "status": "saved"}


@app.get("/api/profile/{user_id}")
def get_profile(user_id: str):
    conn = get_conn()
    row = conn.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Profile not found")
    return dict(row)
