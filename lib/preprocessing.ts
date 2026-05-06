export function buildTryOnPrompt(
  heightCm: number,
  heightCategory: string,
  silhouette: string,
  garmentDescription: string,
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

export function buildOutfitPrompt(
  heightCm: number,
  heightCategory: string,
  silhouette: string,
  garments: { type: string; description: string }[],
): string {
  const outfitList = garments
    .map((g) => `${g.type}: ${g.description}`)
    .join(", ");
  return (
    `Photorealistic full-body fashion photograph of a ${heightCategory} person, ${heightCm}cm tall, ` +
    `with a ${silhouette}, wearing a complete outfit — ${outfitList}. ` +
    `Mediterranean summer backdrop, Monaco waterfront or Côte d'Azur. ` +
    `The person's face and identity must exactly match the reference selfie. ` +
    `Each garment must exactly match its corresponding reference image. ` +
    `Golden hour lighting. Editorial fashion photography style.`
  );
}
