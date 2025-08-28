import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import SystemsShortVersion from "@/components/Systems/SystemsShortVersion";

import { useLocale } from "@/hooks/useLocale";

export default function Login() {
  
  return (
    <div className="container mx-auto mt-[50px] max-w-[1200px]">
      <b className="text-[var(--customGreen)] text-[14px]">Добро пожаловать в единный портал</b>
      <h1 className="text-[36px] leading-[36px] text-transparent bg-clip-text bg-gradient-to-r from-[#E4987C] to-[#FAC791]"><b>SMART ACADEMY</b></h1>

      <div className="flex gap-[10px] mt-[10px]">
        <div className="flex-1 flex items-center justify-between bg-white rounded-[5px] p-[10px] shadow">
          <SystemsShortVersion />
          <img src="/systems.gif" alt="Systems GIF" className="w-[360px] h-[360px] rounded-[5px]" />
        </div>

        <div className="w-fit bg-white rounded-[5px] p-[10px] shadow">
          <LoginForm />
        </div>
      </div>

      <div className="flex items-center justify-center w-full h-[200px] mt-[20px] bg-white rounded-[5px] p-[10px] shadow relative z-[2]">
        <img src="/Man.png" alt="SmartAcademyGuy" className=" h-[450px] rounded-[5px]" />
        <div>
          <h4 className="text-[var(--customGreen)] text-[24px]"><b>Требуется помощь?</b></h4>
          <p className="text-[var(--customDark)] text-[14px]">Свяжитесь с нашей технической поддержкой в WHATSAPP нажав на кнопку ниже</p>

          <Link href="/" className="flex items-center justify-center h-[40px] w-fit px-[30px] bg-[#F9F9F9] rounded-[5px] mt-[20px]">
            <b className="text-[var(--customDark)] text-[14px]">Обратится за помощью</b>
          </Link>
        </div>
      </div>
    </div>
  );
}
