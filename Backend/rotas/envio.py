# rotas/envio.py
from fastapi import APIRouter, Depends
from database import engine, Base, get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
import io

from schema import envio as schemas_envio

from crud import envio as crud_envio

router = APIRouter()

@router.get("/get_all_envio_com_lista_campanha_detalhe", response_model=list[schemas_envio.Envio])
def read_envios(db: Session = Depends(get_db)):
    response_envios = crud_envio.get_all_envio_com_lista_campanha_detalhe(db)

    return response_envios

@router.post("/envio/", response_model=schemas_envio.EnvioCreate)
def create_envio(envio_data: schemas_envio.EnvioCreate, db: Session = Depends(get_db)):
    """
    Cria um envio e realiza o envio dos emails atraves de uma Lista e uma Campanha.
    """
    response_envio = crud_envio.create_envio(db=db, envio=envio_data)
     
    return response_envio

TRANSPARENT_GIF_DATA = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0cIDATx\x9cc`\x00\x00\x00\x00\x00\x00\x00\x04\x00\x01]\xc0+\xea\x00\x00\x00\x00IEND\xaeB`\x82'

@router.get("/envio_update_detalhes/", response_class=StreamingResponse)
def update_detalhes():
    """
    Rota para contagem de abertura dos emails, retornando uma imagem transparente de 1x1.
    """
    print("Deu certo!")

    return StreamingResponse(io.BytesIO(TRANSPARENT_GIF_DATA), media_type="image/png")