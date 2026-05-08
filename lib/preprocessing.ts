export function buildTryOnPrompt(
  heightCm: number,
  heightCategory: string,
  silhouette: string,
  garmentDescription: string,
): string {
  return `
TASK: Virtual fashion try-on. Generate a single photorealistic fashion photograph.

SUBJECT (from reference selfie — Image 1):
- Reproduce the person's face, skin tone, hair, and identity with 100% accuracy from the selfie
- Body proportions: ${heightCategory} frame, ${heightCm}cm tall, ${silhouette}
- Natural, confident standing pose — weight slightly shifted, hands relaxed at sides or one hand at hip
- Full body visible from head to toe, slight 3/4 angle (body turned ~10°, face forward toward camera)

GARMENT (from clothing reference — Image 2):
- The person wears EXACTLY the garment shown in the clothing reference image
- Reproduce every detail faithfully: fabric texture, color, pattern, cut, stitching, collar, hem, sleeves
- Realistic fabric drape, natural folds and shadows where the fabric rests on the body
- Garment fits the person's ${silhouette} frame naturally — no distortion, no floating, properly worn
- Product: ${garmentDescription}

SETTING & ENVIRONMENT:
- High-end fashion studio OR luxury Mediterranean outdoor location (choose whichever makes the garment look its best)
- Studio option: seamless light grey or warm white backdrop, professional softbox lighting from the upper left, subtle fill light, clean polished concrete floor
- Outdoor option: golden hour on a Côte d'Azur terrace or Monaco rooftop, blurred architectural background (bokeh), warm directional sunlight casting soft natural shadows
- Environment must feel aspirational and editorial — no cluttered or casual backgrounds

LIGHTING & CAMERA:
- Shot with a full-frame camera, 85mm portrait lens, f/2.0 — subject sharp, background softly blurred
- Three-point lighting: key light (Rembrandt setup), soft fill, subtle hair/rim light to separate subject from background
- Skin has natural highlights and soft shadows — not overexposed, not flat
- Fabric textures are crisp and detailed under the light

PHOTOGRAPHY STYLE:
- High-fashion editorial — think Vogue, Jacquemus campaign, Loro Piana lookbook
- Photorealistic, not illustrated or painted — real photograph quality
- Color grading: slightly desaturated, warm mid-tones, deep shadows — luxury magazine aesthetic
- Ultra-sharp on the garment details, soft focus on background depth
- Aspect ratio portrait (2:3), no text or logos overlaid

OUTPUT REQUIREMENTS:
- ONE image, full body, front-facing with slight angle
- The face must be the face from the selfie — no generic model face
- The garment must be the garment from the reference — no substitution
`.trim();
}

export function buildOutfitPrompt(
  heightCm: number,
  heightCategory: string,
  silhouette: string,
  garments: { type: string; description: string }[],
): string {
  const garmentLines = garments
    .map((g, i) => `  - [Garment Image ${i + 2}] ${g.type.toUpperCase()}: ${g.description}`)
    .join("\n");

  const outfitSummary = garments.map((g) => g.description).join(", paired with ");

  return `
TASK: Virtual fashion outfit try-on. Generate a single photorealistic fashion photograph showing a complete styled look.

SUBJECT (from reference selfie — Image 1):
- Reproduce the person's face, skin tone, hair, and identity with 100% accuracy from the selfie
- Body proportions: ${heightCategory} frame, ${heightCm}cm tall, ${silhouette}
- Full body visible head to toe, confident editorial pose — slight weight shift, relaxed arms, natural stance
- Body turned ~10° to 3/4 angle, face directed forward toward the camera

COMPLETE OUTFIT (each garment mapped to its reference image):
${garmentLines}
- Every garment must EXACTLY match its reference image: fabric, color, pattern, cut, stitching, silhouette
- Garments are worn together as a coordinated outfit: ${outfitSummary}
- Realistic layering where applicable — garments interact naturally (jacket lapels fall correctly, trousers break at the shoe, shirt collar is properly visible above a jacket, etc.)
- Authentic fabric behavior: linen drapes softly, silk catches the light, cotton has gentle creases

STYLING & DETAILS:
- Clothing is properly fitted to the person's ${silhouette} body
- Shoes implied but may be slightly cropped if needed for full outfit visibility
- Hair and accessories consistent with the selfie — do not add or remove accessories

SETTING & ENVIRONMENT — pick ONE of these elite fashion locations:
Option A: FASHION STUDIO — seamless off-white or warm sand backdrop, professional 3-light setup (large octabox key light upper-left, silver reflector fill, hairlight behind), polished concrete floor visible at base
Option B: MEDITERRANEAN EXTERIOR — Côte d'Azur villa terrace at golden hour, limestone architecture blurred in background, warm 5500K directional sunlight, lens flare hint, long soft shadow on ground
Option C: FASHION WEEK STREET — cobblestone Paris side street, morning light, stone building facades blurred to bokeh f/1.8, overcast soft diffused light, puddle reflection hint

Choose whichever location best complements the outfit's style and season.

LIGHTING & CAMERA:
- Full-frame camera, 50–85mm lens at f/1.8–f/2.2 — crisp subject, cinematic background blur
- Rembrandt key lighting with soft fill — natural-looking sculpted shadows on face and body
- Garment textures sharp and detailed: weave visible, stitching clear, fabric sheen accurate
- No harsh shadows or blown highlights — balanced, editorial-grade exposure

PHOTOGRAPHY STYLE:
- High-fashion editorial — Jacquemus, The Row, Bottega Veneta, Loro Piana campaign quality
- Photorealistic photograph, not AI-generated looking, not illustrated
- Color grade: warm, slightly desaturated, rich blacks, lifted shadows — luxury print magazine aesthetic
- Ultra sharp on clothing and face, background in smooth bokeh
- Portrait aspect ratio 2:3

OUTPUT REQUIREMENTS:
- ONE image only, full body visible
- Face = the selfie person, not a generic model
- Every garment = its exact reference image
- Result should look like a page from a high-end fashion editorial shoot
`.trim();
}
