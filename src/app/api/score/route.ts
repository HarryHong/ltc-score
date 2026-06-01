import { NextRequest, NextResponse } from "next/server";
import type { MahjongRuleSet } from "@/lib/mahjong";
import { MAHJONG_RULES } from "@/lib/mahjong";
import { calculateHandScore } from "@/lib/scoring";

const VALID_RULES = new Set(MAHJONG_RULES.map((r) => r.id));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tiles, ruleSet } = body as {
      tiles?: string[];
      ruleSet?: MahjongRuleSet;
    };

    if (!tiles?.length) {
      return NextResponse.json(
        { error: "Please provide at least one tile." },
        { status: 400 }
      );
    }

    if (!ruleSet || !VALID_RULES.has(ruleSet)) {
      return NextResponse.json(
        { error: "Please select a valid rule set." },
        { status: 400 }
      );
    }

    const result = calculateHandScore(tiles, ruleSet);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Score error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to calculate score";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
