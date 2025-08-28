'use client';

import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import dynamic from 'next/dynamic';

// динамический импорт (SSR выключен)
const ChartsBlock = dynamic(() => import('@/components/ChartsBlock'), {
  ssr: false,
});

export default function EmployeeListPage() {
  const locale = useLocale();

  // Данные для круга
  const data = [
    { name: 'Магистратура', value: 155 },
    { name: 'Докторантура', value: 14 },
  ];
  const COLORS = [
    "#34d399",
    "#3b82f6",
    "#FF9999",
    "#FF6666",
    "#FF3333",
    "#CC0000",
    "#990000",
    "#660000",
    "#FFCC99",
    "#FF9966",
    "#FF6633",];

  const magData = [
    { name: "MHRM", value: 10 },
    { name: "MPP", value: 31 },
    { name: "MRD", value: 32 },
    { name: "MIR", value: 15 },
    { name: "EMPA", value: 26 },
    { name: "MRDm", value: 8 },
    { name: "ME", value: 21 },
    { name: "MPA", value: 3 },
    { name: "MDPA", value: 9 },
  ];

  const phdData = [
    { name: "DPA", value: 9 },
    { name: "DIR", value: 2 },
    { name: "DE", value: 3 },
  ];

  const regions = [
    { name: "Солтүстік Қазақстан облысы", count: 11 },
    { name: "Ақмола облысы", count: 16 },
    { name: "Түркістан облысы", count: 8 },
    { name: "Ақтөбе облысы", count: 9 },
    { name: "Қостанай облысы", count: 11 },
    { name: "Абай облысы", count: 5 },
    { name: "Жетісу облысы", count: 12 },
    { name: "Ұлытау облысы", count: 5 },
    { name: "Павлодар облысы", count: 10 },
    { name: "Шығыс Қазақстан облысы", count: 11 },
    { name: "Жамбыл облысы", count: 15 },
    { name: "Батыс Қазақстан облысы", count: 8 },
    { name: "Маңғыстау облысы", count: 11 },
    { name: "Алматы облысы", count: 8 },
    { name: "Атырау облысы", count: 10 },
    { name: "Қарағанды облысы", count: 14 },
    { name: "Шымкент қаласы", count: 7 },
    { name: "Алматы қаласы", count: 12 },
    { name: "Қызылорда облысы", count: 11 },
    { name: "", count: 194 }, // итог или прочее
  ];

  const topics = [
    { name: '«Б» корпусының мемлекеттік әкімшілік қызметіне алғаш кірген мемлекеттік қызметшілер үшін қайта даярлау курстары', count: 34 },
    { name: '«Б» корпусының мемлекеттік әкімшілік басшы лауазымына алғаш тағайындалған мемлекеттік қызметшілер үшін қайта даярлау курстары', count: 24 },
    { name: 'Ең алдымен – адамдар: мемлекеттік қызметтердің сапасын арттырудың практикалық құралдары', count: 15 },
    { name: 'Жобалық менеджмент: ҚР СТ ISO 21502-2022 сертификаттауға дайындық (жоба басшысЫ)', count: 14 },
    { name: 'Ең алдымен – адамдар: мемлекеттік қызметтердің сапасын арттырудың практикалық құралдары', count: 13 },
    { name: 'Сыбайлас жемқорлыққа қарсы менеджмент және комплаенс', count: 11 },
    { name: 'Жасанды интеллект: пайдасы мен ықтимал қауіптері', count: 8 },
    { name: 'Мемлекеттік сектордағы келіссөздер және медиация: ымыраға келу өнері', count: 7 },
    { name: 'Мемлекеттік қызметтегі әдеп және киберқылмыс: сыбайлас жемқорлыққа қарсы мінез-құлық', count: 7 },
    { name: 'Креативті индустрия: мемлекеттік органдар үшін перспективалар', count: 7 },
    { name: 'Прочие темы', count: 378 },
  ];

  return (
    <div className="">
      <div className="gap-2">
        <Link
          href={`/${locale}/`}
          className="knopkaKotoruyuYaNeLubluNoAluaZastavilaMenyaEyoDelat h-[50px] flex items-center justify-center px-[30px] w-fit rounded"
        >
          Назад
        </Link>
        <h1 className="text-[32px] my-4">
          <b>Статистика</b>
        </h1>

        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <div className="bg-white shadow rounded-2xl p-6 text-center">
            <h3 className="text-gray-500 text-sm">{locale === "ru" ? 'Общее количество сотрудников' : 'Қызметкерлердің жалпы саны'}</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">462</p>
          </div>

          <div className="bg-white shadow rounded-2xl p-6 text-center">
            <h3 className="text-gray-500 text-sm">{locale === "ru" ? 'Количество ППС' : 'Профессор-оқытушылар құрамының саны'}</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">85</p>
          </div>

          <div className="bg-white shadow rounded-2xl p-6 text-center">
            <h3 className="text-gray-500 text-sm">
              {locale === "ru" ? 'Количество поступивших кандидатов в 2025 г.' : '2025 жылы қабылданған кандидаттардың саны'}
            </h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">169</p>
          </div>
        </div>


        {/* Charts (рендер только на клиенте) */}
        <ChartsBlock data={data} magData={magData} phdData={phdData} COLORS={COLORS} />

        {/* Таблица по регионам */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{locale === "ru" ? 'Сотрудники по регионам' : 'Өңірлердегі қызметкерлер саны'}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">{locale === "ru" ? 'Регион' : 'Өңір'}</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">{locale === "ru" ? 'Количество сотрудников' : 'Қызметкерлер саны'}</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((region, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{region.name}</td>
                    <td className="px-4 py-2 font-bold">{region.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Таблица ТОП-10 обучающих тем */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{locale === "ru" ? 'Топ-10 популярных курсов переподготовки и семинаров по повышению квалификации' : 'Мамандықты қайта даярлау мен біліктілікті арттыру бойынша ең танымал 10 курс пен семинар'}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">{locale === "ru" ? 'Курс' : 'Курс'}</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">{locale === "ru" ? 'Количество заявок' : 'Өтініштер саны'}</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{topic.name}</td>
                    <td className="px-4 py-2 font-bold text-center">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        {topic.count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
