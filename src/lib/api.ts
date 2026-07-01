const BASE = "/api";

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

export interface ColorDTO {
  nombre: string;
}

export interface PreciosDTO {
  pulsera: number;
  anillo: number;
}

export async function fetchVentas(): Promise<VentaDTO[]> {
  const res = await fetch(`${BASE}/ventas`);
  if (!res.ok) throw new Error("Error al cargar ventas");
  return res.json();
}

export async function crearVenta(
  nombre: string,
  precio: number,
  color: string,
  tipo: "pulsera" | "anillo",
  cantidad: number
): Promise<void> {
  const res = await fetch(`${BASE}/ventas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, precio, color, tipo, cantidad }),
  });
  if (!res.ok) throw new Error("Error al registrar venta");
}

export async function fetchColores(): Promise<string[]> {
  const res = await fetch(`${BASE}/colores`);
  if (!res.ok) throw new Error("Error al cargar colores");
  const data: ColorDTO[] = await res.json();
  return data.map((c) => c.nombre);
}

export async function agregarColor(color: string): Promise<void> {
  const res = await fetch(`${BASE}/colores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: color }),
  });
  if (!res.ok) throw new Error("Error al agregar color");
}

export async function fetchPrecios(): Promise<PreciosDTO> {
  const res = await fetch(`${BASE}/precios`);
  if (!res.ok) throw new Error("Error al cargar precios");
  return res.json();
}

export async function guardarPrecios(precios: PreciosDTO): Promise<void> {
  const res = await fetch(`${BASE}/precios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(precios),
  });
  if (!res.ok) throw new Error("Error al guardar precios");
}
