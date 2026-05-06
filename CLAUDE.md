# CLAUDE.md — Virtual Try-On E-Commerce Platform
## Project Overview
Build a full-stack clothing e-commerce web application with an integrated AI virtual try-on feature. The store aesthetic is **Zara-style minimalist luxury** — summer, Monaco, Mediterranean. The virtual try-on uses `google/gemini-3.1-flash-image-preview` (referred to internally as NanaBanana2) via the OpenRouter API to generate a photorealistic image of the user wearing a selected garment or full outfit.
---
## Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (serverless functions)
- **Image processing:** `sharp`
- **AI generation:** OpenRouter API — `google/gemini-3.1-flash-image-preview`
- **Storage:** In-memory only for MVP (no persistent user data)
- **State management:** Zustand
- **Environment:** Node.js 20+
---
## Project Structure
```
/
├── app/
│   ├── page.tsx                    # Homepage / hero
│   ├── shop/
│   │   ├── page.tsx                # Product catalog
│   │   └── [id]/page.tsx          # Product detail page
│   ├── try-on/
│   │   └── page.tsx               # Virtual try-on page (single item)
│   ├── outfit-builder/
│   │   └── page.tsx               # Full outfit builder + try-on
│   └── api/
│       ├── try-on/route.ts         # POST — single item try-on endpoint
│       └── outfit/route.ts         # POST — full outfit try-on endpoint
├── components/
│   ├── ui/                         # Reusable UI primitives
│   ├── ProductCard.tsx
│   ├── TryOnModal.tsx
│   ├── OutfitBuilder.tsx
│   └── SelfieUploader.tsx
├── lib/
│   ├── openrouter.ts               # NanaBanana2 API client
│   ├── preprocessing.ts            # Selfie validation + resize
│   └── anthropometric.ts          # Height/weight → body proportion estimation
├── data/
│   └── products.ts                 # Static product catalog (mock data)
├── public/
│   └── products/                   # Product images
└── .env.local
```
---
## Environment Variables
```env
OPENROUTER_API_KEY=sk-or-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
---
## E-Commerce Store Requirements
### Visual Design
- **Aesthetic:** Zara-style. Clean, editorial, lots of white space, minimal UI chrome.
- **Palette:** Off-white `#F5F0EB`, warm black `#1A1A1A`, sand `#C9B99A`, deep navy `#0D1B2A` as accent.
- **Typography:** `Cormorant Garamond` (headings) + `Inter` (body). Both via Google Fonts.
- **Imagery style:** Mediterranean / Monaco summer — linen suits, silk dresses, lightweight cotton, nautical hints. No sportswear.
- **Layout:** Full-bleed hero images, editorial grid for catalog, sticky minimal header.
### Pages Required
#### Homepage (`/`)
- Full-viewport hero with editorial image + headline
- "Shop Now" CTA and "Try It On" CTA
- Featured collection grid (6–8 products)
- Brief brand statement section (Monaco-inspired copy)
#### Catalog (`/shop`)
- Filter sidebar: category (tops, bottoms, dresses, outerwear), size, color
- Product grid — 3 columns desktop, 2 tablet, 1 mobile
- Each card: product image, name, price, "Try On" quick-action button
#### Product Detail (`/shop/[id]`)
- Large product images (mock multiple angles)
- Product name, price, description, size selector
- "Try It On" CTA — links to `/try-on?product=[id]`
- Size guide note: "Not sure about sizing? Use virtual try-on"
#### Virtual Try-On (`/try-on`)
- Step-by-step flow:
  1. Enter height (cm) and weight (kg)
  2. Upload selfie — validated before proceeding
  3. Select garment (pre-filled if `?product=` param present)
  4. Generate → show result
