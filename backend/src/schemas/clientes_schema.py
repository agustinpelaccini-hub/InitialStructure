from pydantic import BaseModel, Field


class CreateClienteSchema(BaseModel):
    email: str = Field(min_length=1)
    nombre: str = Field(min_length=1)
    direccion: str = Field(min_length=1)
    telefono: str = Field(min_length=1)
    role: str | None = Field(default="cliente")


class UpdateClienteSchema(BaseModel):
    email: str | None = Field(default=None, min_length=1)
    nombre: str | None = Field(default=None, min_length=1)
    direccion: str | None = Field(default=None, min_length=1)
    telefono: str | None = Field(default=None, min_length=1)
    role: str | None = Field(default=None)
