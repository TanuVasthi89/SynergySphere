// src/hooks/useAuthUser.ts
import { useEffect, useState } from "react";

function toDisplayName(email?: string | null) {
  if (!email) return "User";
  const raw = email.split("@")[0] || "User";
  // turn "john_doe-42" -> "John Doe 42"
  return raw
    .replace(/[_\-.]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function useAuthUser() {
  const [email, setEmail] = useState<string | null>(() => {
    // prefer user.email if present, else fallback to plain "email"
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u?.email) return u.email as string;
      } catch {}
    }
    return localStorage.getItem("email");
  });

  useEffect(() => {
    const handler = () => {
      // keep in sync across tabs/windows or later updates
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u?.email) return setEmail(u.email);
        } catch {}
      }
      setEmail(localStorage.getItem("email"));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return {
    email: email || "",
    name: toDisplayName(email),
    initial: (toDisplayName(email)[0] || "U").toUpperCase(),
  };
}
