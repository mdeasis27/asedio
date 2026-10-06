"use client";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import { StoryStage } from "@/design-system/demo/decision-lab";
import { OutcomeTape, useReducedMotion } from "@/design-system/demo/project-story";
import { tapeCounts } from "@/design-system/demo/outcome-tape";
import type { Outcome } from "@/lib/asedio/types";
import type { MissionResult } from "./mission";
import { asedioCells, asedioDoors, lastDoor, revealedAttacks } from "./scene-state";
import { STORY } from "./story";

// Status is never color alone: every mark also carries a symbol.
const MARK: Record<Outcome, { symbol: string; fill: string; text: string }> = {
  pass: { symbol: "✓", fill: "fill-success", text: "text-success" },
  "needs-review": { symbol: "?", fill: "fill-info", text: "text-info" },
  fail: { symbol: "×", fill: "fill-danger", text: "text-danger" },
};
const LABEL: Record<Outcome, "served" | "rerouted" | "lost"> = { pass: "served", "needs-review": "rerouted", fail: "lost" };
const doorX = (i: number) => 70 + i * 86;
const MOVE = "transition-transform duration-500 ease-out motion-reduce:transition-none";

/** A house with one door per kind of attack; the visitor tries them in the real order of the run. */
export function AsedioStoryScene({ frame, covered, result, locale }: { frame: PlaybackFrame<TraceEvent>; covered: number; result: MissionResult; locale: "en" | "es" }) {
  const copy = STORY[locale].scene;
  const families = STORY[locale].tryIt.families;
  const reduced = useReducedMotion();
  const revealed = revealedAttacks(frame, result.results.length, reduced);
  const cells = asedioCells(result.results, revealed);
  const through = tapeCounts(cells).lost;
  const doors = asedioDoors(result.results, covered, revealed);
  const at = lastDoor(result.results, revealed);
  return <StoryStage locale={locale} title={copy.title} caption={copy.caption} step={frame.visible} total={frame.total}>
    <svg role="img" aria-label={copy.houseLabel(covered, through)} viewBox="0 0 720 400" className="h-auto w-full" data-asedio-house>
      <polygon points="40,150 360,40 680,150" className="fill-foreground/5 stroke-border" strokeWidth="2" />
      <rect x="50" y="150" width="620" height="200" className="fill-background stroke-border" strokeWidth="2" />
      <line x1="10" y1="350" x2="710" y2="350" className="stroke-border" strokeWidth="2" />
      <text x="360" y="125" textAnchor="middle" className="fill-muted-foreground text-[22px]">{copy.house}</text>
      {doors.map((d, i) => {
        const x = doorX(i), open = d.marks.includes("fail"), review = d.marks.includes("needs-review");
        return <g key={d.family} data-door={d.family} data-locked={d.locked} data-open={open}>
          <rect x={x} y="250" width="56" height="100" className="fill-foreground/80" />
          <g className={`${MOVE} origin-left [transform-box:fill-box]`} style={{ transform: open ? "scaleX(0.25)" : "none" }}>
            <rect x={x} y="250" width="56" height="100" className="fill-surface stroke-muted-foreground" strokeWidth="1.5" />
            <circle cx={x + 46} cy="302" r="3" className="fill-muted-foreground" />
          </g>
          <text x={x + 28} y="282" textAnchor="middle" className={`${open ? "fill-background" : "fill-foreground"} font-mono text-[26px] font-semibold`}>{i + 1}</text>
          {d.locked ? <g aria-hidden="true" className="fill-none stroke-foreground" strokeWidth="2.5">
            <path d={`M${x + 21} 314v-5a7 7 0 0 1 14 0v5`} />
            <rect x={x + 17} y="314" width="22" height="16" rx="2" className="fill-foreground" />
          </g> : null}
          <circle cx={x + 28} cy="238" r="7" className={`transition-colors duration-500 motion-reduce:transition-none ${review ? "fill-info" : "fill-foreground/15"}`} />
          {d.marks.map((m, row) => {
            const cx = x + (row % 2) * 30, cy = 196 - Math.floor(row / 2) * 30;
            return <g key={row} data-mark={m}>
              <rect x={cx} y={cy} width="26" height="26" rx="4" className={MARK[m].fill} />
              <text x={cx + 13} y={cy + 19} textAnchor="middle" className="fill-background text-[19px] font-bold">{MARK[m].symbol}</text>
            </g>;
          })}
        </g>;
      })}
      {!reduced ? <g aria-hidden="true" className={MOVE} style={{ transform: `translateX(${at < 0 ? 20 : doorX(at) - 15}px)` }} data-visitor>
        <circle cx="0" cy="300" r="9" className="fill-muted-foreground" />
        <rect x="-8" y="311" width="16" height="30" rx="5" className="fill-muted-foreground" />
      </g> : null}
    </svg>
    <ol aria-label={copy.doorsLabel} className="mt-4 grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
      {doors.map((d, i) => <li key={d.family} className="flex min-w-0 items-baseline gap-2">
        <span className="w-4 shrink-0 font-mono font-semibold">{i + 1}</span>
        <span className="min-w-0 flex-1">{families[d.family]} <span className="text-muted-foreground">· {d.locked ? copy.locked : copy.unlocked}</span></span>
        <span className="shrink-0 font-mono font-bold">{d.marks.map((m, k) => <span key={k} className={MARK[m].text} title={copy.tape[LABEL[m]]}><span aria-hidden="true">{MARK[m].symbol}</span><span className="sr-only">{copy.tape[LABEL[m]]}. </span></span>)}</span>
      </li>)}
    </ol>
    <div className="mt-6">
      <OutcomeTape cells={cells} labels={copy.tape} ariaLabel={copy.tapeLabel} columns={12} />
      <p className="mt-4 font-mono text-2xl font-semibold tracking-tight">{copy.throughOf(through)}</p>
    </div>
  </StoryStage>;
}
