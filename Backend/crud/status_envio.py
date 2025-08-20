#crud/status_envio

from sqlalchemy.orm import Session
import models # Acessa a pasta acima para importar models.py
from schema import email as schemas_email # Acessa a pasta acima para importar schemas/lista.py

def update_status_envio(db: Session, token: str):
    # Encontra o registro que corresponde ao token
    email_para_atualizar = db.query(models.StatusEnvio).filter(models.StatusEnvio.Token == token).first()
    email_para_atualizar.Visto = True
    db.commit()
    db.refresh(email_para_atualizar)
    return email_para_atualizar