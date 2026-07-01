import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_supabase.js";
import { error, validarTexto } from "./_validar.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const { data, error: err } = await supabase.from("colores").select("nombre").order("nombre");
    if (err) return error(res, err.message);
    return res.json(data);
  }

  if (req.method === "POST") {
    const { nombre } = req.body;
    if (!validarTexto(nombre)) return error(res, "Nombre de color inválido");

    const { error: err } = await supabase.from("colores").insert({ nombre: nombre.trim() });
    if (err) return error(res, err.message);
    return res.status(201).json({ ok: true });
  }

  return error(res, "Método no permitido", 405);
}
