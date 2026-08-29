import os
import json
import logging
from groq import Groq

logger = logging.getLogger(__name__)

def extract_skills(text: str, detected_language: str = "hi") -> dict:
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
                f"The user's message was transcribed from speech in the language: {detected_language}. "
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


def generate_llm_response(text: str, profile: dict, top_occupation_title: str, detected_language: str = "hi") -> str:
    """
    P4 Module: Generate spoken, natural language recommendation response mirroring candidate's language.
    Strictly avoids markdown, bullets, or translation into English.
    """
    api_key = os.environ.get("GROQ_API_KEY")
    if api_key:
        try:
            client = Groq(api_key=api_key)
            system_prompt = (
                "You are a livelihood-mapping and skilling-recommendation assistant. "
                f"The user's message was transcribed from speech in the language: {detected_language}. "
                "ALWAYS respond in the SAME language as the user spoke (Hindi if Hindi, Urdu if Urdu, English if English). "
                "Do not translate the user's language to English in your reply under any circumstances. "
                "Keep responses natural for spoken/voice delivery — short sentences, no markdown, no bullet points."
            )
            user_prompt = (
                f"User text: {text}\n"
                f"Extracted Profile: {json.dumps(profile)}\n"
                f"Top Occupation Recommendation: {top_occupation_title}\n"
                "Formulate a warm 2-sentence voice recommendation for the candidate."
            )
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.4,
            )
            return chat_completion.choices[0].message.content.strip()
        except Exception as e:
            logger.warning(f"Groq LLM response generation failed: {e}. Using fallback.")

    # Fallback responses tailored by detected language
    lang_lower = str(detected_language).lower()
    skills_str = ", ".join(profile.get("skills", ["skills"]))
    
    if "hi" in lang_lower or "hindi" in lang_lower or "ur" in lang_lower:
        return f"Aapke paas {skills_str} ka achha anubhav hai. Hum aapko {top_occupation_title} ke liye sujhaav dete hain."
    else:
        return f"Based on your experience in {skills_str}, we recommend the role of {top_occupation_title} for your career growth."
