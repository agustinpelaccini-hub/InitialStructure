from pydantic import BaseModel


class CreateRepartidorDTO(BaseModel):
    nombre: str
    telefono: int
    role: str | None = "repartidor"
    vehiculo: str
    disponible: bool | None = True


class UpdateRepartidorDTO(BaseModel):
    nombre: str | None = None
    telefono: int | None = None
    role: str | None = None
    vehiculo: str | None = None
    disponible: bool | None = None


class DeleteRepartidorDTO(BaseModel):
    id: int


class GetRepartidorDTO(BaseModel):
    id: int


class RepartidorResponseDTO(BaseModel):
    id: int
    nombre: str
    telefono: int
    role: str
    vehiculo: str
    disponible: bool

    model_config = {"from_attributes": True}