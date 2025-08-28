'use client';

import { useEffect, useState } from 'react';
import { useAddComment } from '@/hooks/useAddComment';
import useReplyToComment from '@/hooks/useReplyToComment';

export default function EventComments({ eventId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // id коммента, на который отвечаем
  const [replyText, setReplyText] = useState('');

  const { addComment, loading: submitting, error } = useAddComment();
  const { replyToComment, loading: replying, error: replyError } = useReplyToComment();

  const fetchComments = async () => {
    if (!eventId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/comments/${eventId}/`);
      if (!res.ok) throw new Error('Ошибка при получении комментариев');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('Ошибка при получении комментариев:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
      const added = await addComment({
        event_id: eventId,
        text: newComment,
      });
    if (added) {
      setNewComment('');
      fetchComments();
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (!replyText.trim()) return;

    const addedReply = await replyToComment({
      eventId,
      employeeId: 159, // 🔁 заменить на актуального юзера
      parentCommentId: parentId,
      text: replyText,
    });

    if (addedReply) {
      setReplyingTo(null);
      setReplyText('');
      fetchComments();
    }
  };

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

  return (
    <div className="mt-4">
      <div className="flex flex gap-2 mb-3">
        <input
          type="text"
          className="w-full p-2 border border-gray-200 rounded text-sm outline-none"
          placeholder="Введите комментарий..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === 'Enter') handleAddComment();
          }}
        />
        <button
          className="bg-gradient-custom text-white w-[40px] h-[40px] flex justify-center items-center rounded"
          onClick={handleAddComment}
          disabled={submitting}
        >
          <img src='/icons/events/submit.svg' width={18} />
        </button>
        {error && <p className="text-red-500 text-sm">Ошибка при отправке комментария.</p>}
      </div>

      {loading ? (
        <p className="text-[14px] text-gray-400">Загрузка комментариев...</p>
      ) : comments.length === 0 ? (
        <p className="text-[14px] text-gray-400">Комментариев пока нет.</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {comments.map((comment) => (
            <li key={comment.id} className="flex flex-col gap-1 bg-gray-50 p-2 rounded-[5px]">
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

              {/* Кнопка "Ответить" */}
              <div className="pl-[50px] mt-1">
                {replyingTo === comment.id ? (
                  <>
                  <div className='flex flex gap-2 mb-3'>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded text-sm outline-none"
                      placeholder="Ваш ответ..."
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
                      Ответить
                    </button>
                  </div>
                    {replyError && <p className="text-red-500 text-sm">Ошибка при ответе.</p>}
                  </>
                ) : (
                  <button
                    className="text-blue-500 text-sm hover:underline"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    Ответить
                  </button>
                )}
              </div>

              {/* Ответы */}
              {comment.replies && comment.replies.length > 0 && (
                <ul className="pl-[50px] mt-2 flex flex-col gap-2">
                  {comment.replies.map((reply) => (
                    <li key={reply.id} className="flex gap-2 items-start">
                      <img
                        src={reply.employee?.photo || '/default-user.png'}
                        className="w-[32px] h-[32px] object-cover rounded-full"
                      />
                      <div className="px-3 py-2 w-full flex justify-between">
                        <div>
                        <p className="text-[13px] font-semibold text-black">
                          {reply.employee?.full_name || 'Пользователь'}
                        </p>
                        <p className="text-[13px] text-gray-700">{reply.text}</p>  
                        </div>
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
