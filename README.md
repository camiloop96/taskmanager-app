# Taskify – Sistema de Tareas

Taskify es una API RESTful desarrollada con **NestJS** para la gestión de tareas.  
La aplicación está diseñada de forma modular bajo el paradigma de **Arquitectura Hexagonal**, lo que facilita la escalabilidad, el mantenimiento y la separación de responsabilidades en distintos dominios y capas.

---

## 🎯 Objetivo

Construir una API robusta que permita a los usuarios gestionar sus propias tareas, mientras que los administradores pueden supervisar y administrar todas.  
La API incluye:

- Autenticación segura con JWT.
- Manejo de roles para usuarios y administradores.
- Filtros avanzados y paginación para la gestión de tareas.
- Documentación completa con Swagger.

---

## ⚙️ Tecnologías

- **NestJS (v10+)**: Framework para construir aplicaciones escalables en Node.js.
- **TypeORM + PostgreSQL**: Gestión de base de datos relacional.
- **JWT**: Para autenticación mediante access y refresh tokens.
- **Swagger (OpenAPI)**: Documentación interactiva de la API.
- **Docker**: Para levantar el entorno completo (opcional).
- **class-validator**: Validación de DTOs.
- **Interceptors y Guards personalizados**: Manejo avanzado de seguridad y errores.
- **Multer y WebSockets (Bonus)**: Para subida de archivos y notificaciones en tiempo real.

---

## 🧩 Arquitectura y Diseño

Taskify se organiza siguiendo la **Arquitectura Hexagonal**, lo que permite separar el **núcleo de la aplicación (dominio y lógica de negocio)** de las dependencias externas (como bases de datos, APIs y frameworks). Esto hace que el proyecto sea altamente modular y fácil de mantener.

### Estructura de carpetas

```bash
src/
│
├── security/     → Módulo de seguridad (autenticación, roles, guards, estrategias JWT)
├── task/         → Módulo de gestión de tareas (CRUD, filtros, paginación)
│
├── common/       → Decoradores, interceptores y filtros globales
├── config/       → Configuración del proyecto (variables de entorno, Swagger, Morgan, etc.)
│
├── main.ts       → Punto de entrada y bootstrap de la aplicación
└── app.module.ts → Módulo raíz que integra todos los módulos
```

### Diseño del Proyecto

**Modularidad:**: Cada dominio (seguridad, tareas, etc.) se implementa en un módulo independiente, permitiendo pruebas y desarrollo aislado.

**Autenticación y Roles:** Implementados con JWT, se protegen las rutas sensibles utilizando guardias personalizados y decoradores como @Roles() y @Public().

**Validaciones Centralizadas:** Se utiliza class-validator para garantizar la integridad de los datos en los DTOs.

**Adaptabilidad:** La estructura facilita la integración con otros servicios o tecnologías (por ejemplo, WebSockets para notificaciones en tiempo real).

---

## 🔐 Autenticación y Roles

**Registro/Login:**  
Los usuarios se registran y autentican con **email** y **contraseña**.

**🔑 Tokens:**

- **Access Token:** Se envía en la cabecera `Authorization` con el formato `Bearer <token>`.
- **Refresh Token:** Se gestiona vía **cookies** o mediante un **endpoint específico**.

**👤 Perfil:**  
Endpoint `GET /auth/profile` para obtener los detalles del usuario autenticado.

**🎭 Roles:**

- `USER`: Puede gestionar **solo sus tareas**.
- `ADMIN`: Puede gestionar **todas las tareas**.

**🛡️ Protección de rutas:**  
Se utilizan **guards personalizados** y **decoradores** (`@Roles()` y `@Public()`) para controlar el acceso a los endpoints.

---

## ✅ Endpoints Principales

### 🔐 Autenticación

| Método | Ruta             | Descripción                         |
| ------ | ---------------- | ----------------------------------- |
| POST   | `/auth/register` | Registro de usuario                 |
| POST   | `/auth/login`    | Inicio de sesión y obtención de JWT |
| GET    | `/auth/profile`  | Obtener el perfil del usuario       |
| GET    | `/auth/users`    | Listado de usuarios (solo Admin)    |

### 📋 Tareas

| Método | Ruta         | Descripción                              |
| ------ | ------------ | ---------------------------------------- |
| GET    | `/tasks`     | Listar tareas (con filtros y paginación) |
| POST   | `/tasks`     | Crear una nueva tarea                    |
| GET    | `/tasks/:id` | Obtener detalle de una tarea             |
| PATCH  | `/tasks/:id` | Actualizar información de una tarea      |
| DELETE | `/tasks/:id` | Eliminar una tarea                       |

---

## 🔎 Filtros y Paginación

**Ejemplo:**

GET /tasks?status=TODO&dueDate=2024-04-10&page=1&limit=10

