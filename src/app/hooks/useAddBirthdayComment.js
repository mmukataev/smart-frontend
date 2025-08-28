import { useState } from 'react';

export const useAddBirthdayComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addComment = async (birthdayEmployeeId, birthYear, text) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/birthday-comments/add/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthday_employee_id: birthdayEmployeeId,
          birth_year: birthYear,
          employee_id: localStorage.getItem('employee_id'), // если нужно
          text,
        }),
      });

      if (!res.ok) throw new Error('Ошибка при отправке');

      return true;
    } catch (err) {
      console.error(err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addComment, loading, error };
};
