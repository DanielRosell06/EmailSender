# crud/envio.py

from sqlalchemy.orm import Session
import models # Acessa a pasta acima para importar models.py
from schema import envio as schemas_envio # Acessa a pasta acima para importar schemas/lista.py
import os
import ssl
import smtplib
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from sqlalchemy import desc
from sqlalchemy.orm import joinedload

#Pegando variaveis de ambiente
load_dotenv()

SMTP_DOMAIN = os.getenv("SMTP_DOMAIN")
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_PORT = int(os.getenv("SMTP_PORT", 578))

def create_envio(db: Session, envio: schemas_envio.EnvioCreate):
    campanha = db.query(models.Campanha).filter(models.Campanha.IdCampanha == envio.Campanha).first()
    lista = db.query(models.Email).filter(models.Email.Lista == envio.Lista).all()

    msg = MIMEMultipart()
    msg['From'] = SMTP_USER
    msg['Subject'] = campanha.Titulo

    msg.attach(MIMEText(campanha.Documento, 'html', 'utf-8'))

    try:
        contexto_ssl = ssl.create_default_context()

        with smtplib.SMTP(SMTP_DOMAIN, SMTP_PORT) as server:
            server.starttls(context=contexto_ssl)  # Inicia a criptografia TLS
            server.login(SMTP_USER, SMTP_PASSWORD) # Realiza o login

            for email_obj in lista:
                del msg['To']
                msg['To'] = email_obj.Conteudo
                server.sendmail(SMTP_USER, email_obj.Conteudo, msg.as_string())

    except smtplib.SMTPAuthenticationError:
        print("Erro de autenticação. Verifique seu usuário e senha (ou senha de app).")
    except smtplib.SMTPServerDisconnected:
        print("O servidor desconectou. Verifique o domínio e a porta.")
    except ConnectionRefusedError:
        print("A conexão foi recusada. Verifique se o domínio e a porta do SMTP estão corretos.")
    except Exception as e:
        print(f"Ocorreu um erro inesperado ao enviar o e-mail: {e}")
            

    db_envio = models.Envio(
        Lista = envio.Lista,
        Campanha = envio.Campanha
    )    
    db.add(db_envio)
    db.commit()
    db.refresh(db_envio)
    return db_envio

def get_all_envio_com_lista_campanha_detalhe(db: Session):
    envios_com_relacoes = (
        db.query(models.Envio)
        .options(
            joinedload(models.Envio.detalhes),
            joinedload(models.Envio.lista_pai),   # Alterado de .Lista para .lista_pai
            joinedload(models.Envio.campanha_pai) # Alterado de .Campanha para .campanha_pai
        )
        .order_by(desc(models.Envio.Dt_Envio))
        .all()
    )
    
    resultados_finais = []
    
    for envio in envios_com_relacoes:
        campanha = envio.campanha_pai
        lista = envio.lista_pai
        detalhes = envio.detalhes
        
        resultado_envio = {
            "IdEnvio": envio.IdEnvio,
            "Dt_Envio": envio.Dt_Envio,
            "Campanha": {
                "IdCampanha": campanha.IdCampanha,
                "Titulo": campanha.Titulo,
                "Cor": campanha.Cor
            } if campanha else None,
            "Lista": {
                "IdLista": lista.IdLista,
                "Titulo": lista.Titulo
            } if lista else None,
            "Detalhes": [{
                "IdDetalhe": detalhe.IdDetalhe,
                "Conteudo": detalhe.Conteudo
            } for detalhe in detalhes]
        }
        
        resultados_finais.append(resultado_envio)
        
    return resultados_finais