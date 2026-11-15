from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.models import User

router = APIRouter(tags=["Catalogs"])


@router.get("/analytics/dashboard")
def dashboard(user: User = Depends(get_current_user)):
    return {"profileCompletion": 0, "skills": [], "careers": [], "progress": []}


@router.get("/careers")
def careers(user: User = Depends(get_current_user)):
    return []


@router.get("/careers/matches")
def career_matches(user: User = Depends(get_current_user)):
    return []


@router.get("/careers/{career_id}")
def career(career_id: str, user: User = Depends(get_current_user)):
    raise HTTPException(status_code=404, detail="Career catalog has not been loaded yet")


@router.get("/skills")
def skills(user: User = Depends(get_current_user)):
    return []


@router.get("/resources")
def resources(user: User = Depends(get_current_user)):
    return []


@router.get("/assessments")
def assessments(user: User = Depends(get_current_user)):
    return []


@router.get("/skillgraph")
def skillgraph(user: User = Depends(get_current_user)):
    return {"nodes": [], "edges": []}


@router.get("/careers/{career_id}/gaps")
def career_gaps(career_id: str, user: User = Depends(get_current_user)):
    return {"careerId": career_id, "gaps": []}


@router.post("/what-if")
def what_if(payload: dict, user: User = Depends(get_current_user)):
    return []


@router.post("/resume/analyze")
def resume_analyze(payload: dict, user: User = Depends(get_current_user)):
    return {"status": "not_configured", "message": "Resume analysis service is not configured yet."}
