const ESTILOS = `
<style>
.toast-container {
  position: fixed; top: 1rem; right: 1rem; z-index: 9999;
  display: flex; flex-direction: column; gap: 0.5rem;
}
.toast {
  padding: 0.75rem 1rem; border-radius: 6px; color: #fff;
  font-size: 0.9rem; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease;
  max-width: 360px;
}
.toast.error { background: #d32f2f; }
.toast.success { background: #388e3c; }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
</style>`;

function initContainer() {
  if (document.querySelector(".toast-container")) return;
  const div = document.createElement("div");
  div.className = "toast-container";
  div.innerHTML = ESTILOS;
  document.body.prepend(div);
}

export function mostrarError(msg: string) {
  initContainer();
  const div = document.createElement("div");
  div.className = "toast error";
  div.textContent = msg;
  document.querySelector(".toast-container")!.appendChild(div);
  setTimeout(() => div.remove(), 5000);
}

export function mostrarExito(msg: string) {
  initContainer();
  const div = document.createElement("div");
  div.className = "toast success";
  div.textContent = msg;
  document.querySelector(".toast-container")!.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}
