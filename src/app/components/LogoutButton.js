'use client';

import React from 'react';
import Cookies from 'js-cookie';

export default function LogoutButton() {
  const handleLogout = () => {
    fetch("https://devapi-smart.apa.kz/logout/", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      }
    }).catch(console.error);

    Cookies.remove('access_token');
    Cookies.remove('UserId');
    Cookies.remove('chatToken');
    Cookies.remove('chatList');

    localStorage.removeItem('userLink_ica');
    localStorage.removeItem('userLink_adm');

    window.location.href = '/';
  };

  return (
    <button onClick={handleLogout} className="flex mx-auto items-center gap-2 hover:shadow hover:bg-red-100 hover:text-red-600 transition duration-200">
      <div className="flex items-center justify-center w-[32px] h-[32px]">
        <img src="/icons/systems/logout.svg" alt="Выход" />
      </div>
      <b className="text-[var(--customDark)] text-[12px]">Выйти</b>
    </button>
  );
}



