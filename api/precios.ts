import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_supabase.js";
import { error, validarNumero } from "./_validar.js";
import { verificarToken } from "./_auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verificarToken(req, res)) return;
  if (req.method === "GET") {
    const { data, error: err } = await supabase.from("precios_base").select("*");
    if (err) return error(res, err.message);
    const map: Record<string, number> = {};
    for (const row of data) map[row.tipo] = Number(row.precio);
    return res.json(map);
  }

  if (req.method === "POST") {
    const { pulsera, anillo } = req.body;
    if (!validarNumero(pulsera)) return error(res, "Precio de pulsera inválido");
    if (!validarNumero(anillo)) return error(res, "Precio de anillo inválido");

    const { error: err1 } = await supabase.from("precios_base").update({ precio: pulsera }).eq("tipo", "pulsera");
    if (err1) return error(res, err1.message);

    const { error: err2 } = await supabase.from("precios_base").update({ precio: anillo }).eq("tipo", "anillo");
    if (err2) return error(res, err2.message);

    return res.json({ ok: true });
  }

  return error(res, "Método no permitido", 405);
}
