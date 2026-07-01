const AUTH_KEY = "mvl_token";

export function getToken(): string | null {
  return localStorage.getItem(AUTH_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(AUTH_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(AUTH_KEY);
}

export function estaAutenticado(): boolean {
  return !!getToken();
}

export function verificarAuth() {
  if (!estaAutenticado()) {
    window.location.href = "/login.html";
  }
}

export async function login(password: string): Promise<boolean> {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  setToken(data.token);
  return true;
}

export function logout() {
  clearToken();
  window.location.href = "/login.html";
}
