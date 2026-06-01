import OpenAI from "openai";
import type { OcrResult } from "./mahjong";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

/**
 * Zero-cost default — OpenRouter auto-picks a free model that supports the
 * request (vision for OCR).
 * @see https://openrouter.ai/docs/guides/routing/routers/free-router
 */
const DEFAULT_FREE_MODEL = "openrouter/free";

const TILE_NOTATION_GUIDE = `
Use this notation for tiles:
- Characters (万): 1m-9m
- Bamboos (索): 1s-9s  
- Dots (筒): 1p-9p
- Winds: E, S, W, N
- Dragons: RD (red), GD (green), WD (white)
- Flowers/Seasons: F, SP
`;

function getClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  return new OpenAI({
    baseURL: OPENROUTER_BASE_URL,
    apiKey,
    defaultHeaders: {
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "LTC Hand Calculator",
    },
  });
}

function getOcrModel() {
  return (
    process.env.OPENROUTER_OCR_MODEL ??
    process.env.OPENROUTER_MODEL ??
    DEFAULT_FREE_MODEL
  );
}

export async function scanHandFromImage(
  imageBase64: string,
  mimeType: string
): Promise<OcrResult> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: getOcrModel(),
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You identify mahjong tiles from photos. ${TILE_NOTATION_GUIDE}
Return JSON: { "tiles": string[], "rawDescription": string, "confidence": "high"|"medium"|"low" }
List every visible tile in reading order (left to right, top to bottom). Include melds and the winning tile if visible.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Identify all mahjong tiles in this image. Return tile IDs only.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    max_tokens: 1024,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No OCR response from AI");

  return JSON.parse(content) as OcrResult;
}
