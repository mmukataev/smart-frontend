'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { useCalendarData } from '@/hooks/useCalendarData';
import CreateEventForm from '@/components/EventCreateForm';
import EditEventForm from '@/components/EventEditForm';
import UpdateBirthdayMessage from '@/components/EventUpdateBirthdayMessage';

import EventType from '@/translations/EventType';

export default function EventsAdminPage() {
  const locale = useLocale();
  const {
    events,
    birthdays,
    selectedDate,
    setSelectedDate,
    loading,
    errorData,
  } = useCalendarData();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedBirthdayId, setSelectedBirthdayId] = useState(null);
  const [selectedBirthYear, setSelectedBirthYear] = useState(null);

  const handleDateChange = (e) => {
    const raw = e.target.value; 
    const [y, m, d] = raw.split('-');
    setSelectedDate(`${d}.${m}.${y}`);
  };

  return (
    <div>
      <Link href={`/${locale}/home`} className="knopkaKotoruyuYaNeLubluNoAluaZastavilaMenyaEyoDelat  h-[50px] flex items-center justify-center px-[30px] w-fit rounded">
      На главную страницу
      </Link>
      <div className='flex items-center justify-between w-full rounded'>
        <b className='text-[32px] my-4'>Административная панель событий</b>
      </div>

      {loading && <p>Загрузка...</p>}
      {errorData && (
        <div className="p-2 mb-3 border border-red-500 rounded text-red-600">
          <p><strong>Ошибка {errorData.status}:</strong> {errorData.data?.message || 'Неизвестная ошибка'}</p>
        </div>
      )}

        <div className='flex w-full flex-row-reverse w-full gap-2 mt-2 overflow-x-auto'>
          <div className='flex flex-col gap-2 bg-white h-fit w-[300px] rounded shadow px-[15px] py-[30px]'>
            <label>
              <b className='mr-2'>Выбранная дата:</b>
              <input
                type="date"
                value={(() => {
                  const [d, m, y] = selectedDate.split('.');
                  return `${y}-${m}-${d}`;
                })()}
                onChange={handleDateChange}
                className="bg-gray-100 w-full px-[25px] h-[40px] rounded"
              />
            </label>

            <button
              onClick={() => setShowCreateForm(prev => !prev)}
              className="text-white mt-4 bg-gradient-custom h-[40px] px-[25px] flex items-center justify-center rounded w-full"
            >
              {showCreateForm ? 'Скрыть форму' : 'Создать событие'}
            </button>
          </div>
          <div className='flex flex-col gap-[10px] flex-2'>
            <div className='bg-white flex-1 rounded shadow px-[15px] py-[30px]'>
              <b className='text-xl'>Именинники</b>
              {birthdays.length > 0 ? birthdays.map((bday) => (
                <div key={bday.id} 
                  className="bg-gradient-custom text-white p-[15px] mb-2 rounded">
                  <div className='flex items-center gap-2 mb-2'>
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${bday.user_image || '/media/default.png'}`}
                      alt="Фото именинника"
                      className="w-[75px] h-[75px] rounded object-cover mr-2"
                    />
                    <div>
                    <b>{bday.user_name} {bday.user_surename} {bday.user_patronymic}</b>
                    <p>{bday.birth_date}</p>
                    </div>
                  </div>

                    <div className='w-full min-h-[40px] h-fit py-[10px] flex gap-[10px] px-[10px] items-start justify-start bg-white/10 rounded mb-2'>
                      <i className="fa-solid fa-map-marker-alt mt-[5px]" />
                      <p>{bday.region_ru || 'Филиал не указан'}</p>
                    </div>

                    <div className='w-full h-[40px] flex gap-[10px] px-[10px] items-center justify-start bg-white/10 rounded mr-2 mb-2'>
                      <i className="fa-solid fa-briefcase" />
                      <p>{bday.department_ru || 'Департамент не указан'}</p>
                    </div>

                    <div className='w-full h-[40px] flex gap-[10px] px-[10px] items-center justify-start bg-white/10 rounded mr-2 mb-2'>
                      <i className="fa-solid fa-user-tie" />
                      <p>{bday.position_ru || 'Должность не указана'}</p>
                    </div>

                  <div className='flex items-center gap-2 justify-between mt-[25px]'>
                    <p><strong>Поздравление:</strong> <br/> <i>{bday.birthday_message_ru}</i></p>

                    <button 
                    className='px-[15px] h-[40px] bg-white text-[var(--customGreen)] rounded'
                      onClick={() => {
                      setSelectedBirthdayId(bday.id);
                        const [d, m, y] = selectedDate.split('.');
                        setSelectedBirthYear(Number(y));
                    }}
                    >
                      Изменить поздравление
                    </button>
                  </div>
                </div>
              )) : !loading && <p>Нет дней рождения</p>}
            </div>

            <div className='bg-white flex-1 rounded shadow px-[15px] py-[30px]'>
              <b className='text-xl'>События</b>
              {events.length > 0 ? events.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-gradient-custom text-white p-[15px] mb-2 rounded"
                >
                  <div className='flex items-center gap-2 mb-2'>
                    {event.image && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${event.image}`}
                        alt={event.title}
                        className="w-[75px] h-[75px] rounded object-cover mr-2"
                      />
                    )}
                    <div>
                      <b className='text-[18px] mb-3'>{event.title}</b>
                    </div>
                  </div>
                    <div className='w-full'>
                      <div className='min-h-[40px] h-fit py-[10px] flex gap-[10px] px-[10px] items-start justify-start bg-white/10 rounded'>
                        <i className="fa-solid fa-book mt-[5px] w-full" />
                        <p className='w-full overflow-hidden whitespace-pre-line'>{event.description || 'Время не указан'}</p>
                      </div>
                      <div className='w-full my-2 flex gap-[10px]'>
                        <div className='flex-1  w-full h-[40px] flex gap-[10px] px-[10px] items-center justify-start bg-white/10 rounded'>
                          <i className="fa-solid fa-tags" />
                          <p>{EventType[event.type]?.ru || 'Тип не указан'}</p>
                        </div>
                        <div className='flex-1 w-full h-[40px] flex gap-[10px] px-[10px] items-center justify-start bg-white/10 rounded'>
                          <i className="fa-solid fa-clock" />
                          <p>{event.time?.slice(0, 5) || 'Время не указан'}</p>
                        </div>
                        <button 
                        onClick={() => setSelectedEvent({
                          type: event.type,
                          date: event.date,
                          time: event.time,
                          title: event.title,
                          title_kz: event.title_kz,
                          description: event.description,
                          description_kz: event.description_kz,
                          image: event.image,
                          id: event.id,
                        })}
                        className='flex-1 px-[15px] h-[40px] bg-white text-[var(--customGreen)] rounded'>
                          <p>Редактировать событие</p>
                        </button>
                      </div>
                    </div>
                </div>
              )) : !loading && <p>Нет событий</p>}
            </div>
          </div>
        </div>

      {showCreateForm && 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col p-5 w-fit">
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-white w-fit hover:text-gray-100 text-[14px] p-4 bg-[rgba(0,0,0,0.2)] rounded mb-4"
            >
              Назад
            </button>
            <CreateEventForm />
          </div>
        </div>
      }

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col p-5 w-fit">
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-white w-fit hover:text-gray-100 text-[14px] p-4 bg-[rgba(0,0,0,0.2)] rounded mb-4"
            >
              Закрыть
            </button>
            <EditEventForm event={selectedEvent} />
          </div>
        </div>
      )}

      {selectedBirthdayId && selectedBirthYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col p-5 w-fit">
            <button
              onClick={() => {
                setSelectedBirthdayId(null);
                setSelectedBirthYear(null);
              }}
              className="text-white w-fit hover:text-gray-100 text-[14px] p-4 bg-[rgba(0,0,0,0.2)] rounded mb-4"
            >
              Закрыть
            </button>
            <UpdateBirthdayMessage
              birthday_employee_id={selectedBirthdayId}
              birth_year={selectedBirthYear}
            />
          </div>
        </div>
      )}
    </div>
  );
}
