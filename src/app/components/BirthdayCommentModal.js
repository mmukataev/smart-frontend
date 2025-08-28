'use client';

import { useState } from 'react';
import { useAddComment } from '@/hooks/useAddComment';
import { useBirthdayComments } from '@/hooks/useBirthdayComments';
import useReplyToComment from '@/hooks/useReplyToComment';
import { useLocale } from '@/hooks/useLocale';

import useEmployeeProfile from "@/hooks/useEmployeeProfile";

export default function BirthdayCommentModal({ birthdayEmployeeId, birth_year, birthday_message_ru, birthday_message_kz }) {
  const locale = useLocale();
  const { comments, loading, refetch } = useBirthdayComments(birthdayEmployeeId, birth_year);
  const { addComment, loading: sending, error } = useAddComment();
  const { replyToComment, loading: replying, error: replyError } = useReplyToComment();

  const id = birthdayEmployeeId;
  const {
    employee,
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

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    const success = await addComment({
      birthday_employee_id: birthdayEmployeeId,
      birth_year,
      text: newComment,
    });

    if (success) {
      setNewComment('');
      refetch();
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (!replyText.trim()) return;
    const success = await replyToComment({
      birth_year,
      parentCommentId: parentId,
      text: replyText,
      birthday_employee_id: birthdayEmployeeId,
    });
    if (success) {
      setReplyingTo(null);
      setReplyText('');
      refetch();
    }
  };

  const formatDate = (str) => {
    const date = new Date(str);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const Comment = ({ comment }) => (
    <li className="flex flex-col gap-1 bg-gray-50 p-2 rounded-[5px]">
      <div className="flex gap-3">
        <img
          src={comment.employee?.photo || '/default-user.png'}
          alt={comment.employee?.full_name || 'Сотрудник'}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-sm">{comment.employee?.full_name || 'Аноним'}</p>
            <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
          </div>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{comment.text}</p>

          {replyingTo === comment.id ? (
            <div className="mt-2">
              <div className="flex gap-2 mb-3">
              <input
                type="text"
                className="w-full p-2 border border-gray-200 rounded text-sm outline-none"
                placeholder="Ваш ответ..."
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') handleReplySubmit(comment.id);
                }}
              />

                <button
                  className="bg-gradient-custom text-white text-[14px] w-fit px-[10px] h-[40px] flex justify-center items-center rounded"
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={replying}
                >
                  {locale === "ru" ? 'Ответить' : 'Жауап беру'}
                </button>
              </div>
              {replyError && <p className="text-red-500 text-sm mt-1">Ошибка при ответе.</p>}
            </div>
          ) : (
            <button
              className="text-blue-500 text-sm text-start hover:underline mt-1"
              onClick={() => setReplyingTo(comment.id)}
            >
              {locale === "ru" ? 'Ответить' : 'Жауап беру'}
            </button>
          )}
        </div>
      </div>

      {/* Ответы */}
      {comment.replies?.length > 0 && (
        <ul className="pl-12 mt-2 flex flex-col gap-2">
          {comment.replies.map((reply) => (
            <li key={reply.id} className="flex gap-2 items-start">
              <img
                src={reply.employee?.photo || '/default-user.png'}
                alt={reply.employee?.full_name || 'Пользователь'}
                className="w-8 h-8 object-cover rounded-full"
              />
              <div className="px-3 py-2 w-full flex justify-between">
                <div>
                  <p className="text-sm font-semibold text-black">
                    {reply.employee?.full_name || 'Пользователь'}
                  </p>
                  <p className="text-sm text-gray-700">{reply.text}</p>
                </div>
                <span className="text-xs text-gray-400 block mt-1">
                  {formatDate(reply.created_at)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <div className="mt-6">
      <div className="bg-gradient-custom rounded-xl p-6 w-full relative shadow">
      <img
        src={`${imageUrl}`}
        alt="Фото сотрудника"
        className="w-[100px] h-[100px] rounded-full object-cover mx-auto mb-4"
      />
      <h2 className="text-lg font-bold text-center text-white">
        {fullName}
      </h2>
      <p className='text-center text-[14px] text-white'>
      {locale === "ru" ? department.ru : department.kz}
      </p>
      </div>
      <div className='bg-white flex items-center justify-center gap-[10px] h-[50px] rounded italic shadow mt-4 mb-4'>
        <img src='/icons/events/cake-green.svg' width={18}/>{locale === "ru" ? birthday_message_ru : birthday_message_kz}
      </div>
      <h4 className='mt-4 mb-2 text-white text-[18px]'>{locale === "ru" ? 'Поздавления' : 'Құттықтаулар'}</h4>
      <div className='bg-white px-[20px] py-[10px] pt-[15px] rounded-[5px] shadow'>
        <div className='flex gap-2'>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded text-sm outline-none"
                      placeholder="Напишите поздравление..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.ctrlKey && e.key === 'Enter') handleAdd();
                      }}
                    />
                    <button
                      className="bg-gradient-custom text-white w-[40px] h-[40px] flex justify-center items-center rounded"
                      onClick={handleAdd}
                      disabled={sending}
                    >
                      <img src='/icons/events/submit.svg' width={18} />
                    </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-2">Ошибка при отправке</p>}

        {loading ? (
          <p className="text-gray-400 text-sm">Загрузка комментариев...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-sm">{locale === "ru" ? 'Пока никто не поздравил' : 'Әлі ешкім құттықтаған жоқ'}</p>
        ) : (
          <ul className="flex flex-col mt-4 gap-3 max-h-[300px] overflow-y-auto pr-2">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
