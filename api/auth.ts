import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { password } = req.body;
  const appPassword = process.env.APP_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!appPassword || !jwtSecret) {
    return res.status(500).json({ error: "Servidor mal configurado" });
  }

  if (password !== appPassword) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "7d" });
  res.json({ token });
}
