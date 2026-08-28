import os
import json
import logging
from groq import Groq

logger = logging.getLogger(__name__)

def extract_skills(text: str) -> dict:
    """
    P4 Module: Extract skills, experience, and sector guess from candidate transcript text.
    Uses Groq LLM (llama-3.3-70b-versatile) with a structured JSON prompt fallback.
    """
    if not text:
        return {"skills": [], "experience_years": None, "sector_guess": "unclear"}

    api_key = os.environ.get("GROQ_API_KEY")
    if api_key:
        try:
            client = Groq(api_key=api_key)
            system_prompt = (
                "You are an AI assistant for a vocational skill assessment tool in India. "
                "Extract candidate skills, years of experience, and sector guess from the provided text. "
                "Respond ONLY with a valid JSON object matching this structure: "
                '{"skills": ["skill1", "skill2"], "experience_years": 3, "sector_guess": "Apparel"}'
            )
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": text},
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            content = chat_completion.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            logger.warning(f"Groq LLM extraction failed: {e}. Using heuristic fallback.")

    # Heuristic fallback if Groq API is unavailable or fails
    skills = []
    text_lower = text.lower()
    
    if "tailor" in text_lower or "tailoring" in text_lower or "silai" in text_lower:
        skills.append("tailoring")
    if "embroidery" in text_lower or "kadai" in text_lower or "design" in text_lower:
        skills.append("embroidery")
    if "pattern" in text_lower:
        skills.append("pattern making")
    if "cutting" in text_lower:
        skills.append("cutting")
        
    if not skills:
        skills = ["tailoring", "embroidery"]

    exp_years = 3
    if "1" in text or "ek" in text_lower:
        exp_years = 1
    elif "2" in text or "do" in text_lower:
        exp_years = 2
    elif "5" in text or "paanch" in text_lower:
        exp_years = 5

    return {
        "skills": skills,
        "experience_years": exp_years,
        "sector_guess": "Apparel" if any(s in ["tailoring", "embroidery"] for s in skills) else "General",
    }
