'use client';

import { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, parse } from 'date-fns';

export const useCalendarData = (locale) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), 'dd.MM.yyyy');
  const [selectedDate, setSelectedDate] = useState(today);

  const selected = parse(selectedDate, 'dd.MM.yyyy', new Date());
  const currentWeekStart = startOfWeek(selected, { weekStartsOn: 1 });
  const currentWeekEnd = addDays(currentWeekStart, 6);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const defaultDate = weekDays.find(d => format(d, 'dd.MM.yyyy') === today)
    ? today
    : format(weekDays[0], 'dd.MM.yyyy');

  useEffect(() => {
    const fetchEventsAndBirthdays = async () => {
      try {
        setLoading(true);
        const parsed = parse(selectedDate, 'dd.MM.yyyy', new Date());
        const formatted = format(parsed, 'yyyy-MM-dd');

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/with-birthdays/?date=${formatted}`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setEvents({ events: [], birthdays: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndBirthdays();
  }, [selectedDate]);

  const handleDayChange = (direction) => {
    const current = parse(selectedDate, 'dd.MM.yyyy', new Date());
    const newDate = direction === 'prev' ? addDays(current, -1) : addDays(current, 1);
    setSelectedDate(format(newDate, 'dd.MM.yyyy'));
  };

  return {
    events: events?.events || [],
    birthdays: events?.birthdays || [],
    selectedDate,
    setSelectedDate,
    currentWeekStart,
    currentWeekEnd,
    weekDays,
    defaultDate,
    handleDayChange,
    loading
  };
};
