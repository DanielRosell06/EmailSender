# standalone_update.py

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, inspect

# Carrega variáveis do .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("A variável de ambiente DATABASE_URL não foi definida.")

# Cria engine
engine = create_engine(DATABASE_URL)

def update_envio_table():
    """Adiciona as colunas de chave estrangeira na tabela envio"""
    
    with engine.connect() as connection:
        # Verifica quais colunas já existem
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('envio')]
        
        print(f"Colunas atuais da tabela envio: {columns}")
        
        try:
            # Inicia transação
            trans = connection.begin()
            
            # Adiciona coluna Lista se não existir
            if 'Lista' not in columns:
                connection.execute(text('ALTER TABLE envio ADD COLUMN "Lista" INTEGER'))
                print("Coluna 'Lista' adicionada")
            else:
                print("Coluna 'Lista' já existe")
            
            # Adiciona coluna Campanha se não existir
            if 'Campanha' not in columns:
                connection.execute(text('ALTER TABLE envio ADD COLUMN "Campanha" INTEGER'))
                print("Coluna 'Campanha' adicionada")
            else:
                print("Coluna 'Campanha' já existe")
            
            # Adiciona as constraints de foreign key
            try:
                connection.execute(text('''
                    ALTER TABLE envio 
                    ADD CONSTRAINT fk_envio_lista 
                    FOREIGN KEY ("Lista") REFERENCES lista("IdLista")
                '''))
                print("Foreign key para Lista adicionada")
            except Exception as fk_error:
                if "already exists" in str(fk_error):
                    print("Foreign key para Lista já existe")
                else:
                    print(f"Aviso FK Lista: {fk_error}")
            
            try:
                connection.execute(text('''
                    ALTER TABLE envio 
                    ADD CONSTRAINT fk_envio_campanha 
                    FOREIGN KEY ("Campanha") REFERENCES campanha("IdCampanha")
                '''))
                print("Foreign key para Campanha adicionada")
            except Exception as fk_error:
                if "already exists" in str(fk_error):
                    print("Foreign key para Campanha já existe")
                else:
                    print(f"Aviso FK Campanha: {fk_error}")
            
            # Commit das alterações
            trans.commit()
            print("Tabela envio atualizada com sucesso!")
            
        except Exception as e:
            trans.rollback()
            print(f"Erro: {e}")
            raise

def verify_table_structure():
    """Verifica a estrutura final da tabela"""
    inspector = inspect(engine)
    
    print("\nEstrutura final da tabela envio:")
    columns = inspector.get_columns('envio')
    for col in columns:
        nullable = "NULL" if col['nullable'] else "NOT NULL"
        print(f"  - {col['name']}: {col['type']} ({nullable})")
    
    print("\nForeign keys da tabela envio:")
    foreign_keys = inspector.get_foreign_keys('envio')
    for fk in foreign_keys:
        print(f"  - {fk['constrained_columns']} → {fk['referred_table']}.{fk['referred_columns']}")

if __name__ == "__main__":
    print("Atualizando tabela envio...")
    update_envio_table()
    verify_table_structure()