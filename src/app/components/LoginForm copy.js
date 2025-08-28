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
      <form className="flex flex-col gap-[10px] w-[400px] pb-[40px]">
        {/* Логин */}
        <label className="text-[14px] flex flex-col bg-[#F9F9F9] rounded-[5px] p-[10px]">
          <p className="text-[var(--customDark)]">Логин</p>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="text-[var(--customGreen)] placeholder-gray-500 py-[5px] outline-none"
            placeholder="Введите корпоративную почту"
          />
        </label>

        {/* Пароль */}
        <label className="text-[14px] flex flex-col bg-[#F9F9F9] rounded-[5px] p-[10px]">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <p className="text-[var(--customDark)]">{translations.login.password[locale]}</p>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin();
                }}
                className="text-[var(--customGreen)] w-full placeholder-gray-500 py-[5px] outline-none"
                placeholder="Введите свой пароль"
              />
            </div>
            <div>
              <button type="button" onClick={() => setShowPassword(prev => !prev)} className="py-2 pt-4 px-4">
                <img
                  src={showPassword ? "/icons/eye-open.svg" : "/icons/eye-close.svg"}
                  alt="Toggle password visibility"
                  className="w-[24px] h-[24px]"
                />
              </button>
            </div>
          </div>
        </label>

        <button
          type="button"
          onClick={handleLogin}
          className="bg-gradient-custom text-white rounded p-[10px] mt-[20px]"
        >
          <b>{translations.login.submit[locale]}</b>
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {/* Модалка */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded flex flex-col p-5 w-fit">
            <h3 className="text-lg font-bold mb-4">Проверьте почту</h3>
            <p className="mb-6">На вашу почту отправлена ссылка для входа в систему.</p>
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
