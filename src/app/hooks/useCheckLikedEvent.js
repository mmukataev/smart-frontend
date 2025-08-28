import { useState } from 'react';
import axios from 'axios';

export const useCheckLikedEvent = () => {
  const [loading, setLoading] = useState(false);
  const [likedMap, setLikedMap] = useState({}); // ключ может быть eventId или `${birthdayEmployeeId}_${birthYear}`
  const [error, setError] = useState(null);

  const checkLiked = async ({ eventId = null, birthdayEmployeeId = null, birthYear = null }) => {
    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId) return false;

    // определим тип лайка и ключ
    const isBirthdayLike = birthdayEmployeeId && birthYear;
    const key = isBirthdayLike ? `${birthdayEmployeeId}_${birthYear}` : eventId;

    if (!key) return false;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/liked/`,
        {
          params: {
            employee_id: employeeId,
            ...(eventId && { event_id: eventId }),
            ...(isBirthdayLike && {
              birthday_employee_id: birthdayEmployeeId,
              birth_year: birthYear,
            }),
          },
        }
      );

      const isLiked = response.data.liked === true;
      setLikedMap((prev) => ({ ...prev, [key]: isLiked }));
      return isLiked;
    } catch (err) {
      console.error('Ошибка при проверке лайка:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { checkLiked, likedMap, loading, error };
};
