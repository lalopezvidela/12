# DevCore AI Assistant Backend

Backend desarrollado con FastAPI para el asistente de IA de DevCore.

## Instalación

1. Crear entorno virtual:
   ```bash
   python -m venv venv
   ```

2. Activar entorno virtual:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

5. Ejecutar servidor:
   ```bash
   python run.py
   ```

## Configuración de Base de Datos

Por defecto, el backend está configurado para PostgreSQL. Para configurar:

1. Instala PostgreSQL
2. Crea una base de datos:
   ```sql
   CREATE DATABASE devcore_ai;
   ```
3. Actualiza la `DATABASE_URL` en el archivo `.env`

## Variables de Entorno Requeridas

- `DATABASE_URL`: URL de conexión a PostgreSQL
- `GEMINI_API_KEY`: API key de Google Gemini
- `SECRET_KEY`: Clave secreta para JWT (cambiar en producción)
- `FRONTEND_URL`: URL del frontend para CORS

## API Endpoints

### Users
- `POST /api/v1/users/` - Crear usuario
- `GET /api/v1/users/` - Listar usuarios
- `GET /api/v1/users/{user_id}` - Obtener usuario
- `PUT /api/v1/users/{user_id}` - Actualizar usuario
- `DELETE /api/v1/users/{user_id}` - Eliminar usuario

### Conversations
- `POST /api/v1/conversations/` - Crear conversación
- `GET /api/v1/conversations/` - Listar conversaciones
- `GET /api/v1/conversations/{conversation_id}` - Obtener conversación
- `GET /api/v1/conversations/user/{user_id}` - Conversaciones de usuario
- `PUT /api/v1/conversations/{conversation_id}` - Actualizar conversación
- `DELETE /api/v1/conversations/{conversation_id}` - Eliminar conversación

### Chat
- `POST /api/v1/chat/send-message` - Enviar mensaje y obtener respuesta de IA

## Estructura de Base de Datos

### Tabla Users
- `id` (PRIMARY KEY)
- `name` 
- `contact_method` (ENUM)
- `contact_info`
- `created_at`
- `updated_at`

### Tabla Conversations
- `id` (PRIMARY KEY)
- `user_id` (FOREIGN KEY)
- `language` (ENUM)
- `started_at`
- `ended_at`

### Tabla Messages
- `id` (PRIMARY KEY)
- `conversation_id` (FOREIGN KEY)
- `text`
- `sender` (ENUM: user/bot)
- `timestamp`
