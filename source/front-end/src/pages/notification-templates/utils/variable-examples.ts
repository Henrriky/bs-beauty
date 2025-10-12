import { NotificationTemplate } from "../../../store/notification-template/types";

export type ExampleVariables = Record<string, string>;

function normalizeKey(key: string | undefined | null) {
  return (key ?? "").toLowerCase().replace(/[\s\-_.]+/g, "");
}

const VARIABLE_EXAMPLES_BY_KEY: Record<string, ExampleVariables> = {
  birthday: {
    nome: "João Silva",
    idade: "25",
    empresa: "BS Beauty",
    data_aniversário: "15/10/2025",
    customerName: "João Silva",
  },
};

const KEY_ALIASES: Array<[RegExp, string]> = [
  [/birthday/i, "birthday"],
  [/appointment.*(upcoming|reminder)/i, "appointmentupcoming"],
  [/appointment.*(confirm|confirmation)/i, "appointmentconfirmation"],
  [/appointment.*(cancel|canceled|cancelled)/i, "appointmentcanceled"],
];

const GENERIC_FALLBACK: ExampleVariables = {
  nome: "João Silva",
  customerName: "João Silva",
  empresa: "BS Beauty",
  businessName: "BS Beauty",
  businessPhone: "(11) 99999-9999",
  date: "15/10/2025",
  time: "14:30",
};

function resolveBaseKeyFromTemplateKey(key?: string | null): string | null {
  if (!key) return null;
  for (const [pattern, base] of KEY_ALIASES) {
    if (pattern.test(key)) return base;
  }
  const normalized = normalizeKey(key);
  return VARIABLE_EXAMPLES_BY_KEY[normalized] ? normalized : null;
}

export function buildExampleVariables(
  template: NotificationTemplate | null | undefined
): ExampleVariables {
  if (!template) return {};

  const baseKey = resolveBaseKeyFromTemplateKey(template.key);
  const base =
    (baseKey ? VARIABLE_EXAMPLES_BY_KEY[baseKey] : null) ?? GENERIC_FALLBACK;

  const result: ExampleVariables = { ...base };

  (template.variables ?? []).forEach((v) => {
    if (!(v in result)) {
      if (/date|data/i.test(v)) result[v] = "15/10/2025";
      else if (/time|hora/i.test(v)) result[v] = "14:30";
      else if (/name|nome/i.test(v)) result[v] = "João Silva";
      else result[v] = `[${v}]`;
    }
  });

  return result;
}
