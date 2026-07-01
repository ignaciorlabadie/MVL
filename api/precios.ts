import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("precios_base").select("*");
    if (error) return res.status(400).json({ error: error.message });
    const map: Record<string, number> = {};
    for (const row of data) map[row.tipo] = Number(row.precio);
    return res.json(map);
  }

  if (req.method === "POST") {
    const { pulsera, anillo } = req.body;
    const { error: err1 } = await supabase
      .from("precios_base")
      .update({ precio: pulsera })
      .eq("tipo", "pulsera");
    if (err1) return res.status(400).json({ error: err1.message });

    const { error: err2 } = await supabase
      .from("precios_base")
      .update({ precio: anillo })
      .eq("tipo", "anillo");
    if (err2) return res.status(400).json({ error: err2.message });

    return res.json({ ok: true });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
