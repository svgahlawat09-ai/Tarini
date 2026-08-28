from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SIH26097 Voice Assistant API")

# CORS: without this, your frontend (a different port/domain) gets blocked
# by the browser when it tries to call this API. Wildcard "*" is fine for
# the hackathon; per Part 11 of the plan, restrict this before final judging.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "SIH26097 backend running"}


@app.post("/api/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    # Day 1: dummy response. Day 2: replace with a real Groq Whisper call.
    return {"text": "dummy transcribed text", "language": "hi"}


@app.post("/api/analyze")
async def analyze(payload: dict):
    # Day 1: dummy response. Day 2: call P4's extraction + P5's scoring here.
    return {
        "profile": {
            "skills": ["tailoring", "embroidery"],
            "experience_years": 3,
            "sector_guess": "Apparel",
        },
        "matches": [
            {
                "occupation_id": "OCC01",
                "title": "Boutique/Custom Apparel Maker",
                "score": 15.7,
            }
        ],
        "top_occupation": "OCC01",
    }


@app.get("/api/occupation/{occupation_id}")
async def get_occupation(occupation_id: str):
    return {
        "id": occupation_id,
        "title": "Boutique/Custom Apparel Maker",
        "matched_skills": ["tailoring"],
        "missing_skills": ["pattern making", "customer handling"],
        "courses": [
            {"id": "C01", "course_name": "Self Employed Tailor", "nsqf_level": 4}
        ],
    }


@app.get("/api/sessions/recent")
async def recent_sessions():
    return {"sessions": []}
