from sqlalchemy.orm import Session
from datetime import datetime
import models  # Acessa a pasta acima para importar models.py
from schema import campanha as schemas_campanha  # Acessa a pasta acima para importar schemas/campanha.py

def create_campanha(user_id:int, db: Session, campanha: schemas_campanha.CampanhaCreate):
    db_campanha = models.Campanha(
        Titulo=campanha.Titulo,
        Cor=campanha.Cor,
        Assunto=campanha.Assunto,
        Documento=campanha.Documento,
        IdUsuario=user_id
    )
    db.add(db_campanha)
    db.commit()
    db.refresh(db_campanha)
    return db_campanha


def get_all_campanha(user_id: int, db: Session):
    return db.query(models.Campanha).filter(models.Campanha.IdUsuario == user_id).all()


def get_campanha_by_id(user_id: int, db: Session, id_campanha: int):
    return db.query(models.Campanha).filter(models.Campanha.IdCampanha == id_campanha, models.Campanha.IdUsuario == user_id).first()


def edit_campanha(db: Session, id_campanha: int, new_campanha: schemas_campanha.Campanha):
    Campanha = db.query(models.Campanha).filter(models.Campanha.IdCampanha == id_campanha).first()
    Campanha.Titulo = new_campanha.Titulo
    Campanha.Cor = new_campanha.Cor
    Campanha.Assunto = new_campanha.Assunto
    Campanha.Documento = new_campanha.Documento
    Campanha.Ultimo_Uso = datetime.now()
    db.add(Campanha)
    db.commit()
    db.refresh(Campanha)
    return Campanha

def delete_campanha(user_id: int, db: Session, id_campanha: int):
    campanha = db.query(models.Campanha).filter(models.Campanha.IdCampanha == id_campanha, models.Campanha.IdUsuario == user_id).first()
    if campanha:
        campanha.Lixeira = True
        db.add(campanha)
        db.commit()
        return True
    return False

def undelete_campanha(user_id: int, db: Session, id_campanha: int):
    campanha = db.query(models.Campanha).filter(models.Campanha.IdCampanha == id_campanha, models.Campanha.IdUsuario == user_id).first()
    if campanha:
        campanha.Ultimo_Uso = datetime.now()
        campanha.Lixeira = False
        db.add(campanha)
        db.commit()
        return True
    return False