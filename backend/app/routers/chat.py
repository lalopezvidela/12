from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import google.generativeai as genai
import os
from dotenv import load_dotenv

from ..database import get_db
from ..models.user import User as UserModel
from ..models.conversation import Conversation as ConversationModel, Message as MessageModel
from ..schemas.conversation import ChatMessage, ChatResponse, Language

load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

router = APIRouter()

def get_system_instruction(language: Language, name: str) -> str:
    """Get system instruction based on language"""
    instructions = {
        Language.EN: f"You are DevCore's AI assistant. You help potential clients understand our software development services. Your name is DevBot and you're talking to {name}. Be helpful, professional, and focus on how DevCore can solve their business needs through custom software solutions.",
        Language.ES: f"Eres el asistente de IA de DevCore. Ayudas a clientes potenciales a entender nuestros servicios de desarrollo de software. Tu nombre es DevBot y estás hablando con {name}. Sé útil, profesional y enfócate en cómo DevCore puede resolver sus necesidades de negocio a través de soluciones de software personalizadas.",
        Language.PT: f"Você é o assistente de IA da DevCore. Você ajuda clientes em potencial a entender nossos serviços de desenvolvimento de software. Seu nome é DevBot e você está falando com {name}. Seja útil, profissional e foque em como a DevCore pode resolver suas necessidades de negócio através de soluções de software personalizadas."
    }
    return instructions.get(language, instructions[Language.EN])

@router.post("/send-message", response_model=ChatResponse)
async def send_message(chat_data: ChatMessage, db: Session = Depends(get_db)):
    """Send a message to the AI and get a response"""
    
    # Get user
    user = db.query(UserModel).filter(UserModel.id == chat_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get or create conversation
    if chat_data.conversation_id:
        conversation = db.query(ConversationModel).filter(ConversationModel.id == chat_data.conversation_id).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        # Create new conversation
        conversation = ConversationModel(
            user_id=chat_data.user_id,
            language=chat_data.language.name  # <-- Use .name for Enum compatibility with DB
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    # Save user message
    user_message = MessageModel(
        conversation_id=conversation.id,
        text=chat_data.message,
        sender="USER"  
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)
    
    # Generate AI response using Gemini
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")
        
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # Get conversation history for context
        messages = db.query(MessageModel).filter(MessageModel.conversation_id == conversation.id).order_by(MessageModel.timestamp).all()
        
        # Build conversation context
        context = get_system_instruction(chat_data.language, user.name) + "\n\nConversation history:\n"
        for msg in messages[:-1]:  # Exclude the current message we just added
            context += f"{msg.sender}: {msg.text}\n"
        
        # Generate response
        prompt = f"{context}\nuser: {chat_data.message}\nbot:"
        response = model.generate_content(prompt)
        bot_response_text = response.text
        
        # Save bot response
        bot_message = MessageModel(
            conversation_id=conversation.id,
            text=bot_response_text,
            sender="BOT"  # Use uppercase to match ENUM in DB
        )
        db.add(bot_message)
        db.commit()
        db.refresh(bot_message)
        
        return ChatResponse(
            response=bot_response_text,
            conversation_id=conversation.id,
            message_id=bot_message.id
        )
        
    except Exception as e:
        # If AI fails, save error message
        error_message = "I'm sorry, I'm having technical difficulties right now. Please try again later."
        bot_message = MessageModel(
            conversation_id=conversation.id,
            text=error_message,
            sender="BOT"  # Use uppercase to match ENUM in DB
        )
        db.add(bot_message)
        db.commit()
        db.refresh(bot_message)
        
        return ChatResponse(
            response=error_message,
            conversation_id=conversation.id,
            message_id=bot_message.id
        )
