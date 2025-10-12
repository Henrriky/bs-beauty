export const PLACEHOLDER_REGEX = /\{([\p{L}\p{M}\p{N}_]{1,64})\}/gu;

export function extractPlaceholders(text: string): string[] {
  if (!text) return [];
  return Array.from(text.matchAll(PLACEHOLDER_REGEX), m => m[1]);
}

export function replacePlaceholders(
  text: string,
  values: Record<string, string | number>
): string {
  if (!text) return text;
  return text.replace(PLACEHOLDER_REGEX, (_m, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : `{${key}}`
  );
}

export function renderTemplate(
  title: string,
  body: string,
  values: Record<string, string | number>
): { title: string; body: string } {
  return {
    title: replacePlaceholders(title, values),
    body: replacePlaceholders(body, values),
  };
}

export function expectedVarsOf(tpl: { variables?: unknown; title: string; body: string }): string[] {
  const column = asStringArray(tpl.variables);
  if (column.length > 0) return column;

  const fromTitle = extractPlaceholders(tpl.title);
  const fromBody = extractPlaceholders(tpl.body);
  return unique([...fromTitle, ...fromBody]);
}

export function validateVars(
  expected: string[],
  provided: Record<string, unknown>
): { ok: boolean; missing: string[]; extra: string[] } {
  const exp = new Set(expected);
  const got = new Set(Object.keys(provided));
  const missing = [...exp].filter(k => !got.has(k));
  const extra = [...got].filter(k => !exp.has(k));
  return { ok: missing.length === 0, missing, extra };
}

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

function asStringArray(json: unknown): string[] {
  return Array.isArray(json) && json.every(v => typeof v === 'string') ? (json as string[]) : [];
}
