# rotas/envio.py
from fastapi import APIRouter, Depends
from database import engine, Base, get_db
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
import io

from crud import status_envio as crud_status_envio

router = APIRouter()

# Imagem transparente de um pixel
TRANSPARENT_GIF_DATA = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0cIDATx\x9cc`\x00\x00\x00\x00\x00\x00\x00\x04\x00\x01]\xc0+\xea\x00\x00\x00\x00IEND\xaeB`\x82'

@router.get("/update_status_envio/", response_class=StreamingResponse)
def update_status_envio(token: Optional[str] = None, db: Session = Depends(get_db),):
    """
    Rota para contagem de abertura dos emails, retornando uma imagem transparente de 1x1.
    """
    print(f'alterando o token {token}')
    crud_status_envio.update_status_envio(db, token)

    return StreamingResponse(io.BytesIO(TRANSPARENT_GIF_DATA), media_type="image/png")