'use client';

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(tz);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://devapi-smart.apa.kz";

export default function useEmployeeProfile(id) {
  const [currentId, setCurrentId] = useState(id);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`${API_BASE}/employee/${currentId}/`);
        const data = await res.json();
        setEmployeeData(data[0]);
      } catch (err) {
        console.error("Ошибка при загрузке:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentId) fetchEmployee();
  }, [currentId]);

  const getWorkDuration = (start) => {
    if (!start) return '';
    const startDate = dayjs(start);
    const now = dayjs();
    const years = now.diff(startDate, 'year');
    const months = now.diff(startDate.add(years, 'year'), 'month');
    const y = years > 0 ? `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}` : '';
    const m = months > 0 ? `${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}` : '';
    return [y, m].filter(Boolean).join(' и ');
  };

  const getOnlineStatus = (logout) => {
    if (!logout) return "Очень давно";
    const logoutDate = dayjs.utc(logout).tz("Asia/Almaty");
    const now = dayjs().tz("Asia/Almaty");
    const mins = now.diff(logoutDate, "minute");
    const hrs = now.diff(logoutDate, "hour");
    const days = now.diff(logoutDate, "day");

    if (mins < 2) return "сейчас в сети";
    if (mins < 60) return `был ${mins} мин назад`;
    if (hrs < 24) return `был ${hrs} ч назад`;
    if (days <= 30) return `был ${days} дн назад`;
    return "давно не заходил";
  };

  const imageUrl = employeeData?.user_image && employeeData.user_image !== "/media/employee/None"
    ? `${API_BASE}${employeeData.user_image}`
    : "/default.png";

  return {
    employee: employeeData,
    loading,
    currentId,
    setCurrentId,
    department: employeeData?.department || {},
    sector: employeeData?.sector || {},
    position: employeeData?.position || {},
    fullName: `${employeeData?.user_surename || ''} ${employeeData?.user_name || ''} ${employeeData?.user_patronymic || ''}`.trim(),
    getWorkDuration,
    getOnlineStatus,
    imageUrl,
  };
}
