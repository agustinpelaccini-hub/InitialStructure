from pydantic import BaseModel


class CreateZonaCoberturaDTO(BaseModel):
    nombre: str
    restaurante_id: int
    codigo_postal: str


class ZonaCoberturaResponseDTO(BaseModel):
    id: int
    nombre: str
    restaurante_id: int
    codigo_postal: str

    model_config = {"from_attributes": True}
