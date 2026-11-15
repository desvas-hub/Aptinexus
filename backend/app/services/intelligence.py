"""Transparent, profile-driven AptiNexus recommendations.

These are deterministic recommendations, not generative-AI output. They use only
information the signed-in user has saved in their own AptiNexus account.
"""
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.catalog_data import CAREERS, SKILLS
from app.models import User, UserData


def read_user_value(db: Session, user_id: int, key: str, default: Any) -> Any:
    row = db.scalar(
        select(UserData).where(
            UserData.user_id == user_id,
            UserData.data_key == key,
        )
    )
    return row.value if row is not None else default


def _strings(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    return [item.strip() for item in value if isinstance(item, str) and item.strip()]


def user_skill_names(db: Session, user: User) -> set[str]:
    profile = read_user_value(db, user.id, "profile", {})
    names: set[str] = set()
    if isinstance(profile, dict):
        sections = profile.get("sections", {})
        if isinstance(sections, dict):
            for key in ("technical", "subjects", "projects", "certifications", "experience"):
                names.update(_strings(sections.get(key)))
    evidence = read_user_value(db, user.id, "evidence", [])
    if isinstance(evidence, list):
        for item in evidence:
            if not isinstance(item, dict):
                continue
            skill = item.get("skill") or item.get("skillName") or item.get("name")
            if isinstance(skill, str) and skill.strip():
                names.add(skill.strip())
    return names


def evidenced_skill_names(db: Session, user: User) -> set[str]:
    evidence = read_user_value(db, user.id, "evidence", [])
    names: set[str] = set()
    if isinstance(evidence, list):
        for item in evidence:
            if not isinstance(item, dict):
                continue
            status = str(item.get("status", "")).lower()
            if status not in {"demonstrated", "verified"}:
                continue
            skill = item.get("skill") or item.get("skillName") or item.get("name")
            if isinstance(skill, str) and skill.strip():
                names.add(skill.strip())
    return names


def profile_completion(db: Session, user: User) -> int:
    profile = read_user_value(db, user.id, "profile", {})
    if not isinstance(profile, dict):
        profile = {}
    personal = profile.get("personal", {})
    sections = profile.get("sections", {})
    if not isinstance(personal, dict):
        personal = {}
    if not isinstance(sections, dict):
        sections = {}
    section_ids = [
        "education", "subjects", "technical", "soft", "interests",
        "experience", "projects", "certifications", "achievements", "goals",
    ]
    filled_sections = sum(bool(_strings(sections.get(key))) for key in section_ids)
    filled_personal = sum(
        bool(value.strip()) for value in personal.values() if isinstance(value, str)
    )
    return round(100 * (filled_sections + filled_personal) / (len(section_ids) + 3))


def career_match(career: dict, acquired: set[str]) -> dict:
    required = career.get("required", [])
    matched = [name for name in required if name in acquired]
    missing = [name for name in required if name not in acquired]
    compatibility = round(100 * len(matched) / len(required)) if required else 0
    return {
        "id": career["id"],
        "title": career["title"],
        "category": career["category"],
        "compatibility": compatibility,
        "missing": missing,
        "matched": matched,
        "requiredCount": len(required),
        "matchedCount": len(matched),
        "method": "Based on skills listed in your profile and submitted evidence.",
    }


def dashboard_data(db: Session, user: User) -> dict:
    acquired = user_skill_names(db, user)
    skill_rows = []
    for item in SKILLS:
        name = item["name"]
        if name in acquired:
            status = "Demonstrated"
        else:
            status = "Not started"
        skill_rows.append({
            "id": name.lower().replace(" ", "-"),
            "name": name,
            "category": item["category"],
            "level": 2 if status == "Demonstrated" else 1,
            "status": status,
        })
    matches = sorted(
        (career_match(career, acquired) for career in CAREERS),
        key=lambda item: (-item["compatibility"], item["title"]),
    )
    results = read_user_value(db, user.id, "results", [])
    completed = len(results) if isinstance(results, list) else 0
    demonstrated = sum(1 for item in skill_rows if item["status"] == "Demonstrated")
    return {
        "profileCompletion": profile_completion(db, user),
        "skills": skill_rows,
        "careers": matches[:5],
        "progress": [
            {"month": "Current", "skills": len(acquired), "demonstrated": demonstrated}
        ],
        "assessmentCount": completed,
    }


def career_gaps(db: Session, user: User, career_id: str) -> dict:
    career = next((item for item in CAREERS if item["id"] == career_id), None)
    if career is None:
        return None
    acquired = user_skill_names(db, user)
    required = career.get("required", [])
    return {
        "careerId": career_id,
        "strengths": [name for name in required if name in acquired],
        "missing": [name for name in required if name not in acquired],
        "optional": [
            item["name"] for item in SKILLS
            if item["name"] not in required
            and item["name"] not in acquired
            and any(related in required for related in item.get("related", []))
        ][:3],
        "method": "Compares skills in your saved profile and evidence with this career's listed requirements.",
    }


def simulate_career_matches(db: Session, user: User, extra_skills: list[str]) -> list[dict]:
    acquired = user_skill_names(db, user)
    hypothetical = acquired | {name.strip() for name in extra_skills if isinstance(name, str) and name.strip()}
    current = {item["id"]: item for item in (career_match(c, acquired) for c in CAREERS)}
    projected = []
    for career in CAREERS:
        before = current[career["id"]]["compatibility"]
        after = career_match(career, hypothetical)["compatibility"]
        projected.append({
            "id": career["id"],
            "current": before,
            "hypothetical": after,
            "change": after - before,
        })
    return sorted(projected, key=lambda item: (-item["hypothetical"], item["id"]))
