# rotas/envio.py
from fastapi import APIRouter, Depends
from database import engine, Base, get_db
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from jwt_auth import verificar_token

from schema import detalhe as schema_detalhe

from crud import detalhe as crud_detalhe

router = APIRouter()

@router.get("/get_detalhe_by_envio", response_model=list[schema_detalhe.Detalhe])
def get_status_envio_by_envio(id_envio:int, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Pega os detalhes de um envio
    """
    detalhes = crud_detalhe.get_detalhe_by_envio(id_envio=id_envio, db=db)
    return detalhes


@router.get("/get_detalhe_by_envio_com_email", response_model=list[schema_detalhe.DetalheComEmail])
def get_status_envio_by_envio(id_envio:int, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Pega os detalhes de um envio com emails
    """
    detalhes = crud_detalhe.get_detalhe_by_envio_com_email(id_envio=id_envio, db=db)
    return detalhes
