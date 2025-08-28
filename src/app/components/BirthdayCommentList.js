'use client';

import { useBirthdayComments } from '@/hooks/useBirthdayComments';
import { useState, useEffect } from 'react';

export default function BirthdayCommentList({ birthdayEmployeeId, birthYear }) {
  const { comments, loading, error } = useBirthdayComments(birthdayEmployeeId, birthYear);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
 useEffect(() => {
  console.log('COMMENTS:', comments);
}, [comments]);

  return (
    <div className="mt-4">
      {loading ? (
        <p className="text-[14px] text-gray-400">Загрузка комментариев...</p>
      ) : error ? (
        <p className="text-[14px] text-red-500">Ошибка: {error}</p>
      ) : comments.length === 0 ? (
        <p className="text-[14px] text-gray-400">Комментариев пока нет.</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {comments.map((comment) => (
            <li key={comment.id} className="flex flex-col gap-1 bg-gray-100 p-2 rounded-[5px]">
              <div className="flex gap-3 items-start">
                <img
                  src={comment.employee?.photo || '/default-user.png'}
                  alt={comment.employee?.full_name || 'Сотрудник'}
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />
                <div className="flex flex-1 justify-between">
                  <div>
                    <p className="font-semibold text-[14px] text-black">
                      {comment.employee?.full_name || 'Неизвестный пользователь'}
                    </p>
                    <p className="text-[14px] text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                  </div>
                  <span className="text-[12px] text-gray-400 block mt-1">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
              </div>

              {/* Ответы к комментарию */}
              {comment.replies && comment.replies.length > 0 && (
                <ul className="pl-[50px] mt-2 flex flex-col gap-2">
                  {comment.replies.map((reply) => (
                    <li key={reply.id} className="flex gap-2 items-start">
                      <img
                        src={reply.employee?.photo || '/default-user.png'}
                        alt={reply.employee?.full_name || 'Пользователь'}
                        className="w-[32px] h-[32px] object-cover rounded-full"
                      />
                      <div className="bg-white border rounded px-3 py-2 w-full">
                        <p className="text-[13px] font-semibold text-black">
                          {reply.employee?.full_name || 'Пользователь'}
                        </p>
                        <p className="text-[13px] text-gray-700">{reply.text}</p>
                        <span className="text-[11px] text-gray-400 block mt-1">
                          {formatDate(reply.created_at)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
