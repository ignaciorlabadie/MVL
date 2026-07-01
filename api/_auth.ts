import type { VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import { IncomingMessage } from "http";

export function verificarToken(req: IncomingMessage, res: VercelResponse): boolean {
  if (req.method === "OPTIONS") return true;
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Servidor mal configurado" });
    return false;
  }

  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token requerido" });
    return false;
  }

  try {
    jwt.verify(header.slice(7), secret);
    return true;
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
    return false;
  }
}
