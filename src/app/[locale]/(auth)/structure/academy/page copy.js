"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';

 

async function getSubordinations() {


   const res = await fetch('https://devapi-smart.apa.kz/subordinations/');

  if (!res.ok) throw new Error('Failed to fetch subordinations');
  return res.json();
}

async function getDepartments() {
  const res = await fetch('https://devapi-smart.apa.kz/departments/');
  if (!res.ok) throw new Error('Failed to fetch departments');
  return res.json();
}

async function getSectors(departmentId) {
  // const res = await fetch(`https://api-smart.apa.kz/employees/department/${departmentId}/`);
    const res = await fetch(`https://devapi-smart.apa.kz/employees/department/${departmentId}/`);
  if (!res.ok) throw new Error('Failed to fetch sectors');
  const employees = await res.json();
  
  // Группируем сотрудников по секторам
  const sectors = {};
  employees.forEach(employee => {
    const sectorId = employee.sector.id;
    if (!sectors[sectorId]) {
      sectors[sectorId] = {
        ...employee.sector,
        employees: []
      };
    }
    sectors[sectorId].employees.push(employee);
  });
  
  return Object.values(sectors);
}



export default function StructurePage() {
  const [subordinations, setSubordinations] = useState([]);
  const [departmentsBySubordination, setDepartmentsBySubordination] = useState({});
  const [expandedDepartment, setExpandedDepartment] = useState(null);
  const [sectors, setSectors] = useState({});
  const [loading, setLoading] = useState({});

  const router = useRouter();

  // Загрузка данных при монтировании
  useState(() => {
    const loadData = async () => {
      try {
        const [subords, depts] = await Promise.all([getSubordinations(), getDepartments()]);
        
        setSubordinations(subords);
        
        const grouped = depts.reduce((acc, dept) => {
          if (!acc[dept.subordination]) acc[dept.subordination] = [];
          acc[dept.subordination].push(dept);
          return acc;
        }, {});
        
        setDepartmentsBySubordination(grouped);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
  }, []);


  // Обработчик клика по департаменту
  const handleDepartmentClick = async (departmentId) => {
    // Если уже раскрыт - сворачиваем
    if (expandedDepartment === departmentId) {
      setExpandedDepartment(null);
      return;
    }
  
    
    // Если секторы еще не загружены
    if (!sectors[departmentId]) {
      setLoading(prev => ({...prev, [departmentId]: true}));
      try {
        const sectorData = await getSectors(departmentId);
        setSectors(prev => ({...prev, [departmentId]: sectorData}));
        
        // Если только один сектор - переходим на его страницу
        if (sectorData.length === 1) {
          router.push(`/${locale}/structure/academy/${departmentId}/sector/${sectorData[0].id}`);
          return;
        }
      } catch (error) {
        console.error(`Error loading sectors for department ${departmentId}:`, error);
      } finally {
        setLoading(prev => ({...prev, [departmentId]: false}));
      }
    } else if (sectors[departmentId]?.length === 1) {
      // Если секторы уже загружены и только один - переходим
      window.location.href = `/${locale}/structure/academy/${departmentId}/sector/${sectors[departmentId][0].id}`;


      return;
    }
  
    // В остальных случаях раскрываем список
    setExpandedDepartment(departmentId);
  };

    const locale = useLocale();

  return (
    <main className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px]">
        {subordinations.map((person) => (
          <div key={person.id} className="">
            {/* Блок руководителя */}
            <div className="mb-[10px]">
              <div className="flex items-center gap-4">
                <img 
                  src={`/images/${person.full_name.toLowerCase().replace(/\s+/g, '-')}.jpg`} 
                  alt={person.full_name}
                  className="flex-2 h-[125px] min-w-[125px] w-[125px] max-w-[125px] rounded-[5px] object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <div className="flex-1"> 
                  <h2 className="font-bold uppercase text-[16px] text-[#15312A] leading-[16px]">{person.full_name}</h2>
                  <p className="font-bold text-[12px] text-[#267962] mt-1 leading-[12px]">{person.ru}</p>
                </div>
              </div>
            </div>
            
            {/* Список подразделений */}
            <div className="">
              <ul className="space-y-[10px]">
                {departmentsBySubordination[person.id]?.map((dept) => (
                  <li key={dept.id}>
                    <div 
                      onClick={() => handleDepartmentClick(dept.id)}
                      className="cursor-pointer h-fit py-[10px] items-center justify-center text-[#15312A] font-bold uppercase text-[14px] bg-[#F5F5F5] hover:bg-[#EBEBEB] border-l-[1px] border-[#15312A] pl-3"
                    >
                      {dept.ru}
                    </div>
                    
                    {/* Раскрывающийся список секторов */}
                    {expandedDepartment === dept.id && (
                      <div className="ml-4 mt-2 space-y-2">
                        {loading[dept.id] ? (
                          <div className="text-center py-2">Загрузка...</div>
                        ) : (
                          sectors[dept.id]?.map(sector => (
                            <Link
                              key={sector.id}
                              href={`/${locale}/structure/academy/${dept.id}/sector/${sector.id}`}
                              className="block text-[#15312A] text-[12px] bg-[#F9F9F9] hover:bg-[#EBEBEB] border-l-[1px] border-[#267962] pl-3 py-1"
                            >
                              {sector.ru}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}