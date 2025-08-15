# create_tables.py

from database import engine, Base
from models import Lista, Campanha, Email, Envio, Detalhe

def create_tables():
    """Cria todas as tabelas no banco de dados"""
    try:
        Base.metadata.create_all(bind=engine)
        print("Tabelas criadas com sucesso!")
        
        # Lista as tabelas criadas
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tabelas no banco: {tables}")
        
    except Exception as e:
        print(f"❌ Erro ao criar tabelas: {e}")

if __name__ == "__main__":
    create_tables()