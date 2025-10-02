# 🩺 Pulse

> **Lightweight health-check service for CI/CD pipelines, orchestration, and monitoring**

`pulse` is a minimal Express.js service that exposes a `/health` endpoint to verify that your application is running. It’s designed to be used in:

- Kubernetes liveness/readiness probes  
- GitHub Actions or any CI/CD pipeline  
- Infrastructure monitoring tools (Prometheus, Datadog, etc.)  
- Microservice architectures requiring a standard health check

Fast, dependency-free, and production-ready.

---

## ✅ Features

- **Lightweight**: No external dependencies beyond Express.
- **Fast**: Responds in < 10ms under normal conditions.
- **Standard**: Returns `200 OK` with JSON `{ "status": "ok", "timestamp": "..." }`.
- **CI/CD Ready**: Includes linting, unit tests, coverage, and build pipeline.
- **No DB, no auth**: Pure in-memory health check.

---

## 🚀 Quick Start

### Install

```bash
git clone https://github.com/yesgallo/pulse.git
cd pulse
npm install

### Run

```bash
npm start
# Servidor escuchando en http://localhost:3000

### Test Health Endpoint

```bash
curl http://localhost:3000/health

### Response:

```bash
{
  "status": "ok",
  "timestamp": "2025-09-17T15:00:00.000Z"
}

---

### 🧪 Testing
# Run linting and tests:

```bash
npm run lint
npm test

Coverage reports are generated in the coverage/ folder.

---

## 🔄 CI/CD
This project includes a GitHub Actions workflow (/.github/workflows/ci.yml) that:

Runs on every push and pull_request to main
Lints the code
Executes unit tests with coverage
Builds the dist/ folder
Uploads artifacts (coverage, dist)
(Optional) Sends coverage to Codecov
The main branch is protected: merges are only allowed if all CI checks pass.

---

## 📦 Build

npm run build

Outputs a dist/ folder ready for deployment.

---

## 📡 Endpoints

### `GET /health`
- Verifica que el servicio está activo.
- **Sin dependencia de Redis**.
- Ideal para liveness probes.

### `GET /ping`
- Verifica el servicio y **guarda metadata del request en Redis**.
- Incluye: IP, User-Agent, timestamp.
- Ideal para readiness probes o monitoreo avanzado.

---

## 📄 License
MIT © [yesgallo]// prueba de protección
