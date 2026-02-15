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

export type ProblemCreateRequest = {
  courseId: string;
  title: string;
  description: string;
  tags?: string[];
  difficulty?: string;
  examType?: string;
};

export async function createProblem(data: ProblemCreateRequest) {
  const token = getAuthToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/problems`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? err?.message ?? res.statusText);
  }
  return res.json();
}

export type CourseSummary = {
  _id?: string;
  courseCode: string;
  courseName?: string;
  [k: string]: any;
};

export async function listCourses(): Promise<CourseSummary[]> {
  const token = getAuthToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/courses`, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? err?.message ?? res.statusText);
  }
  return res.json();
}
