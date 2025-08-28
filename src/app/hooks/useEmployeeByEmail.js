'use client';

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://devapi-smart.apa.kz";

export default function useEmployeeByEmail(initialEmail) {
  const [email, setEmail] = useState(initialEmail);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!email) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/employee-by-email/?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("Ошибка при получении данных");
        const data = await res.json();
        setEmployee(data);
      } catch (err) {
        console.error("Ошибка при загрузке сотрудника:", err);
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [email]);

  return {
    employee,
    loading,
    email,
    setEmail,
    fullName: employee?.fio || '',
    imageUrl: employee?.photo || '/default.png',
  };
}
