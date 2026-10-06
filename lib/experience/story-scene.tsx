"use client";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import { StoryStage } from "@/design-system/demo/decision-lab";
import { OutcomeTape, useReducedMotion } from "@/design-system/demo/project-story";
import { tapeCounts } from "@/design-system/demo/outcome-tape";
import { FlowDiagram, type FlowTone } from "@/design-system/demo/flow-diagram";
import { FAMILY_ORDER } from "@/lib/asedio/demo";
import type { MissionResult } from "./mission";
import { asedioCells, revealedAttacks } from "./scene-state";
import { STORY } from "./story";

const ORDER = ["attacks", "defenses", "assistant"] as const;

export function AsedioStoryScene({ frame, covered, result, locale }: { frame: PlaybackFrame<TraceEvent>; covered: number; result: MissionResult; locale: "en" | "es" }) {
  const copy = STORY[locale].scene;
  const reduced = useReducedMotion();
  const revealed = revealedAttacks(frame, result.results.length, reduced);
  const cells = asedioCells(result.results, revealed);
  const through = tapeCounts(cells).lost;
  const tone: Record<(typeof ORDER)[number], FlowTone> = {
    attacks: "idle",
    defenses: covered === 0 ? "off" : covered === FAMILY_ORDER.length ? "success" : "active",
    assistant: through > 0 ? "danger" : revealed >= result.results.length ? "success" : "idle",
  };
  const nodes = ORDER.map((id, i) => ({ id, x: 10 + i * 240, y: 15, ...copy.nodes[id], tone: tone[id] }));
  const edges = ORDER.slice(1).map((to, i) => ({ from: ORDER[i], to, tone: to === "assistant" && through > 0 ? ("danger" as const) : undefined }));
  return <StoryStage locale={locale} title={copy.title} caption={copy.caption} step={frame.visible} total={frame.total}>
    <FlowDiagram nodes={nodes} edges={edges} width={650} height={100} ariaLabel={copy.throughOf(through)} statusLabels={copy.statusLabels} />
    <div className="mt-6">
      <OutcomeTape cells={cells} labels={copy.tape} ariaLabel={copy.tapeLabel} columns={12} />
      <p className="mt-4 font-mono text-2xl font-semibold tracking-tight">{copy.throughOf(through)}</p>
    </div>
  </StoryStage>;
}
