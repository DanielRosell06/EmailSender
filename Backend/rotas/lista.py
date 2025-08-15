# rotas/lista.py
from fastapi import APIRouter, Depends
from database import engine, Base, get_db
from sqlalchemy.orm import Session

from schema import lista as schemas_lista
from schema import email as schemas_email

from crud import lista as crud_lista
from crud import email as crud_email

router = APIRouter()

@router.post("/listas/", response_model=schemas_lista.Lista)
def create_lista(lista_data: schemas_lista.ListaCreate, db: Session = Depends(get_db)):
    """
    Cria uma nova lista com os dados fornecidos.
    """
    response_list = crud_lista.create_lista(db=db, lista=lista_data)
    response_emails = crud_email.create_email(db=db, email=lista_data.Emails, lista_id=response_list.IdLista)
     
    return response_list

@router.get("/all_lista/", response_model=list[schemas_lista.Lista])
def get_all_listas(db: Session = Depends(get_db)):
    """
    Retorna todas as listas cadastradas.
    """
    listas = crud_lista.get_all_lista(db=db)
    return listas


@router.get("/lista/", response_model=list[schemas_lista.Lista])
def get_all_listas(db: Session = Depends(get_db)):
    """
    Retorna todas as listas cadastradas.
    """
    listas = crud_lista.get_all_lista(db=db)
    return listas