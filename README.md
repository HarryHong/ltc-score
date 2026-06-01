# LTC Hand Calculator

A mahjong hand scoring page for [Lucky Tile Club](https://luckytile.club/) — upload a photo or enter tiles manually, pick your local rules, and get an AI-powered score breakdown.

## Features

- **LTC-branded UI** — matches luckytile.club fonts (Imbue, Nunito Sans, Readex Pro) and color palette (cream, green, coral)
- **Photo OCR** — upload a picture; AI (OpenRouter) identifies tiles, then scores locally
- **Manual input** — tap tiles to build your hand — **instant local scoring**, no AI
- **Rule sets** — American NMJL, Hong Kong, Riichi, Taiwanese, MCR, Singaporean, LTC House Rules
- **AI scoring** — local rule engine with pattern breakdown (OCR only uses AI)

## Setup

```bash
pnpm install
cp .env.example .env.local
# Add your OPENROUTER_API_KEY to .env.local only if using photo scan
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deploy to [Vercel](https://vercel.com) (recommended):

1. Push this repo to GitHub
2. Import in Vercel
3. Add `OPENROUTER_API_KEY` as an environment variable
4. Set `NEXT_PUBLIC_APP_URL` to your deployed URL

## Link from luckytile.club

See [docs/SQUARESPACE_LINK.md](docs/SQUARESPACE_LINK.md) for step-by-step instructions to add a link from your Squarespace site to this calculator.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | For photo OCR only | Photo scan via [OpenRouter](https://openrouter.ai/) |
| `OPENROUTER_MODEL` | No | OCR model (default: `openrouter/free`, **$0**) |
| `OPENROUTER_OCR_MODEL` | No | Override OCR model only (must support vision) |
| `NEXT_PUBLIC_APP_URL` | No | Public URL sent as OpenRouter HTTP-Referer |

Free models are rate-limited (~20 req/min, ~200 req/day). See [OpenRouter free tier docs](https://openrouter.ai/docs/guides/routing/routers/free-router).

## Disclaimer

AI scoring is a helpful guide for learning and casual play. Always confirm with your table's house rules and a human coach at LTC events.
