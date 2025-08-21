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

import hashlib

#Pegando variaveis de ambiente
load_dotenv()

SMTP_DOMAIN = os.getenv("SMTP_DOMAIN")
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_PORT = int(os.getenv("SMTP_PORT", 578))
SERVER_URL = os.getenv("SERVER_URL")

def generate_token(original_string, user_number):
    """
    Cria um token hash de uma string e um número usando um salt.

    Args:
        original_string (str): A string original (ex: nome de usuário).
        user_number (int): Um número para incluir no hash (ex: ID do usuário).

    Returns:
        tuple: Uma tupla contendo o salt e o token gerado.
    """
    # 1. Gera um salt aleatório e seguro
    salt = os.urandom(16)

    # 2. Converte os dados para bytes
    user_number_bytes = str(user_number).encode('utf-8')
    original_string_bytes = original_string.encode('utf-8')

    # 3. Concatena o salt com os dados
    data_to_hash = salt + original_string_bytes + user_number_bytes

    # 4. Gera o hash usando SHA-256
    hashed_token = hashlib.sha256(data_to_hash).hexdigest()

    return hashed_token


def create_envio(db: Session, envio: schemas_envio.EnvioCreate):
    campanha = db.query(models.Campanha).filter(models.Campanha.IdCampanha == envio.Campanha).first()
    lista = db.query(models.Email).filter(models.Email.Lista == envio.Lista).all()


    

    db_envio = models.Envio(
        Lista = envio.Lista,
        Campanha = envio.Campanha
    )    
    db.add(db_envio)
    db.commit()

    try:
        contexto_ssl = ssl.create_default_context()

        with smtplib.SMTP(SMTP_DOMAIN, SMTP_PORT) as server:
            server.starttls(context=contexto_ssl)  # Inicia a criptografia TLS
            server.login(SMTP_USER, SMTP_PASSWORD) # Realiza o login

            for email_obj in lista:
                email = email_obj.Conteudo
                token = generate_token(email, db_envio.IdEnvio)
                documento_com_tag = campanha.Documento + f' <img src="http://{SERVER_URL}/update_status_envio?token={token}">'

                # Criando a mensagem de email
                msg = MIMEMultipart()
                msg['From'] = SMTP_USER
                msg['Subject'] = campanha.Titulo
                msg.attach(MIMEText(documento_com_tag, 'html', 'utf-8'))

                db_status = models.StatusEnvio(
                    IdEnvio = db_envio.IdEnvio,
                    IdEmail = email_obj.IdEmail,
                    Token = token,
                )
                db.add(db_status)
                del msg['To']
                msg['To'] = email
                server.sendmail(SMTP_USER, email, msg.as_string())

    except smtplib.SMTPAuthenticationError:
        print("Erro de autenticação. Verifique seu usuário e senha (ou senha de app).")
    except smtplib.SMTPServerDisconnected:
        print("O servidor desconectou. Verifique o domínio e a porta.")
    except ConnectionRefusedError:
        print("A conexão foi recusada. Verifique se o domínio e a porta do SMTP estão corretos.")
    except Exception as e:
        print(f"Ocorreu um erro inesperado ao enviar o e-mail: {e}")
            

    
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