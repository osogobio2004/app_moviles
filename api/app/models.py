from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import DECIMAL
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from .database import Base


class Producto(Base):

    __tablename__ = "productos"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre = Column(
        String(150),
        nullable=False
    )

    descripcion = Column(
        Text,
        nullable=True
    )

    precio = Column(
        DECIMAL(10, 2),
        nullable=False
    )

    stock = Column(
        Integer,
        default=0
    )