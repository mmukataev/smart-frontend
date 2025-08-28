'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/hooks/useLocale';

export default function CurrentWeather() {
  const locale = useLocale();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const weatherIcons = {
    0: {
      img: 'sun.svg',
      ru: 'Ясно',
      kz: 'Ашық аспан',
    },
    1: {
      img: 'sun.svg',
      ru: 'Преимущественно ясно',
      kz: 'Көбіне ашық',
    },
    2: {
      img: 'sun-cloud.svg',
      ru: 'Переменная облачность',
      kz: 'Ауыспалы бұлтты',
    },
    3: {
      img: 'sun-cloud.svg',
      ru: 'Пасмурно',
      kz: 'Бұлтты',
    },
    45: {
      img: 'fog.svg',
      ru: 'Туман',
      kz: 'Тұман',
    },
    48: {
      img: 'fog.svg',
      ru: 'Иней и туман',
      kz: 'Қырау және тұман',
    },
    51: {
      img: 'drizzle.svg',
      ru: 'Лёгкая морось',
      kz: 'Жеңіл жаңбыр',
    },
    53: {
      img: 'drizzle.svg',
      ru: 'Умеренная морось',
      kz: 'Орташа жаңбыр',
    },
    55: {
      img: 'drizzle.svg',
      ru: 'Сильная морось',
      kz: 'Күшті жаңбыр',
    },
    56: {
      img: 'freezing-drizzle.svg',
      ru: 'Переохлаждённая морось (лёгкая)',
      kz: 'Қатты жаңбыр (жеңіл)',
    },
    57: {
      img: 'freezing-drizzle.svg',
      ru: 'Переохлаждённая морось (сильная)',
      kz: 'Қатты жаңбыр (күшті)',
    },
    61: {
      img: 'sun-rain.svg',
      ru: 'Лёгкий дождь',
      kz: 'Жеңіл жаңбыр',
    },
    63: {
      img: 'rain.svg',
      ru: 'Умеренный дождь',
      kz: 'Орташа жаңбыр',
    },
    65: {
      img: 'rain.svg',
      ru: 'Сильный дождь',
      kz: 'Күшті жаңбыр',
    },
    66: {
      img: 'freezing-rain.svg',
      ru: 'Переохлаждённый дождь (лёгкий)',
      kz: 'Қатты жаңбыр (жеңіл)',
    },
    67: {
      img: 'freezing-rain.svg',
      ru: 'Переохлаждённый дождь (сильный)',
      kz: 'Қатты жаңбыр (күшті)',
    },
    71: {
      img: 'snow.svg',
      ru: 'Лёгкий снег',
      kz: 'Жеңіл қар',
    },
    73: {
      img: 'snow.svg',
      ru: 'Умеренный снег',
      kz: 'Орташа қар',
    },
    75: {
      img: 'snow.svg',
      ru: 'Сильный снег',
      kz: 'Күшті қар',
    },
    77: {
      img: 'snow.svg',
      ru: 'Снежные зёрна',
      kz: 'Қар түйіршіктері',
    },
    80: {
      img: 'rain.svg',
      ru: 'Ливень (лёгкий)',
      kz: 'Найзағай (жеңіл)',
    },
    81: {
      img: 'rain.svg',
      ru: 'Ливень (умеренный)',
      kz: 'Найзағай (орташа)',
    },
    82: {
      img: 'rain.svg',
      ru: 'Ливень (сильный)',
      kz: 'Найзағай (күшті)',
    },
    85: {
      img: 'snow.svg',
      ru: 'Снегопад (лёгкий)',
      kz: 'Қар (жеңіл)',
    },
    86: {
      img: 'snow.svg',
      ru: 'Снегопад (сильный)',
      kz: 'Қар (күшті)',
    },
    95: {
      img: 'rain.svg',
      ru: 'Гроза',
      kz: 'Найзағай',
    },
    96: {
      img: 'rain.svg',
      ru: 'Гроза с небольшим градом',
      kz: 'Ұсақ бұршақпен найзағай',
    },
    99: {
      img: 'rain.svg',
      ru: 'Гроза с сильным градом',
      kz: 'Ірі бұршақпен найзағай',
    },
  };


  useEffect(() => {
    const fetchCurrentWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=51.16&longitude=71.43&current_weather=true&timezone=Asia/Almaty'
        );
        if (!res.ok) throw new Error('Ошибка сети');
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCurrentWeather();
  }, []);

  if (error) return <p>Ошибка: {error}</p>;
  if (!weather) return <p className="px-4 py-6 bg-gradient-custom rounded-[15px] w-full flex flex-col justify-center items-center gap-[15px] text-white">Загрузка погоды...</p>;

    const weatherInfo = weatherIcons[weather.weathercode] || {
    img: 'default.svg',
    ru: 'Неизвестно',
    kz: 'Белгісіз'
  };

  return (
    <div className="px-4 py-[10px] bg-gradient-custom rounded-[15px] w-full flex justify-center items-center gap-[15px] text-white">
      <img src={`/icons/weather/${weatherInfo.img}`} alt="Погода" className="w-[40px] h-[40px]" />
      {/* <p className="text-[16px] font-semibold">{weatherInfo.ru}</p> */}
      <div className='gap-[15px] items-center'>
      <p className="text-[26px] font-bold leading-[32px]">{Math.round(weather.temperature)}°C</p>
      <p className="text-[14px] font-semibold leading-[16px]">{locale === "ru" ? weatherInfo.ru : weatherInfo.kz}</p>
      {/* <p className='text-[16px] leading-[16px]'><b>Ветер:</b><br/>{weather.windspeed} км/ч</p> */}
      </div>
    </div>
  );
}
