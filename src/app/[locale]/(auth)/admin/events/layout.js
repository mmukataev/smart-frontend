'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useLocale } from "@/hooks/useLocale";

export default function AdminEventsLayout({ children }) {
    const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId || employeeId !== '159') {
      router.replace('/${locale}/home');
    }
  }, [router]);

  return <div>{children}</div>;
}
