'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from "next/link";
import SystemSmart from "@/translations/SystemSmart";
import LogoutButton from '@/components/LogoutButton';
import { useLocale } from '@/hooks/useLocale';
import Cookies from 'js-cookie';

import { useRouter, usePathname } from 'next/navigation';

import AuthorizedUser from "@/components/AuthorizedUser";
import WeatherWidget from '@/components/WeatherWidget';



export default function LeftBar() {

  const locale = useLocale();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const changeLanguage = (lang) => {
    const pathname = window.location.pathname;
    const segments = pathname.split('/');
    segments[1] = lang;
    const newPath = segments.join('/');
    window.location.href = newPath;
  };
  const langRef = useRef(null);

  const [token, setToken] = useState(null);

  // Absence orders
  const [ssoUserLink, setSsoUserLink] = useState(null);
  const [ssoOrders, setSsoOrders] = useState([]);

  // Techdesk orders
  const [ssoTechdeskLink, setSsoTechdeskLink] = useState(null);
  const [ssoTechdeskOrders, setSsoTechdeskOrders] = useState([]);

  const handleLogout = () => {
    fetch("https://devapi-smart.apa.kz/logout/", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      }
    }).catch(console.error);

    localStorage.clear();
    sessionStorage.clear();
    Cookies.remove('access_token', { path: '/', domain: '.apa.kz' }); // если кука на общем домене

    window.location.href = '/';
  };


  useEffect(() => {
  const cookieToken = Cookies.get("access_token");
  setToken(cookieToken ?? null);

  if (!cookieToken) return;

  // helper to check cache validity
  const isCacheValid = (timeKey) => {
    const savedTime = localStorage.getItem(timeKey);
    if (!savedTime) return false;
    const diff = Date.now() - parseInt(savedTime, 10);
    return diff < 15 * 60 * 1000; // 15 minutes
  };

  // ---- Techdesk ----
  if (isCacheValid("techdeskTime") && localStorage.getItem("techdeskLink")) {
    setSsoTechdeskLink(localStorage.getItem("techdeskLink"));
    setSsoTechdeskOrders(JSON.parse(localStorage.getItem("techdeskOrders") || "[]"));
  } else {
    fetch("https://techdesk.apa.kz/api/check_access", {
      method: "GET",
      headers: { Authorization: `Bearer ${cookieToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.userLink) {
          setSsoTechdeskLink(data.userLink);
          localStorage.setItem("techdeskLink", data.userLink);
          localStorage.setItem("techdeskTime", Date.now().toString());
        }
        if (data.orders) {
          setSsoTechdeskOrders(data.orders);
          localStorage.setItem("techdeskOrders", JSON.stringify(data.orders));
        }
      })
      .catch(console.error);
  }
}, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col justify-between p-[10px] min-w-[270px] bg-white  h-full rounded-[5px] shadow">
        <Link href={`/${locale}/home`} className="flex items-center gap-[10px]">
          <img src="/Logo.svg" alt="Smart APA Logo" className="h-[50px] w-[50px]" />
          <div className="text-[var(--customDark)]">
            <b className="text-[14px] leading-[14px]">SMART ACADEMY</b>
            <p className="text-[12px] leading-[12px]"> {locale === 'kz' ? 'Бірегей платформа' : 'Единая платформа'}</p>
          </div>
        </Link>

        <AuthorizedUser />

        <nav className="flex flex-col justify-between h-full gap-[10px] mt-[40px] w-fit mx-auto">
          <div>
          {SystemSmart.map((system, index) => {
            const isExternal = system.url.startsWith("http");

              if (!token) {
                return (
                  <div key={`${system.url}-${index}`} className="group mt-2 opacity-50 pointer-events-none">
                    <div className="w-[75%} bg-gray-200 h-[20px] rounded animate-pulse">
                    </div>
                  </div>
              );
              }

              if (system.url === 'https://techdesk.apa.kz' && !ssoTechdeskLink ) {
              return (
                <div key={`${system.url}-${index}`} className="group mt-2 opacity-50 pointer-events-none">
                  <div className="flex items-center gap-[5px] cursor-not-allowed">
                    <div className="flex items-center justify-center w-[32px] h-[32px]">
                      {system.icon && (
                        <img src={`/icons/systems/${system.icon}`} alt={system.name[locale]} className="w-[18px] h-[18px]" />
                      )}
                    </div>
                    <b className="text-[var(--customDark)] text-[12px]">
                      {system.name[locale]}
                    </b>
                  </div>
                </div>
              );
            }
            let href = '';
            if (system.url === 'https://absence.apa.kz/check_access/login') {
              href = `${system.url}?token=${token ?? ''}`;
            } else if (system.url === 'https://techdesk.apa.kz') {
              href = ssoTechdeskLink || system.url;
            } else if (system.url === 'https://smartcloud.apa.kz') {
              href = `${system.url}?token=${token ?? ''}`;
            }
             else if (system.url === 'https://reg.apa.kz/login-session/') {
              href = `${system.url}?token=${token ?? ''}`;
            }
            else if (system.url === 'https://booking.apa.kz') {
                href = `${system.url}?token=${token ?? ''}&locale=${locale}`;
            }
            else if (isExternal) {
              href = system.url;
            } else {
              href = `/${locale}${system.url}`;
            }

            let target = '';
            if (system.url === 'https://30jasmuseum.apa.kz' || system.url === 'https://lib.apa.kz' || system.url === 'https://smartcloud.apa.kz') {
              target = '_blank';
            } else {
              target = '_self';
            }

            return(
              <div key={`${system.url}-${index}`} className="group mt-2">
                <Link
                  href={href}
                  target={target}
                  className="flex items-center gap-[5px]"
                >
                  <div className="flex items-center justify-center w-[32px] h-[32px]">
                    {system.icon && (
                      <img src={`/icons/systems/${system.icon}`} alt={system.name[locale]} className="w-[18px] h-[18px]" />
                    )}
                  </div>
                  <b className="text-[var(--customDark)] text-[12px]">{system.name[locale]}</b>
                </Link>
              </div>
            )
          })}
          </div>

            <div className="flex items-center gap-[10px]">
            <WeatherWidget />
            </div>

          <div className='flex flex-col gap-[10px]'>
            <Link className="flex items-center gap-[5px] mt-auto" 
            href={locale === "ru" ? '/ip/ИП рус.pdf' : '/ip/ИП каз.pdf'}
            target="_blank" rel="noopener noreferrer"
            >
            <div className="flex items-center justify-center w-[32px] h-[32px]">
              <i className='fa fa-clipboard-list text-[var(--customGray)]' />
            </div>
            <b className="text-[var(--customDark)] text-[12px]">{locale === "ru" ? 'Инструкция пользователя' : 'Қолданушы нұсқаулығы'}</b>
            </Link>
        <button className='relative' ref={langRef}>
          <div className="flex items-center gap-[5px] mt-auto relative" onClick={() => setShowLangMenu(prev => !prev)}>
            <div className="flex items-center justify-center w-[32px] h-[32px]">
              <img src="/icons/langDarker.svg" className="w-[18px] h-[18px]" alt="Lang" />
            </div>
            <b className="text-[var(--customDark)] text-[12px]">
              {locale === 'kz' ? 'Қазақ тілі' : 'Русский язык'}
            </b>
          </div>

            {showLangMenu && (
              <div className="absolute top-[-85px] left-0 bg-white shadow rounded-[5px] overflow-hidden flex flex-col w-[150px] z-50">
                <button
                  onClick={() => changeLanguage('kz')}
                  className={`px-4 py-2 text-left hover:bg-gray-100 ${locale === 'kz' ? 'bg-gray-50 font-bold' : ''}`}
                >
                  Қазақ тілі
                </button>
                <button
                  onClick={() => changeLanguage('ru')}
                  className={`px-4 py-2 text-left hover:bg-gray-100 ${locale === 'ru' ? 'bg-gray-50 font-bold' : ''}`}
                >
                  Русский язык
                </button>
              </div>
            )}
        </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-[5px] mt-auto"
          >
            <div className="flex items-center justify-center w-[32px] h-[32px]">
              <img src="/icons/systems/logout.svg" alt="Выход" />
            </div>
            <b className="text-[var(--customDark)] text-[12px]">{locale === "ru" ? 'Выйти' : 'Шығу'}</b>
          </button>
          </div>
        </nav>
    </div>
  );
}
