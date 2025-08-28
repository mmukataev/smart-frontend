'use client';

import React, { useState, useEffect } from "react";
import useEmployeeProfile from "@/hooks/useEmployeeProfile";
import ChatModern from "@/components/ChatModern";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { useLocale } from "@/hooks/useLocale";

dayjs.extend(utc);
dayjs.extend(timezone);

const ALLOWED_USERNAMES = [
  "k.kulynchakov@apa.kz",
  "alua.makhat@apa.kz"
];

// чтение cookie на клиенте
function getCookie(name) {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
  );
  return m ? decodeURIComponent(m[1]) : undefined;
}

// парсер JWT (base64url)
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function Profile({ id, onChangeId }) {
  const {
    employee,
    loading,
    currentId,
    setCurrentId,
    department,
    sector,
    position,
    fullName,
    getWorkDuration,
    getOnlineStatus,
    imageUrl,
  } = useEmployeeProfile(id);

  const locale = useLocale();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [viewerUsername, setViewerUsername] = useState(null);
  const [myId, setMyId] = useState(null);

useEffect(() => {
  const storedId = localStorage.getItem("employee_id");
  setMyId(storedId);
}, []);

  // вытаскиваем username из cookie с JWT
  useEffect(() => {
    const raw =
      getCookie("access_token") ||
      getCookie("access"); // на случай другого имени
    const payload = raw ? parseJwt(raw) : null;
    setViewerUsername(payload?.username || null);
  }, []);

  // грузим события только если это разрешенный пользователь
 useEffect(() => {
  if (!employee || !employee.iin) return;
  if (!ALLOWED_USERNAMES.includes(viewerUsername)) return;

  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scud/${employee.iin}/`)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data?.data)) {
        setEvents(data.data);
      } else {
        setEvents([]);
      }
    })
    .catch((err) => console.error(err));
}, [employee, viewerUsername]);


  const chatLogin = employee?.user_email ? employee.user_email.slice(0, -7) : "";

  if (loading) return <p className="text-center text-gray-500">Загрузка...</p>;
  if (!employee) return <p className="text-center text-red-500">Сотрудник не найден</p>;

  return (
    <>
      <div className="w-full rounded-[15px] bg-white pb-[50px] shadow min-[1200px]:min-w-[600px] mx-auto space-y-4">
        <div
          className="flex px-[20px] bg-gradient-custom py-[20px] space-x-4"
          style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
        >
          <img
            src={imageUrl}
            alt="Фото сотрудника"
            className="w-[100px] h-[100px] rounded-[15px] object-cover"
          />
          <div className="flex flex-col justify-center gap-2">
            <p className="w-fit px-[10px] bg-[rgba(255,255,255,30%)] font-bold text-[11px] text-white rounded-[15px] text-center leading-[14px]">
              {getOnlineStatus(employee.last_logout)}
            </p>
            <p className="leading-[18px] text-[18px] font-bold text-white">{fullName}</p>
            <div className="text-[14px]">
              <p className="text-white opacity-[50%] font-bold">{locale === "ru" ? 'Дата рождения' : 'Туған күні'}:</p>
              <p className="text-white font-bold">
                {employee.birth_date
                  ? new Date(employee.birth_date).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "long",
                    })
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-[20px]">
          {![1, 2, 3, 4].includes(employee.id) && (
            <>
            <p className="text-[14px] text-[#267962] font-bold">Департамент:</p>
            <p className="text-[14px] text-[#15312A] font-bold mb-2">{locale === "ru" ? department.ru : department.kz}</p>
            </>
          )}

          <div className="flex gap-2">
            {employee.sector?.id !== 16 && (
              <div className="flex-1">
                <p className="text-[14px] text-[#267962] font-bold">Сектор:</p>
                <p className="text-[14px] text-[#15312A] font-bold mb-2">{locale === "ru" ? sector.ru : sector.kz}</p>
              </div>
            )}
            <div className="flex-1">
              <p className="text-[14px] text-[#267962] font-bold">{locale === "ru" ? 'Должность' : 'Лауазымы'}:</p>
              <p className="text-[14px] text-[#15312A] font-bold mb-2">{locale === "ru" ? position.ru : position.kz}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-[14px] text-[#267962] font-bold">{locale === "ru" ? 'Дата начала работы' : 'Жұмысқа кірген күні'}:</p>
              <p className="text-[14px] text-[#15312A] font-bold mb-2">{employee.work_start_date || "Не указана"}</p>
            </div>
            <div className="flex-1">
              <p className="text-[14px] text-[#267962] font-bold">{locale === "ru" ? 'Стаж' : 'Еңбек өтілі'}:</p>
              <p className="text-[14px] text-[#15312A] font-bold mb-2">{getWorkDuration(employee.work_start_date)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-[14px] text-[#267962] font-bold">Телефон:</p>
              <p className="text-[14px] text-[#15312A] font-bold mb-2">{employee.user_phone || "Не указан"}</p>
            </div>
            <div className="flex-1">
              <p className="text-[14px] text-[#267962] font-bold">Email:</p>
              <p className="text-[14px] text-[#15312A] font-bold mb-2">{employee.user_email || "Не указан"}</p>
            </div>
          </div>

          {/* Блок событий вход/выход — только для username из cookie */}
   {ALLOWED_USERNAMES.includes(viewerUsername) && events?.length > 0 && (
  <div>
    <h2 className="text-lg font-semibold mb-2">События (входы/выходы)</h2>
    <div className="max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
      <ul className="space-y-2">
        {events.map((ev) => (
          <li
            key={ev.guid}
            className="border p-2 rounded bg-white flex justify-between"
          >
            <span>
              {ev.event_type} — {ev.room_name}
            </span>
            <span className="text-sm text-gray-500">
              {dayjs(ev.date_time).format("DD.MM.YYYY HH:mm")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}

        {String(myId) !== String(employee.id) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-100 text-gray-700 flex rounded-[5px] gap-[10px] items-center h-[40px] px-[16px]"
          >
            <img src="/icons/chat.svg" width={25} />
            {locale === "ru" ? 'Написать' : 'Жазу'}
          </button>
        )}

        </div>
      </div>

      {employee.chief && (
        <div onClick={() => onChangeId(employee.chief.id)}>
          <div
            onClick={() => setCurrentId(employee.chief.id)}
            className="flex rounded-[15px] items-center px-[20px] shadow bg-white gap-2 h-[70px] mt-2 cursor-pointer hover:bg-gray-50"
          >
            <img
              src={
                employee.chief.user_image && employee.chief.user_image !== "/media/employee/None"
                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${employee.chief.user_image}`
                  : "/default.png"
              }
              alt="Фото руководителя"
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <div>
              <p className="text-[14px] text-[#267962] font-bold">{locale === "ru" ? 'Руководитель' : 'Басшы'}:</p>
              <p className="text-[14px] text-[#15312A] font-bold">
                {`${employee.chief.user_surename || ""} ${employee.chief.user_name || ""} ${employee.chief.user_patronymic || ""}`.trim()}
              </p>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <ChatModern
          selectedUser={chatLogin}
          onSelectUser={(user) => {
            if (user === null) {
              setIsModalOpen(false);
            }
          }}
        />
      )}
    </>
  );
}
