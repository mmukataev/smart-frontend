'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { format, parseISO, getYear } from 'date-fns';
import ru from 'date-fns/locale/ru';
import kk from 'date-fns/locale/kk';

import { useCalendarData } from '@/hooks/useCalendarData';
import { useLikeEvent } from '@/hooks/useLikeEvent';
import { useCheckLikedEvent } from '@/hooks/useCheckLikedEvent';
import { useLocale } from '@/hooks/useLocale';

import EventDetailPage from '@/components/EventDetail';
import BirthdayCommentModal from '@/components/BirthdayCommentModal';
import translations from '@/translations/translations';

export default function EventPage() {
  const locale = useLocale();
  const {
    events,
    birthdays,
    selectedDate,
    setSelectedDate,
    currentWeekStart,
    currentWeekEnd,
    weekDays,
    handleDayChange,
    loading,
  } = useCalendarData();

  const getImageUrl = (path) => {
    if (!path || path === "None") return "/default.png";
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;
  };

    const localeObj = locale === 'kz' ? kk : ru;


  const currentYear = getYear(currentWeekStart);
  const { likeEvent } = useLikeEvent();
  const { checkLiked, likedMap } = useCheckLikedEvent();

  const [eventsState, setEventsState] = useState([]);
  const [birthdaysState, setBirthdaysState] = useState([]);

  useEffect(() => {
    const eventsStr = JSON.stringify(events);
    const birthdaysStr = JSON.stringify(birthdays);

    setEventsState(JSON.parse(eventsStr));
    setBirthdaysState(JSON.parse(birthdaysStr));
  }, [JSON.stringify(events), JSON.stringify(birthdays)]);


  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedBirthdayEmployee, setSelectedBirthdayEmployee] = useState(null);

  useEffect(() => {
    events.forEach((event) => checkLiked({ eventId: event.id }));
    birthdays.forEach((person) => checkLiked({ birthdayEmployeeId: person.id, birthYear: currentYear }));
  }, [events, birthdays, currentYear]);

  const handleLike = async ({ eventId, birthdayEmployeeId, birthYear }) => {
    const res = await likeEvent({ eventId, birthdayEmployeeId, birthYear });

    if (!res?.message?.includes("successfully")) return;

    const isLike = res.message === 'Liked successfully';

    if (eventId) {
      await checkLiked({ eventId });
      setEventsState((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, likes_count: event.likes_count + (isLike ? 1 : -1) }
            : event
        )
      );
    } else if (birthdayEmployeeId && birthYear) {
      await checkLiked({ birthdayEmployeeId, birthYear });
      setBirthdaysState((prev) =>
        prev.map((person) =>
          person.id === birthdayEmployeeId
            ? { ...person, birthday_likes_count: person.birthday_likes_count + (isLike ? 1 : -1) }
            : person
        )
      );
    }
  };

  const formatWeekRange = (start, end) => {
    const startMonth = format(start, 'LLLL', { locale: localeObj });
    const endMonth = format(end, 'LLLL', { locale: localeObj });
    const year = format(end, 'yyyy', { locale: localeObj });
    return startMonth === endMonth ? `${startMonth} ${year}` : `${startMonth} — ${endMonth} ${year}`;
  };

  const renderDaySelector = () => (
    <div className='flex gap-[10px] mx-auto w-fit'>
      <div className="flex w-fit gap-2">
        {weekDays.map((date) => {
          const dateStr = format(date, 'dd.MM.yyyy');
          const dayShort = format(date, 'EE', { locale: localeObj });
          const dayNum = format(date, 'dd');
          const isActive = dateStr === selectedDate;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex flex-col items-center px-3 py-2 rounded-md cursor-pointer 
                ${isActive ? 'bg-gradient-custom text-white' : 'bg-[var(--customBackground)] text-[var(--customDark)]'}
                min-w-[50px]`
              }
            >
              <span className="text-[14px] font-medium">{dayShort}</span>
              <span className="text-[16px] font-bold">{dayNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className='w-full mx-auto'>
      <div className="gap-2">
      <Link href={`/${locale}/`} className="knopkaKotoruyuYaNeLubluNoAluaZastavilaMenyaEyoDelat h-[50px] flex items-center justify-center px-[30px] w-fit rounded">
        {locale === "ru" ? "Назад" : "Артқа"}
      </Link>
      <h1 className="text-[32px] my-4"><b>{translations.eventPage.title[locale]}</b></h1>
      </div>
      <div className='flex flex-row-reverse gap-[10px] max-[1200px]:flex-col'>

      <div className='flex flex-col gap-[10px]'>
      <div className="px-[20px] py-[30px] w-full bg-white rounded-[15px] shadow h-fit">
        <div className="flex justify-center w-full items-center mb-4 gap-2">
          <button onClick={() => handleDayChange('prev')} className='my-auto'>
            <img src="/icons/angle-left.svg" alt="Назад" className="w-[25px] h-[25px]" />
          </button>
          <p className="text-[16px] px-2 text-center font-normal text-[var(--customGray)] whitespace-pre-line">
            {formatWeekRange(currentWeekStart, currentWeekEnd)}
          </p>
          <button onClick={() => handleDayChange('next')} className='my-auto w-[25px] h-[25px]'>
            <img src="/icons/angle-right.svg" alt="Вперед" className='w-full'/>
          </button>
        </div>
        {renderDaySelector()}
      </div>
        {loading ? (
          // Skeleton loading version
          <ul className="flex flex-col gap-2">
            <h2 className="text-[20px] font-bold text-[var(--customDark)]"> {translations.eventPage.birthdays[locale]}</h2>
            {Array.from({ length: 2 }).map((_, idx) => (
              <li key={idx} className="bg-gradient-custom p-[10px] rounded-[5px] flex-col gap-[5px] animate-pulse">
                <div className='flex gap-2 items-center'>
                  <div className="rounded-[50%] w-[80px] h-[80px] bg-gray-300"></div>
                  <div className='flex flex-col justify-center gap-2'>
                    <div className="h-[16px] w-[150px] bg-gray-300 rounded"></div>
                    <div className="h-[12px] w-[100px] bg-gray-300 rounded"></div>
                  </div>
                </div>

                <div className='flex justify-between gap-[5px] mt-4'>
                  <div className='flex gap-6'>
                    <div className='h-[20px] w-[50px] bg-gray-300 rounded'></div>
                    <div className='h-[20px] w-[50px] bg-gray-300 rounded'></div>
                  </div>
                  <div className='h-[30px] w-[90px] bg-gray-300 rounded'></div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          // Main version with data
          !loading && birthdays.length > 0 && (
            <ul className="flex flex-col gap-2">
              <h2 className="text-[20px] font-bold text-[var(--customDark)]">{translations.eventPage.birthdays[locale]}</h2>
              {birthdaysState.map((person, idx) => {
                const key = `${person.id}_${currentYear}`;
                return (
                  <li key={idx} className="bg-gradient-custom p-[10px] rounded-[5px] flex-col gap-[5px]">
                    <div className='flex gap-2 items-center'>
                      <img
                        src={
                          person.user_image && person.user_image !== "/media/employee/None"
                            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${person.user_image}`
                            : "/default.png"
                        }
                        className="rounded-[50%] w-[80px] h-[80px] object-cover"
                        alt="Фото сотрудника"
                      />
                      <div className='flex flex-col justify-center'>
                        <b className='text-white text-[16px]'>{`${person.user_surename} ${person.user_name} ${person.user_patronymic || ''}`.trim()}</b>
                        <p className="text-[12px] text-white">
                          {locale === "ru" ? person.position_ru : person.position_kz}
                        </p>
                      </div>
                    </div>

                    <div className='flex justify-between gap-[5px] mt-4'>
                      <div className='flex gap-6'>
                        <button onClick={() => handleLike({ birthdayEmployeeId: person.id, birthYear: currentYear })} disabled={loading}
                          className='text-[14px] py-[5px] flex gap-2 text-white'>
                          <img
                            src={likedMap[key] ? '/icons/events/heart-filled.svg' : '/icons/events/heart-white.svg'}
                            width={16}
                          />
                          {person.birthday_likes_count}
                        </button>
                        <button className="text-[14px] py-[5px] flex gap-2 text-white"
                          onClick={() => setSelectedBirthdayEmployee({
                            id: person.id,
                            year: currentYear,
                            birthday_message_ru: person.birthday_message_ru,
                            birthday_message_kz: person.birthday_message_kz
                          })}
                        >
                          <img src='/icons/events/comments-white.svg' width={16} />
                          {person.birthday_comments_count}
                        </button>
                      </div>

                      <p 
                        onClick={() => setSelectedBirthdayEmployee({
                          id: person.id,
                          year: currentYear,
                          birthday_message_ru: person.birthday_message_ru,
                          birthday_message_kz: person.birthday_message_kz
                        })}
                        className='text-[12px] text-green-800 bg-white h-[30px] px-[15px] flex items-center justify-center rounded w-fit'>
                        {translations.eventPage.congratulate[locale]}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )
        )}

      </div>

      <div className="flex w-full flex-col gap-2">
        {/* События */}
        {loading && (
          <ul className="flex flex-col gap-2">
            <h2 className="text-[20px] font-bold text-[var(--customDark)] min-[1200px]:hidden">{translations.eventPage.events[locale]}</h2>
            {[1, 2, 3].map((i) => (
              <li key={i} className="bg-white shadow rounded-[5px] overflow-hidden animate-pulse">
                <div className="w-full aspect-[16/9] bg-gray-200"></div>
                <div className="px-[20px] pt-[10px] pb-[20px] flex flex-col gap-3">
                  <div className="h-[20px] bg-gray-200 rounded w-3/4"></div>
                  <div className="h-[14px] bg-gray-200 rounded w-full"></div>
                  <div className="h-[14px] bg-gray-200 rounded w-5/6"></div>
                  <div className="flex justify-between mt-4">
                    <div className="flex gap-6">
                      <div className="h-[20px] bg-gray-200 rounded w-[60px]"></div>
                      <div className="h-[20px] bg-gray-200 rounded w-[60px]"></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-[20px] bg-gray-200 rounded w-[50px]"></div>
                      <div className="h-[40px] bg-gray-200 rounded w-[100px]"></div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!loading && events.length > 0 && (
          <ul className="flex flex-col gap-2">
            <h2 className="text-[20px] font-bold text-[var(--customDark)] min-[1200px]:hidden">{translations.eventPage.events[locale]}</h2>
            {eventsState.map((event) => (
              <div key={event.id}>
                <li className="bg-white shadow items-center rounded-[5px]">
                  {event.image && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${event.image}`}
                      alt={event.title}
                      className="w-full aspect-[16/9] rounded-t-[5px] overflow-hidden object-cover"
                    />
                  )}
                  <div className='px-[20px] pt-[10px] pb-[20px]'>
                    <b className='text-[18px] mb-3 line-clamp-2'>{event.title}</b>
                    <p className='text-[14px] text-[var(--customGray)] line-clamp-2 whitespace-pre-line'>{event.description}</p>
                    <div className='flex justify-between gap-[5px] mt-4'>
                      <div className='flex gap-6'>
                        <button
                          onClick={() => handleLike({ eventId: event.id })}
                          disabled={loading}
                          className="text-[14px] py-[5px] flex items-center gap-2 text-[var(--customDark)]"
                        >
                          <img
                            src={likedMap[event.id] ? '/icons/events/heart-filled.svg' : '/icons/events/heart.svg'}
                            width={16}
                            alt="Like"
                          />
                          {event.likes_count}
                        </button>
                        <button className="text-[14px] py-[5px] flex items-center gap-2 text-[var(--customDark)]">
                          <img src='/icons/events/comments.svg' width={16} />
                          {event.comments_count}
                        </button>
                      </div>
                      <div className='flex gap-4'>
                        <p className="text-[14px] py-[5px] flex items-center gap-2 text-[var(--customDark)]">
                          <img src='/icons/events/date.svg' width={16} />
                          {event.time?.slice(0, 5)}
                        </p>
                        <p onClick={() => setSelectedEventId(event.id)} className='text-[12px] text-white bg-gradient-custom h-[40px] px-[25px] flex items-center justify-center rounded w-fit'>
                          <b>{locale === "ru" ? 'Подробнее' : 'Толығырақ'}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        )}
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="p-2 border-b">
              <p className="text-[14px] font-bold">{event.title}</p>
              <p className="text-[12px] text-gray-500">{event.date}</p>
            </div>
          ))
        ) : (
          <p className="text-[14px] flex items-center justify-center h-[250px] text-gray-500 text-center py-2">
            {translations.eventPage.noEvents[locale]}
          </p>
        )}
      </div>
      </div>

      {selectedEventId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex  justify-center">
          <div className="w-full max-w-[800px] rounded-[10px] relative p-6">
            <button
              onClick={() => setSelectedEventId(null)}
              className="text-white w-fit hover:text-gray-100 text-[14px] p-4 bg-[rgba(0,0,0,0.2)] rounded"
              aria-label="Закрыть"
            >
              {translations.back[locale]}
            </button>
            <EventDetailPage eventId={selectedEventId} />
          </div>
        </div>
      )}

      {selectedBirthdayEmployee && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center">
          <div className="w-full max-w-[800px] rounded-[10px] relative p-6">
            <button
              onClick={() => setSelectedBirthdayEmployee(null)}
              className="text-white w-fit hover:text-gray-100 text-[14px] p-4 bg-[rgba(0,0,0,0.2)] rounded"
              aria-label="Закрыть"
            >
              {translations.back[locale]}
            </button>
            <BirthdayCommentModal
              birthdayEmployeeId={selectedBirthdayEmployee.id}
              birth_year={selectedBirthdayEmployee.year}
              birthday_message_ru={selectedBirthdayEmployee.birthday_message_ru}
              birthday_message_kz={selectedBirthdayEmployee.birthday_message_kz}
            />
          </div>
        </div>
      )}
    </div>
  );
}