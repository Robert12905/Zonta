from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    id: int
    name: str

users = []



@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/users")
def create_user(user: User):
    users.append(user.name) 
    name = user.name
    return {"user": name}

@app.get("/users/{user_id}")
def get_user(user_id: int):
   if 0 < user_id <= len(users):
       return {"user": users[user_id - 1]}
   else:
    raise HTTPException(status_code=404, detail="User not found")
   
@app.get("/users")
def list_users(limit: int = 10):
    return {"users": users[:limit]}
