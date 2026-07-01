import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const { nombre, precio, color, tipo, cantidad } = req.body;

    const { data: prod, error: err1 } = await supabase
      .from("productos")
      .insert({ nombre, precio, color, tipo })
      .select()
      .single();

    if (err1) return res.status(400).json({ error: err1.message });

    const { error: err2 } = await supabase
      .from("ventas")
      .insert({ producto_id: prod.id, cantidad });

    if (err2) return res.status(400).json({ error: err2.message });

    return res.status(201).json({ ok: true });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("ventas")
      .select("*, productos(*)")
      .order("id", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  }

  return res.status(405).json({ error: "Método no permitido" });
}
