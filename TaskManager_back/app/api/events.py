from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.event import Event
from app.schemas.event import EventCreate, EventRead
from app.db.session import get_session
from app.utils.jwt import get_current_user

router = APIRouter()

@router.post("/", response_model=EventRead)
async def create_event(event: EventCreate, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    db_event = Event(**event.dict(), user_id=user_id)
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)
    return db_event

@router.get("/", response_model=list[EventRead])
async def read_events(db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    result = await db.execute(select(Event).where(Event.user_id == user_id))
    return result.scalars().all()

@router.get("/{event_id}", response_model=EventRead)
async def get_event(event_id: int, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    event = await db.get(Event, event_id)
    if event is None or event.user_id != user_id:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=EventRead)
async def update_event(event_id: int, event_data: EventCreate, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    event = await db.get(Event, event_id)
    if event is None or event.user_id != user_id:
        raise HTTPException(status_code=404, detail="Event not found")

    for key, value in event_data.dict().items():
        setattr(event, key, value)

    await db.commit()
    await db.refresh(event)
    return event

@router.delete("/{event_id}")
async def delete_event(event_id: int, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    event = await db.get(Event, event_id)
    if event is None or event.user_id != user_id:
        raise HTTPException(status_code=404, detail="Event not found")
    await db.delete(event)
    await db.commit()
    return {"detail": "Event deleted"}