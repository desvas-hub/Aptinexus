from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.models import User
from app.catalog_data import CAREERS, SKILLS, RESOURCES, ASSESSMENTS, GRAPH_NODES, GRAPH_EDGES

router = APIRouter(tags=["Catalogs"])


@router.get("/analytics/dashboard")
def dashboard(user: User = Depends(get_current_user)):
    # User-specific dashboard aggregation will be added in the next milestone.
    return {"profileCompletion": 0, "skills": [], "careers": [], "progress": []}


@router.get("/careers")
def careers(user: User = Depends(get_current_user)):
    return CAREERS


@router.get("/careers/matches")
def career_matches(user: User = Depends(get_current_user)):
    # Placeholder ranking until profile/evidence-based matching is implemented.
    return []


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
    # This is demo assessment content. Answer keys are currently included because
    # the frontend's existing assessment contract expects them; scoring moves server-side next.
    return ASSESSMENTS


@router.get("/skillgraph")
def skillgraph(user: User = Depends(get_current_user)):
    return {"nodes": GRAPH_NODES, "edges": GRAPH_EDGES}


@router.get("/careers/{career_id}/gaps")
def career_gaps(career_id: str, user: User = Depends(get_current_user)):
    career = next((item for item in CAREERS if item["id"] == career_id), None)
    if career is None:
        raise HTTPException(status_code=404, detail="Career not found")
    return {"careerId": career_id, "gaps": career["required"]}


@router.post("/what-if")
def what_if(payload: dict, user: User = Depends(get_current_user)):
    return []


@router.post("/resume/analyze")
def resume_analyze(payload: dict, user: User = Depends(get_current_user)):
    return {"status": "not_configured", "message": "Resume analysis service is not configured yet."}
