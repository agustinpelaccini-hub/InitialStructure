from sqlalchemy.orm import Session

from src.db.models.clientes_model import Clientes


class ClienteRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        email: str,
        nombre: str,
        direccion: str,
        telefono: str,
        role: str = "cliente",
    ) -> Clientes:
        cliente = Clientes(
            email=email,
            nombre=nombre,
            direccion=direccion,
            telefono=telefono,
            role=role,
        )
        self.db.add(cliente)
        self.db.commit()
        self.db.refresh(cliente)
        return cliente

    def find_by_id(self, cliente_id: int) -> Clientes | None:
        return self.db.query(Clientes).filter(Clientes.id == cliente_id).first()

    def find_by_email(self, email: str) -> Clientes | None:
        return self.db.query(Clientes).filter(Clientes.email == email).first()

    def list_all(self) -> list[Clientes]:
        return self.db.query(Clientes).all()

    def update(self, cliente_id: int, **fields) -> Clientes | None:
        cliente = self.find_by_id(cliente_id)
        if not cliente:
            return None
        for key, value in fields.items():
            setattr(cliente, key, value)
        self.db.commit()
        self.db.refresh(cliente)
        return cliente

    def delete(self, cliente_id: int) -> bool:
        cliente = self.find_by_id(cliente_id)
        if not cliente:
            return False
        self.db.delete(cliente)
        self.db.commit()
        return True
