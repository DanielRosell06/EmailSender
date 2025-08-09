# main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Importa a conexão com o banco de dados
from database import engine, Base, get_db

# Importa os módulos de schemas e crud
from schema import lista as schemas_lista
from schema import email as schemas_email

from crud import lista as crud_lista
from crud import email as crud_email

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os headers
)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API!"}

# Endpoint para CRIAR uma nova lista
@app.post("/listas/", response_model=schemas_lista.Lista)
def create_lista(lista_data: schemas_lista.ListaCreate, db: Session = Depends(get_db)):
    """
    Cria uma nova lista com os dados fornecidos.
    """
    # Você não precisa mais do parâmetro 'emails' separado
    response_list = crud_lista.create_lista(db=db, lista=lista_data)
    response_emails = crud_email.create_email(db=db, email=lista_data.Emails, lista_id=response_list.IdLista)
     
    return response_list