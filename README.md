# Plataforma Marvel — Superhéroes y Misiones

Solución full stack para la gestión de superhéroes y misiones del universo Marvel, compuesta por:

| Parte | Tecnología | Puerto |
|---|---|---|
| **Backend** — API REST con JWT | Node + Express + TypeScript, Prisma y SQLite | `4000` |
| **Web** — aplicación React | Vite + React + React Router + Axios | `5173` |
| **Móvil** — aplicación React Native | Expo (se ejecuta en **Expo Go**) + React Navigation + AsyncStorage | Metro `8081` |

Las tres partes funcionan como una sola solución: la web y la app móvil consumen **la misma API REST**. No existen datos estáticos en las interfaces.

---

## 1. Requisitos previos

- **Node.js 18 o superior** (probado con Node 22).
- La app **Expo Go** instalada en el celular (Android o iOS).
- El computador y el celular **conectados a la misma red WiFi**.

No se necesita instalar ningún motor de base de datos: SQLite es un archivo local que Prisma crea automáticamente.

---

## 2. Backend (arrancar primero)

```bash
cd backend
npm install
npx prisma migrate dev      # crea la base de datos y las tablas
npm run seed                # carga 2 usuarios, 8 superhéroes y 6 misiones
npm run dev                 # levanta la API en el puerto 4000
```

Al iniciar, la consola imprime las direcciones disponibles:

```
Marvel API escuchando en el puerto 4000
  Local:  http://localhost:4000/api
  Red:    http://192.168.18.13:4000/api   <- usar esta en la app móvil
```

Anote la dirección de **Red**: la app móvil la necesita.

### Usuarios de prueba

| Rol | Email | Password | Permisos |
|---|---|---|---|
| **ADMIN** | `admin@marvel.com` | `Admin1234` | Acceso completo (GET, POST, PUT, DELETE) |
| **CONSULTA** | `consulta@marvel.com` | `Consulta1234` | Solo lectura (GET). Escritura responde **403** |

### Otros comandos

| Comando | Qué hace |
|---|---|
| `npm run seed` | Reinicia los datos de prueba (borra y vuelve a cargar) |
| `npm run sql` | Genera `sql/marvel.sql` con la estructura y los datos iniciales |
| `npm run studio` | Abre Prisma Studio para ver la base de datos en el navegador |
| `npm run build` / `npm start` | Compila y ejecuta la versión de producción |

---

## 3. Aplicación web (React)

Con el backend encendido, en otra terminal:

```bash
cd web
npm install
npm run dev
```

Abrir **http://localhost:5173** e iniciar sesión con cualquiera de los usuarios de prueba.

Si la API no está en `localhost:4000`, cambie `VITE_API_URL` en `web/.env`.

### Pantallas

- **Login** con manejo de errores y cierre de sesión.
- **Listado de superhéroes**: imagen, nombre, nombre real, poder, nivel (barra) y estado.
- **Búsqueda por nombre** (se consulta a la API, no se filtra en memoria).
- **Detalle** del superhéroe con sus misiones asignadas.
- **Formulario** para registrar y editar superhéroes, con vista previa de la imagen.
- **Eliminar** superhéroe con ventana de confirmación.
- **Listado de misiones** y formulario para registrarlas o editarlas.

Con el usuario **CONSULTA** los botones de crear, editar y eliminar no se muestran, y las rutas de escritura quedan bloqueadas.

---

## 4. Aplicación móvil (React Native con Expo Go)

**Paso 1.** Indicar la IP del computador en `mobile/.env` (la que imprimió el backend):

```
EXPO_PUBLIC_API_URL=http://192.168.18.13:4000/api
```

> ⚠️ No usar `localhost` aquí: dentro del celular, `localhost` es el propio celular.

**Paso 2.** Levantar la app:

```bash
cd mobile
npm install
npx expo start
```

**Paso 3.** Escanear el código QR con la app **Expo Go** (Android) o con la cámara (iOS).

### Pantallas

- **Login**: autentica contra la API y guarda el JWT con **AsyncStorage** (la sesión se mantiene al cerrar la app).
- **Inicio**: nombre del usuario, su rol y accesos a Héroes, Misiones y Favoritos con totales reales.
- **Superhéroes**: listado con **FlatList**, buscador y opción de deslizar para recargar.
- **Detalle**: imagen, nombre, nombre real, poder principal, nivel de poder, estado y misiones asignadas.
- **Favoritos**: se marcan con la estrella ⭐ y se conservan en **AsyncStorage**; los datos siempre se releen de la API.
- **Misiones**: listado con **FlatList**, mostrando héroe, ubicación, fecha, peligro y estado.

### Alternativa sin celular

También está habilitada la salida web de Expo, útil si falla el teléfono durante la demostración:

```bash
cd mobile
npx expo start --web
```

---

## 5. Colección de Postman

Importar `postman/Marvel_API.postman_collection.json`. Contiene 28 peticiones organizadas en cinco carpetas:

1. **Autenticación** — register, login (ADMIN y CONSULTA), me, credenciales incorrectas.
2. **Superhéroes** — listar, buscar, detalle, crear, editar, eliminar.
3. **Misiones** — listar, detalle, crear, editar, eliminar.
4. **Seguridad y validaciones** — 401 sin token, 403 con rol CONSULTA, 404, 409 y 422.
5. **Cierre de sesión** — logout y comprobación de que el token queda invalidado.

