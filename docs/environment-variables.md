# Variables de Entorno / Environment Variables

## Configuración / Configuration

El proyecto utiliza variables de entorno para configurar diferentes aspectos de la aplicación. Estas variables se definen en archivos `.env` y son accesibles a través de `import.meta.env.VARIABLE_NAME` en el código.

The project uses environment variables to configure different aspects of the application. These variables are defined in `.env` files and are accessible through `import.meta.env.VARIABLE_NAME` in the code.

## Variables disponibles / Available Variables

| Variable | Descripción / Description | Valor por defecto / Default Value |
|----------|---------------------------|----------------------------------|
| VITE_API_URL | URL base de la API del backend / Base URL for the backend API | http://localhost:5278 |

## Entornos / Environments

El proyecto soporta diferentes entornos a través de archivos `.env` específicos:

The project supports different environments through specific `.env` files:

- `.env`: Variables para entorno de desarrollo local / Variables for local development environment
- `.env.production`: Variables para entorno de producción / Variables for production environment

## Uso en desarrollo / Usage in development

1. Copia el archivo `.env.example` a `.env`
2. Modifica las variables según tu entorno local

1. Copy the `.env.example` file to `.env`
2. Modify the variables according to your local environment

## Acceso en el código / Access in code

```typescript
// Ejemplo de acceso a variable de entorno / Example of accessing environment variable
const apiUrl = import.meta.env.VITE_API_URL;
```

## Consideraciones de seguridad / Security considerations

Las variables de entorno en Vite que comienzan con `VITE_` están expuestas en el código del cliente. No almacenes información sensible en estas variables.

Environment variables in Vite that start with `VITE_` are exposed in the client-side code. Do not store sensitive information in these variables. 