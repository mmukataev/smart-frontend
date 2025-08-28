// app/structure/academy/[departmentId]/sector/[sectorId]/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Profile from './components/Profile';

async function getEmployees(departmentId, sectorId) {
  const res = await fetch(`https://api-smart.apa.kz/employees/department/${departmentId}/`);
  if (!res.ok) throw new Error('Ошибка загрузки данных');
  const data = await res.json();
  return data.filter(emp => 
    emp.department.id.toString() === departmentId && 
    emp.sector.id.toString() === sectorId
  );
}

export default function SectorPage() {
  const params = useParams();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getEmployees(params.departmentId, params.sectorId);
        setEmployees(data);
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

  // Проверяем, нужно ли скрывать заголовок сектора
  const shouldHideSectorTitle = employees[0]?.sector?.id === 16;

  return (
    <div className="flex gap-[10px] px-[10px]">
      <div className='w-2/3 px-[10px] py-[20px] bg-[#FFF] h-fit min-h-[300px] rounded-[15px]'>
        {selectedEmployee ? (
          <div>
            <Profile 
              employee={selectedEmployee}
              department={employees[0]?.department}
              sector={employees[0]?.sector}
              allEmployees={employees}
            />
            <button 
              onClick={() => setSelectedEmployee(null)}
              className="px-[30px] my-4 h-[50px] flex justify-center items-center bg-[#f2f2f2] text-[#267962] rounded-[5px] hover:underline"
            >
              Назад к сектору
            </button>
          </div>
        ) : (
          <>
            <p className="text-[14px] font-bold mb-[5px] text-[#267962]">
              {employees[0]?.department?.ru || 'Департамент'}
            </p>
            
            {/* Условный рендеринг заголовка сектора */}
            {!shouldHideSectorTitle && (
              <h1 className="text-[24px] font-bold leading-[24px] text-[#1A1A1A]">
                {employees[0]?.sector?.ru || 'Сектор'}
              </h1>
            )}
            
            <p className='text-[14px] text-[#1A1A1A] mt-[10px]'>
              {employees[0]?.sector?.description || 'Деятельность сектора'}
            </p>
          </>
        )}
      </div>

      <div className="space-y-3 w-1/3">
        {employees.length > 0 ? (
          employees.map(employee => {
            const imageName = `${employee.user_surename}-${employee.user_name}-${employee.user_patronymic}`
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-zа-яё-]/g, '');
            
            const isSpecial = employee.position.id === 20;
            const cardClasses = [
              "rounded-[15px]",
              "flex",
              "items-center",
              "gap-4",
              "cursor-pointer",
              isSpecial ? "bg-[#267962]" : "bg-[#FFF]"
            ].join(" ");
            
            const textColorClass = isSpecial ? "text-white" : "text-[#15312A]";
            const positionColorClass = isSpecial ? "text-white" : "text-[#267962]";
            
            return (
              <div 
                key={employee.id} 
                className={cardClasses}
                onClick={() => setSelectedEmployee(employee)}
              >
                <div className="flex-shrink-0">
                  <img 
                    src={`/images/${imageName}.jpg`}
                    alt={`${employee.user_surename} ${employee.user_name}`}
                    className="w-[90px] h-[90px] rounded-[15px] object-cover border"
                  />
                </div>

                <div>
                  <p className={`font-bold text-[16px] ${textColorClass} leading-[16px]`}>
                    {employee.user_surename} {employee.user_name} {employee.user_patronymic}
                  </p>
                  <p className={`font-bold text-[14px] ${positionColorClass} leading-[14px]`}>
                    {employee.position.ru}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>Нет сотрудников в этом секторе</p>
        )}
      </div>
    </div>
  );
}