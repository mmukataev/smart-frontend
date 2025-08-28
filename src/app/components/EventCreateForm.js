'use client';

import { useState } from 'react';

export default function CreateEventForm() {
  const [form, setForm] = useState({
    type: 'academy_events',
    date: '',
    time: '',
    title: '',
    title_kz: '',
    description: '',
    descriptionKz: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors(null);

    try {
      const formData = new FormData();

      // нормализуем переносы строк для textarea
      const normalizedDescription = form.description.replace(/\r\n|\r/g, '\n');
      const normalizedDescriptionKz = form.description_kz.replace(/\r\n|\r/g, '\n');

      Object.entries(form).forEach(([key, value]) => {
        if (value) {
          if (key === 'description') formData.append(key, normalizedDescription);
          else if (key === 'description_kz') formData.append(key, normalizedDescriptionKz);
          else formData.append(key, value);
        }
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/create/`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Событие успешно создано!');
        setForm({
          type: 'academy_events',
          date: '',
          time: '',
          title: '',
          title_kz: '',
          description: '',
          description_kz: '',
          image: null,
        });
      } else {
        setErrors(data.errors || data.message);
      }
    } catch (err) {
      setErrors(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[600px] min-[1200px]:min-w-[600px] mx-auto px-[15px] py-[30px] bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Создать событие</h2>

      {message && <p className="text-green-600 mb-2">{message}</p>}
      {errors && <p className="text-red-600 mb-2">{JSON.stringify(errors)}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>
          Тип:
          <select name="type" value={form.type} onChange={handleChange} className="bg-gray-100 p-1 rounded w-full">
            <option value="academy_events">События в Академий</option>
            <option value="news">Новости</option>
            <option value="holiday">Праздничный день</option>
            <option value="vacation">Выход в отпуск руководителя</option>
            <option value="mission">Выход в командировку руководителя</option>
          </select>
        </label>
        <div className='flex gap-2'>
            <label>
            Дата:
            <input type="date" name="date" value={form.date} onChange={handleChange} className="bg-gray-100 p-1 rounded w-full" required />
            </label>

            <label>
            Время:
            <input type="time" name="time" value={form.time} onChange={handleChange} className="bg-gray-100 p-1 rounded w-full" required />
            </label>
        </div>

        <div className='flex gap-2'>
        <label>
          Название (RU):
          <input type="text" name="title" value={form.title} onChange={handleChange} className="bg-gray-100 p-1 rounded w-full" required />
        </label>

        <label>
          Название (KZ):
          <input type="text" name="title_kz" value={form.title_kz} onChange={handleChange} className="bg-gray-100 p-1 rounded w-full" required />
        </label>
        </div>

        <label>
          Описание (RU):
          <textarea name="description" value={form.description} onChange={handleChange} className="bg-gray-100 p-1 rounded w-full" required />
        </label>

        <label>
          Описание (KZ):
          <textarea name="description_kz" value={form.description_kz} onChange={handleChange} className="bg-gray-100 p-1 rounded w-full" required />
        </label>

        <label>
          Картинка:
          <input type="file" name="image" onChange={handleChange} className="bg-gray-100 p-1 rounded w-full" />
        </label>

        <button type="submit" className="bg-gradient-custom text-white mt-[25px] p-2 rounded" disabled={loading}>
          {loading ? 'Создание...' : 'Создать событие'}
        </button>
      </form>
    </div>
  );
}
