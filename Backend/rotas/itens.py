# rotas/itens.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/itens/{item_id}")
def get_item(item_id: int):
    return {"item_id": item_id, "rota": "itens"}

@router.post("/itens/")
def create_item(item: dict):
    return {"item": item, "rota": "itens"}