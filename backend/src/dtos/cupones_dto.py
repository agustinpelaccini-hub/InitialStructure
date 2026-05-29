from pydantic import BaseModel


class CreateCuponDTO(BaseModel):
    codigo: str
    porcentaje_descuento: int
    fecha_vencimiento: str
    usos_maximos: int
    usos_actuales: int | None = 0


class UpdateCuponDTO(BaseModel):
    codigo: str | None = None
    porcentaje_descuento: int | None = None
    fecha_vencimiento: str | None = None
    usos_maximos: int | None = None
    usos_actuales: int | None = None


class CuponResponseDTO(BaseModel):
    id: int
    codigo: str
    porcentaje_descuento: int
    fecha_vencimiento: str
    usos_maximos: int
    usos_actuales: int
    porcentaje: int | None = None
    vencimiento: str | None = None

    model_config = {"from_attributes": True}
