import { useState } from 'react';
import axios from 'axios';

export const useAddComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addComment = async ({
    event_id = null,
    birthday_employee_id = null,
    birth_year = null,
    text = '',
  }) => {
    const employee_id = localStorage.getItem('employee_id');

    if (!employee_id || !text.trim()) {
      console.warn('Не хватает данных для добавления комментария');
      return null;
    }

    const payload = {
      employee_id,
      event_id,
      birthday_employee_id,
      birth_year,
      text: text.trim(),
    };

    console.log('📤 Отправка комментария (addComment):', payload);

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/comment/add/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (err) {
      console.error('Ошибка при добавлении комментария:', err);

      if (err.response) {
        console.error('Ответ от сервера:', err.response.data);
      } else {
        console.error('Сетевая ошибка или CORS проблема');
      }

      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    addComment,
    loading,
    error,
  };
};
