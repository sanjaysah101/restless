# RESTless

> A visual API mocking platform for frontend developers.
> Built for the **[Global Engineering Hackathon 2025](https://global-engineering-hackathon.devpost.com/)** — Track: Web Applications / Developer Tools.

**GitHub:** [sanjaysah101/restless](https://github.com/sanjaysah101/restless)

---

## Overview

RESTless lets frontend developers define mock API endpoints, configure realistic network simulations, and share a live URL — without waiting on a backend. Every endpoint is immediately accessible at:

```
https://restless-five.vercel.app/mock/[projectId]/[path]
```

---

## Features

| Feature                   | Description                                                                   |
| ------------------------- | ----------------------------------------------------------------------------- |
| **Project Organization**  | Group endpoints into projects, each with a scoped base URL                    |
| **Full CRUD Endpoints**   | Create, edit, and delete endpoints by method + path                           |
| **AI Payload Generation** | Describe a response in plain English; Gemini 2.5 Flash generates it instantly |
| **Faker.js Templates**    | Use `{{faker.person.fullName()}}` syntax for fresh data on every request      |
| **Network Simulation**    | Per-endpoint latency (ms), error rate (%), auth enforcement, and CORS toggle  |
| **Real-Time Inspector**   | Live SSE feed of every incoming request with headers, params, and body        |

### Faker.js Template Example

```json
{
  "id": "{{faker.string.uuid()}}",
  "name": "{{faker.person.fullName()}}",
  "email": "{{faker.internet.email()}}",
  "avatar": "{{faker.image.avatar()}}"
}
```

---

## Tech Stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)           |
| Language     | TypeScript                                   |
| Database     | PostgreSQL + Prisma ORM                      |
| UI           | shadcn/ui + Tailwind CSS v4                  |
| AI           | Google Gemini 2.5 Flash                      |
| Dynamic Data | Faker.js                                     |
| Real-time    | Server-Sent Events (native `ReadableStream`) |
| Deployment   | Vercel / Google Cloud Run                    |

---

## How the Mock Engine Works

When a request hits `GET /mock/[projectId]/[path]`:

1. **Route Match** — Looks up the endpoint by `[projectId, method, path]`
2. **Auth Gate** — Returns `401` if auth is required and the header is missing/invalid
3. **CORS** — Appends wildcard CORS headers if enabled
4. **Latency** — Delays the response by the configured `latencyMs`
5. **Error Simulation** — Randomly returns a 5xx error at the configured rate
6. **Faker Processing** — Interpolates any `{{faker.*}}` template tokens
7. **Inspector Publish** — Emits the request log to the SSE bus
8. **Response** — Returns the JSON payload

---

## Local Setup

**Prerequisites:** Node.js 18+, PostgreSQL, [Gemini API key](https://aistudio.google.com/apikey)

```bash
# 1. Clone and install
git clone https://github.com/sanjaysah101/restless.git
cd restless
npm install

# 2. Configure environment
cp .env.example .env
# Set DATABASE_URL and GEMINI_API_KEY in .env

# 3. Push database schema
npx prisma db push

# 4. (Optional) Seed with demo data
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sanjaysah101/restless)

Set `DATABASE_URL` and `GEMINI_API_KEY` in your Vercel project settings, then run:

```bash
npx prisma db push
```

> **Note:** The SSE-based Inspector requires a platform that supports streaming responses. Vercel Fluid Compute and Google Cloud Run both support this.

---

## Roadmap

- [ ] Import from OpenAPI / Swagger spec
- [ ] Webhook simulation (outbound POST to a user-defined URL)
- [ ] Persistent request history (stored in DB)
- [ ] GraphQL mock support
- [ ] Team workspaces & shared projects

---

## License

MIT — see [LICENSE](LICENSE).
