# ⚡ RESTless

> **Submission for the [Global Engineering Hackathon 2025](https://global-engineering-hackathon.devpost.com/) — Track: Web Applications / Developer Tools**

**RESTless** is a visual, full-stack API mocking platform built for frontend developers who are tired of waiting on the backend. Define realistic API endpoints in seconds, simulate real-world network chaos (latency, error rates, auth failures), and inspect every incoming request in real-time — all from a beautiful developer dashboard.

---

## 🚀 The Problem

Frontend developers are consistently blocked by the backend. APIs aren't ready, schema changes break things, and testing edge-cases (rate limits, 401s, slow networks) requires coordination across teams. Existing tools like Mockoon or Postman Mock Servers are desktop-only, hard to share, and produce only static JSON.

**RESTless solves this with a live, web-based mock server that anyone on your team can access via a URL.**

---

## ✨ Key Features

### 🗂️ Project-Based Organization

Organize your mocks into projects—e.g., `Checkout API`, `Auth Service`, `Product Catalog`. Each project gets a scoped base URL: `/mock/[projectId]/...`

### 🎯 Full Endpoint CRUD with Smart Constraints

- Create, edit, and delete mock endpoints with Method + Path routing
- Same path, different method = different response (e.g., `GET /users` vs `POST /users`)
- Atomic updates via PATCH API with Prisma ORM + PostgreSQL

### 🤖 AI-Powered Payload Generation (Gemini 2.5 Flash)

An embedded AI context window — powered by **Google Gemini 2.5 Flash** — lets you describe the API response you need in plain English:

> _"Give me 10 e-commerce products with title, price, imageUrl, category, and rating"_

Gemini instantly generates a realistic, production-quality JSON payload and populates the response body. Responses are **cached by the Next.js framework** (`unstable_cache`, 1-hour TTL) so repeated prompts are instant with zero API cost.

### 🎲 Dynamic Data via Faker.js Templates

Static JSON is boring. Use Faker.js template syntax in your response body for fresh, randomized data on every single request:

```json
{
  "id": "{{faker.string.uuid()}}",
  "user": "{{faker.person.fullName()}}",
  "email": "{{faker.internet.email()}}",
  "avatar": "{{faker.image.avatar()}}"
}
```

The mock engine intercepts and compiles templates server-side before returning the response.

### 🔒 Advanced Simulation Settings

Configure per-endpoint behaviors that mirror real production APIs:
| Setting | Behavior |
|---|---|
| **Latency (ms)** | Simulates slow networks — validates loading states |
| **Error Rate (%)** | Random 5xx errors — validates retry logic |
| **Require Auth** | Returns `401 Unauthorized` if `Authorization` header is missing or invalid |
| **CORS Control** | Toggle wildcard CORS headers on/off to test cross-origin handling |

### 🔬 Real-Time Request Inspector

Switch to the **Inspector** tab on any project to see a live feed of every request hitting your mock URLs — powered by **Server-Sent Events (SSE)**:

- Method + color-coded status badge
- Exact latency measurement
- Expand any request to inspect: **headers, query params, request body, response body**
- Pause / Resume the feed, or Clear all logs

### 🌐 Live Shareable Mock URLs

Every endpoint you create is immediately live at:

```
https://your-deployment.vercel.app/mock/[projectId]/[your/path]
```

Share this with teammates, your CI pipeline, or your Figma prototype.

---

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────┐
│         Next.js 16 App Router           │
│                                         │
│  /(dashboard)/layout.tsx  ← Sidebar     │
│  /projects/[projectId]    ← Dynamic     │
│  /mock/[projectId]/[...slug] ← Engine  │
│  /api/inspector/[projectId]  ← SSE     │
│  /api/ai-generate            ← Gemini  │
└──────────────┬──────────────────────────┘
               │
     ┌─────────▼──────────┐
     │  PostgreSQL + Prisma│  ← ORM, type-safe queries
     └─────────────────────┘
               │
     ┌─────────▼──────────┐
     │  In-Memory SSE Bus  │  ← inspector-bus.ts singleton
     └─────────────────────┘
               │
     ┌─────────▼──────────┐
     │  Google Gemini API  │  ← unstable_cache (1h TTL)
     └─────────────────────┘
```

### Stack

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)                |
| Language     | TypeScript                                        |
| Database     | PostgreSQL via Prisma ORM                         |
| UI           | Shadcn/UI + Tailwind CSS v4                       |
| AI           | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Dynamic Data | Faker.js                                          |
| Real-time    | Server-Sent Events (native `ReadableStream`)      |
| Deployment   | Vercel / Google Cloud Run                         |

---

## 🛠️ Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted — e.g., Supabase, Neon, Railway)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/apikey))

### 1. Clone & Install

```bash
git clone https://github.com/sanjaysah101/restless.git
cd restless
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/restless"

# Google Gemini AI (for payload generation)
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Push Database Schema

```bash
npx prisma db push
```

### 4. Start Dev Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) ✅

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── layout.tsx            # Persistent sidebar layout
│   │   ├── page.tsx              # Empty state (no project selected)
│   │   └── projects/
│   │       └── [projectId]/
│   │           └── page.tsx      # Dynamic project page (Endpoints + Inspector tabs)
│   ├── api/
│   │   ├── projects/             # GET/POST /api/projects
│   │   │   └── [id]/             # DELETE /api/projects/[id]
│   │   ├── endpoints/            # GET/POST /api/endpoints
│   │   │   └── [id]/             # PATCH/DELETE /api/endpoints/[id]
│   │   ├── inspector/
│   │   │   └── [projectId]/      # GET (SSE stream) /api/inspector/[projectId]
│   │   └── ai-generate/          # POST /api/ai-generate (Gemini + Next.js cache)
│   └── mock/
│       └── [projectId]/
│           └── [...slug]/        # The mock engine — handles all HTTP methods
│               └── route.ts
├── components/
│   ├── Sidebar.tsx               # Project navigator
│   ├── EndpointList.tsx          # Endpoint cards with copy/edit/delete
│   ├── EndpointForm.tsx          # Create/edit endpoint modal form
│   ├── RequestInspector.tsx      # SSE-powered real-time log viewer
│   └── AIGenerateModal.tsx       # AI context window with examples + chat
└── lib/
    ├── prisma.ts                 # Prisma client singleton
    └── inspector-bus.ts          # In-memory SSE pub/sub bus
```

---

## 🌊 How the Mock Engine Works

When a frontend app calls e.g. `GET /mock/abc123/api/users`:

1. **Route Match** — Finds the matching `Endpoint` record by `[projectId, method, path]`
2. **Auth Gate** — If `requireAuth=true`, validates the `Authorization` header
3. **CORS Headers** — Appends wildcard CORS headers if `enableCors=true`
4. **Latency Simulation** — `await sleep(latencyMs)`
5. **Error Simulation** — Random error with probability `errorRate`
6. **Faker Template Processing** — Interpolates `{{faker.*.*()}}` with real generated values
7. **Inspector Publish** — Publishes the full request log to the SSE bus (zero-latency)
8. **Response** — Returns the JSON (or text) response

---

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/api-mockflow)

Set these environment variables in your Vercel project:

- `DATABASE_URL` — your production PostgreSQL connection string
- `GEMINI_API_KEY` — your Google Gemini API key

After deploying, run migrations:

```bash
npx prisma db push
```

> **Note:** The SSE-based Request Inspector requires a platform that supports streaming responses. Vercel Fluid Compute and Google Cloud Run both work perfectly.

---

## 🗺️ Roadmap

- [ ] Team workspaces & shared projects
- [ ] Import from OpenAPI / Swagger spec
- [ ] Webhook simulation (outbound POST to your URL)
- [ ] Request history persistence (stored in DB, not just in-memory)
- [ ] GraphQL mock support
- [ ] SDK code snippets (auto-generated `fetch` / `axios` examples per endpoint)

---

## 🏆 Hackathon Notes

This project was built for the **[Global Engineering Hackathon 2025](https://global-engineering-hackathon.devpost.com/)** — Track: **Web Applications / Developer Tools**.

**Why this wins:**

- Solves a real, daily pain point for every frontend developer
- Demonstrates full-stack technical depth (SSE, AI caching, dynamic routing, Faker templating)
- Production-ready architecture deployable to Vercel or Cloud Run in minutes
- AI integration is core to the feature, not a gimmick — it genuinely saves 5–10 minutes per endpoint

---

## 📄 License

MIT — see [LICENSE](LICENSE).
