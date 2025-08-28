import { useEffect, useState } from 'react';
import axios from 'axios';

export const useHasLikedEvent = (eventId) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLike = async () => {
      try {
        setLoading(true);
        const employeeId = localStorage.getItem('employee_id');

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/liked/`, {
          params: {
            event_id: eventId,
            employee_id: employeeId,
          },
        });

        setHasLiked(response.data.liked);
      } catch (err) {
        console.error("Ошибка при проверке лайка:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      checkLike();
    }
  }, [eventId]);

  return { hasLiked, loading, error };
};
