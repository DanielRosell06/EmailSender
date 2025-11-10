#crud/status_envio

from sqlalchemy.orm import Session
from sqlalchemy import func, Integer, desc
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

def get_all_envios_with_stats(db: Session, user_id: int):
    envios_com_stats = (
        db.query(
            models.Envio.IdEnvio,
            models.Envio.Dt_Envio,
            models.Envio.Token,
            models.Envio.Lista.label('IdLista'),  # Renomeando para IdLista
            models.Envio.Campanha.label('IdCampanha'),  # Renomeando para IdCampanha
            models.Campanha.Titulo,
            models.Campanha.Cor,
            models.Campanha.Assunto,
            models.Campanha.Documento,
            models.Lista.Titulo.label('ListaTitulo'),
            func.count(models.StatusEnvio.IdStatusEnvio).label('total_emails'),
            func.sum(func.cast(models.StatusEnvio.Visto, Integer)).label('emails_vistos')
        )
        .order_by(desc(models.Envio.Dt_Envio))
        .join(models.Campanha, models.Envio.Campanha == models.Campanha.IdCampanha)
        .join(models.Lista, models.Envio.Lista == models.Lista.IdLista)
        .outerjoin(models.StatusEnvio, models.Envio.IdEnvio == models.StatusEnvio.IdEnvio)
        .filter(models.Envio.IdUsuario == user_id)
        .group_by(
            models.Envio.IdEnvio,
            models.Envio.Dt_Envio,
            models.Envio.Token,
            models.Envio.Lista,
            models.Envio.Campanha,
            models.Campanha.Titulo,
            models.Campanha.Cor,
            models.Campanha.Assunto,
            models.Campanha.Documento,
            models.Lista.Titulo
        )
        .all()
    )
    
    resultado = []
    for envio in envios_com_stats:
        # Criando objetos Lista e Campanha como o frontend espera
        lista_obj = {
            "IdLista": envio.IdLista,
            "Titulo": envio.ListaTitulo
        }
        
        campanha_obj = {
            "IdCampanha": envio.IdCampanha,
            "Titulo": envio.Titulo,
            "Cor": envio.Cor,
            "Assunto": envio.Assunto
        }
        
        envio_data = {
            "IdEnvio": envio.IdEnvio,
            "Dt_Envio": envio.Dt_Envio,
            "Token": envio.Token,
            "IdLista": envio.IdLista,
            "IdCampanha": envio.IdCampanha,
            "Lista": lista_obj,
            "Campanha": campanha_obj,
            "entregas": envio.total_emails or 0,
            "aberturas": envio.emails_vistos or 0
        }
        resultado.append(envio_data)
    
    return resultado