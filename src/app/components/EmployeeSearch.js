'use client';

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import Profile from '@/components/Profile';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { useLocale } from "@/hooks/useLocale"
import translations from "@/translations/translations";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function EmployeeSearch() {
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const pathname = usePathname();

  const searchRef = useRef(null);

  const isEmployeesPage = pathname === '/kz/employees' || pathname === '/ru/employees';
  const BackendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    axios.get(`${BackendUrl}/employees/`)
      .then(res => setAllEmployees(res.data || []))
      .catch(err => console.error("Ошибка при получении всех сотрудников:", err));
  }, []);

  useEffect(() => {
    if (query.length > 1 && !isEmployeesPage) {
      axios.get(`${BackendUrl}/employees/?search=${query}`)
        .then(res => setSearchResults(res.data))
        .catch(err => console.error("Ошибка при поиске:", err));
    } else {
      setSearchResults([]);
    }
  }, [query, isEmployeesPage]);

  // Закрытие списка при клике вне поиска
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (employee) => {
    setSelected(employee);
    setSearchResults([]);
    setQuery("");
  };
  const handleClose = () => setSelected(null);

  if (isEmployeesPage) return null;

  const colleaguesInSector = selected
    ? allEmployees.filter(emp =>
        emp.sector?.id === selected?.sector?.id && emp.id !== selected.id
      )
    : [];

  const sectorHead = selected
    ? allEmployees.find(emp =>
        emp.sector?.id === selected.sector?.id &&
        emp.is_sector_head === true &&
        Number(emp.id) !== Number(selected.id)
      )
    : null;

  const departmentHead = selected
    ? allEmployees.find(emp =>
        emp.department?.id === selected.department?.id &&
        emp.is_department_head === true &&
        Number(emp.id) !== Number(selected.id)
      )
    : null;

  return (
    <>
      <label className="w-1/2" ref={searchRef}> 
        <div className="relative w-full">
          <label htmlFor="employeeSearch" className="w-full min-w-[300px] flex items-center border border-current bg-transparent text-[#757575] rounded-[5px] h-[50px]">
            <div className='w-[50px] h-[50px] flex items-center justify-center'>
              <img src="/icons/search.svg" className="max-h-[25px] max-w-[25px]" />
            </div>
            <input
              type="text"
              placeholder={translations.search.placeholder[locale]}
              className="w-full focus:outline-none placeholder-[#757575]" 
              id="employeeSearch"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          {searchResults.length > 0 && (
            <ul className="absolute z-10 bg-white w-full max-h-60 overflow-y-auto mt-1 rounded shadow text-black">
              {searchResults.map((emp) => (
                <li
                  key={emp.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(emp)}
                >
                  {emp.user_surename} {emp.user_name} {emp.user_patronymic}
                </li>
              ))}
            </ul>
          )}
        </div>
      </label>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col p-5 w-fit">
            <button
              onClick={handleClose}
              className="text-white w-fit hover:text-gray-100 text-[14px] p-4 bg-[rgba(0,0,0,0.2)] rounded mb-4"
            >
              Назад
            </button>
            <Profile
              employee={selected}
              colleagues={colleaguesInSector}
              department={selected.department}
              sector={selected.sector}
              sectorHead={sectorHead}
              departmentHead={departmentHead}
              allEmployees={allEmployees}
              id={selected.id}
            />
          </div>
        </div>
      )}
    </>
  );
}
