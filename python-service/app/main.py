from fastapi import FastAPI
from pydantic import BaseModel

from . import rag

app = FastAPI()


class QueryRequest(BaseModel):
    question: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/query")
def query(req: QueryRequest):
    return rag.answer(req.question)
