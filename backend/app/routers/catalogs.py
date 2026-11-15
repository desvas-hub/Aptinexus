from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session

from app.catalog_data import ASSESSMENTS, CAREERS, GRAPH_EDGES, GRAPH_NODES, RESOURCES, SKILLS
from app.core.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.services.intelligence import career_gaps, dashboard_data, evidenced_skill_names, simulate_career_matches, user_skill_names

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
def skillgraph(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    acquired = user_skill_names(db, user)
    demonstrated = evidenced_skill_names(db, user)
    nodes = []
    for source in GRAPH_NODES:
        item = dict(source)
        if item.get("cat") == "skill":
            item.pop("status", None)
            if item["label"] in acquired:
                item["status"] = "Demonstrated" if item["label"] in demonstrated else "Claimed"
        nodes.append(item)
    return {"nodes": nodes, "edges": GRAPH_EDGES}


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
async def resume_analyze(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
):
    """Extract resume text and return conservative, reviewable profile suggestions."""
    import io
    import re
    from docx import Document
    from pypdf import PdfReader

    filename = (file.filename or "").lower()
    if not (filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(status_code=415, detail="Upload a PDF or DOCX file")
    raw = await file.read(5 * 1024 * 1024 + 1)
    if len(raw) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Resume must be 5 MB or smaller")
    if not raw:
        raise HTTPException(status_code=400, detail="The uploaded file is empty")
    try:
        if filename.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(raw))
            if reader.is_encrypted:
                raise HTTPException(status_code=422, detail="Password-protected PDFs are not supported")
            text = "\n".join(page.extract_text() or "" for page in reader.pages[:20])
        else:
            document = Document(io.BytesIO(raw))
            text = "\n".join(paragraph.text for paragraph in document.paragraphs)
            for table in document.tables:
                text += "\n" + "\n".join(" | ".join(cell.text for cell in row.cells) for row in table.rows)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=422, detail="Could not read this document. Try another PDF or DOCX.")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    if not text:
        raise HTTPException(status_code=422, detail="No selectable text found. Scanned image-only PDFs are not supported yet.")

    lines = [line.strip(" •\t-") for line in text.splitlines() if line.strip()]
    section_patterns = {
        "education": ("education", "academic"),
        "experience": ("experience", "employment", "internship", "work history"),
        "projects": ("projects", "project experience"),
        "certifications": ("certifications", "certificates", "licenses"),
        "technical": ("technical skills", "skills", "technologies", "programming"),
        "achievements": ("achievements", "awards", "honors"),
    }
    suggestions = []
    active = None
    for line in lines:
        normalized = line.lower().strip(" :")
        heading = next((key for key, names in section_patterns.items()
                        if normalized in names), None)
        if heading:
            active = heading
            continue
        if active and len(line) >= 3 and len(line) <= 240:
            suggestions.append({
                "section": active.title(),
                "target": active,
                "text": line[:240],
                "origin": "explicit",
            })
        if len(suggestions) >= 80:
            break
    return {
        "filename": file.filename,
        "extractedCharacters": len(text),
        "suggestions": suggestions,
        "message": "These are text extracted under common resume headings. Review every item before adding it to your profile; no skill or qualification has been independently verified.",
    }
