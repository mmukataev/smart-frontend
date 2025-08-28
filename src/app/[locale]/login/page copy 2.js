"use client";

import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import SystemsShortVersion from "@/components/Systems/SystemsShortVersion";
import LocaleSwitcher from "@/components/LocaleSwitcher";

import { useLocale } from "@/hooks/useLocale";
import translations from "@/translations/translations";

export default function Login() {
  const locale = useLocale();
  
  return (
    <div className="flex gap-[10px] w-full" style={{ height: 'calc(100vh - 20px)' }}>
      <div className="flex flex-col w-2/5">
          <header className="flex w-full bg-white rounded shadow items-center justify-between h-[70px] px-[10px] mb-[10px]">
          <Link href="/home" className="flex items-center gap-[10px]">
            <img src="/Logo.svg" alt="Smart APA Logo" className="h-[50px] w-[50px]" />
            <div>
                <b className="text-[14px] leading-[14px]">SMART ACADEMY</b>
                <p className="text-[12px] leading-[12px]">{translations.login.logo[locale]}</p>
            </div>
          </Link>
            <div className="flex items-center gap-[10px]">
            <LocaleSwitcher />
            </div>
          </header>
        <div className="flex-1 px-[50px] flex flex-col my-auto justify-center items-center p-[10px] bg-white rounded shadow">
          <LoginForm />
        </div>
            </div>
      <div className="w-3/5 h-full flex justify-center items-center align-centertext-white bg-gradient-custom rounded shadow"  style={{ backgroundImage: "url('/Login.jpg')", objectFit: 'cover', backgroundPosition: 'center', backgroundSize: 'cover' }}>
      
      <div className="relative w-full h-full overflow-hidden m-[15%]">
        <img 
          src="/anim_better_ru/5.png" 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-slow" 
        />
        <img 
          src="/anim_better_ru/4.png" 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-medium" 
        />
        <img 
          src="/anim_better_ru/3.png" 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-fast" 
        />
        <img 
          src="/anim_better_ru/2.png" 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
        />
      </div>



      </div>
    </div>
  );
}
