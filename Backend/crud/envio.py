# crud/envio.py

from sqlalchemy.orm import Session
import models
from schema import envio as schemas_envio
import os
import ssl
import smtplib
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from sqlalchemy import desc
from sqlalchemy.orm import joinedload
import hashlib
from datetime import datetime
from cryptography.fernet import Fernet

# Importa a instância do servidor SocketIO.
# Isso geralmente é feito em um arquivo principal, como main.py, e a instância é passada aqui.
# Por exemplo, `from main import sio`.
# Para o exemplo, vamos assumir que `sio` é um objeto global ou passado como parâmetro.
sio = None # Substitua por `from your_main_app import sio`

# Pegando variaveis de ambiente
load_dotenv()

key_string = os.getenv("SMTP_KEY")

f = Fernet(key_string.encode())

def decrypt_password(encrypted_password: str) -> str:
    decrypted_password = f.decrypt(encrypted_password.encode())

    return decrypted_password.decode()

SERVER_URL = os.getenv("SERVER_URL")

def set_socketio_server(socket_instance):
    """
    Define a instância do servidor SocketIO para a função de envio.
    """
    global sio
    sio = socket_instance

def generate_token(original_string, user_number):
    """
    Cria um token hash de uma string e um número usando um salt.
    ... (seu código atual)
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

async def create_envio(user_id:int, db: Session, envio: schemas_envio.EnvioCreate, sid: str):
    """
    Função de envio de e-mail atualizada com progresso assíncrono.
    Recebe o 'sid' (Session ID) do cliente para enviar mensagens específicas.
    """
    global sio
    if not sio:
        print("Servidor SocketIO não está configurado.")
        return

    campanha = db.query(models.Campanha).filter(models.Campanha.IdCampanha == envio.Campanha).first()
    lista = db.query(models.Email).filter(models.Email.Lista == envio.Lista).all()
    usuario_smtp = db.query(models.UsuarioSmtp).filter(models.UsuarioSmtp.IdUsuarioSmtp == envio.UsuarioSmtp).first()
    total_emails = len(lista)

    smtp_user = usuario_smtp.Usuario
    smtp_domain = usuario_smtp.Dominio
    smtp_password = usuario_smtp.Senha
    smtp_password = decrypt_password(usuario_smtp.Senha)
    smtp_port = usuario_smtp.Porta

    db_envio = models.Envio(
        Lista = envio.Lista,
        Campanha = envio.Campanha,
        IdUsuario = user_id
    )
    campanha.Ultimo_Uso = datetime.now()
    db.add(db_envio)
    db.add(campanha)
    db.commit()

    # --- ETAPA 1: INÍCIO DO PROCESSO (10% DA BARRA) ---
    await sio.emit('progress', {'sent': 0, 'total': total_emails, 'percentage': 10, 'id_envio': db_envio.IdEnvio}, room=sid)

    try:
        contexto_ssl = ssl.create_default_context()
        with smtplib.SMTP(smtp_domain, smtp_port) as server:
            server.starttls(context=contexto_ssl)
            server.login(smtp_user, smtp_password)
            
            emails_enviados_count = 0
            progresso_anterior = 0

            # --- ETAPA 2: ENVIO DE EMAILS (10% a 90% da barra) ---
            for email_obj in lista:
                email = email_obj.Conteudo
                token = generate_token(email, db_envio.IdEnvio)
                documento_com_tag = campanha.Documento + f' <img src="{SERVER_URL}/update_status_envio?token={token}">'

                msg = MIMEMultipart()
                msg['From'] = smtp_user
                msg['Subject'] = campanha.Assunto
                msg.attach(MIMEText(documento_com_tag, 'html', 'utf-8'))

                db_status = models.StatusEnvio(
                    IdEnvio = db_envio.IdEnvio,
                    IdEmail = email_obj.IdEmail,
                    Token = token,
                )
                db.add(db_status)
                
                del msg['To']
                msg['To'] = email
                server.sendmail(smtp_user, email, msg.as_string())
                
                emails_enviados_count += 1
                
                # Cálculo de progresso de 5% em 5%
                progresso_emails_bruto = (emails_enviados_count / total_emails) * 80  # 80% da barra (10% a 90%)
                progresso_atual = int(progresso_emails_bruto / 5) * 5
                
                if progresso_atual > progresso_anterior:
                    progresso_total_barra = 10 + progresso_atual
                    await sio.emit('progress', {'sent': emails_enviados_count, 'total': total_emails, 'percentage': progresso_total_barra, 'id_envio': db_envio.IdEnvio}, room=sid)
                    progresso_anterior = progresso_atual

    except smtplib.SMTPAuthenticationError:
        print("Erro de autenticação.")
    except smtplib.SMTPServerDisconnected:
        print("O servidor desconectou.")
    except ConnectionRefusedError:
        print("A conexão foi recusada.")
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")

    # --- ETAPA 3: FINALIZAÇÃO (90% a 100% da barra) ---
    db.commit() # Salva todos os StatusEnvio de uma vez, se o envio for bem-sucedido.
    await sio.emit('progress', {'sent': total_emails, 'total': total_emails, 'percentage': 100, 'id_envio': db_envio.IdEnvio}, room=sid)
    db.refresh(db_envio)
    return db_envio

# ... (restante do seu código)
def get_all_envio_com_lista_campanha_detalhe(user_id:int, db: Session):
    # ... (seu código atual, sem alterações)
    envios_com_relacoes = (
        db.query(models.Envio)
        .filter(models.Envio.IdUsuario == user_id)
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
