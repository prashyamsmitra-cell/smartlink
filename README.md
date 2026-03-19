# ⚡ SmartLink — Scalable URL Shortener with Analytics

A production-ready, full-stack URL shortener built as a professional portfolio project.  
Shorten URLs, track clicks, and view analytics — powered by Node.js, PostgreSQL, and Redis.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
│                  React + TypeScript + Tailwind               │
│                     (Deployed on Vercel)                     │
└─────────────────────┬───────────────────────────────────────┘
                      │  HTTPS
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND API                             │
│                  Node.js + Express                           │
│                  (Deployed on Railway)                       │
│                                                              │
│  POST /api/shorten ──► Validate ──► Generate Code ──► DB    │
│  GET  /:shortCode  ──► Redis? ──► Yes: Redirect             │
│                              └──► No:  DB ──► Cache ──► Redirect │
│  GET  /api/stats/:code ──────────────────────────► DB       │
│  GET  /api/health  ──────────────────────────────► DB ping  │
└──────┬──────────────────────────┬───────────────────────────┘
       │                          │
       ▼                          ▼
┌─────────────┐          ┌────────────────┐
│  PostgreSQL │          │     Redis       │
│  (Supabase) │          │   (Upstash)     │
│             │          │                │
│  urls table │          │  Cache layer   │
│  click data │          │  TTL: 1 hour   │
└─────────────┘          └────────────────┘
```

---

## 🛠️ Tech Stack

| Layer       | Technology              | Hosted On  |
|-------------|-------------------------|------------|
| Frontend    | React + TypeScript + Tailwind CSS | Vercel |
| Backend     | Node.js + Express       | Railway    |
| Database    | PostgreSQL              | Supabase   |
| Cache       | Redis                   | Upstash    |
| Container   | Docker + Docker Compose | Local dev  |

---

## 📁 Project Structure

```
smartlink/
├── backend/
│   ├── config/          # Centralised env config
│   ├── cache/           # Redis client with fallback
│   ├── controllers/     # Request/response handlers
│   ├── database/        # PostgreSQL pool + migrations
│   ├── middleware/      # Error handler
│   ├── models/          # DB query functions
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic layer
│   ├── tests/           # Jest test suites
│   ├── utils/           # Base62, logger, validator
│   ├── app.js           # Express app setup
│   ├── server.js        # Entry point
│   ├── Dockerfile
│   └── railway.toml
│
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── hooks/       # Custom React hooks
│       ├── pages/       # Route-level page components
│       ├── styles/      # Global CSS
│       └── utils/       # API client + helpers
│
├── docker-compose.yml   # Full local stack
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (Local with Docker)

**Prerequisites:** Docker Desktop installed.

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/smartlink.git
cd smartlink

# 2. Start everything with one command
docker-compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:5000
# API docs → http://localhost:5000/api/health
```

---

## 🔧 Local Setup (Without Docker)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your DATABASE_URL and REDIS_URL in .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

---

## ☁️ Deployment Guide (All Free Services)

### Step 1 — Set Up Supabase (PostgreSQL)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a name, password, and region (pick closest to you)
3. Once created: **Project Settings → Database → Connection string (URI)**
4. Copy the URI — it looks like:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```
5. Save this as `DATABASE_URL`

> The backend auto-creates the `urls` table on first boot via migrations — no manual SQL needed.

---

### Step 2 — Set Up Upstash (Redis)

1. Go to [upstash.com](https://upstash.com) → **Create Database**
2. Choose **Redis**, select a region, enable **TLS**
3. Once created: Go to **Details → Connect → Node.js → ioredis**
4. Copy the `rediss://` URL — save it as `REDIS_URL`

---

### Step 3 — Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
2. Select your repo → choose the `backend` folder as root directory
   - Railway detects the `Dockerfile` automatically
3. Go to **Variables** tab and add all these:

   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | your Supabase URI |
   | `REDIS_URL` | your Upstash URI |
   | `ALLOWED_ORIGINS` | `https://your-app.vercel.app` (fill after Step 4) |
   | `LOG_LEVEL` | `info` |

4. Railway auto-deploys. Copy your backend URL e.g. `https://smartlink-api.up.railway.app`
5. Add it as a variable: `BASE_URL` = `https://smartlink-api.up.railway.app`

---

### Step 4 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project → Import from GitHub**
2. Select your repo → set **Root Directory** to `frontend`
3. Vercel auto-detects Vite. Add this environment variable:

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | your Railway backend URL |

4. Click **Deploy**
5. Copy your Vercel URL (e.g. `https://smartlink.vercel.app`)
6. Go back to Railway → update `ALLOWED_ORIGINS` with your Vercel URL
7. Railway will auto-redeploy

---

### Step 5 — Verify Everything Works

```bash
# Health check
curl https://your-backend.up.railway.app/api/health

# Shorten a URL
curl -X POST https://your-backend.up.railway.app/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'

# Get stats
curl https://your-backend.up.railway.app/api/stats/abc1234
```

---

## 📡 API Reference

### `POST /api/shorten`
Shorten a long URL.

**Request body:**
```json
{ "url": "https://example.com/some/very/long/path" }
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "shortCode": "aB3xY9z",
    "shortUrl": "https://your-backend.up.railway.app/aB3xY9z",
    "longUrl": "https://example.com/some/very/long/path",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "clickCount": 0
  }
}
```

---

### `GET /:shortCode`
Redirects to the original URL. Increments click count.

**Response:** `301 Redirect`

---

### `GET /api/stats/:shortCode`
Returns analytics for a short link.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "shortCode": "aB3xY9z",
    "shortUrl": "https://...",
    "longUrl": "https://example.com/...",
    "clickCount": 42,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "lastAccessed": "2025-01-02T12:00:00.000Z"
  }
}
```

---

### `GET /api/recent`
Returns the 10 most recently created links.

---

### `GET /api/health`
Server health check.

**Response `200`:**
```json
{
  "status": "ok",
  "uptime": 3600,
  "services": { "database": "ok" }
}
```

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

Tests cover:
- All API endpoints (with mocked DB + Redis)
- Base62 encoding and collision detection
- URL validation and SSRF prevention

---

## 🔐 Security Features

- **Helmet** — sets secure HTTP response headers
- **CORS** — only allows configured origins
- **Rate limiting** — 200 req/15min global, 20 req/min for `/shorten`
- **SSRF protection** — blocks localhost and private IP ranges
- **Input validation** — URL length, protocol, and format checks
- **Non-root Docker** — container runs as unprivileged user

---

## 🗺️ Future Improvements

- [ ] User accounts and authentication (JWT)
- [ ] Custom short codes (vanity URLs)
- [ ] Link expiration / TTL
- [ ] Per-day click time-series data
- [ ] QR code generation
- [ ] Browser / country / referrer analytics
- [ ] API key management for programmatic access

---

## 📄 License

MIT — free to use for portfolio and learning purposes.
#   s m a r t l i n k  
 