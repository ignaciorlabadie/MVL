import { fetchVentas, crearVenta, fetchColores, fetchPrecios } from "./lib/api.js";

const selectTipo = document.getElementById("venta-tipo") as HTMLSelectElement;
const selectColor = document.getElementById("venta-color") as HTMLSelectElement;
const inputPrecio = document.getElementById("venta-precio") as HTMLInputElement;
const tbody = document.querySelector("#tabla-ventas tbody")!;

async function init() {
  const [colores, preciosBase, ventas] = await Promise.all([
    fetchColores(),
    fetchPrecios(),
    fetchVentas(),
  ]);

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

    await crearVenta(tipo === "pulsera" ? `Pulsera ${color}` : `Anillo ${color}`, precio, color, tipo, cantidad);

    (e.target as HTMLFormElement).reset();
    selectTipo.value = "";
    selectColor.innerHTML = `<option value="">Seleccionar...</option>` +
      colores.map((c) => `<option value="${c}">${c}</option>`).join("");
    inputPrecio.value = "";
    render(await fetchVentas());
  });

  render(ventas);
}

function render(ventas: Awaited<ReturnType<typeof fetchVentas>>) {
  tbody.innerHTML = ventas.map((v) =>
    `<tr>
      <td>${v.productos.nombre}</td>
      <td>${v.cantidad}</td>
      <td class="fecha-cell">${new Date(v.fecha).toLocaleDateString()}</td>
    </tr>`
  ).join("");
}

init();
