from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.conversation import Conversation as ConversationModel, Message as MessageModel
from ..schemas.conversation import Conversation, ConversationCreate, ConversationUpdate, Message

router = APIRouter()

@router.post("/", response_model=Conversation, status_code=status.HTTP_201_CREATED)
def create_conversation(conversation: ConversationCreate, db: Session = Depends(get_db)):
    """Create a new conversation"""
    db_conversation = ConversationModel(
        user_id=conversation.user_id,
        language=conversation.language
    )
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

@router.get("/", response_model=List[Conversation])
def read_conversations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all conversations with pagination"""
    conversations = db.query(ConversationModel).offset(skip).limit(limit).all()
    return conversations

@router.get("/{conversation_id}", response_model=Conversation)
def read_conversation(conversation_id: int, db: Session = Depends(get_db)):
    """Get a specific conversation by ID"""
    db_conversation = db.query(ConversationModel).filter(ConversationModel.id == conversation_id).first()
    if db_conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return db_conversation

@router.get("/user/{user_id}", response_model=List[Conversation])
def read_user_conversations(user_id: int, db: Session = Depends(get_db)):
    """Get all conversations for a specific user"""
    conversations = db.query(ConversationModel).filter(ConversationModel.user_id == user_id).all()
    return conversations

@router.put("/{conversation_id}", response_model=Conversation)
def update_conversation(conversation_id: int, conversation: ConversationUpdate, db: Session = Depends(get_db)):
    """Update a conversation (e.g., mark as ended)"""
    db_conversation = db.query(ConversationModel).filter(ConversationModel.id == conversation_id).first()
    if db_conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    update_data = conversation.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_conversation, field, value)
    
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

@router.delete("/{conversation_id}")
def delete_conversation(conversation_id: int, db: Session = Depends(get_db)):
    """Delete a conversation and all its messages"""
    db_conversation = db.query(ConversationModel).filter(ConversationModel.id == conversation_id).first()
    if db_conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    db.delete(db_conversation)
    db.commit()
    return {"message": "Conversation deleted successfully"}
