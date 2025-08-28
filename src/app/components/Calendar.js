import Link from 'next/link';
import { format } from 'date-fns';
import ru from 'date-fns/locale/ru';
import kk from 'date-fns/locale/kk';

import { useCalendarData } from '@/hooks/useCalendarData';
import { useLocale } from '@/hooks/useLocale';
import { locale } from 'dayjs';

import translations from '@/translations/translations';

export default function Calendar() {
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

  const localeObj = locale === 'kz' ? kk : ru;

  const formatWeekRange = (start, end) => {
    const startMonth = format(start, 'LLLL', { locale: localeObj  });
    const endMonth = format(end, 'LLLL', { locale: localeObj  });
    const year = format(end, 'yyyy', { locale: localeObj  });

    return startMonth === endMonth ? `${startMonth} ${year}` : `${startMonth} — ${endMonth} ${year}`;
  };

  return (
    <div className="px-[20px] w-1/2 py-[30px] max-[1200px]:w-full bg-white rounded-[15px] max-h-[600px] shadow flex flex-col items-center">
      <div className="flex justify-between w-full items-center mb-4 flex-wrap gap-2">
        <h2 className="text-[24px] font-bold text-[var(--customDark)]">{translations.events.title[locale]}</h2>
        <span className="text-[16px] font-normal text-[var(--customGray)]">
          {formatWeekRange(currentWeekStart, currentWeekEnd)}
        </span>
      </div>

      {/* Дни недели */}
      <div className='flex gap-[10px] w-full justify-between'>
        <button onClick={() => handleDayChange('prev')} className='my-auto'>
          <img src="/icons/angle-left.svg" alt="Назад" className="w-[25px] h-[25px]" />
        </button>
        <div className="flex gap-2 w-full">
          {weekDays.map((date) => {
            const dateStr = format(date, 'dd.MM.yyyy');
            const dayShort = format(date, 'EE', { locale: localeObj });
            const dayNum = format(date, 'dd');
            const isActive = dateStr === selectedDate;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex w-full flex-col items-center px-3 py-2 rounded-md cursor-pointer 
                  ${isActive ? 'bg-gradient-custom text-white' : 'bg-[var(--customBackground)] text-[var(--customDark)]'}
                  min-w-[50px]
              `}
              >
                <span className="text-[14px] font-medium">{dayShort}</span>
                <span className="text-[16px] font-bold">{dayNum}</span>
              </button>
            );
          })}
        </div>
        <button onClick={() => handleDayChange('next')} className='my-auto'>
          <img src="/icons/angle-right.svg" alt="Вперед" className="w-[25px] h-[25px]" />
        </button>
      </div>

      {/* События */}
      <Link href={`/${locale}/events/`} className="flex flex-col gap-2 mt-4 w-full h-full h-[500px] overflow-y-auto">
        {loading && (
          <div className="w-full flex justify-center items-center h-[200px]">
            <div className="loader"></div>
          </div>
        )}

        {/* Дни рождения */}
        {!loading && birthdays.length > 0 && (
            <ul className="flex flex-col gap-2">
              {birthdays.map((person, idx) => (
                <li key={idx} className="bg-[var(--customBackground)] p-[10px] rounded-[5px] flex items-center gap-[10px]">
                  <div className='w-[45px] h-[45px] flex bg-gradient-custom rounded justify-center items-center'>
                    <img
                      src="/icons/cake-white.svg"
                      alt="birthday"
                      className="w-[24px] h-[24px]"
                    />
                  </div>
                  <div>
                    <b className='text-[var(--customDark)]'>{`${person.user_surename} ${person.user_name} ${person.user_patronymic || ''}`.trim()}</b>
                    {/* {person.position?.ru && (
                      <p className="text-[14px] text-[var(--customDark)]">{person.department.ru}</p>
                    )} */}
                    {/* <p className="text-[14px] text-[var(--customDark)]">{person.birthday_message_ru}</p> */}
                  </div>
                </li>
              ))}
            </ul>
        )}
        {/* События */}
        {!loading && events.length > 0 && (
            <ul className="flex flex-col gap-2">
              {events.map((event, idx) => (
              <li 
                key={idx} 
                className="bg-[var(--customBackground)] grid grid-cols-[45px_1fr] gap-[10px] p-[10px] items-center rounded-[5px]"
              >
                <img
                  src={
                    event.image
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${event.image}`
                      : '/default.svg'
                  }
                  alt={event.title}
                  className="w-[45px] h-[45px] object-cover rounded"
                />
                <div className="flex flex-col gap-[5px] min-w-0">
                  <b className="block truncate">{event.title}</b>
                  <p className="text-[14px] line-clamp-1 text-[var(--customGray)] overflow-hidden max-w-full">
                    {event.description}
                  </p>
                </div>
              </li>

              ))}
            </ul>
        ) || (!loading && birthdays.length === 0 && events.length === 0 && (
          <div className='w-full flex justify-center items-center h-[200px] text-gray-500 text-[16px]'>
              {translations.events.nodata[locale]}
          </div>
        ))}
      </Link>
    </div>
  );
}
