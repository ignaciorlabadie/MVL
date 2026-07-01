import { fetchColores, agregarColor, fetchPrecios, guardarPrecios } from "./lib/api.js";
import { verificarAuth, logout } from "./lib/auth.js";
import { mostrarError, mostrarExito } from "./lib/toast.js";

verificarAuth();
document.getElementById("btn-logout")!.addEventListener("click", (e) => { e.preventDefault(); logout(); });

const spanPulsera = document.getElementById("precio-pulsera-actual")!;
const spanAnillo = document.getElementById("precio-anillo-actual")!;

function mostrarPrecios(precios: { pulsera: number; anillo: number }) {
  spanPulsera.textContent = precios.pulsera.toFixed(2);
  spanAnillo.textContent = precios.anillo.toFixed(2);
}

async function init() {
  try {
    const [colores, preciosBase] = await Promise.all([fetchColores(), fetchPrecios()]);
    mostrarPrecios(preciosBase);

    (document.getElementById("precio-pulsera") as HTMLInputElement).value = preciosBase.pulsera?.toString() || "";
    (document.getElementById("precio-anillo") as HTMLInputElement).value = preciosBase.anillo?.toString() || "";

    document.getElementById("precios-form")!.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const precios = {
          pulsera: parseFloat((document.getElementById("precio-pulsera") as HTMLInputElement).value),
          anillo: parseFloat((document.getElementById("precio-anillo") as HTMLInputElement).value),
        };
        await guardarPrecios(precios);
        mostrarPrecios(precios);
        mostrarExito("Precios actualizados");
      } catch {
        mostrarError("Error al guardar precios");
      }
    });

    const listaColores = document.getElementById("lista-colores")!;
    listaColores.innerHTML = colores.map((c) => `<li>${c}</li>`).join("");

    document.getElementById("color-form")!.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = document.getElementById("nuevo-color") as HTMLInputElement;
      const color = input.value.trim();
      if (!color) return;
      try {
        await agregarColor(color);
        listaColores.innerHTML += `<li>${color}</li>`;
        input.value = "";
        mostrarExito("Color agregado");
      } catch {
        mostrarError("Error al agregar color");
      }
    });
  } catch (err) {
    mostrarError(err instanceof Error ? err.message : "Error al cargar configuración");
  }
}

init();
