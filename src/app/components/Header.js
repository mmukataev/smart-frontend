import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-[70px] px-[10px] mb-[10px] rounded-[15px] bg-gradient-custom text-white">
      <Link href="/home" className="flex items-center gap-[10px]">
        <img src="/Logo.svg" alt="Smart APA Logo" className="h-[50px] w-[50px]" />
        <div>
            <b className="text-[14px] leading-[14px]">SMART ACADEMY</b>
            <p className="text-[12px] leading-[12px]">Единная платформа</p>
        </div>
      </Link>

      <div className="w-[40px] h-[40px] flex items-center justify-center rounded-[5px] bg-[var(--custom-button-bg)] hover:bg-white transition-colors">
        <object data="/icons/question.svg" type="image/svg+xml" className="h-[24px] w-[24px]" aria-label="Help Icon"></object>
      </div>
    </header>
  );
}