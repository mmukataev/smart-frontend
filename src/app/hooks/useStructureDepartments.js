import { useState, useEffect } from 'react';

export default function useStructureDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDepartments() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/departments/`);
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const data = await res.json();

        // Сортируем по id, если нужен порядок
        const sortedData = data.sort((a, b) => a.id - b.id);
        setDepartments(sortedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDepartments();
  }, []);

  return { departments, loading, error };
}
