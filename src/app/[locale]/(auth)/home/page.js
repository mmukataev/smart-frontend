'use client';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import { useAuthorizedUser } from "@/hooks/useAuthorizedUser";
import { useLocale } from "@/hooks/useLocale";
import useDailyQuote from "@/hooks/useDailyQuote";

import SystemCarousel from '@/components/SystemCarousel';
import Zayavki from '@/components/Zayavki';
import Calendar from '@/components/Calendar';
import VacancyCarousel from '@/components/vacancyCarousel';
import Map from '@/components/Map';

import translations from '@/translations/translations';

export default function Home() {
  const locale = useLocale();
  const { quote } = useDailyQuote();
  const { user } = useAuthorizedUser();

  const [username, setUsername] = useState('');
  const [chatList, setChatList] = useState([]);
  

  
useEffect(() => {
  const uid = Cookies.get('UserId');
  const token = Cookies.get('chatToken');
  const list = Cookies.get('chatList');
  const access_token = Cookies.get('access_token');

  if (access_token) {
      const decoded = parseJwt(access_token);
      console.log('🟢 Декодированный JWT:', decoded);
      if (decoded?.username) {
        const cleanUsername = decoded.display_name.split('@')[0];
        setUsername(cleanUsername);
      }
    }

  console.log('🟢 Cookies:', { uid, token, list });

  // setUserId(uid);
  // setChatToken(token);

  try {
    const parsedList = JSON.parse(list || '[]');
    console.log('🟢 Parsed chatList:', parsedList);
    setChatList(parsedList);
  } catch (e) {
    console.error('❌ Ошибка парсинга chatList', e);
  }
  

  },

[]);

function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (e) {
      console.error('Ошибка декодирования JWT:', e);
      return null;
    }
  }
   

  return (
    <>
      <div className='flex flex-col gap-[10px]'>
        <div className='flex flex-col justify-center py-[50px] max-[1200px]:my-[100px]'>
          <h3 className='text-[24px] text-[var(--customDark)] leading-[28px] font-bold'>{translations.home.welcome[locale]}, <a className='text-[var(--customGreen)]'> {user ? user.user_name : "Гость"}</a>!<br/>{translations.home.pray[locale]}</h3>
          <p className='text-[16px] text-[var(--customGray)] italic mt-[15px]'>“{quote?.[`quote_${locale}`] || quote?.quote_ru}”</p>
        </div>
      </div>

      <SystemCarousel />
      <div className='flex gap-[10px] max-[1200px]:flex-col'>
        <Zayavki />
        <Calendar />
      </div>
      {/* <VacancyCarousel /> */}
      {/* <Map /> */}
    </>


  );
}
