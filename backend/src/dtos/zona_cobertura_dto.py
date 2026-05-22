from pydantic import BaseModel


class CreateZonaCoberturaDTO(BaseModel):
    nombre: str
    restaurante_id: int
    role: str | None = "cliente"
    codigo_postal: str


class UpdateZonaCoberturaDTO(BaseModel):
    nombre: str | None = None
    restaurante_id: int | None = None
    role: str | None = None
    codigo_postal: str | None = None


class DeleteZonaCoberturaDTO(BaseModel):
    id: int


class GetZonaCoberturaDTO(BaseModel):
    id: int


class ZonaCoberturaResponseDTO(BaseModel):
    id: int
    nombre: str
    restaurante_id: int
    role: str
    codigo_postal: str

    model_config = {"from_attributes": True}