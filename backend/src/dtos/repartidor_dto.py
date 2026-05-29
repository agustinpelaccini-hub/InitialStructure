from pydantic import BaseModel


class CreateRepartidorDTO(BaseModel):
    nombre: str
    vehiculo: str
    disponible: bool | None = True


class UpdateRepartidorDTO(BaseModel):
    nombre: str | None = None
    vehiculo: str | None = None
    disponible: bool | None = None


class RepartidorResponseDTO(BaseModel):
    id: int
    nombre: str
    vehiculo: str
    disponible: bool

    model_config = {"from_attributes": True}
