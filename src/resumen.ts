import { fetchVentas } from "./lib/api.js";
import { verificarAuth, logout } from "./lib/auth.js";
import { mostrarError } from "./lib/toast.js";

verificarAuth();
document.getElementById("btn-logout")!.addEventListener("click", (e) => { e.preventDefault(); logout(); });

interface Venta {
  productos: { nombre: string; precio: number; color: string; tipo: string };
  cantidad: number;
  fecha: string;
}

async function init() {
  try {
    const ventas = (await fetchVentas()) as unknown as Venta[];

    let totalGlobal = 0;
    const meses: Record<string, { pulseras: number; anillos: number; total: number }> = {};
    const pulserasPorColor: Record<string, { cantidad: number; total: number }> = {};
    const anillosPorColor: Record<string, { cantidad: number; total: number }> = {};

    for (const v of ventas) {
      const subtotal = v.productos.precio * v.cantidad;
      totalGlobal += subtotal;

      const fecha = v.fecha.split("T")[0];
      const mes = fecha.substring(0, 7);

      if (!meses[mes]) meses[mes] = { pulseras: 0, anillos: 0, total: 0 };
      meses[mes].total += subtotal;

      if (v.productos.tipo === "pulsera") {
        meses[mes].pulseras += v.cantidad;
        if (!pulserasPorColor[v.productos.color])
          pulserasPorColor[v.productos.color] = { cantidad: 0, total: 0 };
        pulserasPorColor[v.productos.color].cantidad += v.cantidad;
        pulserasPorColor[v.productos.color].total += subtotal;
      } else {
        meses[mes].anillos += v.cantidad;
        if (!anillosPorColor[v.productos.color])
          anillosPorColor[v.productos.color] = { cantidad: 0, total: 0 };
        anillosPorColor[v.productos.color].cantidad += v.cantidad;
        anillosPorColor[v.productos.color].total += subtotal;
      }
    }

    document.getElementById("total-global")!.textContent = `$${totalGlobal.toFixed(2)}`;

    const mesesOrdenados = Object.entries(meses).sort(([a], [b]) => a.localeCompare(b));
    const mesesTbody = document.querySelector("#tabla-meses tbody")!;
    mesesTbody.innerHTML = mesesOrdenados.map(([mes, d]) => {
      const [año, mesNum] = mes.split("-");
      const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const mesNombre = mesesNombres[parseInt(mesNum) - 1];
      return `<tr><td>${mesNombre} ${año}</td><td>${d.pulseras}</td><td>${d.anillos}</td><td>$${d.total.toFixed(2)}</td></tr>`;
    }).join("");

    function renderColorTable(
      containerId: string,
      data: Record<string, { cantidad: number; total: number }>
    ) {
      const tbody = document.querySelector(`${containerId} tbody`)!;
      tbody.innerHTML = Object.entries(data)
        .sort(([, a], [, b]) => b.cantidad - a.cantidad)
        .map(([color, d]) =>
          `<tr><td>${color}</td><td>${d.cantidad}</td><td>$${d.total.toFixed(2)}</td></tr>`
        ).join("") || `<tr><td colspan="3">Sin datos</td></tr>`;
    }

    renderColorTable("#tabla-pulseras-color", pulserasPorColor);
    renderColorTable("#tabla-anillos-color", anillosPorColor);

    document.getElementById("btn-exportar")!.addEventListener("click", () => {
      const rows = [["Mes", "Pulseras", "Anillos", "Total"]];
      for (const [mes, d] of mesesOrdenados) {
        rows.push([mes, d.pulseras.toString(), d.anillos.toString(), d.total.toFixed(2)]);
      }
      const csv = rows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resumen.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  } catch (err) {
    mostrarError(err instanceof Error ? err.message : "Error al cargar resumen");
  }
}

init();
