import { NextRequest, NextResponse } from "next/server";
import { scanHandFromImage } from "@/lib/llm";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload an image file." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image (JPEG, PNG, WebP, etc.)." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const result = await scanHandFromImage(base64, file.type);

    return NextResponse.json(result);
  } catch (error) {
    console.error("OCR error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to scan image";
    const status = message.includes("OPENROUTER_API_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
