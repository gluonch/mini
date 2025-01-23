from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Simple FastAPI App")


class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float


items = [
    {"name": "item1", "description": "description1", "price": 100.0},
    {"name": "item2", "description": "description2", "price": 200.0},
]


@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI application"}


@app.get("/items")
async def get_items():
    return items


@app.post("/items")
async def create_item(item: Item):
    items.append(item)
    return item


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=3000)