- Permite filtrar por `status` y `dueDate`.
- Soporta paginación usando los parámetros `page` y `limit`.
- Implementado utilizando **QueryBuilder** de TypeORM.

---

## 📑 Validaciones

Las validaciones se implementan con `class-validator` en los DTOs.

**Ejemplo de DTO:**

```ts
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;
}
```

Se validan campos como:

- title: string (requerido)

- description: string

- status: enum (TODO, IN_PROGRESS, DONE)

- dueDate: fecha válida

- userId: asociado automáticamente al usuario autenticado

## 📘 Documentación

La documentación Swagger de Taskify está disponible en:
/api

Todos los endpoints están documentados.

Se puede enviar el JWT desde Swagger para probar endpoints protegidos.

---

📦 Scripts

```bash

# Instalar dependencias

npm install

# Levantar en modo desarrollo

npm run start:dev

# Compilar y ejecutar en modo producción

npm run build && npm run start:prod

# Ejecutar pruebas unitarias

npm run test

```

---

## 🐳 Docker (opcional)

Si deseas levantar el entorno completo con Docker, puedes usar Docker Compose.

Ejemplo de Docker Compose:

```yaml

version: '3.9'
services:
api:
container_name: taskmanager-server
image: taskmanager-server:latest
env_file: - .env
depends_on: - postgres
networks: - taskmanager-net
restart: unless-stopped

postgres:
container_name: taskmanager-db
image: postgres:15-alpine
restart: always
environment: - POSTGRES_HOST=${POSTGRES_HOST}
      - POSTGRES_PORT=${POSTGRES_PORT} - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD} - POSTGRES_DB=${POSTGRES_DB}
env_file: - .env
ports: - 5436:5432
volumes: - tasksys-data:/var/lib/postgresql/data
networks: - taskmanager-net

nginx:
container_name: nova_nginx
image: nginx:stable
ports: - "80:80" - "443:443"
volumes: - ./nginx/conf.d:/etc/nginx/conf.d - ./nginx/nginx.conf:/etc/nginx/nginx.conf - ./nginx/ssl:/etc/letsencrypt - ./nginx/webroot:/var/www/certbot
depends_on: - api
networks: - taskmanager-net
restart: unless-stopped

certbot:
image: certbot/certbot
container_name: certbot
volumes: - ./nginx/ssl:/etc/letsencrypt - ./nginx/ssl:/var/lib/letsencrypt - ./nginx/conf.d:/etc/nginx/conf.d
entrypoint: /bin/sh -c "trap exit TERM; while :; do sleep 1; done"
networks: - taskmanager-net

volumes:
tasksys-data:

networks:
taskmanager-net:
driver: bridge
Ejemplo de archivo .env:

```

### Variables de entorno

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=task_db
JWT_SECRET=mySuperSecret
JWT_EXPIRATION=3600s
PORT=4000

```

## 🚀 Estado Actual

**Módulos Funcionales:**

- Seguridad con JWT y roles.

- Gestión de tareas (CRUD) con validaciones, filtros y paginación.

- Documentación Swagger integrada.

- Integración con TypeORM y PostgreSQL.

**Pendiente/En Desarrollo:**

- Pruebas unitarias y E2E.

- Mejoras y refinamiento en la integración con Docker Compose.

- Implementación de WebSockets y subida de archivos.

---

## 🧑‍💻 Diseño del Proyecto

Taskify se ha construido siguiendo Arquitectura Hexagonal, lo que permite separar la lógica de negocio del núcleo de la aplicación de las dependencias externas y las interfaces.

**Modularidad:** Cada dominio (seguridad, tareas, etc.) está encapsulado en su propio módulo, facilitando la escalabilidad y el mantenimiento.

**Roles y Autenticación:** Se utiliza JWT junto con un sistema de roles y guardias personalizados para proteger las rutas.

**Validaciones Centralizadas:** Uso de class-validator para asegurar la integridad de los datos.

**Interacción Limpia:** Los componentes y módulos están desacoplados a través de puertos y adaptadores, permitiendo cambios en la infraestructura sin afectar la lógica del negocio.

---

## 🚀 Cómo Ejecutar

```bash

# Clona el repositorio

git clone <url-del-repo>
cd taskify

# Instala dependencias

npm install

# Configura la base de datos en el archivo .env (o usa tu propia configuración)

# Inicia la aplicación en modo desarrollo

npm run start:dev

# Accede a la documentación Swagger en:

http://localhost:4000/api

```

---

## 🧪 Testing

**_Pruebas Unitarias:_** Para AuthService, TaskService y RolesGuard.

**Pruebas E2E:** Para flujos de registro, login y gestión de tareas según rol.


## 🧰 Autor
**Camilo Polanía** – Desarrollador Fullstack
