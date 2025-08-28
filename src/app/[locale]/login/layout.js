import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Raleway } from 'next/font/google';
import "@/globals.css";

import Link from "next/link";
import Header from "@/components/Header";
import LocaleSwitcher from '@/components/LocaleSwitcher';

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
});

export const metadata = {
  title: "Smart Academy",
  description: "Смарт Академия",
  icons: {
    icon: '/Logo.svg',
  },
};

export default function LoginLayout({ children, params}) {
  const locale = params.locale;
  const cookieStore = cookies();
  const token = cookieStore.get('access_token');

  if (token) {
    redirect(`/${locale}/home`);
  }

  return (
    <html lang="en">
      <body
        className={`${raleway.variable} antialiased flex flex-col`}
        style={{
          height: 'calc(100vh)',
          backgroundImage: "url('/FINALL.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          objectFit: 'cover'
        }}
      >

          {/* <header className="flex w-full bg-white rounded shadow items-center justify-between h-[70px] px-[10px] mb-[10px]">
          <Link href="/home" className="flex items-center gap-[10px]">
            <img src="/Logo.svg" alt="Smart APA Logo" className="h-[50px] w-[50px]" />
            <div>
                <b className="text-[14px] leading-[14px]">SMART ACADEMY</b>
                <p className="text-[12px] leading-[12px]">Единная платформа</p>
            </div>
          </Link>
            <div className="flex items-center gap-[10px]">
            <LocaleSwitcher />
            </div>
          </header> */}
        {children}
      </body>
    </html>
  );
}
