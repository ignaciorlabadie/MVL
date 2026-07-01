import { getToken } from "./auth.js";

const BASE = "/api";

function headers(): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

export interface VentaDTO {
  id: number;
  producto_id: number;
  cantidad: number;
  fecha: string;
  productos: {
    id: number;
    nombre: string;
    precio: number;
    color: string;
    tipo: "pulsera" | "anillo";
  };
}

export async function fetchVentas(): Promise<VentaDTO[]> {
  const res = await fetch(`${BASE}/ventas`, { headers: headers() });
  if (res.status === 401) { window.location.href = "/login.html"; throw new Error("No autorizado"); }
  if (!res.ok) throw new Error("Error al cargar ventas");
  return res.json();
}

export async function crearVenta(
  nombre: string, precio: number, color: string,
  tipo: "pulsera" | "anillo", cantidad: number, fecha?: string
): Promise<void> {
  const res = await fetch(`${BASE}/ventas`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ nombre, precio, color, tipo, cantidad, fecha }),
  });
  if (res.status === 401) { window.location.href = "/login.html"; return; }
  if (!res.ok) {
    const msg = await res.json().then((d) => d.error).catch(() => "Error al registrar venta");
    throw new Error(msg);
  }
}

export async function eliminarVenta(id: number): Promise<void> {
  const res = await fetch(`${BASE}/ventas`, {
    method: "DELETE",
    headers: headers(),
    body: JSON.stringify({ id }),
  });
  if (res.status === 401) { window.location.href = "/login.html"; return; }
  if (!res.ok) throw new Error("Error al eliminar venta");
}

export async function fetchColores(): Promise<string[]> {
  const res = await fetch(`${BASE}/colores`, { headers: headers() });
  if (res.status === 401) { window.location.href = "/login.html"; throw new Error("No autorizado"); }
  if (!res.ok) throw new Error("Error al cargar colores");
  const data: { nombre: string }[] = await res.json();
  return data.map((c) => c.nombre);
}

export async function agregarColor(color: string): Promise<void> {
  const res = await fetch(`${BASE}/colores`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ nombre: color }),
  });
  if (res.status === 401) { window.location.href = "/login.html"; return; }
  if (!res.ok) throw new Error("Error al agregar color");
}

export async function fetchPrecios(): Promise<{ pulsera: number; anillo: number }> {
  const res = await fetch(`${BASE}/precios`, { headers: headers() });
  if (res.status === 401) { window.location.href = "/login.html"; throw new Error("No autorizado"); }
  if (!res.ok) throw new Error("Error al cargar precios");
  return res.json();
}

export async function guardarPrecios(precios: { pulsera: number; anillo: number }): Promise<void> {
  const res = await fetch(`${BASE}/precios`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(precios),
  });
  if (res.status === 401) { window.location.href = "/login.html"; return; }
  if (!res.ok) throw new Error("Error al guardar precios");
}
