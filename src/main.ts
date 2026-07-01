import { Producto, Pulsera, Anillo, Venta } from "./models/index.js";

const coloresIniciales = ["Dorado", "Plateado", "Oro Rosa", "Negro", "Blanco", "Rojo", "Azul", "Verde"];

const ventas: Venta[] = [];
const colores: string[] = [...coloresIniciales];
const preciosBase = { pulsera: 0, anillo: 0 };

// ---- Routing ----

const pages = document.querySelectorAll<HTMLElement>(".page");
const navLinks = document.querySelectorAll<HTMLAnchorElement>("nav a");

function mostrarPagina(hash: string) {
  const id = hash.replace("#", "") || "ventas";
  pages.forEach((p) => p.classList.toggle("active", p.id === `page-${id}`));
  navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
  if (id === "resumen") actualizarResumen();
}

function navegar(e: MouseEvent, href: string) {
  e.preventDefault();
  history.replaceState(null, "", href);
  mostrarPagina(href);
}

navLinks.forEach((l) => l.addEventListener("click", (e) => navegar(e, l.getAttribute("href")!)));
window.addEventListener("popstate", () => mostrarPagina(location.hash));
mostrarPagina(location.hash || "#ventas");

// ---- Venta form ----

const selectTipo = document.getElementById("venta-tipo") as HTMLSelectElement;
const selectColor = document.getElementById("venta-color") as HTMLSelectElement;
const inputPrecio = document.getElementById("venta-precio") as HTMLInputElement;
const tbodyVentas = document.querySelector("#tabla-ventas tbody")!;

function actualizarSelectColor() {
  selectColor.innerHTML = colores.map((c) => `<option value="${c}">${c}</option>`).join("");
}

selectTipo.addEventListener("change", () => {
  inputPrecio.value = preciosBase[selectTipo.value as "pulsera" | "anillo"]?.toString() || "";
});

document.getElementById("venta-form")!.addEventListener("submit", (e) => {
  e.preventDefault();

  const tipo = selectTipo.value;
  const color = selectColor.value;
  const precio = parseFloat(inputPrecio.value);
  const cantidad = parseInt((document.getElementById("venta-cantidad") as HTMLInputElement).value);

  const producto: Producto =
    tipo === "pulsera"
      ? new Pulsera(`Pulsera ${color}`, precio, color)
      : new Anillo(`Anillo ${color}`, precio, color);

  ventas.push(new Venta(producto, cantidad));

  (e.target as HTMLFormElement).reset();
  actualizarSelectColor();
  selectTipo.value = "pulsera";
  inputPrecio.value = preciosBase.pulsera?.toString() || "";
  actualizarTablaVentas();
});

function actualizarTablaVentas() {
  tbodyVentas.innerHTML = ventas.map((v) =>
    `<tr>
      <td>${v.id}</td>
      <td>${v.producto.nombre}</td>
      <td>${v.cantidad}</td>
      <td>$${v.total.toFixed(2)}</td>
      <td>${v.fecha.toLocaleString()}</td>
    </tr>`
  ).join("");
}

// ---- Config ----

document.getElementById("precios-form")!.addEventListener("submit", (e) => {
  e.preventDefault();
  preciosBase.pulsera = parseFloat((document.getElementById("precio-pulsera") as HTMLInputElement).value);
  preciosBase.anillo = parseFloat((document.getElementById("precio-anillo") as HTMLInputElement).value);
});

document.getElementById("color-form")!.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("nuevo-color") as HTMLInputElement;
  const color = input.value.trim();
  if (color && !colores.includes(color)) {
    colores.push(color);
    actualizarSelectColor();
  }
  input.value = "";
});

// ---- Resumen ----

function actualizarResumen() {
  const totalGlobal = ventas.reduce((s, v) => s + v.total, 0);
  document.getElementById("total-global")!.textContent = `$${totalGlobal.toFixed(2)}`;

  const meses = new Map<string, { total: number; cant: number }>();
  const pulseras = new Map<string, { total: number; cant: number }>();
  const anillos = new Map<string, { total: number; cant: number }>();

  for (const v of ventas) {
    const mes = `${v.fecha.getFullYear()}-${String(v.fecha.getMonth() + 1).padStart(2, "0")}`;
    const m = meses.get(mes) || { total: 0, cant: 0 };
    m.total += v.total;
    m.cant += v.cantidad;
    meses.set(mes, m);

    const mapa = v.producto instanceof Pulsera ? pulseras : anillos;
    const color = v.producto.color;
    const c = mapa.get(color) || { total: 0, cant: 0 };
    c.total += v.total;
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

// ---- Init ----

actualizarSelectColor();
