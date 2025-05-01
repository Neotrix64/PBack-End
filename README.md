#  Proton — Backend

Este es el backend oficial del proyecto **Proton**, una plataforma que combina lo mejor de Insomnia y FastAPI con integración de inteligencia artificial para facilitar la creación, prueba y documentación de APIs de forma visual e intuitiva.

## 🚀 Tecnologías y dependencias principales

- [Express](https://expressjs.com/) — Framework para la creación de la API REST.
- [MongoDB + Mongoose](https://mongoosejs.com/) — Base de datos NoSQL y ORM para modelos.
- [JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken) — Autenticación segura basada en tokens.
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — Encriptación de contraseñas.
- [CORS](https://github.com/expressjs/cors) — Middleware para habilitar acceso cross-origin.
- [dotenv](https://github.com/motdotla/dotenv) — Manejo de variables de entorno.

## 📁 Estructura del proyecto


- `endpoints/`: Lógica de negocio.
- `middleware/`: Validaciones, autenticación, control de errores.
- `models/`: Esquemas de MongoDB.
- `utils/`: Funciones reutilizables (generación de tokens, etc).
- `index.js`: Punto de entrada principal.

## 🔐 Autenticación

El sistema utiliza JWT para proteger rutas privadas. Las contraseñas son almacenadas de forma segura usando `bcrypt`.

### Endpoints básicos de autenticación

- `POST /api/auth/register` — Registro de nuevos usuarios.
- `POST /api/auth/login` — Login con generación de token.
- `GET /api/user/profile` — Obtener perfil autenticado (requiere token).

## ⚙️ Configuración del entorno

Crea un archivo `.env` en la raíz con las siguientes variables:

```env
MONGODB_CONNECTION=mongodb://localhost:27017/PBack
PORT=3000
