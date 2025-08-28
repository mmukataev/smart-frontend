'use client'

import { useEffect, useState } from 'react'
import { useLikeEvent } from '@/hooks/useLikeEvent'
import { useCheckLikedEvent } from '@/hooks/useCheckLikedEvent'

import EventComments from '@/components/EventComments'

export default function EventDetailPage({ eventId }) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [likeCount, setLikeCount] = useState(0)

  const { likeEvent } = useLikeEvent()
  const { checkLiked, likedMap } = useCheckLikedEvent()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/detail/${eventId}/`)
        const data = await res.json()
        setEvent(data)
        setLikeCount(data.likes_count)
      } catch (err) {
        console.error('Ошибка загрузки события:', err)
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
      checkLiked({ eventId })
    }
  }, [eventId])

  const handleLike = async () => {
    const res = await likeEvent({ eventId })
    if (!res?.message?.includes('successfully')) return

    const isLike = res.message === 'Liked successfully'
    await checkLiked({ eventId })

    setLikeCount((prev) => prev + (isLike ? 1 : -1))
  }

  if (loading) return <p className="p-4">Загрузка...</p>
  if (!event) return <p className="p-4">Событие не найдено.</p>

  return (
    <div className='h-full overflow-y-auto scrollbar-hidden'>
      <li className="bg-white shadow items-center rounded-[5px] list-none mt-6">
        {event.image && (
          <img
            src={`${event.image}`}
            alt={event.title}
            className="w-full h-[450px] rounded-t-[5px] object-cover"
          />
        )}

        <div className='px-[20px] pt-[10px] pb-[20px]'>
          <b className='text-[18px] mb-3 block'>{event.title}</b>
          <p className='text-[14px] text-[var(--customGray)]'>{event.description}</p>

          <hr className='w-full my-[10px]' />

          <div className='flex justify-between gap-[5px] mt-4'>
            <div className='flex gap-6'>
              <button
                onClick={handleLike}
                className="text-[14px] py-[5px] flex gap-2 text-[var(--customDark)]"
              >
                <img
                  src={likedMap[event?.id] ? '/icons/events/heart-filled.svg' : '/icons/events/heart.svg'}
                  width={16}
                  alt="like"
                />
                {likeCount}
              </button>
              <button className="text-[14px] py-[5px] flex gap-2 text-[var(--customDark)]">
                <img src='/icons/events/comments.svg' width={16} />
                {event.comments_count}
              </button>
            </div>

            <div className='flex gap-4'>
              <p className="text-[14px] py-[5px] flex gap-2 text-[var(--customDark)]">
                <img src='/icons/events/date.svg' width={16} />
                {event.time?.slice(0, 5)}
              </p>
            </div>
          </div>
        </div>
      </li>

      <h4 className='mt-4 mb-2 text-white text-[18px]'>Комментарий</h4>
      <div className='bg-white px-[20px] py-[10px] rounded-[5px] shadow'>
        <EventComments eventId={event.id} />
      </div>
    </div>
  )
}
