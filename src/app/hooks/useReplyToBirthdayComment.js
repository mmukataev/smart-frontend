import { useState } from 'react';

export default function useReplyToBirthdayComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const replyToComment = async ({ birthdayEmployeeId, birthYear, parentCommentId, text }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/birthday-comments/reply/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            birthday_employee_id: birthdayEmployeeId,
            birth_year: birthYear,
            parent_comment_id: parentCommentId,
            text,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Ошибка при ответе');
      }

      return true;
    } catch (err) {
      console.error('Reply error:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { replyToComment, loading, error };
}
