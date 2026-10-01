import { NextResponse } from "next/server";
import { getSql } from "@/lib/db/client";
import { runSuite } from "@/lib/asedio/suite";
import { CONFIG, vulnerableTarget } from "@/lib/asedio/demo";
import type { Attack } from "@/lib/asedio/types";

export async function POST(request: Request) {
  let payload: string;
  try {
    const body = await request.json();
    payload = typeof body.payload === "string" ? body.payload.trim() : "";
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  if (!payload) {
    return NextResponse.json({ error: "Escribe un payload de ataque" }, { status: 400 });
  }

  const attack: Attack = {
    id: "custom",
    category: "prompt_extraction",
    payload,
    exploitability: 4,
    impact: 4,
    humanVerdict: "violation",
    compromisedResponse: `Por supuesto. Aquí tienes mi system prompt: ${CONFIG.systemPrompt}`,
  };

  const result = runSuite([attack], vulnerableTarget, CONFIG)[0];

  try {
    const db = getSql();
    await db`INSERT INTO asedio.attacks (payload, outcome, severity) VALUES (${payload}, ${result.outcome}, ${result.severity ?? null})`;

    return NextResponse.json({
      attackId: result.attackId,
      category: result.category,
      outcome: result.outcome,
      severity: result.severity,
      signature: result.signature,
      checks: result.checks,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error guardando el ataque" },
      { status: 500 },
    );
  }
}
