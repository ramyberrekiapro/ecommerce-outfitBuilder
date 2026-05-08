const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface GenerateParams {
  prompt: string;
  selfieDataUrl: string;
  garmentDataUrls: string[];
  aspectRatio?: string;
  imageSize?: "0.5K" | "1K" | "2K" | "4K";
}

export async function generateTryOnImage(
  params: GenerateParams,
): Promise<string> {
  const {
    prompt,
    selfieDataUrl,
    garmentDataUrls,
    aspectRatio = "2:3",
    imageSize = "1K",
  } = params;

  // Text MUST come first — per Gemini image-preview docs.
  const userContent: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } }
  > = [
    { type: "text", text: prompt },
    { type: "image_url", image_url: { url: selfieDataUrl } },
    ...garmentDataUrls.map((url) => ({
      type: "image_url" as const,
      image_url: { url },
    })),
  ];

  const body = {
    model: "google/gemini-3.1-flash-image-preview",
    modalities: ["image", "text"],
    include_usage: true,
    image_config: {
      aspect_ratio: aspectRatio,
      image_size: imageSize,
    },
    messages: [
      {
        role: "system",
        content:
          "You are an elite fashion photography AI specializing in photorealistic virtual try-on. " +
          "Your output must look indistinguishable from a real high-end fashion campaign photograph. " +
          "CRITICAL RULES — never violate these:\n" +
          "1. The subject's face, skin tone, hair color, and identity must be reproduced EXACTLY from the reference selfie (Image 1). Do not substitute a generic model face.\n" +
          "2. Every garment must match its reference clothing image EXACTLY — same color, same fabric texture, same cut, same pattern, same stitching details. Do not invent or alter any garment.\n" +
          "3. Generate exactly ONE image. No text, no watermarks, no logos.\n" +
          "4. The photograph must be photorealistic — not illustrated, not painted, not cartoon-like.\n" +
          "5. Lighting, shadows, and fabric drape must follow the laws of physics — realistic, not CGI-flat.\n" +
          "6. The result must look like it belongs in Vogue, a Jacquemus lookbook, or a Loro Piana campaign.",
      },
      {
        role: "user",
        content: userContent,
      },
    ],
  };

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
    }

    const res = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "213 - Virtual Try-On",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 429) {
      lastError = new Error("rate_limited");
      continue;
    }
    if (res.status === 402) {
      throw new Error("insufficient_credits");
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        `openrouter_error_${res.status}: ${JSON.stringify(err).slice(0, 300)}`,
      );
    }

    const data = await res.json();
    const imageUrl =
      data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl) {
      throw new Error(
        `no_image_in_response. Response: ${JSON.stringify(data).slice(0, 500)}`,
      );
    }
    return imageUrl;
  }
  throw lastError ?? new Error("generation_failed_after_retries");
}
