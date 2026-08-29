import os
import logging
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq

from extraction.extract_skills import extract_skills, generate_llm_response
from scoring.recommend import score_all_occupations

load_dotenv()
logger = logging.getLogger(__name__)

app = FastAPI(title="SIH26097 Voice Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client if API key is provided
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# P3 Data File: Load occupations dataset once at startup
try:
    if os.path.exists("../data/occupations.csv"):
        occupations_df = pd.read_csv("../data/occupations.csv")
    elif os.path.exists("data/occupations.csv"):
        occupations_df = pd.read_csv("data/occupations.csv")
    else:
        occupations_df = pd.DataFrame()
except Exception as e:
    logger.warning(f"Could not load occupations.csv: {e}")
    occupations_df = pd.DataFrame()


@app.get("/")
def root():
    return {"status": "ok", "message": "SIH26097 backend running"}


@app.post("/api/transcribe")
async def transcribe(audio: UploadFile = File(...), language: str | None = None):
    try:
        if groq_client:
            audio_bytes = await audio.read()
            filename = audio.filename or "speech.mp3"
            
            kwargs = {
                "file": (filename, audio_bytes),
                "model": "whisper-large-v3-turbo",
                "response_format": "verbose_json",
            }
            if language:
                kwargs["language"] = language

            transcription = groq_client.audio.transcriptions.create(**kwargs)
            
            text = getattr(transcription, "text", "")
            detected_lang = getattr(transcription, "language", language or "hi")
            return {
                "transcribed_text": text,
                "detected_language": detected_lang,
                "text": text,
                "language": detected_lang,
            }
    except Exception as e:
        logger.warning(f"Groq Whisper transcription error: {e}")

    # Fallback response for dev/stub testing or missing key
    return {
        "transcribed_text": "dummy transcribed text",
        "detected_language": language or "hi",
        "text": "dummy transcribed text",
        "language": language or "hi",
    }


@app.post("/api/analyze")
async def analyze(payload: dict):
    text = payload.get("text", "") or payload.get("transcribed_text", "")
    detected_lang = payload.get("detected_language", payload.get("language", "hi"))

    try:
        profile = extract_skills(text, detected_language=detected_lang)
    except Exception as e:
        logger.error(f"extract_skills exception: {e}")
        profile = {"skills": [], "experience_years": None, "sector_guess": "unclear"}

    try:
        ranked = score_all_occupations(profile, occupations_df)
    except Exception as e:
        logger.error(f"score_all_occupations exception: {e}")
        ranked = []

    top = ranked[0] if ranked else None
    top_title = top["title"] if top else "Custom Apparel Maker"

    try:
        llm_response = generate_llm_response(text, profile, top_title, detected_language=detected_lang)
    except Exception as e:
        logger.error(f"generate_llm_response exception: {e}")
        llm_response = f"We recommend {top_title} based on your skills."

    return {
        "transcribed_text": text,
        "detected_language": detected_lang,
        "llm_response_text": llm_response,
        "audio_reply_url": None,
        "profile": profile,
        "matches": ranked[:3],
        "top_occupation": top["occupation_id"] if top else None,
    }


@app.get("/api/occupation/{occupation_id}")
async def get_occupation(occupation_id: str):
    matched_skills = ["tailoring"]
    missing_skills = ["pattern making", "customer handling"]
    title = "Boutique/Custom Apparel Maker"

    if not occupations_df.empty:
        match = occupations_df[occupations_df["occupation_id"] == occupation_id]
        if not match.empty:
            row = match.iloc[0]
            title = str(row.get("title", title))
            raw_skills = str(row.get("skills_required", ""))
            occ_skills = [s.strip() for s in raw_skills.split(",") if s.strip()]
            if occ_skills:
                matched_skills = occ_skills[:1]
                missing_skills = occ_skills[1:]

    return {
        "id": occupation_id,
        "title": title,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "courses": [
            {"id": "C01", "course_name": "Self Employed Tailor", "nsqf_level": 4}
        ],
    }


@app.get("/api/sessions/recent")
async def recent_sessions():
    return {"sessions": []}
