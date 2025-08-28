"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Profile from '@/components/Profile';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

async function getEmployees(departmentId, sectorId) {
  const res = await fetch(`https://devapi-smart.apa.kz/employees/department/${departmentId}/`);
  if (!res.ok) throw new Error('Ошибка загрузки данных');
  const data = await res.json();
  return data.filter(emp =>
    emp.department.id.toString() === departmentId
  );
}


export default function SectorPage() {
  const params = useParams();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [chief, setChief] = useState(null);
  const [sectorHead, setSectorHead] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getEmployees(params.departmentId, params.sectorId);
        const chiefEmp = data.find(emp => emp.is_chief === true);
        const sectorHeads = data.filter(emp => emp.is_sector_head === true);

        setEmployees(data);
        setChief(chiefEmp || null);
        setSectorHead(sectorHeads || []);
      } catch (err) {
        setError(err.message);
      }
    };
    loadData();
  }, [params.departmentId, params.sectorId]);

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const shouldHideSectorTitle = employees[0]?.sector?.id === 16;

  const getImageName = (employee) =>
    `${employee.user_surename}-${employee.user_name}-${employee.user_patronymic}`
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zа-яё-]/gi, '');


      dayjs.extend(utc);
      dayjs.extend(tz);



const isOnline = (logoutTimeStr) => {
  if (!logoutTimeStr) return false;
  const logoutDate = dayjs.utc(logoutTimeStr).tz("Asia/Almaty");
  const now = dayjs().tz("Asia/Almaty");
  const diff = now.diff(logoutDate, "minute");
  return diff <= 2;
};

  return (
    <div className="gap-[10px] px-[10px] max-w-[1000px] mx-auto">
      {/* Левая панель */}


      {/* Модалка */}
      {selectedEmployee ? (
        <div className="w-full" >
            <button
              onClick={() => setSelectedEmployee(null)}
              className="text-gray-500 hover:text-gray-800 text-[14px] p-4 bg-gray-100 rounded mb-4"
            >
              Назад
            </button>
          <div className="rounded-[15px] w-full relative shadow max-h-[90vh] overflow-y-auto">
            <Profile
              employee={selectedEmployee}
              department={employees[0]?.department}
              sector={employees[0]?.sector}
              allEmployees={employees}
              chief={chief}
              id={selectedEmployee.id}
            />
          </div>
        </div>
      ) : (
        <>
      <div className="p-4 pb-[35px] bg-[#FFF] h-fit rounded-[15px] rounded-[15px] shadow">
        <h4 className="text-[24px] font-bold mb-[5px] text-[#267962]">
          {employees[0]?.department?.ru || 'Департамент'}
        </h4>

        {!shouldHideSectorTitle && (
          <h1 className="text-[24px] font-bold leading-[24px] text-[#1A1A1A]">
            {employees[0]?.sector?.ru || 'Сектор'}
          </h1>
        )}

        <p className="text-[14px] text-[#1A1A1A] mt-[10px]">
          {employees[0]?.sector?.description || 'Деятельность сектора'}
        </p>
      </div>

        {/* Руководители */}
        <div className="mt-4">
          {chief ? (
            <div
              className="flex items-center space-x-4 mb-4 cursor-pointer p-4 bg-white shadow rounded-[15px]"
              onClick={() => setSelectedEmployee(chief)}
            >
              <img
                src={`/images/${getImageName(chief)}.jpg`}
                alt={`${chief.user_surename} ${chief.user_name}`}
                className="w-[90px] h-[90px] rounded-[15px] object-cover"
              />
              <div>
                <p className='leading-[18px]'><b className='text-[var(--customDark)] text-[18px]'>{chief.user_surename} {chief.user_name} {chief.user_patronymic}</b></p>
                <small className='text-[var(--customGreen)] text-[14px]'><b>Руководитель департамента:</b></small>
              </div>
            </div>
          ) : (
            <span className="text-red-500">Нет руководителя</span>
          )}
          
          {sectorHead && sectorHead.length > 0 && (
            <>
              <p className="mt-2 mb-2"><b>Руководители сектора:</b></p>
              <div className="flex items-center space-x-4 mb-4 cursor-pointer p-4 bg-white shadow rounded-[15px]">
                {sectorHead.map((head, idx) => (
                  <div
                    key={idx}
                    className='flex items-center space-x-4 cursor-pointer'
                    onClick={() => setSelectedEmployee(head)}
                  >
                    <img
                      src={`/images/${getImageName(head)}.jpg`}
                      alt={`${head.user_surename} ${head.user_name}`}
                      className="w-[90px] h-[90px] rounded-[10px] object-cover"
                    />
                    <span className="text-[var(--customDark)] text-[18px]">
                      <b>{head.user_surename} {head.user_name} {head.user_patronymic}</b>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {sectorHead && sectorHead.length === 0 && (
            <p className="text-red-500"></p>
          )}

        </div>

      {/* Правая панель — сотрудники */}
      <div className="flex flex-col p-4 bg-white rounded-[15px] shadow gap-2 w-full">
        {employees.length > 0 ? (
          employees
            .filter(employee => !employee.is_chief)
            .map((employee) => {
            const imageName = getImageName(employee);
            const isSpecial = employee.position.id === 20;

            return (
              <div
                key={employee.id}
                className={`rounded-[15px] flex items-center gap-4 cursor-pointer hover:bg-gray-100 ${
                  isSpecial ? "bg-[#267962]" : "bg-[#FFF]"
                }`}
                onClick={() => setSelectedEmployee(employee)}
              >
                <div className="flex-shrink-0">
                  <img
                    src={`/images/${imageName}.jpg`}
                    alt={`${employee.user_surename} ${employee.user_name}`}
                    className="w-[90px] h-[90px] rounded-[15px] object-cover"
                  />
                </div>
                <div>
              <div>
                <p className='leading-[18px]'><b className='text-[var(--customDark)] text-[18px]'>{employee.user_surename} {employee.user_name} {employee.user_patronymic}</b></p>
                <small className='text-[var(--customGreen)] text-[14px]'><b>{employee.position.ru}</b></small>
              </div>
                  {isOnline(employee.last_logout) && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-600 text-xs">online</span>
                    </div>
                  )}
                 
                </div>
              </div>
            );
          })
        ) : (
          <p>Нет сотрудников в этом секторе</p>
        )}
      </div>
        </>
      )}
    </div>
  );
}
