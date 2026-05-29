from pydantic import BaseModel, Field


class CreateZonaCoberturaSchema(BaseModel):
    nombre: str = Field(min_length=1)
    restaurante_id: int = Field(gt=0)
    codigo_postal: str = Field(min_length=1)
