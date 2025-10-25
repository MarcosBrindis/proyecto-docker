# Microservicios con Docker Compose

## Descripción
Arquitectura de microservicios compuesta por tres servicios que se comunican mediante una red interna Docker:

- **Frontend**: React + TypeScript + Vite  
- **Backend**: Node.js + TypeScript  + Arquitectura Hexagonal
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
1. El usuario abre la UI en su **navegador** (ej. `http://localhost:3000` o `http://<IP-PUBLICA>:3000`).
2. El código React (ejecutándose en el navegador) envía peticiones HTTP... (ej. `http://localhost:5000/api` o `http://<IP-PUBLICA>:5000/api`).
3. El contenedor del Backend (marcos_brindis_api) recibe esta petición externa.
4. El Backend procesa la lógica y se conecta al contenedor de la base de datos usando el nombre del servicio (host: postgres, puerto: 5432).
5. PostgreSQL (Contenedor marcos_brindis_db) persiste los datos en el volumen nombrado postgres_data.

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
Crea un archivo llamado .env en la raíz del proyecto.
```bash
touch .env 
```
Abre el archivo (ej. nano .env) y llénalo con la siguiente estructura (reemplazando los valores si es necesario):

```text
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
(Puedes añadir -d para ejecutarlo en segundo plano)

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

### Credenciales 
- Database: marcos_brindis_db
- Usuario: marcos
- Contraseña: (Definida en el archivo .env)

## Probar persistencia:
Para verificar que el volumen postgres_data funciona:
1. Levanta los servicios y crea un nuevo usuario desde el frontend.
2. Reinicia los contenedores (esto no los borra):
```bash
docker-compose restart
```
3. Refresca el frontend. El usuario debe seguir allí.
### Prueba Fuerte (Opcional)
1. Detén y elimina los contenedores:
```bash
docker-compose down
```
2. Levántalos de nuevo:
```bash
docker-compose up -d
```
3. El usuario debe seguir allí.

## Autor
### Marcos D Brindis
- Arquitectura Hexagonal en Backend
- Clean Architecture en Frontend
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