#crud/status_envio

from sqlalchemy.orm import Session
import models # Acessa a pasta acima para importar models.py
from schema import status_envio as schema_status_envio

def update_status_envio(db: Session, token: str):
    # Encontra o registro que corresponde ao token
    email_para_atualizar = db.query(models.StatusEnvio).filter(models.StatusEnvio.Token == token).first()
    email_para_atualizar.Visto = True
    db.commit()
    db.refresh(email_para_atualizar)
    return email_para_atualizar


def get_status_envio_by_envio(db: Session, id_envio: int):
    # Faz join com a tabela Email para pegar o Conteudo (email)
    status = (
        db.query(models.Email.Conteudo, models.StatusEnvio.Visto)
        .join(models.Email, models.Email.IdEmail == models.StatusEnvio.IdEmail)
        .filter(models.StatusEnvio.IdEnvio == id_envio)
        .all()
    )
    return [schema_status_envio.Status(IdEmail=s.Conteudo, Visto=s.Visto) for s in status]