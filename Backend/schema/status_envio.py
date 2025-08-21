# schemas/status_envio.py

from pydantic import BaseModel, ConfigDict
from datetime import date

class Status(BaseModel):
    IdEmail: str
    Visto: bool

    model_config = ConfigDict(from_attributes=True)