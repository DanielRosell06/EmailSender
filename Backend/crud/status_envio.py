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


def get_status_envio_by_envio(db: Session, id_envio: int, user_id: int):
    # 1. Busca o IdCampanha do envio.
    id_campanha = db.query(
        models.Envio.Campanha
    ).filter(
        models.Envio.IdEnvio == id_envio,
        models.Envio.IdUsuario == user_id
    ).scalar()

    # 2. Busca os detalhes da campanha associada, se um IdCampanha foi encontrado.
    campanha_data = None
    if id_campanha:
        campanha_data = db.query(models.Campanha.Titulo, models.Campanha.Documento).filter(models.Campanha.IdCampanha == id_campanha).first()
    
    # 3. Se a campanha não for encontrada, retorna uma resposta vazia ou um erro.
    if not campanha_data:
        return None
    
    campanha_schema = schema_status_envio.Campanha(
        Titulo=campanha_data.Titulo,
        Documento=campanha_data.Documento
    )

    # 4. Busca todos os status de envio em uma única consulta
    status_db = (
        db.query(models.Email.Conteudo, models.StatusEnvio.Visto)
        .join(models.Email, models.Email.IdEmail == models.StatusEnvio.IdEmail)
        .filter(models.StatusEnvio.IdEnvio == id_envio)
        .all()
    )

    # 5. Cria a lista de StatusBase
    status_list = [
        schema_status_envio.StatusBase(
            IdEmail=s.Conteudo,
            Visto=s.Visto
        )
        for s in status_db
    ]
    
    # 6. Retorna o objeto Status, contendo a lista de StatusBase e a Campanha
    return {
        "Status": status_list,
        "Campanha": campanha_schema
    }