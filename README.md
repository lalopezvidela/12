# Devcore Group AI Assistant

Asistente conversacional basado en React y Gemini API, diseñado para ayudar a los usuarios a interactuar con inteligencia artificial de manera sencilla.

## Requisitos

- Node.js (v18 o superior recomendado)
- npm

## Instalación

1. Clona el repositorio o descarga el código fuente.
2. Instala las dependencias:
   ```sh
   npm install
   ```

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto y agrega tu clave de API de Gemini:

```
GEMINI_API_KEY=tu_clave_de_api
```

## Uso

### Desarrollo

Inicia el servidor de desarrollo con:

```sh
npm run dev
```

Abre tu navegador en [http://localhost:5173](http://localhost:5173).

### Producción

Para construir la aplicación para producción:

```sh
npm run build
```

Para previsualizar la build:

```sh
npm run preview
```

## Estructura del Proyecto

- `src/` — Código fuente de la aplicación React.
- `package.json` — Dependencias y scripts del proyecto.
- `.env.local` — Variables de entorno (no subir a repositorios públicos).

## Dependencias principales

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [@google/genai](https://www.npmjs.com/package/@google/genai)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [remark-gfm](https://github.com/remarkjs/remark-gfm)

## Licencia

MIT

---

Desarrollado por DevCore Group.
