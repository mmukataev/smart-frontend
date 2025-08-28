import { useState, useEffect } from 'react';
import axios from 'axios';

export const useLikeEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likedMap, setLikedMap] = useState({}); // Ключ: eventId или `${birthdayEmployeeId}_${birthYear}`

  // Загружаем лайки из localStorage при первом рендере
  useEffect(() => {
    const storedLikes = localStorage.getItem('liked_events_map');
    if (storedLikes) {
      setLikedMap(JSON.parse(storedLikes));
    }
  }, []);

  // Сохраняем при изменении
  useEffect(() => {
    localStorage.setItem('liked_events_map', JSON.stringify(likedMap));
  }, [likedMap]);

  const likeEvent = async ({ eventId = null, birthdayEmployeeId = null, birthYear = null }) => {
    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId) return null;

    const isBirthdayLike = birthdayEmployeeId && birthYear;
    const key = isBirthdayLike ? `${birthdayEmployeeId}_${birthYear}` : eventId;
    if (!key) return null;

    try {
      setLoading(true);
      setError(null);

      const payload = {
        employee_id: employeeId,
        ...(eventId && { event_id: eventId }),
        ...(isBirthdayLike && {
          birthday_employee_id: birthdayEmployeeId,
          birth_year: birthYear,
        }),
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/like/`,
        payload
      );

      const result = response.data;

      if (result.message === 'Liked successfully') {
        setLikedMap((prev) => ({ ...prev, [key]: true }));
      } else if (result.message === 'Unliked successfully') {
        setLikedMap((prev) => ({ ...prev, [key]: false }));
      }

      return result;
    } catch (err) {
      console.error('Ошибка при лайке:', err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { likeEvent, likedMap, loading, error };
};
