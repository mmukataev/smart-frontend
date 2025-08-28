'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Пример вакансий
const vacancies = [
  {
    id: 1,
    title: {
      ru: 'Преподаватель кафедры государственного управления',
      kz: 'Мемлекеттік басқару кафедрасының оқытушысы',
    },
    description: {
      ru: 'Преподавание дисциплин по госуправлению, участие в научных проектах и методической работе.',
      kz: 'Мемлекеттік басқару пәндерін оқыту, ғылыми жобаларға және әдістемелік жұмысқа қатысу.',
    },
    url: '/vacancies/1',
    icon: '/Teacher.svg',
  },
  {
    id: 2,
    title: {
      ru: 'Методист учебного отдела',
      kz: 'Оқу бөлімінің әдіскері',
    },
    description: {
      ru: 'Сопровождение учебного процесса, составление расписаний, работа с преподавателями.',
      kz: 'Оқу процесін сүйемелдеу, сабақ кестелерін құру, оқытушылармен жұмыс істеу.',
    },
    url: '/vacancies/2',
    icon: '/Methodist.svg',
  },
  {
    id: 3,
    title: {
      ru: 'Специалист IT-отдела',
      kz: 'IT бөлімінің маманы',
    },
    description: {
      ru: 'Поддержка внутренних систем, обслуживание оборудования и ПО.',
      kz: 'Ішкі жүйелерді қолдау, жабдықтар мен бағдарламаларды қызмет көрсету.',
    },
    url: '/vacancies/3',
    icon: '/IT.svg',
  },
  {
    id: 4,
    title: {
      ru: 'Методист учебного отдела',
      kz: 'Оқу бөлімінің әдіскері',
    },
    description: {
      ru: 'Сопровождение учебного процесса, составление расписаний, работа с преподавателями.',
      kz: 'Оқу процесін сүйемелдеу, сабақ кестелерін құру, оқытушылармен жұмыс істеу.',
    },
    url: '/vacancies/2',
    icon: '/Methodist.svg',
  },
  {
    id: 5,
    title: {
      ru: 'Специалист IT-отдела',
      kz: 'IT бөлімінің маманы',
    },
    description: {
      ru: 'Поддержка внутренних систем, обслуживание оборудования и ПО.',
      kz: 'Ішкі жүйелерді қолдау, жабдықтар мен бағдарламаларды қызмет көрсету.',
    },
    url: '/vacancies/3',
    icon: '/IT.svg',
  },
  {
    id: 6,
    title: {
      ru: 'Преподаватель кафедры государственного управления',
      kz: 'Мемлекеттік басқару кафедрасының оқытушысы',
    },
    description: {
      ru: 'Преподавание дисциплин по госуправлению, участие в научных проектах и методической работе.',
      kz: 'Мемлекеттік басқару пәндерін оқыту, ғылыми жобаларға және әдістемелік жұмысқа қатысу.',
    },
    url: '/vacancies/1',
    icon: '/Teacher.svg',
  },
];

export default function VacancyCarousel() {
  const { locale } = useParams();
  const currentLocale = locale || 'ru';

  return (
    <div className="w-full mt-4">
      <h4 className='text-[24px] font-bold text-[var(--customDark)] mb-2'>
        Вакансии
      </h4>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Autoplay]}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {vacancies.map((vacancy) => (
          <SwiperSlide key={vacancy.id} className="flex justify-center">
            <Link
              href={`/${currentLocale}${vacancy.url}`}
              className="w-full flex flex-col px-[20px] py-[30px] justify-between rounded-[15px] bg-white h-[100%] hover:shadow-md transition"
            >
              <div>
                {/* <div className="flex mb-[10px] w-[50px] h-[50px] items-center justify-center rounded-[15px] bg-[#F9F9F9]">
                  <img
                    src={vacancy.icon}
                    alt={vacancy.title[currentLocale]}
                    className="w-[30px] h-[30px] object-contain"
                  />
                </div> */}
                <b className="text-[16px] text-[var(--customDark)] block">
                  {vacancy.title[currentLocale]}
                </b>
                <p className="text-[14px] text-[var(--customGray)] mt-[5px] line-clamp-2">
                  {vacancy.description[currentLocale]}
                </p>
              </div>

              {/* <p className="text-[var(--customGreen)] text-[14px] mt-[15px]">
                Подробнее
              </p> */}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Навигация */}
      <div className="flex gap-[15px] justify-center mt-4">
        <button className="swiper-button-prev-custom px-4 py-2">
          <img src="/icons/angle-left.svg" alt="Назад" className="w-[25px] h-[25px]" />
        </button>
        <button className="text-[var(--customDark)] text-[14px] font-bold">
          Все вакансии
        </button>
        <button className="swiper-button-next-custom px-4 py-2">
          <img src="/icons/angle-right.svg" alt="Вперёд" className="w-[25px] h-[25px]" />
        </button>
      </div>
    </div>
  );
}
