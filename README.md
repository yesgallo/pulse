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


