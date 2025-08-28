'use client';

import { useState, useEffect } from 'react';

export default function EditEventForm({ event, onClose, onUpdated }) {
  const [type, setType] = useState('academy_events');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [titleKz, setTitleKz] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionKz, setDescriptionKz] = useState('');
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState(null);

  // Подставляем данные из пропа event в форму
  useEffect(() => {
    if (event) {
      setType(event.type || 'academy_events');
      setDate(event.date || '');
      setTime(event.time || '');
      setTitle(event.title || '');
      setTitleKz(event.title_kz || '');
      setDescription(event.description || '');
      setDescriptionKz(event.description_kz || '');
      setImage(event.image || '');
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event) return;
    setLoading(true);
    setMessage('');
    setErrors(null);

    const formData = new FormData();
    formData.append('type', type);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('title', title);
    formData.append('title_kz', titleKz);
    formData.append('description', description);
    formData.append('description_kz', descriptionKz);
    formData.append('image', image);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/edit/${event.id}/update/`, {
        method: 'PUT',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Событие успешно обновлено!');
        if (onUpdated) onUpdated(data);
      } else {
        setErrors(data.errors || data.message);
      }
    } catch (err) {
      setErrors(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <div className="w-[600px] mx-auto p-4 rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Редактировать событие</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {errors && <p className="text-red-600 mb-2">{JSON.stringify(errors)}</p>}

      <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${event.image}`} alt="Event" className="w-full h-48 object-cover mb-4" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>
          Тип:
          <select value={type} onChange={e => setType(e.target.value)} className="bg-gray-100 p-1 rounded w-full">
            <option value="academy_events">События Академий</option>
            <option value="news">Новости</option>
            <option value="vacation">Выход руководства в отпуск</option>
            <option value="mission">Выход руководства в командировку</option>
            <option value="holiday">Праздничные дни</option>
          </select>
        </label>
        <div className='flex gap-[10px]'>
          <label className='w-full'>
            Дата:
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-gray-100 p-1 rounded w-full" required />
          </label>

          <label className='w-full'>
            Время:
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="bg-gray-100 p-1 rounded w-full" required />
          </label>
        </div>

        <label>
          Заголовок (RU):
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="bg-gray-100 h-[40px] p-1 rounded w-full" required />
        </label>

        <label>
          Заголовок (KZ):
          <input type="text" value={titleKz} onChange={e => setTitleKz(e.target.value)} className="bg-gray-100 h-[40px] p-1 rounded w-full" required />
        </label>

        <label>
          Текст (RU):
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="border p-1 rounded w-full" required />
        </label>

        <label>
          Текст (KZ):
          <textarea value={descriptionKz} onChange={e => setDescriptionKz(e.target.value)} className="border p-1 rounded w-full" required />
        </label>

        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-gradient-custom text-white p-2 rounded flex-1" disabled={loading}>
            {loading ? 'Обновление...' : 'Обновить'}
          </button>
          {onClose && (
            <button type="button" onClick={onClose} className="bg-gray-400 text-white p-2 rounded flex-1">
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
