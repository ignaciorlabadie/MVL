import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_supabase.js";
import { error, validarTipo, validarNumero, validarEntero, validarTexto } from "./_validar.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const { nombre, precio, color, tipo, cantidad } = req.body;

    if (!validarTexto(nombre)) return error(res, "Nombre inválido");
    if (!validarNumero(precio)) return error(res, "Precio inválido");
    if (!validarTexto(color)) return error(res, "Color inválido");
    if (!validarTipo(tipo)) return error(res, "Tipo inválido (pulsera o anillo)");
    if (!validarEntero(cantidad)) return error(res, "Cantidad inválida");

    const { data: prod, error: err1 } = await supabase
      .from("productos")
      .insert({ nombre: nombre.trim(), precio, color: color.trim(), tipo })
      .select()
      .single();

    if (err1) return error(res, err1.message);

    const { error: err2 } = await supabase
      .from("ventas")
      .insert({ producto_id: prod.id, cantidad });

    if (err2) return error(res, err2.message);

    return res.status(201).json({ ok: true });
  }

  if (req.method === "GET") {
    const { data, error: err } = await supabase
      .from("ventas")
      .select("*, productos(*)")
      .order("id", { ascending: false });

    if (err) return error(res, err.message);
    return res.json(data);
  }

  return error(res, "Método no permitido", 405);
}
