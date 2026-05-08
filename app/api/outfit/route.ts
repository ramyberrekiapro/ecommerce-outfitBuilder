import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { generateTryOnImage } from "@/lib/openrouter";
import {
  computeBMI,
  getSilhouetteDescriptor,
  getHeightCategory,
} from "@/lib/anthropometric";
import { buildOutfitPrompt } from "@/lib/preprocessing";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const selfieFile = formData.get("selfie") as File | null;
  const heightCm = Number(formData.get("height"));
  const weightKg = Number(formData.get("weight"));

  if (!selfieFile || !heightCm || !weightKg) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  if (heightCm < 140 || heightCm > 220 || weightKg < 40 || weightKg > 180) {
    return NextResponse.json(
      { error: "measurements_out_of_range" },
      { status: 400 },
    );
  }

  if (selfieFile.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "selfie_too_large" }, { status: 400 });
  }

  const validMimes = ["image/jpeg", "image/png", "image/webp"];
  if (!validMimes.includes(selfieFile.type)) {
    return NextResponse.json(
      { error: "selfie_invalid_format" },
      { status: 400 },
    );
  }

  const selfieBuffer = Buffer.from(await selfieFile.arrayBuffer());
  const meta = await sharp(selfieBuffer).metadata();
  if ((meta.width ?? 0) < 400 || (meta.height ?? 0) < 400) {
    return NextResponse.json({ error: "selfie_too_small" }, { status: 400 });
  }

  const resizedSelfie = await sharp(selfieBuffer)
    .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  const selfieDataUrl = `data:image/jpeg;base64,${resizedSelfie.toString("base64")}`;

  // Collect garments: garment_0_url, garment_0_desc, garment_0_type, garment_1_url, ...
  const garments: { type: string; description: string }[] = [];
  const garmentDataUrls: string[] = [];

  let i = 0;
  while (formData.has(`garment_${i}_url`)) {
    const url = formData.get(`garment_${i}_url`) as string;
    const desc = formData.get(`garment_${i}_desc`) as string;
    const type = formData.get(`garment_${i}_type`) as string;

    try {
      const garmentRes = await fetch(url);
      if (!garmentRes.ok) throw new Error("fetch_failed");
      const buf = Buffer.from(await garmentRes.arrayBuffer());
      const resized = await sharp(buf)
        .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      garmentDataUrls.push(`data:image/jpeg;base64,${resized.toString("base64")}`);
      garments.push({ type, description: desc });
    } catch {
      return NextResponse.json({ error: "garment_unavailable" }, { status: 400 });
    }

    i++;
  }

  if (garments.length === 0) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const bmi = computeBMI(weightKg, heightCm);
  const silhouette = getSilhouetteDescriptor(bmi);
  const heightCategory = getHeightCategory(heightCm);
  const prompt = buildOutfitPrompt(heightCm, heightCategory, silhouette, garments);

  try {
    const image = await generateTryOnImage({
      prompt,
      selfieDataUrl,
      garmentDataUrls,
      aspectRatio: "2:3",
      imageSize: "1K",
    });
    return NextResponse.json({ image });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    if (message === "insufficient_credits") {
      return NextResponse.json({ error: "service_unavailable" }, { status: 402 });
    }
    return NextResponse.json(
      { error: "generation_failed", detail: message },
      { status: 500 },
    );
  }
}
