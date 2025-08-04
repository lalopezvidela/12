from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SqlEnum
from ..database import Base
import enum

# Define the Python Enum for contact methods
class ContactMethod(enum.Enum):
    whatsapp = "whatsapp"
    telegram = "telegram"
    email = "email"
    instagram = "instagram"
    linkedin = "linkedin"
    message="message"
    call="call"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact_method = Column(SqlEnum(ContactMethod, name="contactmethod", create_constraint=False), nullable=False)
    contact_info = Column(String)

    # 💍 Aquí está el missing link
    conversations = relationship("Conversation", back_populates="user")
