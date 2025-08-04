from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    contact_method: str
    contact_info: str

class UserOut(UserCreate):
    id: int
    model_config = {"from_attributes": True}
class UserOut(UserCreate):
    id: int
