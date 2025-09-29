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

import requests
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import copy

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
    Agora: baixa imagens externas encontradas em <img src="..."> e as embute como CID.
    Recebe o 'sid' (Session ID) para enviar mensagens específicas.
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
    smtp_password = decrypt_password(usuario_smtp.Senha)
    smtp_port = usuario_smtp.Porta

    db_envio = models.Envio(
        Lista = envio.Lista,
        Campanha = envio.Campanha,
        IdUsuario = user_id,
        Token = envio.Token
    )
    campanha.Ultimo_Uso = datetime.now()
    db.add(db_envio)
    db.add(campanha)
    db.commit()

    IdNewEnvio = db_envio.IdEnvio

    # --- ETAPA 1: INÍCIO DO PROCESSO (10% DA BARRA) ---
    await sio.emit('progress', {'sent': 0, 'total': total_emails, 'percentage': 10, 'id_envio': db_envio.IdEnvio}, room=sid)

    def _embed_external_images_and_get_html(html: str, msg):
        try:
            import requests
            from bs4 import BeautifulSoup
            from email.mime.image import MIMEImage
            import uuid
            from urllib.parse import urljoin

            soup = BeautifulSoup(html, "html.parser")
            attached = {}
            for img_tag in soup.find_all("img"):
                src = img_tag.get("src")
                if not src:
                    continue
                if src.startswith("cid:") or src.startswith("data:"):
                    continue
                resolved_src = src
                if src.startswith("//"):
                    resolved_src = "https:" + src
                elif src.startswith("/"):
                    if SERVER_URL:
                        resolved_src = urljoin(SERVER_URL, src)
                    else:
                        continue
                elif not (src.lower().startswith("http://") or src.lower().startswith("https://")):
                    continue
                if resolved_src in attached:
                    img_tag["src"] = f"cid:{attached[resolved_src]}"
                    continue
                try:
                    r = requests.get(resolved_src, timeout=10)
                    if r.status_code == 200 and r.content:
                        cid = uuid.uuid4().hex
                        try:
                            mime_img = MIMEImage(r.content)
                        except Exception:
                            mime_img = MIMEImage(r.content)
                        mime_img.add_header("Content-ID", f"<{cid}>")
                        mime_img.add_header("Content-Disposition", "inline", filename=cid)
                        msg.attach(mime_img)
                        attached[resolved_src] = cid
                        img_tag["src"] = f"cid:{cid}"
                    else:
                        print(f"[embed_images] status != 200 para {resolved_src}: {r.status_code}")
                except Exception as e:
                    print(f"[embed_images] falha ao baixar imagem {resolved_src}: {e}")
            return str(soup)
        except Exception as e:
            print(f"[embed_images] erro inesperado ao processar imagens: {e}")
            return html
        
    emails_enviados_count = 0

    try:
        contexto_ssl = ssl.create_default_context()
        with smtplib.SMTP(smtp_domain, smtp_port) as server:
            server.starttls(context=contexto_ssl)
            server.login(smtp_user, smtp_password)

            progresso_anterior = 0

            # --- ETAPA 2: ENVIO DE EMAILS (10% a 90% da barra) ---
            for email_obj in lista:
                try:
                    email = email_obj.Conteudo
                    token = generate_token(email, db_envio.IdEnvio)

                    # Cria uma mensagem multiparte relacionada (html + imagens inline)
                    # A mensagem base agora é criada dentro do loop para cada email
                    msg = MIMEMultipart("related")
                    msg['From'] = smtp_user
                    msg['Subject'] = campanha.Assunto
                    
                    # Cria a parte alternativa
                    alternative = MIMEMultipart("alternative")
                    msg.attach(alternative)

                    # Tenta embutir imagens externas e obter o html modificado com cid
                    documento_com_imagens = _embed_external_images_and_get_html(campanha.Documento, msg)
                    html_with_cid = documento_com_imagens + f' <img src="{SERVER_URL}/api/update_status_envio?token={token}">'

                    # plain fallback: remove tags simples (pega texto bruto)
                    try:
                        from bs4 import BeautifulSoup as _BS
                        plain_text = _BS(html_with_cid, "html.parser").get_text(separator="\n").strip()
                    except Exception:
                        plain_text = ""

                    alternative.attach(MIMEText(plain_text, 'plain', 'utf-8'))
                    alternative.attach(MIMEText(html_with_cid, 'html', 'utf-8'))

                    # define destinatário
                    try:
                        del msg['To']
                    except Exception:
                        pass
                    msg['To'] = email

                    # envia o email e, se for bem-sucedido, registra o status
                    server.sendmail(smtp_user, email, msg.as_string())

                    db_status = models.StatusEnvio(
                        IdEnvio = db_envio.IdEnvio,
                        IdEmail = email_obj.IdEmail,
                        Token = token,
                    )
                    db.add(db_status)
                    
                    emails_enviados_count += 1

                except smtplib.SMTPDataError as e:
                    if e.smtp_code == 452:
                        db_detalhe = models.Detalhe(
                            Conteudo = "nEnviado " + emails_enviados_count,
                            Tipo = 1,
                            Codigo = 452,
                            Envio = db_envio.IdEnvio
                        )
                        db.add(db_detalhe)
                        db.commit()
                        await sio.emit('redirect', {'url': f"/envio_detail/{IdNewEnvio}"}, room=sid)
                        break 
                    else:
                        emails_enviados_count += 1
                        error_code = e.smtp_code
                        print(f"Erro SMTPDataError ao enviar e-mail para {email_obj.Conteudo}: {e}")
                        
                        db_detalhe = models.Detalhe(
                            Tipo = 1,
                            Codigo = error_code,
                            Envio = db_envio.IdEnvio,
                            Email = email_obj.IdEmail
                        )
                        db.add(db_detalhe)
                        db.commit()

                except smtplib.SMTPRecipientsRefused as e:
                    emails_enviados_count += 1
                    error_code = 0
                    
                    if e.recipients:
                        first_recipient = list(e.recipients.values())[0]
                        if isinstance(first_recipient, tuple) and len(first_recipient) > 0:
                            error_code = first_recipient[0]  # Vai capturar 553, 550, etc.
                    
                    print(f"Erro SMTPRecipientsRefused: {error_code} com o email {email_obj.Conteudo}")
                    
                    db_detalhe = models.Detalhe(
                        Tipo = 1,
                        Codigo = error_code,
                        Envio = db_envio.IdEnvio,
                        Email = email_obj.IdEmail
                    )
                    db.add(db_detalhe)
                    db.commit()

                except Exception as e:
                    emails_enviados_count += 1
                    error_code = 0
                    
                    # Para qualquer outro tipo de erro, tentamos extrair o código de forma genérica
                    if hasattr(e, 'smtp_code'):
                        error_code = e.smtp_code
                    elif hasattr(e, 'code'):
                        error_code = e.code
                    elif hasattr(e, 'status_code'):
                        error_code = e.status_code
                    
                    print(f"Erro genérico: {error_code} com o email {email_obj.Conteudo}: {e}")
                    
                    db_detalhe = models.Detalhe(
                        Tipo = 1,
                        Codigo = error_code,
                        Envio = db_envio.IdEnvio,
                        Email = email_obj.IdEmail
                    )
                    db.add(db_detalhe)
                    db.commit()

                progresso_emails_bruto = (emails_enviados_count / total_emails) * 80
                progresso_atual = int(progresso_emails_bruto)
                
                if progresso_atual > progresso_anterior:
                    progresso_total_barra = 10 + progresso_atual
                    await sio.emit('progress', {'sent': emails_enviados_count, 'total': total_emails, 'percentage': progresso_total_barra, 'id_envio': db_envio.IdEnvio}, room=sid)
                    progresso_anterior = progresso_atual

    except smtplib.SMTPAuthenticationError:
        if emails_enviados_count > 0:
            db.commit()
        print("Erro de autenticação.")

    except smtplib.SMTPServerDisconnected:
        if emails_enviados_count > 0:
            db.commit()
        print("O servidor desconectou.")

    except ConnectionRefusedError:
        if emails_enviados_count > 0:
            db.commit()
        print("A conexão foi recusada.")

    except Exception as e:
        if emails_enviados_count > 0:
            db.commit()
        print(f"Ocorreu um erro inesperado: {e}")

    # --- ETAPA 3: FINALIZAÇÃO (90% a 100% da barra) ---
    db.commit()
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

def get_envio_id_by_token(token: str, db:Session):
    envio_id = db.query(models.Envio.IdEnvio).filter(models.Envio.Token == token).scalar()
    return envio_id
