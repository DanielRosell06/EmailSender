# rotas/lista.py
from fastapi import APIRouter, Depends
from database import engine, Base, get_db
from sqlalchemy.orm import Session
from jwt_auth import verificar_token

from schema import lista as schemas_lista
from schema import email as schemas_email

from crud import lista as crud_lista
from crud import email as crud_email

router = APIRouter()

@router.post("/listas", response_model=schemas_lista.Lista)
def create_lista(lista_data: schemas_lista.ListaCreate, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Cria uma nova lista com os dados fornecidos.
    """
    response_list = crud_lista.create_lista(db=db, lista=lista_data, user_id=user_id)
    response_emails = crud_email.create_email(db=db, emails=lista_data.Emails, lista_id=response_list.IdLista)
     
    return response_list

@router.get("/all_lista", response_model=list[schemas_lista.Lista])
def get_all_listas(db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Retorna todas as listas cadastradas.
    """
    listas = crud_lista.get_all_lista(user_id=user_id, db=db)
    return listas

@router.get("/get_lista_by_id_com_email", response_model=schemas_lista.ListaComEmail)
def get_all_listas(id_lista = int, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Retorna a lista com IdLista = id_lista, e todos os seus emails
    """
    lista = crud_lista.get_lista_com_emails(user_id=user_id, id_lista=id_lista, db=db)
    return lista


@router.get("/lista", response_model=list[schemas_lista.Lista])
def get_all_listas(db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Retorna todas as listas cadastradas.
    """
    listas = crud_lista.get_all_lista(user_id=user_id, db=db)
    return listas

@router.delete("/delete_lista", response_model=bool)
def delete_lista( id_lista: int, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Deleta a lista de id = id_lista
    """
    deleted = crud_lista.delete_lista(db=db, id_lista=id_lista, user_id=user_id)
    return deleted

@router.delete("/undelete_lista", response_model=bool)
def undelete_lista( id_lista: int, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Retira a lista de id = id_lista da lixeira
    """
    undeleted = crud_lista.undelete_lista(db=db, id_lista=id_lista, user_id=user_id)
    return undeleted

@router.put("/edit_lista", response_model=str)
def edit_lista( id_lista: int, new_titulo: str, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Edita o título da lista
    """
    result = crud_lista.edit_lista(db=db, id_lista=id_lista, new_titulo=new_titulo)
    return result