#crud/status_envio

from sqlalchemy.orm import Session
import models # Acessa a pasta acima para importar models.py
from schema import status_envio as schema_detalhe

def get_detalhe_by_envio(id_envio: int, db: Session):
    db_detalhes = db.query(models.Detalhe).filter(models.Detalhe.Envio == id_envio).all()
    return db_detalhes