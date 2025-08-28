"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthorizedUser } from "@/hooks/useAuthorizedUser";
import { useLocale } from '@/hooks/useLocale';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://devapi-smart.apa.kz";

export default function AuthorizedUser() {
  const locale = useLocale();
  const { user, error, loading } = useAuthorizedUser();
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (user && !user.image) {
      setShowModal(true);
    }
  }, [user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("user_image", file);

    try {
      const res = await fetch(`${API_BASE}/upload/user-photo`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Не удалось загрузить изображение");

      // После успешной загрузки обновить состояние
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      alert("Ошибка при загрузке фото: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="mt-[20px] flex flex-col gap-2 items-center">
          <img
            src="/default.png"
            className="mx-auto w-[100px] h-[100px] rounded-[50px] object-cover"
            alt="User Avatar"
          />
            <div className="w-full h-[20px] bg-gray-200 rounded animate-pulse"></div>
            <div className="w-3/4 h-[15px] bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">Ошибка: {error}</p>;
  }

  return (
    <>
      <div className="mt-[20px]">
        <Link href={`/${locale}/profile`}>
          <img
            src={`${API_BASE}${user.image || "/default-avatar.png"}`}
            className="mx-auto w-[100px] h-[100px] rounded-[50px] object-cover"
            alt="User Avatar"
          />
          <h4 className="text-[16px] text-[var(--customDark)] text-center mt-[15px] leading-[18px]">
            <b>{user.user_name} {user.user_surename} {user.user_patronymic}</b>
          </h4>
          <p className="text-[12px] text-[var(--customGray)] text-center mt-[5px]">
            <b>
              {locale === "ru" ? user.position_ru : user.position_kz}
            </b>
          </p>
        </Link>
      </div>
    </>
  );
}
