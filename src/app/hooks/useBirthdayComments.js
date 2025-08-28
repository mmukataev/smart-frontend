// hooks/useBirthdayComments.js
import { useState, useEffect } from 'react';

export function useBirthdayComments(birthdayEmployeeId, birthYear) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    if (!birthdayEmployeeId || !birthYear) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/birthday-comments/?birthday_employee_id=${birthdayEmployeeId}&birth_year=${birthYear}`
      );

      if (!res.ok) {
        const text = await res.text();
        console.error('Ошибка API:', text);
        throw new Error(`Ошибка загрузки комментариев (${res.status})`);
      }

      const data = await res.json();
      setComments(data);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки комментариев');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [birthdayEmployeeId, birthYear]);

  return { comments, loading, error, refetch: fetchComments };
}
