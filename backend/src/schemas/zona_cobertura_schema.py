from pydantic import BaseModel, Field


class CreateZonaCoberturaSchema(BaseModel):
    nombre: str = Field(min_length=1)
    restaurante_id: int = Field(gt=0)
    role: str | None = Field(default="cliente")
    codigo_postal: str = Field(min_length=1)


class UpdateZonaCoberturaSchema(BaseModel):
    nombre: str | None = Field(default=None, min_length=1)
    restaurante_id: int | None = Field(default=None, gt=0)
    role: str | None = Field(default=None)
    codigo_postal: str | None = Field(default=None, min_length=1)