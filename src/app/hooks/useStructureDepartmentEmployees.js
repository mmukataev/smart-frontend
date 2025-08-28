"use client";

import { useState, useEffect } from 'react';

export default function useStructureDepartmentEmployees(departmentId) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Если departmentId не задан — не делаем запрос
    if (!departmentId) return;

    async function fetchEmployees() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/department/${departmentId}/`);
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const data = await res.json();

        // Если нужно сортировать, например, по id
        const sortedData = data.sort((a, b) => a.id - b.id);
        setEmployees(sortedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, [departmentId]); // запрос при изменении departmentId

  return { employees, loading, error };
}
