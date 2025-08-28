'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import Profile from '@/components/Profile';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import translations from '@/translations/translations';

dayjs.extend(utc);
dayjs.extend(timezone);

const ITEMS_PER_PAGE = 6;

export default function EmployeeListPage() {
  const locale = useLocale();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('https://devapi-smart.apa.kz/employees/')
      .then(res => res.json())
      .then(data => setEmployees(data || []))
      .catch(console.error);
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    if (!emp || !emp.user_surename || !emp.user_name || !emp.user_patronymic) return false;
    const fullName = `${emp.user_surename} ${emp.user_name} ${emp.user_patronymic}`;
    return fullName.toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationButtons = (currentPage, totalPages) => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="">
      <div className="gap-2">
      <Link href={`/${locale}/`} className="knopkaKotoruyuYaNeLubluNoAluaZastavilaMenyaEyoDelat h-[50px] flex items-center justify-center px-[30px] w-fit rounded">
        {translations.back[locale]}
      </Link>
      <h1 className="text-[32px] my-4"><b>{locale === "ru" ? 'Телефонный справочник' : 'Телефон анықтамалығы'}</b></h1>
      </div>

      <div className="p-4 pb-[35px] bg-[#FFF] h-fit rounded-[15px] rounded-[15px] shadow">
        <input
          type="text"
          placeholder={locale === "ru" ? 'Поиск сотрудника по ФИО' : 'Қызметкерді аты-жөні бойынша іздеу'}
          className=" mt-4 px-4 py-2 rounded w-full outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

<div className="overflow-x-auto mt-4 bg-white rounded shadow p-4">
  <table className="min-w-full text-left text-sm">
    <tbody className="divide-y">
      {currentEmployees.map((emp) => (
        <tr
          key={emp.id}
          onClick={() => setSelectedEmployee(emp)}
          className="hover:bg-gray-100 cursor-pointer"
        >
          <td className="flex items-center gap-4 px-4 py-3 w-[350px]">
            <img
              src={emp.user_photo || '/default.png'}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="truncate">
              <p className="font-semibold">
                {emp.user_surename} {emp.user_name} {emp.user_patronymic}
              </p>
            </div>
          </td>

          <td className="px-4 py-3">
            <p className="text-sky-700 truncate">{emp.department?.[locale]}</p>
            <p className="text-gray-500 truncate">{emp.position?.[locale]}</p>
          </td>

          <td className="px-4 py-3">
            <p className="text-blue-600 truncate">{emp.user_email}</p>
            <p className="text-gray-700">{emp.user_phone}</p>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-0.5 text-sm rounded bg-gray-100"
          >
            <b>&lt;</b>
          </button>

          {getPaginationButtons(currentPage, totalPages).map((page, i) =>
            page === '...' ? (
              <span key={i} className="px-2 py-0.5 text-sm text-gray-500">...</span>
            ) : (
              <button
                key={i}
                onClick={() => handlePageChange(page)}
                className={`px-2 py-0.5 text-sm rounded min-w-[28px] ${
                  currentPage === page ? 'bg-[var(--customGreen)] text-white' : 'bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-0.5 text-sm rounded bg-gray-100"
          >
            <b>&gt;</b>
          </button>
        </div>
      )}

      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col p-5 w-fit">
            <button
              onClick={() => setSelectedEmployee(null)}
              className="text-white w-fit hover:text-gray-100 text-[14px] p-4 bg-[rgba(0,0,0,0.2)] rounded mb-4"
            >
              Назад
            </button>
            <Profile 
              id={selectedEmployee.id} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
