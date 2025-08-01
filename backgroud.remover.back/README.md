# Background Remover API Proxy

Este proyecto implementa una función lambda serverless en Vercel que actúa como proxy para la API de remove.bg.

## Endpoint

`POST /api/remove-bg`

### Body JSON
```json
{
  "image_url": "https://example.com/imagen.jpg"
}
```

### Respuesta
Una imagen `image/png` sin fondo.

## Variables de entorno
- `REMOVE_BG_API_KEY`: Tu clave secreta de remove.bg

## Instalación y despliegue

1. Sube el proyecto a GitHub.
2. Conéctalo con Vercel.
3. Agrega la variable de entorno desde el dashboard.
