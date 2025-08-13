# rotas/campanha.py
from fastapi import APIRouter, Depends
from database import engine, Base, get_db
from sqlalchemy.orm import Session

from schema import campanha as schemas_campanha

from crud import campanha as crud_campanha

router = APIRouter()

@router.post("/campanhas/", response_model=schemas_campanha.Campanha)
def create_campanha(campanha_data: schemas_campanha.CampanhaCreate, db: Session = Depends(get_db)):
    """
    Cria uma nova campanha com os dados fornecidos.
    """
    response_campain = crud_campanha.create_campanha(db=db, campanha=campanha_data)
     
    return response_campain