'use client';

import { usePathname, useRouter } from 'next/navigation';

const SUPPORTED_LOCALES = ['kz', 'ru'];

function getCurrentLocale(pathname) {
  const [, lang] = pathname?.split('/') || [];
  return SUPPORTED_LOCALES.includes(lang) ? lang : 'kz';
}

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = getCurrentLocale(pathname);

  const toggleLocale = () => {
    const newLocale = currentLocale === 'kz' ? 'ru' : 'kz';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLocale}
      className="px-[10px] text-[var(--customDark)] flex gap-[10px] items-center"
    >
      <img src="/icons/langDarker.svg" className="w-[20px] h-[20px]" />
      <b className="font-semibold">{currentLocale.toUpperCase()}</b>
    </button>
  );
}
