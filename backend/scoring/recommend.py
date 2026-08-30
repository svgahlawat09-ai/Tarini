import pandas as pd

def score_all_occupations(profile: dict, occupations_df: pd.DataFrame) -> list:
    """
    Scores occupations against candidate extracted skills.
    Returns sorted list of matches. Zero score if no skills overlap.
    """
    if occupations_df.empty:
        return []

    candidate_skills = set(s.lower().strip() for s in profile.get("skills", []))
    if not candidate_skills:
        return []

    results = []

    for _, row in occupations_df.iterrows():
        occ_id = str(row.get("occupation_id", ""))
        title = str(row.get("title", ""))
        sector = str(row.get("sector", ""))
        raw_skills = str(row.get("skills_required", ""))
        nsqf_level = row.get("nsqf_level", None)

        req_skills = set(s.lower().strip() for s in raw_skills.split(",") if s.strip())
        if not req_skills:
            continue

        matching_skills = candidate_skills & req_skills
        overlap_count = len(matching_skills)

        if overlap_count == 0:
            total_score = 0.0  # no match at all — don't give it a fake baseline
        else:
            total_score = round(overlap_count / len(req_skills), 2)
            sector_guess = str(profile.get("sector_guess", "")).lower()
            if sector_guess != "unclear" and sector_guess in sector.lower():
                total_score = round(min(1.0, total_score + 0.1), 2)

        if total_score > 0:
            results.append({
                "occupation_id": occ_id,
                "id": occ_id,
                "title": title,
                "sector": sector,
                "score": total_score,
                "matched_skills": list(matching_skills),
                "nsqf_level": nsqf_level
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results
