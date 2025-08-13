from sqlalchemy.orm import Session
import models  # Acessa a pasta acima para importar models.py
from schema import campanha as schemas_campanha  # Acessa a pasta acima para importar schemas/campanha.py

def create_campanha(db: Session, campanha: schemas_campanha.CampanhaCreate):
    db_campanha = models.Campanha(
        Titulo=campanha.Titulo,
        Cor=campanha.Cor,
        Documento=campanha.Documento
    )
    db.add(db_campanha)
    db.commit()
    db.refresh(db_campanha)
    return db_campanha
