from sqlalchemy.orm import Session

from src.dtos.clientes_dto import (
    CreateClienteDTO,
    UpdateClienteDTO,
    GetClienteDTO,
    DeleteClienteDTO,
    ClienteResponseDTO
)

from src.mappers.clientes_mapper import to_clientes_response
from src.repositories.clientes_repository import ClienteRepository
from src.exceptions import NotFoundError


class ClienteService:
    def __init__(self, db: Session):
        self.repo = ClienteRepository(db)

    def create(self, dto: CreateClienteDTO) -> ClienteResponseDTO:
        """Crea un cliente y devuelve el DTO de respuesta."""

        existing_cliente = self.repo.find_by_email(dto.email)

        if existing_cliente:
            raise ValueError(
                f"Ya existe un cliente con el email {dto.email}"
            )

        cliente = self.repo.create(
            email=dto.email,
            nombre=dto.nombre,
            direccion=dto.direccion,
            telefono=dto.telefono,
            role=dto.role
        )

        return to_clientes_response(cliente)

    def get_by_id(self, cliente_id: int) -> ClienteResponseDTO:
        cliente = self.repo.find_by_id(cliente_id)

        if not cliente:
            raise NotFoundError(
                f"Cliente con id {cliente_id} no encontrado"
            )

        return to_clientes_response(cliente)

    def list_all(self) -> list[ClienteResponseDTO]:
        clientes = self.repo.list_all()

        return [
            to_clientes_response(c)
            for c in clientes
        ]

    def update(
        self,
        cliente_id: int,
        dto: UpdateClienteDTO
    ) -> ClienteResponseDTO:

        if dto.email:
            existing_cliente = self.repo.find_by_email(dto.email)

            if existing_cliente and existing_cliente.id != cliente_id:
                raise ValueError(
                    f"Ya existe un cliente con el email {dto.email}"
                )

        cliente = self.repo.update(
            cliente_id,
            **dto.dict(exclude_unset=True)
        )

        if not cliente:
            raise NotFoundError(
                f"Cliente con id {cliente_id} no encontrado"
            )

        return to_clientes_response(cliente)

    def delete(self, cliente_id: int) -> None:
        success = self.repo.delete(cliente_id)

        if not success:
            raise NotFoundError(
                f"Cliente con id {cliente_id} no encontrado"
            )