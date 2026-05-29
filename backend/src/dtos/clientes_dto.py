from pydantic import BaseModel


class CreateClienteDTO(BaseModel):
    email: str
    nombre: str
    direccion: str
    telefono: str
    role: str | None = "cliente"


class UpdateClienteDTO(BaseModel):
    email: str | None = None
    nombre: str | None = None
    direccion: str | None = None
    telefono: str | None = None
    role: str | None = None


class DeleteClienteDTO(BaseModel):
    id: int


class GetClienteDTO(BaseModel):
    id: int


class ClienteResponseDTO(BaseModel):
    id: int
    email: str
    nombre: str
    direccion: str
    telefono: str
    role: str
    created_at: str

    model_config = {"from_attributes": True}