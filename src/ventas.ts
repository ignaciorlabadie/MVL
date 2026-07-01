import { fetchVentas, crearVenta, fetchColores, fetchPrecios, eliminarVenta } from "./lib/api.js";
import { verificarAuth, logout } from "./lib/auth.js";
import { mostrarError, mostrarExito } from "./lib/toast.js";

verificarAuth();
document.getElementById("btn-logout")!.addEventListener("click", (e) => { e.preventDefault(); logout(); });

const selectTipo = document.getElementById("venta-tipo") as HTMLSelectElement;
const selectColor = document.getElementById("venta-color") as HTMLSelectElement;
const inputPrecio = document.getElementById("venta-precio") as HTMLInputElement;
const inputFecha = document.getElementById("venta-fecha") as HTMLInputElement;
const tbody = document.querySelector("#tabla-ventas tbody")!;

async function init() {
  try {
    const [colores, preciosBase, ventas] = await Promise.all([
      fetchColores(), fetchPrecios(), fetchVentas(),
    ]);

    inputFecha.value = new Date().toISOString().split("T")[0];

    selectColor.innerHTML = `<option value="">Seleccionar...</option>` +
      colores.map((c) => `<option value="${c}">${c}</option>`).join("");

    function actualizarPrecio() {
      if (!selectTipo.value) { inputPrecio.value = ""; return; }
      const p = preciosBase[selectTipo.value as "pulsera" | "anillo"];
      inputPrecio.value = p && p > 0 ? p.toString() : "";
    }

    selectTipo.addEventListener("change", actualizarPrecio);

    document.getElementById("venta-form")!.addEventListener("submit", async (e) => {
      e.preventDefault();

      const tipo = selectTipo.value as "pulsera" | "anillo";
      const color = selectColor.value;
      const precio = parseFloat(inputPrecio.value);
      const cantidad = parseInt((document.getElementById("venta-cantidad") as HTMLInputElement).value);
      const fecha = inputFecha.value;

      if (isNaN(precio) || precio < 0 || isNaN(cantidad) || cantidad < 1) return;

      try {
        await crearVenta(
          tipo === "pulsera" ? `Pulsera ${color}` : `Anillo ${color}`,
          precio, color, tipo, cantidad, fecha
        );
        mostrarExito("Venta registrada");

        (e.target as HTMLFormElement).reset();
        selectTipo.value = "";
        selectColor.innerHTML = `<option value="">Seleccionar...</option>` +
          colores.map((c) => `<option value="${c}">${c}</option>`).join("");
        inputFecha.value = new Date().toISOString().split("T")[0];
        render(await fetchVentas());
      } catch (err) {
        mostrarError(err instanceof Error ? err.message : "Error al registrar venta");
      }
    });

    render(ventas);
  } catch (err) {
    mostrarError(err instanceof Error ? err.message : "Error al cargar datos");
  }
}

function render(ventas: Awaited<ReturnType<typeof fetchVentas>>) {
  tbody.innerHTML = ventas.map((v) => {
    const [año, mes, día] = v.fecha.split("T")[0].split("-");
    return `<tr>
      <td>${v.productos.nombre}</td>
      <td>${v.cantidad}</td>
      <td class="fecha-cell">${día}/${mes}/${año}</td>
      <td><button class="btn-delete" data-id="${v.id}">✕</button></td>
    </tr>`;
  }).join("");

  tbody.querySelectorAll(".btn-delete").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const id = parseInt((btn as HTMLElement).dataset.id!);
      if (!confirm("¿Eliminar esta venta?")) return;
      try {
        await eliminarVenta(id);
        mostrarExito("Venta eliminada");
        render(await fetchVentas());
      } catch {
        mostrarError("Error al eliminar venta");
      }
    })
  );
}

init();
