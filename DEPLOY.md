# Deployment

Frontend → **Vercel**. Backend (API + WebSocket + worker) → **Railway**.
MongoDB Atlas, Upstash Redis, Cloudinary and GROQ are already hosted — no change.

The backend can't run on Vercel: it needs always-on processes (Express, the
WebSocket server, and the BullMQ worker that drains the queue).

## 1. Backend on Railway

Create a project from this repo. Add **two services**, both with root directory `backend`:

| Service  | Start command            | Purpose                     |
| -------- | ------------------------ | --------------------------- |
| `web`    | `npm run start`          | REST API + WebSocket server |
| `worker` | `npm run start:worker`   | Generates papers from queue |

Install command for both: `npm ci`. No build step (runs via `tsx`).

Set these env vars on **both** services (see `backend/.env.example`):

- `NODE_ENV=production` ← required: makes the auth cookie `SameSite=None; Secure`
- `JWT_SECRET` ← a real random secret (`openssl rand -hex 32`)
- `CORS_ORIGIN` ← your Vercel URL (e.g. `https://vedaai.vercel.app`)
- `MONGO_URI`, `REDIS_URL`, `GROQ_API_KEY`, `GROQ_MODEL`, `GROQ_FALLBACK_MODEL`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

`PORT` is provided by Railway automatically. The WebSocket shares that port.

## 2. Frontend on Vercel

Import the repo, set **Root Directory = `frontend`**. Env vars (`frontend/.env.example`):

- `NEXT_PUBLIC_API_URL` ← the `web` service URL, e.g. `https://vedaai-api.up.railway.app`
- `NEXT_PUBLIC_WS_URL` ← same host with `wss://`, e.g. `wss://vedaai-api.up.railway.app`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

## 3. After first deploy

- Update backend `CORS_ORIGIN` to the final Vercel domain if it changed, then redeploy.
- Sign up → onboarding → create an assignment to confirm the worker + live progress work.
- If login doesn't persist: confirm `NODE_ENV=production` is set on the backend
  (cross-site cookies require `SameSite=None; Secure`).

Never commit real secrets — `.env` is gitignored; set values in the platform dashboards.
