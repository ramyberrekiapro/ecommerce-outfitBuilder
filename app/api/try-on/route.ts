import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { generateTryOnImage } from "@/lib/openrouter";
import {
  computeBMI,
  getHeightCategory,
  getSilhouetteDescriptor,
} from "@/lib/anthropometric";
import { buildTryOnPrompt } from "@/lib/preprocessing";

export const runtime = "nodejs";
export const maxDuration = 60;

const VALID_MIMES = ["image/jpeg", "image/png", "image/webp"];

function getRequestOrigin(req: NextRequest): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  if (!host) return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${proto}://${host}`;
}

function toAbsoluteUrl(input: string, origin: string): string {
  // Node fetch needs absolute URLs. Frontend may send "/products/..." paths.
  try {
    return new URL(input, origin).toString();
  } catch {
    return input;
  }
}

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  const selfieFile = formData.get("selfie") as File | null;
  const heightCm = Number(formData.get("height"));
  const weightKg = Number(formData.get("weight"));
  const garmentImageUrl = formData.get("garmentImageUrl") as string | null;
  const garmentDescription = formData.get("garmentDescription") as
    | string
    | null;

  if (
    !selfieFile ||
    !garmentImageUrl ||
    !garmentDescription ||
    !heightCm ||
    !weightKg
  ) {
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
  if (!VALID_MIMES.includes(selfieFile.type)) {
    return NextResponse.json(
      { error: "selfie_invalid_format" },
      { status: 400 },
    );
  }

  const selfieBuffer = Buffer.from(await selfieFile.arrayBuffer());
  let selfieMeta;
  try {
    selfieMeta = await sharp(selfieBuffer).metadata();
  } catch {
    return NextResponse.json(
      { error: "selfie_invalid_format" },
      { status: 400 },
    );
  }
  if ((selfieMeta.width ?? 0) < 400 || (selfieMeta.height ?? 0) < 400) {
    return NextResponse.json({ error: "selfie_too_small" }, { status: 400 });
  }

  const resizedSelfie = await sharp(selfieBuffer)
    .rotate()
    .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  const selfieDataUrl = `data:image/jpeg;base64,${resizedSelfie.toString("base64")}`;

  const bmi = computeBMI(weightKg, heightCm);
  const silhouette = getSilhouetteDescriptor(bmi);
  const heightCategory = getHeightCategory(heightCm);

  let garmentDataUrl: string;
  try {
    const origin = getRequestOrigin(req);
    const absGarmentUrl = toAbsoluteUrl(garmentImageUrl, origin);
    const garmentRes = await fetch(absGarmentUrl);
    if (!garmentRes.ok) throw new Error(`fetch_failed_${garmentRes.status}`);
    const ct = garmentRes.headers.get("content-type") ?? "";
    const garmentBuffer = Buffer.from(await garmentRes.arrayBuffer());
    // sharp can read SVG when given a density; raster formats are read directly.
    const pipeline = ct.includes("svg")
      ? sharp(garmentBuffer, { density: 300 })
      : sharp(garmentBuffer);
    const resizedGarment = await pipeline
      .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    garmentDataUrl = `data:image/jpeg;base64,${resizedGarment.toString("base64")}`;
  } catch (e) {
    console.error("[try-on] garment processing failed:", e);
    return NextResponse.json(
      { error: "garment_unavailable" },
      { status: 400 },
    );
  }

  const prompt = buildTryOnPrompt(
    heightCm,
    heightCategory,
    silhouette,
    garmentDescription,
  );

  try {
    const image = await generateTryOnImage({
      prompt,
      selfieDataUrl,
      garmentDataUrls: [garmentDataUrl],
      aspectRatio: "2:3",
      imageSize: "1K",
    });
    return NextResponse.json({ image });
  } catch (err) {
    console.error("[try-on] generation failed:", err);
    const message = err instanceof Error ? err.message : "unknown";
    if (message === "insufficient_credits") {
      return NextResponse.json(
        { error: "service_unavailable" },
        { status: 402 },
      );
    }
    if (message === "rate_limited") {
      return NextResponse.json({ error: "rate_limited" }, { status: 503 });
    }
    return NextResponse.json(
      { error: "generation_failed", detail: message },
      { status: 500 },
    );
  }
}
