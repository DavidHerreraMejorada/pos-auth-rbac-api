# 🔐 REST API Authentication & Role-Based Access Control (RBAC)

Una API REST robusta y escalable construida con **Node.js**, **TypeScript**, **Express**, **Prisma ORM** y **MySQL**. Ofrece un sistema de autenticación seguro basado en **JSON Web Tokens (JWT)** con estrategia de _Short-lived Access Tokens_ y _Long-lived Refresh Tokens_, además de Control de Acceso Basado en Roles (**RBAC**).

---

## 🛠️ Tecnologías Utilizadas

- **Lenguaje:** TypeScript / Node.js
- **Framework Web:** Express.js
- **Base de Datos:** MySQL
- **ORM:** Prisma ORM
- **Seguridad & Autenticación:**
  - `bcryptjs` (Hashing de contraseñas con sal)
  - `jsonwebtoken` (Manejo de Access Tokens y Refresh Tokens)
- **Desarrollo:** `tsx` / `ts-node-dev`

---

## 🔑 Características Principales

- 📝 **Registro e Inicio de Sesión de Usuarios:** Encriptación de contraseñas de forma segura con `bcrypt`.
- 🔄 **Manejo de Refresh Tokens:** Rotación y almacenamiento persistente de tokens de renovación en base de datos.
- 🛡️ **Protección de Rutas (Middleware JWT):** Verificación de firma y tiempo de expiración para endpoints privados.
- 🎭 **Control de Acceso por Roles (RBAC):** Middleware para restringir rutas específicas según el rol asignado (`USER`, `ADMIN`).
- 🚪 **Cierre de Sesión Seguro (`/logout`):** Invalidación de tokens en la base de datos.
- 💥 **Manejo Centralizado de Errores:** Respuestas JSON unificadas y limpias para excepciones del servidor y errores del cliente.

---

## 🏗️ Arquitectura del Proyecto

```text
src/
├── config/         # Configuración de Prisma y clientes
├── controllers/    # Controladores de las rutas (Manejo de req/res)
├── middlewares/    # Middlewares de Autenticación, RBAC y Error Global
├── routes/         # Definición de endpoints de la API
├── services/       # Lógica de negocio e interacciones con la BD
├── utils/          # Utilidades (Clase CustomError, helpers JWT)
└── app.ts          # Configuración principal de Express
```