El **login guarda el token automáticamente** en las variables de la colección, así que el resto de peticiones ya viajan autenticadas. Se puede ejecutar toda la colección de corrido con el *Collection Runner*.

---

## 6. Endpoints de la API

Base: `http://localhost:4000/api`

### Autenticación

| Método | Ruta | Token | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registra un usuario (rol `CONSULTA` por defecto) |
| POST | `/auth/login` | No | Devuelve el usuario y el JWT |
| GET | `/auth/me` | Sí | Datos del usuario autenticado |
| POST | `/auth/logout` | Sí | Invalida el token actual |

### Superhéroes

| Método | Ruta | Rol requerido |
|---|---|---|
| GET | `/heroes` (acepta `?nombre=` y `?estado=`) | ADMIN o CONSULTA |
| GET | `/heroes/{id}` | ADMIN o CONSULTA |
| POST | `/heroes` | ADMIN |
| PUT | `/heroes/{id}` | ADMIN |
| DELETE | `/heroes/{id}` | ADMIN |

### Misiones

| Método | Ruta | Rol requerido |
|---|---|---|
| GET | `/misiones` (acepta `?estado=`, `?nivel_peligro=`, `?superheroe_id=`) | ADMIN o CONSULTA |
| GET | `/misiones/{id}` | ADMIN o CONSULTA |
| POST | `/misiones` | ADMIN |
| PUT | `/misiones/{id}` | ADMIN |
| DELETE | `/misiones/{id}` | ADMIN |

### Códigos de respuesta

| Código | Cuándo se devuelve |
|---|---|
| `200` / `201` | Operación correcta / recurso creado |
| `401` | Sin token, token inválido, expirado o cerrado por logout |
| `403` | Un usuario **CONSULTA** intenta crear, editar o eliminar |
| `404` | El identificador no existe |
| `409` | Email o nombre de héroe repetido; héroe con misiones asociadas |
| `422` | Error de validación (devuelve el detalle campo por campo) |

Ejemplo de error de validación:

```json
{
  "error": "Error de validacion en los datos enviados",
  "detalles": [
    { "campo": "nivel_poder", "mensaje": "El nivel de poder debe estar entre 1 y 100" }
  ]
}
```

---

## 7. Reglas de negocio implementadas

- No se permiten dos usuarios con el mismo email.
- No se permiten dos superhéroes con el mismo nombre.
- El nivel de poder debe ser un entero entre 1 y 100.
- Toda misión debe estar asociada a un superhéroe **existente**; por eso no se puede eliminar un héroe que aún tiene misiones (responde `409` explicando el motivo).
- La fecha de la misión es obligatoria.
- Solo se aceptan los estados y niveles de peligro definidos: `ACTIVO/INACTIVO`, `BAJO/MEDIO/ALTO`, `PENDIENTE/EN_PROGRESO/COMPLETADA`.
- Las passwords se guardan con hash **bcrypt** y nunca se devuelven en las respuestas.
- El `logout` invalida el token realmente: se guarda su identificador en una lista de tokens revocados.

---

## 8. Estructura del proyecto

```
exam_2_parcial/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        modelos Usuario, Superheroe, Mision
│   │   ├── migrations/          migraciones SQL generadas
│   │   └── seed.ts              datos iniciales
│   ├── sql/marvel.sql           script SQL (estructura + datos)
│   ├── scripts/exportar-sql.ts  generador del script SQL
│   └── src/
│       ├── controllers/         lógica de cada endpoint
│       ├── routes/              definición de rutas y permisos
│       ├── middlewares/         autenticación, roles, validación, errores
│       ├── schemas/             validaciones con Zod
│       ├── lib/                 Prisma, JWT y errores
│       └── app.ts / index.ts
│
├── web/
│   └── src/
│       ├── api/                 cliente Axios y servicios
│       ├── componentes/         Navbar, TarjetaHeroe, Estados, Diálogo
│       ├── contexto/            AuthContext (sesión)
│       ├── paginas/             Login, Heroes, Detalle, Formularios, Misiones
│       └── App.tsx              rutas de React Router
│
├── mobile/
│   └── src/
│       ├── api/                 cliente Axios y servicios
│       ├── componentes/         TarjetaHeroe y estados de carga/error
│       ├── contexto/            AuthContext y FavoritosContext (AsyncStorage)
│       ├── navegacion/          React Navigation (stack + tabs)
│       └── pantallas/           Login, Inicio, Heroes, Detalle, Favoritos, Misiones
│
├── postman/Marvel_API.postman_collection.json
└── README.md
```

---

## 9. Solución de problemas

| Problema | Solución |
|---|---|
| La web muestra *"No se pudo conectar con la API"* | Verifique que el backend esté corriendo (`cd backend && npm run dev`) |
| La app móvil no carga datos | Revise que `mobile/.env` tenga la IP de red del computador (no `localhost`) y que ambos estén en la misma WiFi |
| El firewall de Windows bloquea la conexión | Permita Node.js en redes privadas la primera vez que Windows lo pregunte |
| Quiere volver a los datos originales | `cd backend && npm run seed` |
| El token dejó de funcionar | Los tokens duran 8 horas; vuelva a iniciar sesión |
