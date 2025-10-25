# Microservicios con Docker Compose

## Descripción
Arquitectura de microservicios compuesta por tres servicios que se comunican mediante una red interna Docker:

- **Frontend**: React + TypeScript + Vite  
- **Backend**: Node.js + TypeScript + Arquitectura Hexagonal  
- **Base de Datos**: PostgreSQL con persistencia

El proyecto está pensado para ejecutarse con Docker Compose; los contenedores se comunican por nombre de servicio dentro de la misma red. El frontend consume la API REST del backend, el backend realiza operaciones CRUD sobre la base de datos.

## Estructura del proyecto

```text
proyecto-docker/
├── backend/         # Código del API (TypeScript, Dockerfile)
├── frontend/        # Código del Frontend (Vite, React, Dockerfile)
├── docker-compose.yml
├── .env
└── README.md
```

## Arquitectura

```text
┌─────────────┐       ┌─────────────┐       ┌──────────────┐
│  Frontend   │─────▶│   Backend   │─────▶│  PostgreSQL  │
│  React:3000 │       │  Node:5000  │       │    :5432     │
└─────────────┘       └─────────────┘       └──────────────┘
       │                     │                     │
       └─────────────────────┴─────────────────────┘
             microservices-network (bridge)
```

El flujo de datos típico:
1. Usuario abre la UI en el Frontend (puerto 3000).
2. Frontend envía peticiones HTTP a la API (URL interna: http://marcos_brindis_api:5000/api).
3. Backend procesa la lógica y consulta/actualiza PostgreSQL (host: marcos_brindis_postgres).
4. PostgreSQL persiste los datos en el volumen nombrado postgres_data.

## Cómo Levantar el Proyecto

### Prerrequisitos
- Docker  
- Docker Compose  
- Git  

## docker-compose.yml (ubicación)

El archivo `docker-compose.yml` debe estar en la raíz del repo (al mismo nivel que `frontend/` y `backend/`). Este archivo levanta los tres servicios, define la red interna, y el volumen nombrado `postgres_data`.

### Pasos

1. Clonar el repositorio
```bash
git clone https://github.com/MarcosBrindis/proyecto-docker.git
cd proyecto-docker
```


2. Crear archivo de entorno local
```bash
touch .env 
nano .env
#estos son los datos que se necesitan
# Variables de la Base de Datos
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
# Puerto de la API 
API_PORT=5000
# Puerto del Frontend 
FRONT_PORT=3000
```

3. Construir y levantar los servicios
```bash
docker-compose up --build
```


4. Acceder a los servicios

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Endpoint Brindis: http://localhost:5000/api/brindis

## Endpoints principales

Endpoint personalizado (retorna mi nombre completo):
```
GET /api/brindis
```
Ejemplo de respuesta:
```json
{
  "nombreCompleto": "Marcos Brindis",
  "mensaje": "Endpoint personalizado de Marcos Brindis",
  "timestamp": "2025-10-21T15:09:13.000Z"
}
```


CRUD de usuarios:
- GET /api/users             — obtener todos los usuarios
- POST /api/users            — crear usuario (body JSON con nombre, apellido, email)
- GET /api/users/:id         — obtener usuario por id
- DELETE /api/users/:id      — eliminar usuario por id

## Esquema de la base de datos

Tabla: users

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
La inicialización de la tabla está automatizada en el backend (PostgresConnection.initializeDatabase) para crear la tabla `users` y cargar datos de ejemplo si la tabla está vacía.

Credenciales 
- Database: marcos_brindis_db
- Usuario: marcos
- Contraseña: <<--- CAMBIADO (Definida en el archivo .env)

## Probar persistencia:

1. Crear uno o más usuarios.
2. Detener y reiniciar contenedores:
```bash
docker-compose down
docker-compose up --build
```
3. Comprobar que los usuarios siguen presentes:
```bash
curl http://localhost:5000/api/users
```

## Autor
Marcos D Brindis
Arquitectura Hexagonal en Backend
Clean Architecture en Frontend

## Anexos (comandos útiles)

- Ver logs de todos los servicios:
```bash
docker-compose logs -f
```

- Ver logs de un servicio concreto:
```bash
docker-compose logs -f backend
```

- Reconstruir un servicio en concreto:
```bash
docker-compose build frontend
docker-compose up -d frontend
```
- Ver servicios activos 
```bash
docker-compose ps
```