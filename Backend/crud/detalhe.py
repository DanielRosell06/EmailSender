#crud/status_envio

from sqlalchemy.orm import Session
import models # Acessa a pasta acima para importar models.py
from schema import status_envio as schema_detalhe
from sqlalchemy.orm import joinedload
from typing import List
from schema.detalhe import DetalheComEmail

def get_detalhe_by_envio(id_envio: int, db: Session):
    db_detalhes = db.query(models.Detalhe).filter(models.Detalhe.Envio == id_envio).all()
    return db_detalhes


def get_detalhe_by_envio_com_email(id_envio: int, db: Session) -> List[DetalheComEmail]:
    # Busca os detalhes com LEFT OUTER JOIN na tabela Email
    # Isso garante que todos os Detalhes sejam retornados, mesmo sem Email
    db_detalhes_com_email = (
        db.query(
            models.Detalhe,
            models.Email.Conteudo.label('ConteudoEmail')  # Pega o Conteudo do Email (pode ser NULL)
        )
        .outerjoin(models.Email, models.Detalhe.Email == models.Email.IdEmail)
        .filter(models.Detalhe.Envio == id_envio)
        .all()
    )
    
    # Converte para a lista de DetalheComEmail
    resultados = []
    for detalhe, conteudo_email in db_detalhes_com_email:
        resultado = DetalheComEmail(
            IdDetalhe=detalhe.IdDetalhe,
            Conteudo=detalhe.Conteudo,
            Tipo=detalhe.Tipo,
            Codigo=detalhe.Codigo,
            Envio=detalhe.Envio,
            Email=detalhe.Email,
            ConteudoEmail=conteudo_email 
        )
        resultados.append(resultado)
    
    return resultados