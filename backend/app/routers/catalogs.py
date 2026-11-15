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
    # Assessment answer keys are retained for frontend compatibility in this prototype.
    # They must be moved fully server-side before public release.
    return ASSESSMENTS


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
