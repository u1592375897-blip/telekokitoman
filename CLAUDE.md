# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**telekoquitoman.pro** — Personal brand website with YouTube channel promotion, deployed on dondominio shared hosting (FTP) with a Cloudflare Workers backend and an AI chatbot powered by the Anthropic Claude API.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Frontend (Vite + React + TypeScript + Tailwind)    │
│  Deployed via FTP → telekoquitoman.pro (dondominio) │
└──────────────────────┬──────────────────────────────┘
                       │ fetch()
┌──────────────────────▼──────────────────────────────┐
│  Backend (Cloudflare Worker — TypeScript)           │
│  Routes: /api/chat  /api/contact  /api/youtube      │
│  Cloudflare Pages / Workers — free tier             │
└──────────────────────┬──────────────────────────────┘
                       │ Anthropic SDK
┌──────────────────────▼──────────────────────────────┐
│  Claude API (claude-haiku-4-5) — chatbot            │
│  System prompt: only answers about owner profile    │
└─────────────────────────────────────────────────────┘
```

### Monorepo structure

```
telekokitoman/
├── frontend/          # Vite + React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   ├── YouTubeSection.tsx
│   │   │   ├── Chatbot.tsx
│   │   │   ├── About.tsx
│   │   │   └── Contact.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── worker/            # Cloudflare Worker
│   ├── src/
│   │   └── index.ts   # Main worker entry point
│   ├── wrangler.toml
│   └── package.json
├── scripts/
│   └── deploy.ps1     # PowerShell: build + FTP deploy + test
├── .env.local         # Local env vars (never commit)
├── .env.production    # Production env template (no secrets)
└── CLAUDE.md
```

## Environments

| | Local | Production |
|---|---|---|
| Frontend URL | `http://localhost:5173` | `https://telekoquitoman.pro` |
| Worker URL | `http://localhost:8787` | `https://api.telekoquitoman.pro` (or workers.dev subdomain) |
| API key source | `.env.local` | Cloudflare Worker secret |

### Environment variables

**Frontend** (`.env.local` / `.env.production`):
```
VITE_WORKER_URL=http://localhost:8787   # local
VITE_WORKER_URL=https://<worker>.workers.dev  # production
VITE_YOUTUBE_CHANNEL_ID=<channel_id>
```

**Worker** (Cloudflare secrets — never in files):
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Commands

### Frontend
```bash
cd frontend
npm install          # install deps
npm run dev          # dev server on :5173
npm run build        # build to dist/
npm run preview      # preview production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
```

### Worker
```bash
cd worker
npm install
npm run dev          # wrangler dev — local worker on :8787
npm run deploy       # wrangler deploy (production)
npm run typecheck    # tsc --noEmit
```

### Full deploy (PowerShell)
```powershell
# From repo root:
.\scripts\deploy.ps1 -env production   # build + FTP upload + smoke test
.\scripts\deploy.ps1 -env local        # build only, serve locally
```

## Design system

- **Style**: Futuristic / cyberpunk — dark backgrounds (#0a0a0f), neon accents (cyan #00f5ff, purple #bf00ff)
- **Framework**: Tailwind CSS v3 with custom theme extensions
- **Fonts**: Space Grotesk (headings) + Inter (body) from Google Fonts
- **Animations**: Framer Motion for entrance animations and transitions
- **Responsive**: Mobile-first, breakpoints: sm(640) md(768) lg(1024) xl(1280)

## Chatbot constraints

The chatbot worker uses a strict system prompt. It must **only** answer questions about the owner's profile, professional background, and content. It must refuse off-topic questions gracefully.

System prompt is defined in `worker/src/profile.ts` and injected into every Anthropic API call as the `system` parameter.

Model: `claude-haiku-4-5-20251001` (fast, cheap — ideal for chat widget).

## YouTube promotion strategy (free)

- YouTube API v3 (free quota) to fetch latest videos and display them
- SEO metadata (OpenGraph, Twitter Cards) on every page
- Structured data (JSON-LD) for Person and VideoObject schema
- Auto-generated sitemap.xml at build time

## Key conventions

- All API calls from frontend go through the Cloudflare Worker (never expose API keys client-side)
- Worker validates request origin via `ALLOWED_ORIGIN` env var
- FTP deployment uploads only the `frontend/dist/` directory
- No SSR — the frontend is a fully static SPA built with Vite
