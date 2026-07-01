export function error(res: any, msg: string, status = 400) {
  return res.status(status).json({ error: msg });
}

const TIPOS = ["pulsera", "anillo"] as const;
export type Tipo = (typeof TIPOS)[number];

export function validarTipo(v: unknown): v is Tipo {
  return typeof v === "string" && TIPOS.includes(v as Tipo);
}

export function validarNumero(v: unknown, min = 0): v is number {
  return typeof v === "number" && !isNaN(v) && v >= min;
}

export function validarEntero(v: unknown, min = 1): v is number {
  return Number.isInteger(v) && (v as number) >= min;
}

export function validarTexto(v: unknown, minLen = 1, maxLen = 200): v is string {
  return typeof v === "string" && v.trim().length >= minLen && v.length <= maxLen;
}
