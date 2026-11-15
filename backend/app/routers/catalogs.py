from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.catalog_data import ASSESSMENTS, CAREERS, GRAPH_EDGES, GRAPH_NODES, RESOURCES, SKILLS
from app.core.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.services.intelligence import career_gaps, dashboard_data, simulate_career_matches

router = APIRouter(tags=["AptiNexus"])


@router.get("/analytics/dashboard")
def dashboard(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return dashboard_data(db, user)


@router.get("/careers")
def careers(user: User = Depends(get_current_user)):
    return CAREERS


@router.get("/careers/matches")
def career_matches(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return dashboard_data(db, user)["careers"]


@router.get("/careers/{career_id}")
def career(career_id: str, user: User = Depends(get_current_user)):
    item = next((career for career in CAREERS if career["id"] == career_id), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Career not found")
    return item


@router.get("/skills")
def skills(user: User = Depends(get_current_user)):
    return SKILLS


@router.get("/resources")
def resources(user: User = Depends(get_current_user)):
    return RESOURCES


@router.get("/assessments")
def assessments(user: User = Depends(get_current_user)):
    # Never send answer keys to the browser before submission.
    return [
        {
            "id": item["id"],
            "title": item["title"],
            "skill": item["skill"],
            "questions": [
                {"q": question["q"], "options": question["options"]}
                for question in item["questions"]
            ],
        }
        for item in ASSESSMENTS
    ]


@router.post("/assessments/{assessment_id}/submit")
def submit_assessment(
    assessment_id: str,
    payload: dict,
    user: User = Depends(get_current_user),
):
    assessment = next((item for item in ASSESSMENTS if item["id"] == assessment_id), None)
    if assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")
    answers = payload.get("answers")
    questions = assessment["questions"]
    if not isinstance(answers, list) or len(answers) != len(questions):
        raise HTTPException(status_code=422, detail="Submit one answer for every question")
    if any(type(answer) is not int or answer < 0 or answer >= len(questions[index]["options"])
           for index, answer in enumerate(answers)):
        raise HTTPException(status_code=422, detail="One or more answers are invalid")
    correct_answers = [question["answer"] for question in questions]
    score = sum(answer == correct for answer, correct in zip(answers, correct_answers))
    total = len(questions)
    return {
        "assessmentId": assessment_id,
        "score": score,
        "total": total,
        "percentage": round(100 * score / total) if total else 0,
        "correctAnswers": correct_answers,
        "feedback": (
            "Strong result. Add a project or demonstration to back it up."
            if total and score / total >= 0.75 else
            "Partial result. Revisit the topics you missed."
            if total and score / total >= 0.5 else
            "This skill needs more practice."
        ),
    }


@router.get("/skillgraph")
def skillgraph(user: User = Depends(get_current_user)):
    return {"nodes": GRAPH_NODES, "edges": GRAPH_EDGES}


@router.get("/careers/{career_id}/gaps")
def gaps(career_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = career_gaps(db, user, career_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Career not found")
    return result


@router.post("/what-if")
def what_if(payload: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    extra_skills = payload.get("extraSkills", [])
    if not isinstance(extra_skills, list):
        raise HTTPException(status_code=422, detail="extraSkills must be a list")
    return simulate_career_matches(db, user, extra_skills)


@router.post("/resume/analyze")
def resume_analyze(payload: dict, user: User = Depends(get_current_user)):
    # The current frontend sends only a file name, not resume contents. Do not
    # pretend to analyse a document we have not received.
    return {
        "status": "upload_required",
        "message": "Resume analysis is not available yet. The frontend must upload the PDF or DOCX contents before analysis can run.",
    }
