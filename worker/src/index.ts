import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './profile'

interface Env {
  ANTHROPIC_API_KEY: string
  YOUTUBE_API_KEY: string
  YOUTUBE_CHANNEL_ID: string
  ALLOWED_ORIGIN: string
}

function cors(request: Request, env: Env): HeadersInit {
  const origin = request.headers.get('Origin') || ''
  const allowed = env.ALLOWED_ORIGIN || 'http://localhost:5173'
  const localOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']
  const prodOrigins = ['https://telekoquitoman.pro', 'http://telekoquitoman.pro', 'https://www.telekoquitoman.pro']
  const isAllowed = origin === allowed || localOrigins.includes(origin) || prodOrigins.includes(origin)
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = cors(request, env)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    const url = new URL(request.url)

    // ─── /api/youtube ───────────────────────────────────────────────
    if (url.pathname === '/api/youtube' && request.method === 'GET') {
      try {
        const channelId = env.YOUTUBE_CHANNEL_ID
        const apiKey = env.YOUTUBE_API_KEY
        const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=6&order=viewCount&type=video&key=${apiKey}`
        const res = await fetch(ytUrl)
        const data = await res.json() as { items?: { id: { videoId: string }; snippet: { title: string; thumbnails: { high: { url: string } }; publishedAt: string } }[] }
        const videos = (data.items || []).map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          publishedAt: item.snippet.publishedAt,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }))
        return json(videos, 200, corsHeaders)
      } catch (e) {
        return json({ error: 'YouTube API error' }, 500, corsHeaders)
      }
    }

    // ─── /api/chat ───────────────────────────────────────────────────
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
        const body = await request.json() as { message?: string }
        const message = body.message?.trim()
        if (!message) return json({ error: 'No message' }, 400, corsHeaders)

        const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
        const response = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: message }],
        })
        const reply = response.content[0].type === 'text' ? response.content[0].text : ''
        return json({ reply }, 200, corsHeaders)
      } catch (e) {
        return json({ error: 'Chat error' }, 500, corsHeaders)
      }
    }

    // ─── /api/contact ────────────────────────────────────────────────
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      try {
        const body = await request.json() as { name?: string; email?: string; message?: string }
        if (!body.name || !body.email || !body.message) {
          return json({ error: 'Missing fields' }, 400, corsHeaders)
        }
        // Log to console (visible in wrangler logs)
        console.log(`[contact] ${body.name} <${body.email}>: ${body.message}`)
        return json({ ok: true }, 200, corsHeaders)
      } catch {
        return json({ error: 'Contact error' }, 500, corsHeaders)
      }
    }

    return json({ error: 'Not found' }, 404, corsHeaders)
  },
}
