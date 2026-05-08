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

## Features

- **Virtual Try-On**: AI-powered outfit visualization using selfies
- **Product Catalog**: Browse and filter clothing items
- **Outfit Builder**: Create complete outfit combinations
- **Admin Dashboard**: Manage products and inventory
- **Shopping Cart**: Add items and manage selections
- **Responsive Design**: Optimized for all devices

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Image Processing**: Sharp
- **AI Integration**: OpenRouter API (Google Gemini 3.1 Flash)
- **Deployment**: Vercel-ready with optimized configuration

## Project Structure

```
app/
├── api/          # API routes for try-on and admin
├── shop/         # Product catalog and detail pages
├── try-on/       # Single item virtual try-on
├── outfit-builder/ # Complete outfit creation
├── admin/        # Admin dashboard
components/
├── ui/           # Reusable UI components
├── ProductCard.tsx
├── TryOnFlow.tsx
├── OutfitBuilder.tsx
└── AdminDashboard.tsx
lib/
├── openrouter.ts # AI API client
├── preprocessing.ts # Image validation
└── anthropometric.ts # Body measurement calculations
```
