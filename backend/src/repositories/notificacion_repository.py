from sqlalchemy.orm import Session

from src.db.models.notificacion_model import Notificacion


class NotificacionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        pedido_id: int,
        estado_nuevo: str,
        usuario_id: int,
        leida: bool = False,
        precio: int = 0
    ) -> Notificacion:

        notificacion = Notificacion(
            pedido_id=pedido_id,
            estado_nuevo=estado_nuevo,
            usuario_id=usuario_id,
            leida=leida,
            precio=precio
        )

        self.db.add(notificacion)
        self.db.commit()
        self.db.refresh(notificacion)

        return notificacion

    def find_by_id(self, notificacion_id: int) -> Notificacion | None:
        return (
            self.db.query(Notificacion)
            .filter(Notificacion.id == notificacion_id)
            .first()
        )

    def list_all(self) -> list[Notificacion]:
        return self.db.query(Notificacion).all()

    def find_by_usuario(self, usuario_id: int) -> list[Notificacion]:
        return (
            self.db.query(Notificacion)
            .filter(Notificacion.usuario_id == usuario_id)
            .all()
        )

    def update(self, notificacion_id: int, **fields) -> Notificacion | None:
        notificacion = (
            self.db.query(Notificacion)
            .filter(Notificacion.id == notificacion_id)
            .first()
        )

        if not notificacion:
            return None

        for key, value in fields.items():
            setattr(notificacion, key, value)

        self.db.commit()
        self.db.refresh(notificacion)

        return notificacion

    def delete(self, notificacion_id: int) -> bool:
        notificacion = (
            self.db.query(Notificacion)
            .filter(Notificacion.id == notificacion_id)
            .first()
        )

        if not notificacion:
            return False

        self.db.delete(notificacion)
        self.db.commit()

        return True