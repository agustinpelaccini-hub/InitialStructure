from pydantic import BaseModel


class CreatePlatoDTO(BaseModel):
    restaurante_id: int | None = None
    nombre: str
    descripcion: str | None = None
    precio: float
    disponible: bool | None = True


class UpdatePlatoDTO(BaseModel):
    restaurante_id: int | None = None
    nombre: str | None = None
    descripcion: str | None = None
    precio: float | None = None
    disponible: bool | None = None


class DeletePlatoDTO(BaseModel):
    id: int


class GetPlatoDTO(BaseModel):
    id: int


class PlatoResponseDTO(BaseModel):
    id: int
    restaurante_id: int
    nombre: str
    descripcion: str | None = None
    precio: float
    disponible: bool

    model_config = {"from_attributes": True}