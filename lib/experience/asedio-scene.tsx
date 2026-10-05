import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import { OutcomeBlock, StoryStage } from "@/design-system/demo/decision-lab";
import type { ExperienceInput, ExperienceResult } from "./adapter";

const outcomeCopy = (outcome: "pass" | "fail" | "needs-review", locale: "en" | "es") => {
  if (locale === "en") return outcome;
  return { pass: "pasa", fail: "falla", "needs-review": "requiere revisión" }[outcome];
};

const outcomeClass = (outcome: "pass" | "fail" | "needs-review") => ({
  pass: "border-success bg-success/10",
  fail: "border-danger bg-danger/10",
  "needs-review": "border-warning bg-warning/10",
}[outcome]);

export function AsedioScene({ frame, input, result, locale }: { frame: PlaybackFrame<TraceEvent>; input: ExperienceInput; result: ExperienceResult; locale: "en" | "es" }) {
  const es = locale === "es";

  return <StoryStage locale={locale} title={es ? "Matriz de defensa calculada" : "Computed defense matrix"} caption={es ? "Cada celda es una prueba local de la familia seleccionada." : "Each cell is a local test from the selected family."} step={frame.visible} total={frame.total}>
    <div role="img" aria-label={es ? "Matriz de ataques" : "Attack matrix"} className="grid grid-cols-2 gap-3">
      {result.results.map((item, index) => {
        const visible = index < frame.visible;
        return <div key={item.attackId} className={`rounded-lg border p-4 transition-all duration-500 ${visible ? outcomeClass(item.outcome) : "border-border bg-muted/40 text-muted-foreground"}`}>
          <b>{item.attackId}</b>
          <p>{visible ? outcomeCopy(item.outcome, locale) : (es ? "pendiente" : "pending")}</p>
        </div>;
      })}
    </div>
    {frame.complete && <OutcomeBlock tone={result.stats.fail > 0 ? "danger" : result.stats.needsReview > 0 ? "warning" : "success"} title={result.stats.fail > 0 ? (es ? "Exposición detectada" : "Exposure detected") : result.stats.needsReview > 0 ? (es ? "Revisión necesaria" : "Review required") : (es ? "Defensa aprobada" : "Defense passed")} explanation={es ? `${result.stats.fail} fallos y ${result.stats.needsReview} casos por revisar para ${input.target}.` : `${result.stats.fail} failures and ${result.stats.needsReview} review cases for ${input.target}.`} />}
  </StoryStage>;
}