- Animated loading state during API call (10–30s expected)
- Display generated image full-width with download option
#### Outfit Builder (`/outfit-builder`)
- Left panel: category tabs (top, bottom, shoes, accessories) with item selector
- Right panel: selected outfit summary + user body inputs (height, weight, selfie)
- "Generate Outfit Preview" button → calls `/api/outfit`
- Display generated full-outfit image
### Mock Product Catalog
Generate 12+ products across categories: tops, bottoms, dresses, outerwear.
```typescript
interface Product {
  id: string;
  name: string;
  price: number;           // EUR
  category: 'top' | 'bottom' | 'dress' | 'outerwear';
  colors: string[];
  sizes: string[];
  images: string[];        // Use Unsplash URLs for MVP
  description: string;
  material: string;
}
```
Use Unsplash editorial-quality summer fashion URLs. Mediterranean vibe — linen, silk, cotton, cream/sand/navy palette.
---
## Virtual Try-On Feature — Full Specification
### Input
```typescript
interface TryOnInput {
  heightCm: number;         // 140–220
  weightKg: number;         // 40–180
  selfie: File;             // JPEG/PNG/WEBP, max 10MB
  garmentId: string;
  garmentImageUrl: string;
  garmentDescription: string;
}
```
### Preprocessing Pipeline (server-side in API route)
**Step 1 — Selfie Validation**
- File size < 10MB
- MIME: `image/jpeg`, `image/png`, or `image/webp`
- Min resolution 400×400px (check with `sharp().metadata()`)
- Reject early with 400 + `{ error: 'selfie_invalid' | 'selfie_too_small' }`
**Step 2 — Resize & Normalize**
- `sharp` → resize to max 1024px longest edge, preserve aspect ratio
- Convert to JPEG @ 85% quality
- Encode to base64: `data:image/jpeg;base64,...`
**Step 3 — Body Proportion Estimation**
```typescript
// lib/anthropometric.ts
export function getSilhouetteDescriptor(bmi: number): string {
  if (bmi < 18.5) return 'slim, lean build';
  if (bmi < 25)   return 'average athletic build';
  if (bmi < 30)   return 'medium full build';
  return 'fuller, curvy build';
}
export function getHeightCategory(heightCm: number): string {
  if (heightCm < 165) return 'petite';
  if (heightCm <= 178) return 'average height';
  return 'tall';
}
export function computeBMI(weightKg: number, heightCm: number): number {
  return weightKg / Math.pow(heightCm / 100, 2);
}
```
**Step 4 — Garment Image Preprocessing**
- `fetch` garment image from URL
- `sharp` → resize to max 1024px, JPEG @ 85%
- Encode to base64 data URL
**Step 5 — Prompt Construction**
```typescript
export function buildTryOnPrompt(
  heightCm: number,
  heightCategory: string,
  silhouette: string,
  garmentDescription: string
): string {
  return (
    `Photorealistic fashion photograph of a ${heightCategory} person, ${heightCm}cm tall, ` +
    `with a ${silhouette}, wearing ${garmentDescription}. ` +
    `Natural Mediterranean daylight, outdoor coastal setting. ` +
    `The person's face and identity must exactly match the reference selfie provided. ` +
    `The garment must exactly match the reference clothing image in color, pattern, cut, and style. ` +
    `Full body, front-facing. Realistic fabric drape and fit. Editorial fashion photography.`
  );
}
```
**Step 6 — Call NanaBanana2**
See API Integration section below.
**Step 7 — Return**
Return `{ image: 'data:image/png;base64,...' }` to frontend. Display directly in `<img>` tag. No server-side storage.
### Outfit Builder Variant (multi-garment)
Accepts: top + bottom + optional shoes (2–3 garment images max).
```typescript
export function buildOutfitPrompt(
  heightCm: number,
  heightCategory: string,
  silhouette: string,
  garments: { type: string; description: string }[]
): string {
  const outfitList = garments.map(g => `${g.type}: ${g.description}`).join(', ');
  return (
    `Photorealistic full-body fashion photograph of a ${heightCategory} person, ${heightCm}cm tall, ` +
    `with a ${silhouette}, wearing a complete outfit — ${outfitList}. ` +
    `Mediterranean summer backdrop, Monaco waterfront or Côte d'Azur. ` +
    `The person's face and identity must exactly match the reference selfie. ` +
    `Each garment must exactly match its corresponding reference image. ` +
    `Golden hour lighting. Editorial fashion photography style.`
  );
}
```
Pass selfie + all garment images as separate `image_url` content parts.
---
## API Integration — NanaBanana2
### Critical Facts (from model docs — do not deviate)
- **Endpoint:** `POST https://openrouter.ai/api/v1/chat/completions`
- **Auth header:** `Authorization: Bearer ${OPENROUTER_API_KEY}`
- **Required body field:** `modalities: ["image", "text"]` — omitting this causes failure
- **Text content part must come FIRST** in the content array, before all `image_url` parts
- **Image inputs:** `{ type: "image_url", image_url: { url: "data:image/jpeg;base64,..." } }`
- **Supported MIME types:** `image/png`, `image/jpeg`, `image/webp`, `image/heic`, `image/heif`
- **Max reference images:** ~14 per request
- **Max inline payload:** 20MB total (base64 images + prompt combined)
- **image_config:** pass `aspect_ratio` and `image_size` — NOT part of OpenAI spec, pass as top-level field alongside `messages`
- **Recommended for try-on:** `aspect_ratio: "2:3"`, `image_size: "1K"`
- **Output location:** `choices[0].message.images[0].image_url.url` — base64 PNG data URL
- **Response always includes both** `message.content` (text) and `message.images` — ignore text, read images
- **Cost:** ~$0.067 per image at `1K` size
### `lib/openrouter.ts`
```typescript
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
interface GenerateParams {
  prompt: string;
  selfieDataUrl: string;
  garmentDataUrls: string[];
  aspectRatio?: string;
  imageSize?: '0.5K' | '1K' | '2K' | '4K';
}
export async function generateTryOnImage(params: GenerateParams): Promise<string> {
  const {
    prompt,
    selfieDataUrl,
    garmentDataUrls,
    aspectRatio = '2:3',
    imageSize = '1K',
  } = params;
  // TEXT MUST COME FIRST — per model docs
  const userContent = [
    { type: 'text', text: prompt },
    { type: 'image_url', image_url: { url: selfieDataUrl } },
    ...garmentDataUrls.map(url => ({
      type: 'image_url',
      image_url: { url },
    })),
  ];
  const body = {
    model: 'google/gemini-3.1-flash-image-preview',
    modalities: ['image', 'text'],
    image_config: {
      aspect_ratio: aspectRatio,
      image_size: imageSize,
    },
    messages: [
      {
        role: 'system',
        content:
          "You are a fashion photography AI. Generate photorealistic virtual try-on images. " +
          "Preserve the subject's face and identity exactly from the reference selfie. " +
          "Match each garment exactly to its reference image in color, cut, and pattern.",
      },
      {
        role: 'user',
        content: userContent,
      },
    ],
  };
  let lastError: Error | null = null;
  // Retry with exponential backoff on 429
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
    }
    const res = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
        'X-Title': 'VirtualTryOn-Ecommerce',
      },
      body: JSON.stringify(body),
    });
    if (res.status === 429) {
      lastError = new Error('rate_limited');
      continue;
    }
    if (res.status === 402) {
      throw new Error('insufficient_credits');
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`openrouter_error_${res.status}: ${JSON.stringify(err)}`);
    }
    const data = await res.json();
    const imageUrl = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl) {
      throw new Error(
        `no_image_in_response. Full response: ${JSON.stringify(data).slice(0, 500)}`
      );
    }
    return imageUrl; // data:image/png;base64,...
  }
  throw lastError ?? new Error('generation_failed_after_retries');
}
```
### `app/api/try-on/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { generateTryOnImage } from '@/lib/openrouter';
import { computeBMI, getSilhouetteDescriptor, getHeightCategory } from '@/lib/anthropometric';
import { buildTryOnPrompt } from '@/lib/preprocessing';
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const selfieFile = formData.get('selfie') as File | null;
  const heightCm = Number(formData.get('height'));
  const weightKg = Number(formData.get('weight'));
  const garmentImageUrl = formData.get('garmentImageUrl') as string;
  const garmentDescription = formData.get('garmentDescription') as string;
  // Validate inputs
  if (!selfieFile || !garmentImageUrl || !heightCm || !weightKg) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }
  if (selfieFile.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'selfie_too_large' }, { status: 400 });
  }
  const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validMimes.includes(selfieFile.type)) {
    return NextResponse.json({ error: 'selfie_invalid_format' }, { status: 400 });
  }
  const selfieBuffer = Buffer.from(await selfieFile.arrayBuffer());
  const meta = await sharp(selfieBuffer).metadata();
  if ((meta.width ?? 0) < 400 || (meta.height ?? 0) < 400) {
    return NextResponse.json({ error: 'selfie_too_small' }, { status: 400 });
  }
  // Resize selfie
  const resizedSelfie = await sharp(selfieBuffer)
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  const selfieDataUrl = `data:image/jpeg;base64,${resizedSelfie.toString('base64')}`;
  // Body proportions
  const bmi = computeBMI(weightKg, heightCm);
  const silhouette = getSilhouetteDescriptor(bmi);
  const heightCategory = getHeightCategory(heightCm);
  // Garment image
  let garmentDataUrl: string;
  try {
    const garmentRes = await fetch(garmentImageUrl);
    if (!garmentRes.ok) throw new Error('fetch_failed');
    const garmentBuffer = Buffer.from(await garmentRes.arrayBuffer());
    const resizedGarment = await sharp(garmentBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    garmentDataUrl = `data:image/jpeg;base64,${resizedGarment.toString('base64')}`;
  } catch {
    return NextResponse.json({ error: 'garment_unavailable' }, { status: 400 });
  }
  const prompt = buildTryOnPrompt(heightCm, heightCategory, silhouette, garmentDescription);
  try {
    const image = await generateTryOnImage({
      prompt,
      selfieDataUrl,
      garmentDataUrls: [garmentDataUrl],
      aspectRatio: '2:3',
      imageSize: '1K',
    });
    return NextResponse.json({ image });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown';
    if (message === 'insufficient_credits') {
      return NextResponse.json({ error: 'service_unavailable' }, { status: 402 });
    }
    return NextResponse.json({ error: 'generation_failed', detail: message }, { status: 500 });
  }
}
```
### `app/api/outfit/route.ts`
Same structure as try-on route, but:
- Accepts multiple garment form fields: `garment_0_url`, `garment_0_desc`, `garment_0_type`, etc.
- Fetches and resizes each garment image
- Uses `buildOutfitPrompt` with array of garments
- Passes all garment base64 data URLs in `garmentDataUrls` array to `generateTryOnImage`
---
## Error Handling
| Scenario | HTTP | `error` field |
|---|---|---|
| Missing form fields | 400 | `missing_fields` |
| Selfie > 10MB | 400 | `selfie_too_large` |
| Wrong selfie format | 400 | `selfie_invalid_format` |
| Selfie resolution < 400px | 400 | `selfie_too_small` |
| Garment image fetch fails | 400 | `garment_unavailable` |
| OpenRouter 429 (after 3 retries) | 503 | `rate_limited` |
| OpenRouter 402 | 402 | `service_unavailable` |
| No image in response | 500 | `generation_failed` |
Frontend must display user-friendly messages for each — not raw error codes.
---
## Performance & Cost Notes
- **Cost:** ~$0.067/image at `1K`. Use `0.5K` (~$0.045) for faster/cheaper previews if acceptable quality.
- **Latency:** 10–30s per generation. Show animated loading state — skeleton or spinner with copy like "Generating your look…"
- **No selfie persistence.** Process in-memory, discard immediately. No biometric data stored.
- **Payload size.** After sharp resizing, 2 images (selfie + 1 garment) base64-encoded ≈ 2–3MB, well under the 20MB cap. Monitor if garment images are large.
- **Generation timeout.** Set frontend request timeout to 60s. Show retry option on timeout.
---
## Build Checklist
- [ ] Next.js 14 project scaffold (TypeScript + Tailwind)
- [ ] Google Fonts: Cormorant Garamond + Inter
- [ ] Tailwind config: custom palette (`#F5F0EB`, `#1A1A1A`, `#C9B99A`, `#0D1B2A`)
- [ ] Mock product catalog — 12+ items with Unsplash images
- [ ] Homepage: hero, featured grid, brand statement
- [ ] Catalog page with category/color/size filters
- [ ] Product detail page
- [ ] Virtual try-on page (single item, step flow)
- [ ] Outfit builder page (multi-garment)
- [ ] `lib/openrouter.ts` — NanaBanana2 client with retry logic
- [ ] `lib/anthropometric.ts` — BMI → silhouette + height category
- [ ] `lib/preprocessing.ts` — prompt builders
- [ ] `app/api/try-on/route.ts`
- [ ] `app/api/outfit/route.ts`
- [ ] SelfieUploader component with client-side preview
- [ ] Loading state component (animated, 10–30s friendly)
- [ ] Error message components per error code
- [ ] Mobile-responsive layout (all pages)
- [ ] `.env.local` with `OPENROUTER_API_KEY`
---
## Out of Scope for MVP
- User authentication / accounts
- Payment processing
- Pose estimation (MediaPipe) — prompt-based approach used instead
- Body segmentation
- Persistent image storage
- Analytics / tracking