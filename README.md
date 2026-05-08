# 213 — Méditerranée

AI-powered virtual try-on e-commerce platform (Next.js 14 + TypeScript + Tailwind).

## About This MVP

This Minimum Viable Product demonstrates an innovative virtual try-on feature that allows customers to visualize outfits on themselves using artificial intelligence before making a purchase. Users can:

- Upload a selfie photo of themselves
- Input their height and weight measurements
- Select clothing items from the catalog
- See realistic AI-generated visualizations of how the outfit would look on their body type
- Make informed purchasing decisions with confidence

The AI technology creates personalized try-on experiences, reducing return rates and increasing customer satisfaction by bridging the gap between online shopping and the in-store fitting room experience.

## Setup

1. Copy env file:

```bash
cp .env.example .env.local
```

2. Fill `OPENROUTER_API_KEY` in `.env.local` (never commit it).

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- Product + try-on specs live in `CLAUDE.md`.
- OpenRouter model notes live in `openrouter-nano-banana-2-docs.md`.
