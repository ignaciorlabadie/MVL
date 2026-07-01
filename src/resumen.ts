import { fetchVentas } from "./lib/api.js";

async function init() {
  const ventas = await fetchVentas();

  const totalGlobal = ventas.reduce((s, v) => s + Number(v.productos.precio) * v.cantidad, 0);
  document.getElementById("total-global")!.textContent = `$${totalGlobal.toFixed(2)}`;

  const meses = new Map<string, { total: number; cant: number }>();
  const pulseras = new Map<string, { total: number; cant: number }>();
  const anillos = new Map<string, { total: number; cant: number }>();

  for (const v of ventas) {
    const [año, mes] = v.fecha.split("T")[0].split("-");
    const mesKey = `${año}-${mes}`;
    const subtotal = Number(v.productos.precio) * v.cantidad;

    const m = meses.get(mesKey) || { total: 0, cant: 0 };
    m.total += subtotal;
    m.cant += v.cantidad;
    meses.set(mesKey, m);

    const mapa = v.productos.tipo === "pulsera" ? pulseras : anillos;
    const color = v.productos.color;
    const c = mapa.get(color) || { total: 0, cant: 0 };
    c.total += subtotal;
    c.cant += v.cantidad;
    mapa.set(color, c);
  }

  document.querySelector("#tabla-meses tbody")!.innerHTML = [...meses.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, d]) => `<tr><td>${mes}</td><td>$${d.total.toFixed(2)}</td><td>${d.cant}</td></tr>`)
    .join("");

  function tablaColor(mapa: Map<string, { total: number; cant: number }>, id: string) {
    document.querySelector(`#${id} tbody`)!.innerHTML = [...mapa.entries()]
      .sort(([, a], [, b]) => b.cant - a.cant)
      .map(([color, d]) => `<tr><td>${color}</td><td>${d.cant}</td><td>$${d.total.toFixed(2)}</td></tr>`)
      .join("");
  }

  tablaColor(pulseras, "tabla-pulseras-color");
  tablaColor(anillos, "tabla-anillos-color");
}

init();
