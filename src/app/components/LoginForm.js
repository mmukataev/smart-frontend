"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useLocale } from '@/hooks/useLocale';

import translations from "@/translations/translations";

export default function LoginForm() {
  const router = useRouter();
  const locale = useLocale();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ для модалки

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/autorize/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) throw new Error('Ошибка входа');

      const data = await response.json();
      const chatToken = data.chattoken;
      const chatList = data.chatlist;
      const UserId = data.chatuserid;
      console.log("API response:", data);
      console.log("data:", data);

      Cookies.set('UserId', UserId);
      Cookies.set('chatToken', chatToken);
      console.log("chatToken:", chatToken);
      Cookies.set('chatList', JSON.stringify(chatList));
      Cookies.set('all', JSON.stringify(data));

      if (data.status === 'login successful') {
        // вход успешен → редирект
        router.push(`/${locale}/home`);
      } else if (data.status === 'need verification') {
        // нужно подтвердить email → показываем модалку
        setShowModal(true);
      } else {
        setError('Неверный логин или пароль');
      }

    } catch (err) {
      console.error(err);
      setError('Неверный логин или пароль');
    }
  };


  return (
    <>
      <form className="flex flex-col gap-[10px] w-full max-w-[600px] pb-[40px] text-white">
        <b className="w-full max-w-[600px] mb-[20px] mb-[20px] text-[22px] text-center uppercase">
          {locale === "ru" ? 'Добро пожаловать в единый портал для сотрудников академий' : 'Академия қызметкерлеріне арналған бірыңғай порталға қош келдіңіз'}
        </b>
        {/* Логин */}
        <label className="text-[14px] flex flex-col">
          <b className="mb-1">Логин</b>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="h-[50px] placeholder-white py-[10px] px-[15px] border border-gray-400 outline-none rounded"
            placeholder={locale === "ru" ? 'Введите корпоративную почту' : 'Корпоративтік поштаны енгізіңіз'}
          />
        </label>

        {/* Пароль */}
        <label className="text-[14px] flex flex-col mt-2">
          <b className="mb-1">{translations.login.password[locale]}</b>
          <div className="flex items-center justify-between">
            <div className="h-[50px] w-full flex items-center py-[10px] px-[15px] border border-gray-400 outline-none rounded">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin();
                }}
                className="w-full placeholder-white outline-none"
                placeholder={locale === "ru" ? 'Введите свой пароль' : 'Құпия сөзіңізді енгізіңіз'}
                autocomplete="new-password" 
              />
                <img
                  onClick={() => setShowPassword(prev => !prev)}
                  src={showPassword ? "/icons/eye-open.svg" : "/icons/eye-close.svg"}
                  alt="Toggle password visibility"
                  className="w-[24px] h-[24px]"
                />
              </div>
          </div>
        </label>

        <button
          type="button"
          onClick={handleLogin}
          className="h-[50px] bg-gradient-custom text-white rounded p-[10px] mt-[20px]"
        >
          <b>{translations.login.submit[locale]}</b>
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {/* Модалка */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded flex flex-col p-5 w-fit">
            <h3 className="text-lg font-bold mb-4">{locale === "ru" ? 'Проверьте почту' : 'Поштаңызды тексеріңіз'}</h3>
            <p className="mb-6">{locale === "ru" ? 'На вашу почту отправлена ссылка для входа в систему.' : 'Жүйеге кіру үшін сілтеме сіздің поштаңызға жіберілді.'}</p>
            <button
              className="bg-gradient-custom text-white px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
