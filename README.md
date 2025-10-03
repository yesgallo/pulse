# 🩺 Pulse

> **Servicio ligero de monitoreo con registro de pings en Redis**  
> Ideal para pipelines de CI/CD, pruebas de integración y verificación de salud de sistemas.

`pulse` es un microservicio minimalista que expone endpoints para verificar la disponibilidad de un servicio y registrar metadata de requests en Redis. Todo funciona **localmente**, sin necesidad de despliegue en la nube.

---

## ✅ Funcionalidades

- **`GET /health`**: Verifica que el servicio está activo (sin dependencia de Redis).
- **`GET /ping`**: Registra metadata del request (IP, User-Agent, timestamp) en Redis y responde con `"pong"`.
- **`GET /responses`**: Devuelve todos los pings guardados en Redis (ordenados por fecha más reciente).

✅ **Características clave**:
- Respuestas en **menos de 100ms**
- Persistencia en **Redis con expiración automática (1 hora)**
- **100% local y reproducible**
- Incluye **pruebas automatizadas y pipeline de CI**

---

## 🚀 Ejecución Local

### Requisitos
- Node.js v18+
- Docker (para Redis)

### Pasos



1. **Instalar dependencias**

```bash
  npm install 
```

2. **Levantar Redis**

```bash
  npm run redis 
```

3. **Iniciar la app**

```bash
  npm run dev
```

4. **Probar los endpoints**

```bash
    # Verificar salud
curl http://localhost:3000/health

    # Hacer pings (se guardan en Redis)
curl http://localhost:3000/ping
curl http://localhost:3000/ping

    # Ver todos los registros
curl http://localhost:3000/responses
```

5. **✅ Ejemplo de respuesta en /responses:**

```bash
{
  "count": 2,
  "responses": [
    {
      "timestamp": "2025-10-03T15:30:00.000Z",
      "ip": "::1",
      "userAgent": "curl/8.4.0",
      "path": "/ping"
    },
    {
      "timestamp": "2025-10-03T15:29:00.000Z",
      "ip": "::1",
      "userAgent": "curl/8.4.0",
      "path": "/ping"
    }
  ]
}
```

6. **Pruebas**

Ejecuta las pruebas automatizadas (incluyen cobertura):

```bash
  npm test
```
✅ Verás:
Todos los tests pasan
Cobertura 100% en lógica crítica
Tiempos de respuesta < 100ms


## 🔄 Pipeline de CI/CD

Este proyecto incluye un workflow de GitHub Actions que:
Se ejecuta en cada push y pull_request a main
Ejecuta linting, tests (con Redis embebido) y build
Sube artifacts (reportes de cobertura, resultados de tests)
Protege la rama main: solo se puede mergear si el CI pasa
💡 El pipeline garantiza que todo el código cumple con estándares de calidad antes de integrarse. 

## 📁 Arquitectura

```bash
Cliente
   │
   ▼
Express (src/app.js)
   ├── /health → Respuesta inmediata
   ├── /ping → Guarda en Redis → Responde
   └── /responses → Lee de Redis → Responde
   │
   ▼
Redis (vía src/redis.js)
```

Patrón: Arquitectura en capas (presentación → lógica → datos)
Bajo acoplamiento: /health no depende de Redis
Extensible: Fácil de añadir métricas, autenticación, etc.

## 🛠️ Scripts Disponibles

**npm run dev** > Inicia la app en modo desarrollo

**npm run redis** > Levanta Redis con Docker

**npm run redis:down** > Detiene Redis

**npm test** > Ejecuta pruebas con cobertura

**npm run lint** > Valida estilo de código


## 📦 Dependencias

**Producción:** express, redis
**Desarrollo:** jest, supertest, eslint

## 📄 Licencia

MIT © [yesgallo]