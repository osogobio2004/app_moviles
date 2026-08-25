from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text

from app.database import engine


app = FastAPI(
    title="API Desarrollo de Aplicaciones Móviles",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8100"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def inicio():

    return {
        "mensaje": "API funcionando correctamente"
    }


@app.get("/productos")
def productos():

    with engine.connect() as connection:

        resultado = connection.execute(
            text("""
                SELECT
                    id,
                    nombre,
                    descripcion,
                    precio,
                    stock
                FROM productos
            """)
        )

        productos = []

        for fila in resultado:

            productos.append({
                "id": fila.id,
                "nombre": fila.nombre,
                "descripcion": fila.descripcion,
                "precio": float(fila.precio),
                "stock": fila.stock
            })

        return productos