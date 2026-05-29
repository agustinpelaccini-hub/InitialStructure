from sqlalchemy.orm import Session

from src.dtos.clientes_dto import CreateClienteDTO, UpdateClienteDTO, ClienteResponseDTO
from src.mappers.clientes_mapper import to_clientes_response
from src.repositories.clientes_repository import ClienteRepository
from src.utils.errors import ConflictError, NotFoundError


class ClienteService:
    def __init__(self, db: Session):
        self.repo = ClienteRepository(db)

    def create(self, dto: CreateClienteDTO) -> ClienteResponseDTO:
        if self.repo.find_by_email(dto.email):
            raise ConflictError(f"Ya existe un cliente con el email {dto.email}")
        cliente = self.repo.create(
            email=dto.email,
            nombre=dto.nombre,
            direccion=dto.direccion,
            telefono=dto.telefono,
            role=dto.role or "cliente",
        )
        return to_clientes_response(cliente)

    def get_by_id(self, cliente_id: int) -> ClienteResponseDTO:
        cliente = self.repo.find_by_id(cliente_id)
        if not cliente:
            raise NotFoundError(f"Cliente con id {cliente_id} no encontrado")
        return to_clientes_response(cliente)

    def list_all(self) -> list[ClienteResponseDTO]:
        return [to_clientes_response(c) for c in self.repo.list_all()]

    def update(self, cliente_id: int, dto: UpdateClienteDTO) -> ClienteResponseDTO:
        if dto.email:
            existing = self.repo.find_by_email(dto.email)
            if existing and existing.id != cliente_id:
                raise ConflictError(f"Ya existe un cliente con el email {dto.email}")
        data = dto.model_dump(exclude_unset=True)
        cliente = self.repo.update(cliente_id, **data)
        if not cliente:
            raise NotFoundError(f"Cliente con id {cliente_id} no encontrado")
        return to_clientes_response(cliente)

    def delete(self, cliente_id: int) -> None:
        if not self.repo.delete(cliente_id):
            raise NotFoundError(f"Cliente con id {cliente_id} no encontrado")
