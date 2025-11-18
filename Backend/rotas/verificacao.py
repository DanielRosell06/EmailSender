# rotas/lista.py
from fastapi import APIRouter, Depends
from database import engine, Base, get_db
from sqlalchemy.orm import Session
from fastapi import Body
import models
from jwt_auth import verificar_token

from schema import email as schemas_email

from crud import verificacao as crud_verificacao

router = APIRouter()


@router.put("/verifify_list", response_model=bool)
def verify_list(list_id: int, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Verifica todos os emails não verificados de uma lista
    Retorna 1 se concluído sem erros
    """
    print('STARTING')
    response = crud_verificacao.verificar_lista_emails(id_lista=list_id, user_id=user_id, db=db)
     
    return response