'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
// import { id } from 'date-fns/locale';
import Link from 'next/link';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Ошибка при разборе токена JWT:', error);
    return null;
  }
}

const employees = [
  {
    name: 'Керимбаев Айбек Оразгалиевич',
    image: '/images/Керимбаев Айбек Центр Цифровых Технологий.jpg',
    account: 'a.kerimbayev',
    id: "157"
  },
  {
    name: 'Кулынчаков Канат Сабитович',
    image: '/images/Кулынчаков Канат Центр Цифровых Технологий.jpg',
    account: 'k.kulynchakov',
    id: "152"
  },
  {
    name: 'Мұқатаев Мәди Ержанұлы',
    image: '/images/Мұқатаев Мади Центр Цифровых Технологий.jpg',
    account: 'm.mukataev',
    id: "159"
  },
  // {
  //   name: 'Уалбеков Сергей',
  //   image: '/images/Уалбеков Серге.jpg',
  //   account: 's.ualbekov',
  // },
  // {
  //   name: 'Махат Алуа Бостандыққызы',
  //   image: '/images/Махат Алуа Бостандыққызы.jpg',
  //   account: 'makhat.alua',
  //   id: "150"
  // },
  // {
  //   name: 'Альмуканов Альберт Мыразбаевич',
  //   image: '/images/альмуканов-альберт-мыразбаевич.jpg',
  //   account: 'a.almukanov',
  //   id: "153"
  // },
  // {
  //   name: 'Тлеков Бейсенбай Тлекович',
  //   image: '/images/тлеков-бейсенбай-тлекович.jpg',
  //   account: 'beisen.tlekov',
  //   id: "154"
  // },
  {
    name: 'Оралов Бахтияр Сайлауғазыұлы',
    image: '/images/оралов-бахтияр-сайлауазылы.jpg',
    account: 'b.oralov',
    id: "155"
  },
  // {
  //   name: 'Кинжебаев Руслан Сатбекович',
  //   image: '/images/кинжебаев-руслан-сатбекович.jpg',
  //   account: 'r.kinzhebayev',
  //   id: "156"
  // },
  {
    name: 'Болатбек Динара Маратқызы',
    image: '/images/болатбек-динара-маратызы.jpg',
    account: 'd.bolatbek',
    id: "158"
  },
  // {
  //   name: 'Джони <3',
  //   image: '/images/Джони.jpg',
  //   account: 'j.depp',
  // },
];


export default function ChatComponent() {
  const [username, setUsername] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [chatToken, setChatToken] = useState(null);
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const token = Cookies.get('chatToken');
    if (token) setChatToken(token);

    const chatListFromCookies = Cookies.get('chatList');
    if (chatListFromCookies) {
      try {
        setChatList(JSON.parse(chatListFromCookies));
      } catch (e) {
        console.error('Ошибка при разборе chatList:', e);
      }
    }

    const access_token = Cookies.get('access_token');
    if (access_token) {
      const decoded = parseJwt(access_token);
      if (decoded?.username) {
        const cleanUsername = decoded.username.split('@')[0];
        setUsername(cleanUsername);
      }
    }
  }, []);
  

  const handleClick = (account) => {
    const employee = employees.find((emp) => emp.account === account);
    setSelectedAccount(account);
    setSelectedEmployee(employee);
  };

  const closeChat = () => {
    setSelectedAccount(null);
    setSelectedEmployee(null);
  };


  return (
    <div
      className={`flex rounded-[15px] z-[999999999999] px-[0px]`}
      style={{
        height: '100%',
        top: selectedEmployee ? '0px' : 'auto',
        position: selectedEmployee ? 'absolute' : 'relative',   // Абсолют при выбранном сотруднике
        bottom: selectedEmployee ? '10px' : 'auto',             // Координаты для absolute
        right: selectedEmployee ? '0px' : 'auto',
        background: '#FFF',
        backdropFilter: 'blur(50px)',
        WebkitBackdropFilter: 'blur(50px)',
        width: selectedEmployee ? '700px' : 'auto',
        borderRadius: '15px',
        boxShadow: selectedEmployee ? '0 4px 10px rgba(0,0,0,0.3)' : 'none',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        zIndex: selectedEmployee ? 9999 : 'auto',
      }}
    >
        <div
          className='flex flex-col gap-[10px] pt-[16px] px-[10px]'
          style={{
            borderRight: selectedEmployee ? 'solid 1px #15312A' : 'none',
          }}
        >
          <div className='w-[50px] h-[50px] flex items-center justify-center'>
            <img src='/icons/chat.svg' className='w-[24px] h-[24px]' />
          </div>

          {employees.map((employee, index) => (
            <div key={index} onClick={() => handleClick(employee.account)} style={{ cursor: 'pointer' }}>
              <img
                src={employee.image}
                alt={employee.name}
                className='w-[50px] h-[50px] rounded-[15px] object-cover border border-[5px] border-orange-100'
              />
            </div>
          ))}
        </div>
        <div id='chat' className='w-full h-fill'>
          {selectedEmployee && (
            <div className='w-full h-[90px] flex items-center justify-between px-4'>
              <Link href={`/employee/${selectedEmployee.id}`} className='flex items-center'>
                <img
                  src={selectedEmployee.image}
                  alt={selectedEmployee.name}
                  className='w-[50px] h-[50px] rounded-[15px] object-cover mr-2'
                />
                <h4 className='text-[16px] text-[var(--customDark)] font-semibold'>{selectedEmployee.name}</h4>
              </Link>
              <button
                onClick={closeChat}
                className='text-black w-[50px] h-[50px] rounded-[5px]'
              >
                X
              </button>
            </div>
          )}
          {selectedAccount && chatToken && (
            <iframe
            src={`https://chat.apa.kz/direct/${selectedEmployee.account}?resumeToken=${chatToken}&createDirect=1`}
              className='w-full'
              style={{ height: 'calc(100vh - 90px)' }}
            />

          )}
        </div>
      </div>
  );
}
