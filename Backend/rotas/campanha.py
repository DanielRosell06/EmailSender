# rotas/campanha.py
from fastapi import APIRouter, Depends
from database import engine, Base, get_db
from sqlalchemy.orm import Session
from jwt_auth import verificar_token

from schema import campanha as schemas_campanha

from crud import campanha as crud_campanha

router = APIRouter()

@router.post("/create_campanha", response_model=schemas_campanha.Campanha)
def create_campanha(campanha_data: schemas_campanha.CampanhaCreate, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Cria uma nova campanha com os dados fornecidos.
    """
    response_campain = crud_campanha.create_campanha(user_id=user_id, db=db, campanha=campanha_data)
     
    return response_campain

@router.get("/all_campanha", response_model=list[schemas_campanha.CampanhaBase])
def get_all_campanhas(db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Retorna todas as campanhas cadastradas.
    """
    campanhas = crud_campanha.get_all_campanha(user_id=user_id, db=db)
    return campanhas


@router.get("/campanha_by_id", response_model=schemas_campanha.CampanhaBase)
def get_campanha_by_id(id_campanha: int, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Retorna todas as campanhas cadastradas.
    """
    campanhas = crud_campanha.get_campanha_by_id(user_id=user_id, db=db, id_campanha=id_campanha)
    return campanhas

@router.put("/edit_campanha", response_model=schemas_campanha.Campanha)
def edit_campanha( id_campanha: int, new_campanha: schemas_campanha.Campanha, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Edita a campanha do id_campanha, inserindo os dados de new_campanha
    """
    campanha = crud_campanha.edit_campanha(db, id_campanha, new_campanha)
    return campanha

@router.delete("/delete_campanha", response_model=bool)
def delete_campanha( id_campanha: int, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Deleta a campanha de id = id_campanha
    """
    deleted = crud_campanha.delete_campanha(db=db, id_campanha=id_campanha, user_id=user_id)
    return deleted

@router.delete("/undelete_campanha", response_model=bool)
def delete_campanha( id_campanha: int, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Retira a campanha de id = id_campanha da lixeira
    """
    undeleted = crud_campanha.undelete_campanha(db=db, id_campanha=id_campanha, user_id=user_id)
    return undeleted