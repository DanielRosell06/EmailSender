# schemas/email.py

from pydantic import BaseModel
from typing import List

class EmailCreate(BaseModel):
    Conteudo: str

class EmailListCreate(BaseModel):
    # A sintaxe correta para uma lista de schemas
    Emails: list[str]