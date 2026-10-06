const COPY: Record<string, { en: string; es: string }> = {
  "batch.1": { en: "attacks 1 to 3 tried", es: "ataques 1 a 3 probados" },
  "batch.2": { en: "attacks 4 to 6 tried", es: "ataques 4 a 6 probados" },
  "batch.3": { en: "attacks 7 to 9 tried", es: "ataques 7 a 9 probados" },
  "batch.4": { en: "attacks 10 to 12 tried", es: "ataques 10 a 12 probados" },
};
export function traceCopy(locale: "en" | "es", key: string) { return COPY[key]?.[locale] ?? key; }
