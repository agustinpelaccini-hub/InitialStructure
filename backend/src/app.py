from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.middlewares.error_middleware import app_error_handler
from src.routers import (
    calificacion_router,
    clientes_router,
    cupones_router,
    notificacion_router,
    pedido_router,
    platos_router,
    repartidor_router,
    restaurantes_router,
    zona_cobertura_router,
)
from src.utils.errors import AppError, BadRequestError, ConflictError

app = FastAPI(title="Initial Structure API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppError, app_error_handler)


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"error": "BadRequestError", "message": str(exc)},
    )


@app.exception_handler(BadRequestError)
async def bad_request_handler(request: Request, exc: BadRequestError):
    return JSONResponse(
        status_code=400,
        content={"error": "BadRequestError", "message": exc.message},
    )


@app.exception_handler(ConflictError)
async def conflict_handler(request: Request, exc: ConflictError):
    return JSONResponse(
        status_code=409,
        content={"error": "ConflictError", "message": exc.message},
    )


API_PREFIX = "/api"

app.include_router(restaurantes_router.router, prefix=API_PREFIX)
app.include_router(clientes_router.router, prefix=API_PREFIX)
app.include_router(repartidor_router.router, prefix=API_PREFIX)
app.include_router(platos_router.router, prefix=API_PREFIX)
app.include_router(pedido_router.router, prefix=API_PREFIX)
app.include_router(cupones_router.router, prefix=API_PREFIX)
app.include_router(zona_cobertura_router.router, prefix=API_PREFIX)
app.include_router(calificacion_router.router, prefix=API_PREFIX)
app.include_router(notificacion_router.router, prefix=API_PREFIX)


@app.get("/health")
def health():
    return {"status": "ok"}
