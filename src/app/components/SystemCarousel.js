'use client';

import { useParams } from "next/navigation";
import Link from 'next/link';
import Systems from "@/translations/systems";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";

import translations from "@/translations/translations";

export default function SystemCarousel() {
  const { locale } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [token, setToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://devapi-smart.kz";

  useEffect(() => {
    const t = Cookies.get("access_token");
    if (t) setToken(t);
  }, []);

  const resolveHref = (system, apiBaseUrl) => {
    let finalUrl = system.url
      ? system.url
      : `${apiBaseUrl}${system.path || ''}`;

    if (system.withToken && token) {
      const separator = finalUrl.includes("?") ? "&" : "?";
      finalUrl = `${finalUrl}${separator}token=${encodeURIComponent(token)}`;
    }

    return finalUrl;
  };

  return (
    <div className="max-w-[calc(100%)]">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        autoplay={{
          delay: 50000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Navigation, Autoplay]}
        breakpoints={{
          800: { slidesPerView: 2 },
          1400: { slidesPerView: 4 },
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {Object.entries(Systems).map(([key, system], index) => {
          const href = resolveHref(system, ApiBaseUrl);

          return (
            <SwiperSlide
              key={key}
              className={`flex justify-center transition-opacity duration-300 rounded-[15px] ${
                index === activeIndex
                  ? "bg-gradient-custom text-white hover:shadow"
                  : "bg-white text-[var(--customDark)]"
              }`}
            >
              <Link
                href={href}
                className="flex flex-col px-[20px] py-[30px] justify-between h-[100%] transition"
              >
                <div>
                  <div className="flex mb-[10px] w-[50px] h-[50px] items-center justify-center rounded-[15px] bg-[#F9F9F9]">
                    <img
                      src={`/icons${system.iconGreen}`}
                      alt={system.name[locale] || "icon"}
                      className="w-[30px] h-[30px] object-contain"
                    />
                  </div>
                  <b className="text-[16px] block">{system.domen}</b>
                  <p className="text-[14px] mt-[5px] line-clamp-2">
                    {system.shortdescription[locale]}
                  </p>
                </div>

                <p className="text-[14px] mt-[15px]">{translations.systems.button[locale]}</p>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Навигация */}
      <div className="flex gap-[15px] justify-center mt-4">
        <button className="swiper-button-prev-custom px-4 py-2">
          <img
            src="/icons/angle-left.svg"
            alt="Назад"
            className="w-[25px] h-[25px] cursor-pointer"
          />
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-[var(--customDark)] text-[14px] font-bold cursor-pointer"
        >
          {translations.systems.all[locale]}
        </button>
        <button className="swiper-button-next-custom px-4 py-2">
          <img
            src="/icons/angle-right.svg"
            alt="Вперёд"
            className="w-[25px] h-[25px] cursor-pointer"
          />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-lg max-w-5xl w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">{translations.systems.all[locale]}</h2>

            {/* Systems grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {Object.entries(Systems).map(([key, system]) => {
                const href = resolveHref(system, ApiBaseUrl);

                return (
                  <Link
                    key={key}
                    href={href}
                    className="group cursor-pointer flex flex-col items-center p-4 border rounded-xl
                        transition-all duration-300 ease-in-out
                        shadow-md hover:shadow-lg
                        hover:scale-105 hover:border-green-500 hover:bg-green-50"
                  >
                    <img
                      src={`/icons${system.iconGreen}`}
                      alt={system.name[locale] || "icon"}
                      className="w-[40px] h-[40px] object-contain mb-2"
                    />
                    <b className="text-sm text-center">{system.domen}</b>

                    {/* description */}
                    <p className="text-xs text-gray-500 text-center">
                      {system.shortdescription[locale]}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
