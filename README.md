# InitialStructure — Run with Docker

This repo includes a `docker-compose.yml` that can run the backend, a PostgreSQL database, and the frontend.

Services provided:
- `db`: PostgreSQL 15 (ports: 5432)
- `backend`: FastAPI (ports: 8000)
- `frontend`: Vite dev server (ports: 5173) with volume mounts for hot-reload
- `frontend-prod`: production build served by `nginx` (ports: 80)

Quick start (requires Docker):

- Development (hot-reload frontend):

```powershell
# builds images and starts db, backend and frontend dev server
docker compose up --build backend db frontend
```

- Production frontend (build + nginx):

```powershell
# builds images and starts backend, db and frontend served by nginx on port 80
docker compose up --build backend db frontend-prod
```

- Full (both dev and prod frontend services):

```powershell
docker compose up --build
```

Notes:
- Backend reads `DATABASE_URL` from environment. The compose file sets it automatically to point to the `db` service.
- If you want to persist DB data across runs, the compose file creates a `db_data` volume.
- The frontend production image expects the app to be served on `/` and proxies `/api` to the backend.

VS Code: use the Run configuration `Run full app (docker)` to run `docker compose up --build` with a single button.

If you want I can:
- add a `pgadmin` service
- add migrations / a seed step to initialize the DB
- tweak backend to wait for DB migrations on startup

