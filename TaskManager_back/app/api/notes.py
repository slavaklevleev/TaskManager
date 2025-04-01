from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.schemas.note import NoteCreate, NoteUpdate, NoteRead
from app.models.note import Note
from app.db.session import get_session
from app.utils.jwt import get_current_user

router = APIRouter()

@router.post("/", response_model=NoteRead)
async def create_note(note: NoteCreate, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    db_note = Note(**note.dict(), user_id=user_id)
    db.add(db_note)
    await db.commit()
    await db.refresh(db_note)
    return db_note

@router.get("/", response_model=list[NoteRead])
async def read_notes(db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    result = await db.execute(select(Note).where(Note.user_id == user_id))
    return result.scalars().all()

@router.get("/{note_id}", response_model=NoteRead)
async def get_note(note_id: int, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    note = await db.get(Note, note_id)
    if note is None or note.user_id != user_id:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.put("/{note_id}", response_model=NoteRead)
async def update_note(note_id: int, note_data: NoteUpdate, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    note = await db.get(Note, note_id)
    if note is None or note.user_id != user_id:
        raise HTTPException(status_code=404, detail="Note not found")
    for key, value in note_data.dict(exclude_unset=True).items():
        setattr(note, key, value)
    await db.commit()
    await db.refresh(note)
    return note

@router.delete("/{note_id}")
async def delete_note(note_id: int, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    note = await db.get(Note, note_id)
    if note is None or note.user_id != user_id:
        raise HTTPException(status_code=404, detail="Note not found")
    await db.delete(note)
    await db.commit()
    return {"detail": "Note deleted"}