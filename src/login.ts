import { login } from "./lib/auth.js";

document.getElementById("login-form")!.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = (document.getElementById("login-password") as HTMLInputElement).value;
  const errEl = document.getElementById("login-error")!;

  const ok = await login(password);
  if (ok) {
    window.location.href = "/";
  } else {
    errEl.style.display = "block";
  }
});
