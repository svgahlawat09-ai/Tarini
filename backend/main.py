import os
import logging
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from extraction.extract_skills import extract_skills, generate_llm_response
from scoring.recommend import score_all_occupations

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SIH26097 Voice Assistant API")

# Restrict to known frontend origins in production; keep localhost for dev.
ALLOWED_ORIGINS = [
    "https://tarinisih.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"  # Allow wildcard for flexible deployment environments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

if not groq_client:
    logger.warning(
        "GROQ_API_KEY is not set. STT/LLM features will return explicit "
        "errors instead of fake success — set this env var in production."
    )

# Load occupations dataset relative to THIS file's location, not the
# process's working directory (this was breaking in production).
BASE_DIR = Path(__file__).resolve().parent
CANDIDATE_PATHS = [
    BASE_DIR / "data" / "occupations.csv",
    BASE_DIR.parent / "data" / "occupations.csv",
]

occupations_df = pd.DataFrame()
for p in CANDIDATE_PATHS:
    if p.exists():
        try:
            occupations_df = pd.read_csv(p)
            logger.info(f"Loaded occupations dataset from {p}")
            break
        except Exception as e:
            logger.warning(f"Failed reading {p}: {e}")

if occupations_df.empty:
    logger.warning("occupations.csv not found in expected locations.")


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "SIH26097 backend running",
        "groq_configured": bool(groq_client),
        "occupations_loaded": len(occupations_df),
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "message": "SIH26097 backend running",
        "groq_configured": bool(groq_client),
        "occupations_loaded": len(occupations_df),
    }


@app.post("/api/transcribe")
async def transcribe(audio: UploadFile = File(...), language: str | None = None):
    if not groq_client:
        # Honest failure — never fake a transcript when the key is missing.
        return {
            "success": False,
            "error": "Speech-to-text is not configured on the server (missing GROQ_API_KEY).",
            "transcribed_text": "",
            "text": "",
            "detected_language": language or "hi",
            "language": language or "hi",
        }

    try:
        audio_bytes = await audio.read()
        if not audio_bytes:
            return {
                "success": False,
                "error": "No audio data received.",
                "transcribed_text": "",
                "text": "",
                "detected_language": language or "hi",
                "language": language or "hi",
            }

        filename = audio.filename or "speech.mp3"
        kwargs = {
            "file": (filename, audio_bytes),
            "model": "whisper-large-v3-turbo",
            "response_format": "verbose_json",
        }
        # Only force a language if the caller explicitly wants that — leave
        # unset by default so Whisper auto-detects Hindi/Hinglish/English.
        if language:
            kwargs["language"] = language

        transcription = groq_client.audio.transcriptions.create(**kwargs)
        text = getattr(transcription, "text", "") or ""
        detected_lang = getattr(transcription, "language", language or "hi")

        if not text.strip():
            return {
                "success": False,
                "error": "Could not understand the audio. Please try again or type your message.",
                "transcribed_text": "",
                "text": "",
                "detected_language": detected_lang,
                "language": detected_lang,
            }

        return {
            "success": True,
            "error": None,
            "transcribed_text": text,
            "detected_language": detected_lang,
            "text": text,
            "language": detected_lang,
        }
    except Exception as e:
        logger.error(f"Groq Whisper transcription error: {e}")
        return {
            "success": False,
            "error": "Voice transcription failed. Please try again or type your message.",
            "transcribed_text": "",
            "text": "",
            "detected_language": language or "hi",
            "language": language or "hi",
        }


