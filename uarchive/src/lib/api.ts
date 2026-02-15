const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";

type LoginRequest = {
  username: string;
  password: string;
};

type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export async function postLogin(data: LoginRequest) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    let message: any = err?.detail ?? err?.message ?? res.statusText;
    if (Array.isArray(message)) {
      message = message
        .map((e: any) => {
          if (e.loc) return `${e.loc.join(".")}: ${e.msg || JSON.stringify(e)}`;
          return e.msg || JSON.stringify(e);
        })
        .join("; ");
    }
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }
  return res.json();
}

export async function postRegister(data: RegisterRequest) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    let message: any = err?.detail ?? err?.message ?? res.statusText;
    if (Array.isArray(message)) {
      message = message
        .map((e: any) => {
          if (e.loc) return `${e.loc.join(".")}: ${e.msg || JSON.stringify(e)}`;
          return e.msg || JSON.stringify(e);
        })
        .join("; ");
    }
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }
  return res.json();
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}
