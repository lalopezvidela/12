from pydantic import BaseModel
from enum import Enum
from datetime import datetime
from typing import List, Optional

class Language(str, Enum):
    EN = "en"
    ES = "es"
    PT = "pt"

class MessageSender(str, Enum):
    USER = "user"
    BOT = "bot"

class MessageBase(BaseModel):
    text: str
    sender: MessageSender

class MessageCreate(MessageBase):
    conversation_id: int

class Message(MessageBase):
    id: int
    conversation_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class ConversationBase(BaseModel):
    language: Language

class ConversationCreate(ConversationBase):
    user_id: int

class ConversationUpdate(BaseModel):
    ended_at: Optional[datetime] = None

class Conversation(ConversationBase):
    id: int
    user_id: int
    started_at: datetime
    ended_at: Optional[datetime] = None
    messages: List[Message] = []

    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    user_id: int
    language: Language

class ChatResponse(BaseModel):
    response: str
    conversation_id: int
    message_id: int
