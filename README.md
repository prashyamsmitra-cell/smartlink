<div align="center">

<img src="https://img.shields.io/badge/SmartLink-URL%20Shortener-b4ff4e?style=for-the-badge&logoColor=black" alt="SmartLink" />

# ⚡ SmartLink

### A production-ready, full-stack URL shortener with real-time analytics

*Shorten. Share. Track. — Built from scratch as a professional engineering portfolio project.*

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)

<br/>

[![Deploy Frontend](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Deploy Backend](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.app)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Cache](https://img.shields.io/badge/Cache-Upstash-00E9A3?style=flat-square&logo=upstash&logoColor=white)](https://upstash.com)

<br/>

[**Live Demo**](https://smartlink.vercel.app) · [**API Docs**](#-api-reference) · [**Quick Start**](#-quick-start) · [**Deploy Guide**](#️-deployment-guide)

<br/>

---

</div>

## 👋 What is SmartLink?

SmartLink is a **full-stack URL shortener** inspired by Bitly — built to demonstrate real-world software engineering skills. It takes any long URL and converts it into a short, shareable link, while tracking every click with analytics.

> This project is intentionally built with **production-grade patterns** — caching, error handling, retry logic, security headers, rate limiting, structured logging, automated tests, and Docker support — to reflect how real systems are engineered.

<br/>

## ✨ Features

| Feature | Description |
|---|---|
| 🔗 **URL Shortening** | Converts long URLs into 7-character Base62 short codes |
| 📊 **Click Analytics** | Tracks total clicks, creation date, and last accessed time |
| ⚡ **Redis Caching** | Sub-millisecond redirects via Upstash Redis with 1hr TTL |
| 🛡️ **Security** | Helmet headers, CORS, rate limiting, SSRF prevention |
| 🔁 **Auto Migrations** | Database table auto-created on first boot — no manual SQL |
| 🐳 **Docker Ready** | Full local stack with one `docker-compose up` command |
| 🧪 **Tested** | Jest test suite covering all endpoints, Base62, and validation |
| 📱 **Responsive UI** | Modern dark-themed React frontend with smooth animations |

<br/>

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                           │
│              React + TypeScript + Tailwind CSS                   │
│                          [ Vercel ]                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND API                               │
│                    Node.js + Express                             │
│                       [ Railway ]                                │
│                                                                  │
│  POST /api/shorten  →  Validate  →  Generate Code  →  DB save   │
│  GET  /:shortCode   →  Redis hit?  →  ✅ Redirect immediately   │
│                              ↓ miss                              │
│                          DB lookup  →  Cache it  →  Redirect    │
│  GET  /api/stats/:code  ─────────────────────────────→  DB      │
│  GET  /api/health   ─────────────────────────────────→  ping    │
└───────────┬──────────────────────────┬──────────────────────────┘
            │                          │
            ▼                          ▼
  ┌─────────────────┐        ┌──────────────────┐
  │   PostgreSQL    │        │      Redis        │
  │  [ Supabase ]   │        │   [ Upstash ]     │
  │                 │        │                  │
  │  urls           │        │  url:{code}      │
  │  ├ id (UUID)    │        │  TTL: 1 hour     │
  │  ├ long_url     │        │  Graceful        │
  │  ├ short_code   │        │  fallback if     │
  │  ├ click_count  │        │  unavailable     │
  │  └ created_at   │        └──────────────────┘
  └─────────────────┘
```

<br/>

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Tailwind CSS | Type-safe, fast, modern UI |
| **Backend** | Node.js 20 + Express | Lightweight, non-blocking API |
| **Database** | PostgreSQL 16 | Reliable relational storage |
| **Cache** | Redis 7 | In-memory speed for redirects |
| **Hosting — Frontend** | Vercel | Free, zero-config Vite deployment |
| **Hosting — Backend** | Railway | Free tier with Dockerfile support |
| **DB Hosting** | Supabase | Free managed PostgreSQL |
| **Cache Hosting** | Upstash | Free serverless Redis |
| **Containers** | Docker + Docker Compose | Reproducible local dev environment |
| **Testing** | Jest + Supertest | API + unit test coverage |
| **Logging** | Winston | Structured JSON logs |

<br/>

## 📁 Project Structure

```
smartlink/
│
├── 📂 backend/
│   ├── config/           ← Centralised environment config
│   ├── cache/            ← Redis client with graceful fallback
│   ├── controllers/      ← HTTP request & response handlers
│   ├── database/         ← PostgreSQL pool + auto-migrations
│   ├── middleware/        ← Error handler middleware
│   ├── models/           ← Database query functions
│   ├── routes/           ← Express route definitions
│   ├── services/         ← Business logic layer
│   ├── tests/            ← Jest test suites (3 files, 30 tests)
│   ├── utils/            ← Base62 encoder, logger, URL validator
│   ├── app.js            ← Express app + middleware setup
│   ├── server.js         ← Entry point, DB connect, migrations
│   ├── Dockerfile        ← Multi-stage production image
│   └── railway.toml      ← Railway deployment config
│
├── 📂 frontend/
│   ├── public/           ← favicon.svg
│   └── src/
│       ├── components/   ← 7 reusable UI components
│       ├── hooks/        ← useShorten, useRecentUrls
│       ├── pages/        ← HomePage, AnalyticsPage, NotFoundPage
│       ├── styles/       ← Global CSS + Tailwind directives
│       └── utils/        ← Axios API client + helper functions
│
├── docker-compose.yml    ← Runs full stack locally
├── .gitignore
└── README.md
```

<br/>

## 🚀 Quick Start

### Option A — Docker (Recommended)

> **Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

```bash
# 1. Clone the repo
git clone https://github.com/prashyamsmitra-cell/smartlink.git
cd smartlink

# 2. Start everything — PostgreSQL + Redis + Backend + Frontend
docker-compose up --build
```

| Service | URL |
|---|---|
| 🖥️ Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:5000 |
| ❤️ Health Check | http://localhost:5000/api/health |

---

### Option B — Manual Setup

**Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your DATABASE_URL and REDIS_URL
npm run dev
```

**Frontend** *(open a new terminal)*
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:5000
npm run dev
```

<br/>

## ☁️ Deployment Guide

> All services have a **free tier** — no credit card required.

### 1️⃣ Supabase — PostgreSQL Database

1. Sign up at [supabase.com](https://supabase.com)
2. **New Project** → name it, set a password, pick nearest region
3. Go to **Project Settings → Database → Connection string → URI**
4. Copy — looks like:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```
5. Save as `DATABASE_URL` ✅

> 💡 No manual table setup needed — migrations run automatically on first boot.

---

### 2️⃣ Upstash — Redis Cache

1. Sign up at [upstash.com](https://upstash.com)
2. **Create Database** → Redis → nearest region → enable **TLS**
3. Go to **Details → Connect → Node.js → ioredis**
4. Copy the `rediss://` URL
5. Save as `REDIS_URL` ✅

> 💡 Redis is optional — the app works without it, just without caching.

---

### 3️⃣ Railway — Backend

1. Sign up at [railway.app](https://railway.app) with GitHub
2. **New Project → Deploy from GitHub repo** → select `smartlink`
3. Set root directory to `backend` — Railway finds the `Dockerfile` automatically
4. Go to **Variables** and add:

   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | your Supabase URI |
   | `REDIS_URL` | your Upstash URI |
   | `ALLOWED_ORIGINS` | `https://your-app.vercel.app` ← update after next step |
   | `BASE_URL` | `https://your-app.up.railway.app` ← your Railway domain |
   | `LOG_LEVEL` | `info` |

5. Go to **Settings → Networking → Generate Domain** → copy URL ✅

---

### 4️⃣ Vercel — Frontend

1. Sign up at [vercel.com](https://vercel.com) with GitHub
2. **New Project → Import** → select `smartlink`
3. Set **Root Directory** to `frontend`
4. Add environment variable:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | your Railway backend URL |

5. Click **Deploy** → copy your Vercel URL ✅
6. Back in Railway → update `ALLOWED_ORIGINS` to your Vercel URL → auto-redeploys 🎉

---

### 5️⃣ Verify Everything Works

```bash
# Health check
curl https://YOUR-RAILWAY-URL/api/health

# Shorten a URL
curl -X POST https://YOUR-RAILWAY-URL/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'

# View stats
curl https://YOUR-RAILWAY-URL/api/stats/abc1234
```

<br/>

## 📡 API Reference

### `POST /api/shorten`
Shorten a long URL into a 7-character smart link.

**Request**
```json
{ "url": "https://example.com/very/long/path" }
```

**Response `201`**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "shortCode": "aB3xY9z",
    "shortUrl": "https://your-domain.com/aB3xY9z",
    "longUrl": "https://example.com/very/long/path",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "clickCount": 0
  }
}
```

---

### `GET /:shortCode`
Redirect to the original URL. Increments click counter.
```
301 Redirect → https://original-url.com
```

---

### `GET /api/stats/:shortCode`
Fetch analytics for a short link.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "shortCode": "aB3xY9z",
    "clickCount": 42,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "lastAccessed": "2025-01-15T09:30:00.000Z"
  }
}
```

---

### `GET /api/recent`
Returns the 10 most recently created links.

---

### `GET /api/health`
Server and database health check.

**Response `200`**
```json
{ "status": "ok", "uptime": 3600, "services": { "database": "ok" } }
```

<br/>

## 🧪 Running Tests

```bash
cd backend
npm test
```

```
PASS  tests/urlValidator.test.js  (12 tests)
PASS  tests/base62.test.js        (8 tests)
PASS  tests/api.test.js           (10 tests)

Test Suites: 3 passed, 3 total
Tests:       30 passed, 30 total
```

<br/>

## 🔐 Security

| Feature | Implementation |
|---|---|
| **Security Headers** | Helmet.js on all responses |
| **CORS** | Allowlist-only origin policy |
| **Rate Limiting** | 200 req/15min global · 20 req/min on `/shorten` |
| **SSRF Protection** | Blocks localhost, 127.x, 10.x, 192.168.x, 172.16–31.x |
| **Input Validation** | URL format, protocol, max length (2048 chars) |
| **Non-root Container** | Docker runs as unprivileged `appuser` |
| **Error Sanitisation** | Stack traces never exposed in production |

<br/>

## 🗺️ Roadmap

- [ ] 👤 User accounts with JWT authentication
- [ ] 🎨 Custom vanity short codes
- [ ] ⏳ Link expiration / TTL support
- [ ] 📈 Per-day click time-series chart
- [ ] 📱 QR code generation per link
- [ ] 🌍 Geolocation analytics (country / city)
- [ ] 🔑 API key management for developers
- [ ] 📧 Weekly email reports for link owners

<br/>

## 👨‍💻 Author

**Prashyam Smitra**

[![GitHub](https://img.shields.io/badge/GitHub-prashyamsmitra--cell-181717?style=flat-square&logo=github)](https://github.com/prashyamsmitra-cell)

<br/>

## 📄 License

```
MIT License — free to use, modify, and distribute.
Built for learning and portfolio purposes.
```

---

<div align="center">

*If you found this project useful, consider giving it a ⭐ on GitHub!*

**[⬆ Back to top](#-smartlink)**

</div>
