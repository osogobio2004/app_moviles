from decimal import Decimal

from pydantic import BaseModel
from pydantic import ConfigDict


class ProductoBase(BaseModel):

    nombre: str
    descripcion: str | None = None
    precio: Decimal
    stock: int = 0


class ProductoCrear(ProductoBase):
    pass


class ProductoRespuesta(ProductoBase):

    id: int

    model_config = ConfigDict(
        from_attributes=True
    )