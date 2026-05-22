from pydantic import BaseModel


class CreateCuponDTO(BaseModel):
    codigo: str
    porcentaje_descuento: int
    fecha_expiracion: str
    telefono: int
    uso_maximo: int
    usos_actuales: int | None = 0


class UpdateCuponDTO(BaseModel):
    codigo: str | None = None
    porcentaje_descuento: int | None = None
    fecha_expiracion: str | None = None
    telefono: int | None = None
    uso_maximo: int | None = None
    usos_actuales: int | None = None


class DeleteCuponDTO(BaseModel):
    id: int


class GetCuponDTO(BaseModel):
    id: int


class CuponResponseDTO(BaseModel):
    id: int
    codigo: str
    porcentaje_descuento: int
    fecha_expiracion: str
    telefono: int
    uso_maximo: int
    usos_actuales: int

    model_config = {"from_attributes": True}