# 📋 Prueba Técnica: Sistema de Tareas

API RESTful desarrollada con **NestJS** para la gestión de tareas. Incluye autenticación con JWT, manejo de roles, filtros avanzados y documentación Swagger.

---

## 🎯 Objetivo

Desarrollar una API robusta para la creación, edición y seguimiento de tareas. Cada usuario puede gestionar sus propias tareas, mientras que un administrador puede gestionar todas.

---

## ⚙️ Tecnologías

- NestJS (v10+)
- TypeORM + PostgreSQL
- JWT (access & refresh tokens)
- Swagger (OpenAPI)
- Docker (opcional)
- class-validator
- Interceptores y Guards personalizados

---

## 🧩 Arquitectura

Proyecto basado en **Arquitectura Hexagonal**, dividido por dominios y capas:

```bash
src/
│
├── security/     → Seguridad: autenticación, roles, guards, estrategias JWT
├── task/         → Gestión de tareas (CRUD)
│
├── common/       → Decoradores, interceptores, filtros globales
├── config/       → Variables de entorno y configuración del proyecto
│
├── main.ts       → Bootstrap principal
└── app.module.ts → Módulo raíz
```

---

## 🔐 Autenticación y Roles

- **Registro/Login** con email y contraseña
- **Access Token** en headers (`Authorization: Bearer <token>`)
- **Refresh Token** vía cookies o endpoint
- Endpoint `GET /auth/profile` para obtener el usuario autenticado
- **Roles:**
  - `USER`: Solo puede ver/gestionar sus tareas
  - `ADMIN`: Puede ver/gestionar todas las tareas
- Decorador `@Roles('USER' | 'ADMIN')` con **Guard personalizado**

---

## ✅ Endpoints Principales

### 🔐 Autenticación

| Método | Ruta             | Descripción                    |
| ------ | ---------------- | ------------------------------ |
| POST   | `/auth/register` | Registro de usuario            |
| POST   | `/auth/login`    | Login con JWT                  |
| GET    | `/auth/profile`  | Perfil del usuario autenticado |

### 📋 Tareas

| Método | Ruta         | Descripción                            |
| ------ | ------------ | -------------------------------------- |
| GET    | `/tasks`     | Lista de tareas (filtros y paginación) |
| POST   | `/tasks`     | Crear una tarea                        |
| GET    | `/tasks/:id` | Obtener detalle de una tarea           |
| PATCH  | `/tasks/:id` | Editar tarea                           |
| DELETE | `/tasks/:id` | Eliminar tarea                         |

---

## 🔎 Filtros y Paginación

- **GET /tasks?status=TODO&dueDate=2024-04-10&page=1&limit=10**
- Filtros opcionales: `status`, `dueDate`
- Paginación con `page` y `limit`
- Implementado usando QueryBuilder de TypeORM

---

## 📑 Validaciones

Usando `class-validator` en DTOs:

- `title`: string (requerido)
- `description`: string
- `status`: enum (`TODO`, `IN_PROGRESS`, `DONE`)
- `dueDate`: fecha válida
- `userId`: relación automática al usuario autenticado

---

## 📘 Swagger

Documentación disponible en: [`/api`](http://localhost:3000/api)

- Todos los endpoints documentados
- Se puede enviar JWT desde Swagger para probar endpoints protegidos

---

## 🧪 Testing (Opcional)

- Pruebas Unitarias: `AuthService`, `TasksService`, `RolesGuard`
- E2E Testing: Registro, login, tareas por rol

---

## 📦 Scripts

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run start:dev

# Compilar y correr
npm run start

# Pruebas unitarias
npm run test

# Documentación Swagger disponible en /api
🐳 Docker (opcional)
Si deseas levantar el entorno con Docker:

bash
Copiar
Editar
# Construir imagen
docker build -t task-api .

# Correr contenedor con PostgreSQL
docker-compose up
Archivo .env (ejemplo):

env
Copiar
Editar
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=task_db
JWT_SECRET=mySuperSecret
JWT_EXPIRATION=3600s
🎁 Bonus Implementados
 WebSockets para notificaciones

 Upload de archivos con multer

 Arquitectura hexagonal y sistema multirrol robusto

 Docker completo con base de datos

📌 Estado Actual
✅ Módulos funcionales:

Seguridad con JWT

Sistema de roles

CRUD con validaciones

Filtros y paginación

Swagger documentado

🚧 En desarrollo o pendiente:

Tests

Docker Compose

WebSocket y Uploads (bonus)

🚀 Cómo Ejecutar
bash
Copiar
Editar
# Clona el repo
git clone <url-del-repo>
cd task-api

# Instala dependencias
npm install

# Levanta base de datos local
# (o configura conexión en .env)

# Corre la app
npm run start:dev
🧠 Autor
Camilo – Desarrollador Fullstack

```
