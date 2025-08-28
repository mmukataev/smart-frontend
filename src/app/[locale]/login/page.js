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
    <div className="flex flex-col max-w-[600px] gap-[10px] w-full m-auto">
          <header className="flex w-full bg-white rounded shadow items-center justify-between h-[70px] px-[25px]">
          <Link href="/home" className="flex items-center gap-[10px]">
            <img src="/Logo.svg" alt="Smart APA Logo" className="h-[50px] w-[50px]" />
            <div>
                <b className="text-[14px] leading-[14px]">SMART ACADEMY</b>
                {/* <p className="text-[12px] leading-[12px]">{translations.login.logo[locale]}</p> */}
            </div>
          </Link>
            <div className="flex items-center gap-[10px]">
            <LocaleSwitcher />
            </div>
          </header>
        <div className="flex-1 px-[25px] shadow flex flex-col my-auto justify-center items-center py-[85px] bg-black/10 backdrop-blur-xl rounded shadow">
          <LoginForm />
        </div>
    </div>
  );
}