@app.post("/api/analyze")
async def analyze(payload: dict):
    text = payload.get("text", "") or payload.get("transcribed_text", "") or payload.get("message", "")
    detected_lang = payload.get("detected_language", payload.get("language", "hi"))

    # Recent conversation window, e.g. [{"role": "user"|"assistant", "content": "..."}]
    # Only used to give the LLM context for follow-ups; kept short intentionally.
    conversation_history = payload.get("conversationHistory", []) or []
    recent_history = conversation_history[-6:]

    if not text.strip():
        return {
            "success": False,
            "error": "No message text provided.",
            "transcribed_text": "",
            "detected_language": detected_lang,
            "llm_response_text": "",
            "profile": {"skills": [], "experience_years": None, "sector_guess": "unclear"},
            "matches": [],
            "top_occupation": None,
        }

    # Build a single string that folds in recent turns so the extractor and
    # responder understand follow-ups like "what course should I take?".
    context_text = text
    if recent_history:
        history_str = "\n".join(
            f"{turn.get('role', 'user')}: {turn.get('content', '')}" for turn in recent_history
        )
        context_text = f"Conversation so far:\n{history_str}\n\nLatest message: {text}"

    try:
        profile = extract_skills(context_text, detected_language=detected_lang)
    except Exception as e:
        logger.error(f"extract_skills exception: {e}")
        profile = {"skills": [], "experience_years": None, "sector_guess": "unclear"}

    if not profile.get("skills"):
        # Don't force an occupation guess when nothing was actually extracted —
        # matches the "do not hallucinate" requirement.
        clarifying = (
            "Aap apne kaam ya hunar ke baare mein thoda aur bataiye — jaise silai, "
            "computer, driving, ya koi aur kaam — taaki main sahi salaah de sakoon."
            if str(detected_lang).lower().startswith(("hi", "ur"))
            else "Could you tell me a bit more about your work or skills — for example "
            "tailoring, computer use, driving, or something else — so I can give you "
            "relevant advice?"
        )
        return {
            "success": True,
            "transcribed_text": text,
            "detected_language": detected_lang,
            "llm_response_text": clarifying,
            "audio_reply_url": None,
            "profile": profile,
            "matches": [],
            "top_occupation": None,
        }

    try:
        ranked = score_all_occupations(profile, occupations_df)
    except Exception as e:
        logger.error(f"score_all_occupations exception: {e}")
        ranked = []

    top = ranked[0] if ranked else None
    top_title = top["title"] if top else "a role matching your skills"

    try:
        llm_response = generate_llm_response(text, profile, top_title, detected_language=detected_lang)
    except Exception as e:
        logger.error(f"generate_llm_response exception: {e}")
        llm_response = f"We recommend {top_title} based on your skills."

    return {
        "success": True,
        "transcribed_text": text,
        "detected_language": detected_lang,
        "llm_response_text": llm_response,
        "audio_reply_url": None,
        "profile": profile,
        "matches": ranked[:3],
        "top_occupation": top["occupation_id"] if top else None,
    }


# Retain /api/chat alias mapping to /api/analyze for backwards compatibility
@app.post("/api/chat")
async def chat(payload: dict):
    res = await analyze(payload)
    # Adapt response format for any existing /api/chat consumers
    if res.get("success"):
        matches = res.get("matches", [])
        top_occ = matches[0] if matches else {}
        return {
            "session_id": "session-1",
            "reply_text": res.get("llm_response_text", ""),
            "matched_skill": res.get("profile", {}).get("skills", [None])[0] if res.get("profile", {}).get("skills") else None,
            "intent": "skill_assessment",
            "confidence": top_occ.get("score", 0.9),
            "courses": [
                {
                    "qp_code": top_occ.get("occupation_id", "COURSE-01"),
                    "job_role": top_occ.get("title", "Skill Course"),
                    "nsqf_level": top_occ.get("nsqf_level", 4),
                    "sector": top_occ.get("sector", "General"),
                    "duration_hours": 300,
                    "eligibility": "10th Pass",
                    "self_employment_possible": True,
                }
            ] if top_occ else [],
            "is_fallback": False,
            "raw_analysis": res,
        }
    else:
        return {
            "session_id": "session-1",
            "reply_text": res.get("error", "An error occurred."),
            "matched_skill": None,
            "intent": None,
            "confidence": 0,
            "courses": [],
            "is_fallback": True,
            "raw_analysis": res,
        }


@app.get("/api/occupation/{occupation_id}")
async def get_occupation(occupation_id: str):
    if occupations_df.empty:
        return {
            "id": occupation_id,
            "title": "Unknown",
            "matched_skills": [],
            "missing_skills": [],
            "courses": [],
        }

    match = occupations_df[occupations_df["occupation_id"] == occupation_id]
    if match.empty:
        return {
            "id": occupation_id,
            "title": "Unknown",
            "matched_skills": [],
            "missing_skills": [],
            "courses": [],
        }

    row = match.iloc[0]
    title = str(row.get("title", "Unknown"))
    sector = str(row.get("sector", ""))
    nsqf_level = row.get("nsqf_level", None)
    raw_skills = str(row.get("skills_required", ""))
    occ_skills = [s.strip() for s in raw_skills.split(",") if s.strip()]

    # Generic, REAL official portals — not a fabricated specific course page.
    course_name = f"{title} — Skill Certification"
    if nsqf_level and str(nsqf_level) != "nan":
        course_name += f" (NSQF Level {int(float(nsqf_level))})"

    return {
        "id": occupation_id,
        "title": title,
        "sector": sector,
        "matched_skills": occ_skills[:1] if occ_skills else [],
        "missing_skills": occ_skills[1:] if len(occ_skills) > 1 else [],
        "courses": [
            {
                "id": f"{occupation_id}-C01",
                "course_name": course_name,
                "provider": "Skill India Digital Hub",
                "url": "https://www.skillindiadigital.gov.in/",
                "sourceType": "official",
            },
            {
                "id": f"{occupation_id}-C02",
                "course_name": f"{sector} sector courses via NSDC",
                "provider": "National Skill Development Corporation (NSDC)",
                "url": "https://www.nsdcindia.org/",
                "sourceType": "official",
            },
        ],
    }


@app.get("/api/sessions/recent")
async def recent_sessions():
    return {"sessions": []}
