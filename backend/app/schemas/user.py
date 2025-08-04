from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    contact_method: str
    contact_info: str

class UserOut(UserCreate):
    id: int

    class Config:
        orm_mode = True
class UserOut(UserCreate):
    id: int
