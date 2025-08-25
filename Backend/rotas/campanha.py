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

@router.get("/all_campanha/", response_model=list[schemas_campanha.CampanhaBase])
def get_all_campanhas(db: Session = Depends(get_db)):
    """
    Retorna todas as campanhas cadastradas.
    """
    campanhas = crud_campanha.get_all_campanha(db=db)
    return campanhas


@router.get("/campanha/", response_model=list[schemas_campanha.CampanhaBase])
def get_all_campanhas(db: Session = Depends(get_db)):
    """
    Retorna todas as campanhas cadastradas.
    """
    campanhas = crud_campanha.get_all_campanha(db=db)
    return campanhas

@router.put("/edit_campanha/", response_model=schemas_campanha.Campanha)
def edit_campanha( id_campanha: int, new_campanha: schemas_campanha.Campanha, db: Session = Depends(get_db)):
    """
    Edita a campanha do id_campanha, inserindo os dados de new_campanha
    """
    campanha = crud_campanha.edit_campanha(db, id_campanha, new_campanha)
    return campanha