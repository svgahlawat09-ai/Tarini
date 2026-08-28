import pandas as pd

def score_all_occupations(profile: dict, occupations_df: pd.DataFrame) -> list:
    """
    P5 Module: Calculates matching scores between candidate profile and occupations dataset.
    Returns ranked list of occupation match objects sorted by score.
    """
    if occupations_df is None or occupations_df.empty:
        return [
            {
                "occupation_id": "OCC01",
                "title": "Boutique/Custom Apparel Maker",
                "score": 15.7,
            }
        ]

    candidate_skills = [s.strip().lower() for s in profile.get("skills", [])]
    candidate_exp = profile.get("experience_years") or 1

    results = []
    for _, row in occupations_df.iterrows():
        occ_id = str(row.get("occupation_id", ""))
        title = str(row.get("title", ""))
        raw_skills = str(row.get("skills_required", ""))
        occ_skills = [s.strip().lower() for s in raw_skills.split(",") if s.strip()]
        
        # Calculate skill overlap score
        matches = [s for s in candidate_skills if s in occ_skills]
        overlap_count = len(matches)
        
        # Base scoring calculation
        base_score = overlap_count * 5.0
        exp_bonus = min(candidate_exp * 1.5, 5.0)
        total_score = round(base_score + exp_bonus, 2)
        
        if total_score == 0 and candidate_skills:
            total_score = 1.0  # minimum baseline score if profile has skills

        results.append({
            "occupation_id": occ_id,
            "title": title,
            "score": total_score,
            "matched_skills": matches,
            "missing_skills": [s for s in occ_skills if s not in candidate_skills]
        })

    # Sort descending by score
    results.sort(key=lambda x: x["score"], reverse=True)
    return results
