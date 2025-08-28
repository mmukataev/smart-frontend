// hooks/useAuthorizedUser.ts
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://devapi-smart.apa.kz";

export function useAuthorizedUser() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/autorize/check`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Не авторизован");

        const data = await res.json();
        setUser(data);

        localStorage.setItem("authorized_user_data", JSON.stringify(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, error, loading };
}
