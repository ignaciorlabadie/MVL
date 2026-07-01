import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { password } = req.body;
  const appPasswords = (process.env.APP_PASSWORD || "").split(",");
  const jwtSecret = process.env.JWT_SECRET;

  if (!appPasswords.length || !jwtSecret) {
    return res.status(500).json({ error: "Servidor mal configurado" });
  }

  if (!appPasswords.includes(password)) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "7d" });
  res.json({ token });
}
