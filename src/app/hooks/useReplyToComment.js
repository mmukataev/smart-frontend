import { useState } from 'react';

export default function useReplyToComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
const employeeId = localStorage.getItem('employee_id');
  const replyToComment = async ({
    eventId = null,
    birth_year = null,
    birthday_employee_id = null,
    parentCommentId,
    text
  }) => {
    setLoading(true);
    setError(null);

    const payload = {
    birthday_employee_id,
      event_id: eventId,
      birth_year: birth_year,
      employee_id: employeeId,
      comment_id: parentCommentId,
      text: text,
    };
    console.log('📤 Отправка комментария (replyToComment):', payload);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/comment/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Ошибка при ответе на комментарий:', err);
      setError(err.message || 'Произошла ошибка');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { replyToComment, loading, error };
}
