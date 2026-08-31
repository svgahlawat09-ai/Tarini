import os
import json
import logging
from groq import Groq

logger = logging.getLogger(__name__)

def extract_skills(text: str, detected_language: str = "hi") -> dict:
    """
    Extract skills, experience, and sector guess from candidate transcript text.
    Uses Groq LLM (llama-3.3-70b-versatile) with a structured JSON prompt,
    falling back to a broader keyword heuristic only if the LLM is unavailable.
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
                "The message may include earlier conversation turns for context — use them to "
                "resolve follow-ups (e.g. 'what course should I take' refers to the skill "
                "already discussed), but extract skills based on everything said so far. "
                "Extract candidate skills, years of experience, and sector guess from the text. "
                "Do not limit yourself to apparel/tailoring — the candidate could have any skill "
                "(computer operation, driving, construction, cooking, retail, beauty, etc). "
                "If nothing concrete is mentioned, return an empty skills list rather than guessing. "
                "Respond ONLY with a valid JSON object matching this structure: "
                '{"skills": ["skill1", "skill2"], "experience_years": 3, "sector_guess": "Apparel"}'
            )
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": text},
                ],
                model="openai/gpt-oss-120b",
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            content = chat_completion.choices[0].message.content
            parsed = json.loads(content)
            parsed.setdefault("skills", [])
            parsed.setdefault("experience_years", None)
            parsed.setdefault("sector_guess", "unclear")
            return parsed
        except Exception as e:
            logger.warning(f"Groq LLM extraction failed: {e}. Using heuristic fallback.")

    # Heuristic fallback ONLY used if Groq is unavailable/fails — covers more
    # than apparel, and defaults to "unclear" instead of guessing tailoring.
    text_lower = text.lower()
    skills = []
    keyword_map = {
        "tailoring": ["tailor", "tailoring", "silai", "stitch", "stitching"],
        "embroidery": ["embroidery", "kadai", "kasida"],
        "pattern making": ["pattern"],
        "cutting": ["cutting"],
        "computer operation": ["computer", "typing", "ms office", "excel", "data entry"],
        "driving": ["driving", "driver", "gaadi chalana"],
        "construction": ["construction", "mistri", "rajmistri", "mason", "masonry"],
        "cooking": ["cooking", "khana", "chef", "cook"],
        "retail sales": ["sales", "dukaan", "shop", "retail"],
        "beautician": ["beauty", "parlour", "makeup", "beautician"],
        "electrical work": ["electrician", "wiring", "electrical"],
        "plumbing": ["plumber", "plumbing", "pipe fitting"],
    }
    for skill, keywords in keyword_map.items():
        if any(k in text_lower for k in keywords):
            skills.append(skill)

    exp_years = None
    if "1" in text or "ek saal" in text_lower:
        exp_years = 1
    elif "2" in text or "do saal" in text_lower:
        exp_years = 2
    elif "5" in text or "paanch saal" in text_lower:
        exp_years = 5

    apparel_related = {"tailoring", "embroidery", "pattern making", "cutting"}
    if skills:
        sector_guess = "Apparel" if any(s in apparel_related for s in skills) else "General"
    else:
        sector_guess = "unclear"

    return {
        "skills": skills,
        "experience_years": exp_years,
        "sector_guess": sector_guess,
    }


def generate_llm_response(text: str, profile: dict, top_occupation_title: str, detected_language: str = "hi") -> str:
    """
    Generate a spoken, natural language recommendation response mirroring the candidate's language.
    Avoids markdown/bullets; grounded strictly in the extracted profile and the top scored occupation (no invented schemes).
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
                "Keep responses natural for spoken/voice delivery — short sentences, no markdown, no bullet points. "
                "Do not name specific government schemes, courses, or institutions unless they are given to you "
                "explicitly — refer generally to 'an NSQF-aligned course' or 'a recognized training provider' instead."
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
                model="openai/gpt-oss-120b",
                temperature=0.4,
            )
            return chat_completion.choices[0].message.content.strip()
        except Exception as e:
            logger.warning(f"Groq LLM response generation failed: {e}. Using fallback.")

    lang_lower = str(detected_language).lower()
    skills_str = ", ".join(profile.get("skills", [])) or "your experience"
    if lang_lower.startswith(("hi", "ur")):
        return f"Aapke paas {skills_str} ka achha anubhav hai. Hum aapko {top_occupation_title} ke liye sujhaav dete hain."
    return f"Based on your experience in {skills_str}, we recommend the role of {top_occupation_title} for your career growth."
