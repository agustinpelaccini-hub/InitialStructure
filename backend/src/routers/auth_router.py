from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel

from src.db.connection import get_db
from src.db.models.clientes_model import Clientes
from src.db.models.repartidor_model import Repartidor
from src.db.models.resturantes_model import Restaurantes
from src.utils.errors import NotFoundError, BadRequestError

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    token: str
    role: str
    entidad_id: int | None
    nombre: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    nombre: str
    role: str  # "cliente", "repartidor", "restaurante"
    # Campos opcionales según rol
    direccion: str | None = None
    telefono: str | None = None
    categoria: str | None = None
    vehiculo: str | None = None


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    # Buscar en clientes
    cliente = db.query(Clientes).filter(Clientes.email == payload.email).first()
    if cliente and cliente.password and verify_password(payload.password, cliente.password):
        return LoginResponse(
            token="mock-token-" + str(cliente.id),
            role="cliente",
            entidad_id=cliente.id,
            nombre=cliente.nombre
        )
    
    # Buscar en repartidores
    repartidor = db.query(Repartidor).filter(Repartidor.email == payload.email).first()
    if repartidor and repartidor.password and verify_password(payload.password, repartidor.password):
        return LoginResponse(
            token="mock-token-" + str(repartidor.id),
            role="repartidor",
            entidad_id=repartidor.id,
            nombre=repartidor.nombre
        )
    
    # Buscar en restaurantes
    restaurante = db.query(Restaurantes).filter(Restaurantes.email == payload.email).first()
    if restaurante and restaurante.password and verify_password(payload.password, restaurante.password):
        return LoginResponse(
            token="mock-token-" + str(restaurante.id),
            role="restaurante",
            entidad_id=restaurante.id,
            nombre=restaurante.nombre
        )
    
    # Admin hardcodeado
    if payload.email == "admin@rappi.com" and payload.password == "admin123":
        return LoginResponse(
            token="mock-token-admin",
            role="admin",
            entidad_id=None,
            nombre="Administrador"
        )
    
    raise HTTPException(status_code=401, detail="Credenciales inválidas")


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(payload.password)
    
    if payload.role == "cliente":
        if not payload.direccion or not payload.telefono:
            raise HTTPException(status_code=400, detail="Dirección y teléfono son requeridos para clientes")
        
        # Verificar si email ya existe
        if db.query(Clientes).filter(Clientes.email == payload.email).first():
            raise HTTPException(status_code=400, detail="Email ya registrado")
        
        cliente = Clientes(
            nombre=payload.nombre,
            email=payload.email,
            password=hashed_password,
            direccion=payload.direccion,
            telefono=payload.telefono
        )
        db.add(cliente)
        db.commit()
        db.refresh(cliente)
        
        return LoginResponse(
            token="mock-token-" + str(cliente.id),
            role="cliente",
            entidad_id=cliente.id,
            nombre=cliente.nombre
        )
    
    elif payload.role == "repartidor":
        if not payload.vehiculo:
            raise HTTPException(status_code=400, detail="Vehículo es requerido para repartidores")
        
        # Verificar si email ya existe
        if db.query(Repartidor).filter(Repartidor.email == payload.email).first():
            raise HTTPException(status_code=400, detail="Email ya registrado")
        
        repartidor = Repartidor(
            nombre=payload.nombre,
            email=payload.email,
            password=hashed_password,
            vehiculo=payload.vehiculo
        )
        db.add(repartidor)
        db.commit()
        db.refresh(repartidor)
        
        return LoginResponse(
            token="mock-token-" + str(repartidor.id),
            role="repartidor",
            entidad_id=repartidor.id,
            nombre=repartidor.nombre
        )
    
    elif payload.role == "restaurante":
        if not payload.categoria or not payload.direccion:
            raise HTTPException(status_code=400, detail="Categoría y dirección son requeridos para restaurantes")
        
        # Verificar si email ya existe
        if db.query(Restaurantes).filter(Restaurantes.email == payload.email).first():
            raise HTTPException(status_code=400, detail="Email ya registrado")
        
        restaurante = Restaurantes(
            nombre=payload.nombre,
            email=payload.email,
            password=hashed_password,
            categoria=payload.categoria,
            direccion=payload.direccion
        )
        db.add(restaurante)
        db.commit()
        db.refresh(restaurante)
        
        return LoginResponse(
            token="mock-token-" + str(restaurante.id),
            role="restaurante",
            entidad_id=restaurante.id,
            nombre=restaurante.nombre
        )
    
    else:
        raise HTTPException(status_code=400, detail="Rol inválido")


@router.post("/logout")
def logout():
    return {"message": "Logout successful"}


@router.get("/me")
def me():
    return {"message": "Me endpoint - implementar con JWT real"}
