'use client';

import { useState, useEffect } from 'react';

export default function UpdateBirthdayMessage({ birthday_employee_id, birth_year }) {
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Загружаем все доступные поздравления
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/birthday-message/all/`);
        if (!res.ok) throw new Error('Ошибка при загрузке сообщений');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMessages();
  }, []);

  const handleUpdate = async () => {
    if (!selectedMessageId) return;

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/birthday-message/update/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthday_employee_id,
          birth_year,
          message_id: selectedMessageId,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess('Поздравление успешно обновлено!');
      } else {
        setError(data.errors || data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 min-w-[600px] rounded shadow bg-white max-w-md">
      <h3 className="text-lg font-bold mb-2">Изменить поздравление</h3>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <label className="block mb-2">
        Выберите поздравление:
        <select
          value={selectedMessageId || ''}
          onChange={e => setSelectedMessageId(e.target.value)}
          className="bg-gray-100 p-1 rounded w-full mt-1"
        >
          <option value="">-- Выберите --</option>
          {messages.map(msg => (
            <option key={msg.id} value={msg.id}>
              {msg.text_ru ? msg.text_ru.slice(0, 50) : 'Без текста'}...
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={handleUpdate}
        disabled={loading || !selectedMessageId}
        className="mt-2 bg-gradient-custom text-white px-4 py-2 rounded"
      >
        {loading ? 'Обновление...' : 'Обновить'}
      </button>
    </div>
  );
}
