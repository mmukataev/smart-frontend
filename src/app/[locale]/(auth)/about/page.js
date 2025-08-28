"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import translations from "@/translations/translations";

export default function AboutPage() {
  const locale = useLocale();

  return (
    <div className="mx-auto py-12 space-y-16">
      <Link
        href={`/${locale}/`}
        className="knopkaKotoruyuYaNeLubluNoAluaZastavilaMenyaEyoDelat h-[50px] flex items-center justify-center px-[30px] w-fit rounded"
      >
        {locale === "ru" ? "Назад" : "Артқа"}
      </Link>

      {/* Заголовок */}
      <section>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {locale === "ru" ? "О нас" : "Біз туралы"}
        </h1>
        <p className="text-lg leading-relaxed text-gray-700">
          <b>Smart Academy</b> — {translations.about.about[locale]} <br />
          <br />
          {translations.about.abzac[locale]}
        </p>
      </section>

      {/* Миссия */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {translations.about.missin[locale]}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {translations.about.miisiontext[locale]}
        </p>
      </section>

      {/* Основные возможности (2 колонки) */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {translations.about.vozmojnosti.title[locale]}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 text-gray-700 leading-relaxed">
          <ul className="space-y-3 list-disc list-inside">
            <li>{translations.about.vozmojnosti.list.v1[locale]}</li>
            <li>{translations.about.vozmojnosti.list.v2[locale]}</li>
            <li>{translations.about.vozmojnosti.list.v3[locale]}</li>
            <li>{translations.about.vozmojnosti.list.v4[locale]}</li>
            <li>{translations.about.vozmojnosti.list.v5[locale]}</li>
            <li>{translations.about.vozmojnosti.list.v6[locale]}</li>
          </ul>
          <ul className="space-y-3 list-disc list-inside">
            {translations.about.services[locale].map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Доступ к системам Академии (2 колонки) */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {translations.about.systems.title[locale]}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          {translations.about.systems.description[locale]}
        </p>
        <div className="grid md:grid-cols-2 gap-8 text-gray-700">
          <ul className="space-y-2 list-disc list-inside">
            {translations.about.systems.col1[locale].map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <ul className="space-y-2 list-disc list-inside">
            {translations.about.systems.col2[locale].map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Разработчики системы */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {translations.about.developers.title[locale]}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          {translations.about.developers.description[locale]}
        </p>
        <ul className="space-y-2 text-gray-700 list-disc list-inside">
          {translations.about.developers.team.map((member, idx) => {
            // Поддержка старого формата: если member — строка, выводим её как есть
            if (typeof member === 'string') {
              return <li key={idx}>{member}</li>;
            }
            // Новый формат: объект { name, position: { ru, kz } }
            const positionText = typeof member.position === 'string'
              ? member.position
              : (member.position[locale] || member.position.ru);
            return (
              <li key={idx}>
                {member.name} — {positionText}
              </li>
            );
          })}
        </ul>
      </section>


      <img
        src="/IMG_2203 1.jpg"
        alt="About Illustration"
        className="my-5 rounded w-full"
      />
    </div>
  );
}
