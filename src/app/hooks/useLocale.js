"use client";

import { usePathname } from "next/navigation";

const SUPPORTED_LOCALES = ["kz", "ru"];

export function useLocale() {
  const pathname = usePathname();
  const [, lang] = pathname?.split("/") || [];
  return SUPPORTED_LOCALES.includes(lang) ? lang : "kz";
}
