import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Raleway } from 'next/font/google';
import "@/globals.css";
import EmployeeSearch from "@/components/EmployeeSearch";

import Link from "next/link";

import LeftBar from "@/components/LeftBar";
import ChatComponent from '@/components/ChatComponent';
import ChatModern from "@/components/ChatModern";
import Hamburger from "@/components/Hamburger"

import { SsoOrdersProvider } from '@/context/SsoOrdersContext';


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

export default async function AuthLayout({ children, params }) {
  const locale = params.locale;
  const token = cookies().get('access_token')?.value;

  if (!token) {
    redirect(`/${locale}/login`);
  }
  
  return (
    <html lang="en">
      <body className={`${raleway.variable} antialiased min-h-screen p-[10px] flex gap-[10px]`}>
          <SsoOrdersProvider>
          <div className="max-[1200px]:hidden h-fill">
              <LeftBar />
          </div>

        <div className='min-[1200px]:max-w-[calc(100%-360px)] max-[1200px]:w-full mx-auto w-full'>
          <header className="flex w-full gap-[10px] max-w-[1200px] items-center justify-between h-[70px] mb-[10px] rounded-[5px] max-[1200px]:bg-white max-[1200px]:shadow max-[1200px]:p-[10px] mx-auto">
          <Link href={`/${locale}/home`} className="flex items-center  gap-[10px] min-[1200px]:hidden">
            <img src="/Logo.svg" alt="Smart APA Logo" className="h-[50px] w-[50px]" />
            <div className="text-[var(--customDark)]">
              <b className="text-[14px] leading-[14px]">SMART ACADEMY</b>
              <p className="text-[12px] leading-[12px]"> {locale === 'kz' ? 'Бірегей платформа' : 'Единая платформа'}</p>
            </div>
          </Link>
            <div className='flex items-center gap-[10px] max-[1200px]:hidden'>
              <Link href="https://mail.apa.kz/owa/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <div className='w-[50px] h-[50px] flex items-center justify-center'>
                  <img src="/icons/Mail.svg" className="max-h-[25px] max-w-[25px]" />
                </div>
                Outlook
              </Link>

              <Link href="https://apa.documentolog.kz" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <div className='w-[50px] h-[50px] flex items-center justify-center'>
                  <img src="/icons/Documentolog.svg" className="max-h-[25px] max-w-[25px]" />
                </div>
                Documentolog
              </Link>
            </div>

            <EmployeeSearch />
            <Hamburger />
          </header>
          <main className="pt-[20px] max-w-[1200px]  scrollbar-hidden overflow-scroll flex flex-col gap-[10px] h-[calc(100vh-100px)] mx-auto">
            {children}
          </main>
        </div>
        {/* <div className="relative shadow rounded-[5px]"> */}
        <div className="max-[1200px]:hidden h-full">
        <ChatModern />
        </div>
        {/* </div> */}
        </SsoOrdersProvider>
      </body>
    </html>
  );
}
