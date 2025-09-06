// src/lib/auth.ts
export type AuthUser = {
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
};

const USER_KEY = "user";
const TOKEN_KEY = "token";
const USER_EVENT = "user-updated";

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveAuth(token: string | null, user: AuthUser | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);

  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);

  // let the app know user info changed (same-tab safe)
  window.dispatchEvent(new Event(USER_EVENT));
}

export function clearAuth() {
  saveAuth(null, null);
}

export const USER_UPDATED_EVENT = USER_EVENT;
