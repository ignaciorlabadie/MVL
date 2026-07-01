import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("colores").select("nombre").order("nombre");
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === "POST") {
    const { nombre } = req.body;
    const { error } = await supabase.from("colores").insert({ nombre });
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ ok: true });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
