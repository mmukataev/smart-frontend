'use client';

import { useState } from "react";
import Link from "next/link";

import { useLocale } from "@/hooks/useLocale";
import useStructureSubordinations from "@/hooks/useStructureSubordinations";
import useStructureDepartments from "@/hooks/useStructureDepartments";
import useStructureDepartmentEmployees from "@/hooks/useStructureDepartmentEmployees";
import { useRegions } from '@/hooks/useRegions';
import useRegionData from "@/hooks/useRegionData";
import translations from "@/translations/translations";

import Profile from "@/components/Profile";

export default function StructurePage() {
  const locale = useLocale();
  const { subordination, loading, error } = useStructureSubordinations();
  const { departments } = useStructureDepartments();
  const { regions } = useRegions();

  const [activeIndex, setActiveIndex] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [regionId, setRegionId] = useState(null);

  const handleClose = () => setSelectedId(null);
  const { data: regionEmployees } = useRegionData(regionId);
  const { employees } = useStructureDepartmentEmployees(departmentId);

  const currentDeptRu =
    departments.find(d => d.id === departmentId)?.ru ||
    employees?.[0]?.department?.ru ||
    "";

  const currentDeptKz =
    departments.find(d => d.id === departmentId)?.kz ||
    employees?.[0]?.department?.kz ||
    "";

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  const sorted = [...subordination].sort((a, b) => a.id - b.id);

  // 1. Сетка сотрудников всей структуры
const staffGrid = (
  <>
    <div className="my-3">
      <b className="uppercase">{locale === "ru" ? 'Сведения о Ректорате' : 'Ректорат туралы мәліметтер'}</b>
    </div>
    <ul className="grid grid-cols-2 gap-[10px]">
      {sorted.map((item, idx) => (
        <li
          key={item.id ?? `staff-${idx}`}
          onClick={() => setSelectedId(item.id)}
          className="flex items-end w-full aspect-square rounded-[5px] overflow-hidden bg-gray-200 cursor-pointer bg-cover bg-center"
          style={{
            backgroundImage: item.user_image ? `url(${item.user_image})` : 'none',
          }}
        >
          <div className="p-4 pt-[45px] bg-gradient-shadow text-white w-full">
            <b className="text-[20px]">{item.full_name}</b>
            <p className="text-[16px]">{locale === "ru" ? item.ru : item.kz}</p>
          </div>
        </li>
      ))}
    </ul>
  </>
);


// 2. Список сотрудников выбранного департамента
const departmentEmployeesList =
  departmentId && employees.length > 0 && (
    <div>
      <div className="my-3">
        <b className="text-[20px]">{locale === "ru" ? currentDeptRu : currentDeptKz}</b>
      </div>

      {/* Шеф всегда первый */}
      {employees.some(emp => emp.is_chief && emp.id !== 1) && (
        <ul className="mb-4">
          {employees
            .filter(emp => emp.is_chief && emp.id !== 1)
            .map(emp => {
              const fullName = `${emp.user_surename} ${emp.user_name} ${emp.user_patronymic ?? ""}`.trim();
              const position = emp.position?.ru ?? "";
              const imageUrl =
                emp.user_image && emp.user_image !== "/media/employee/None"
                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${emp.user_image}`
                  : "/default.png";

              return (
                <li
                  key={emp.id}
                  className="flex items-center gap-3 p-2 rounded-[5px] shadow bg-gradient-custom text-white"
                  onClick={() => setSelectedId(emp.id)}
                >
                  <img
                    src={imageUrl}
                    alt={fullName}
                    className="w-[60px] h-[60px] rounded-full object-cover"
                  />
                  <div>
                    <b>{fullName}</b>
                    <p className="text-white/90">{position}</p>
                  </div>
                </li>
              );
            })}
        </ul>
      )}

      {employees.some(emp => 
        emp.id && 
        emp.sector?.id === 16 && 
        !emp.is_chief && 
        ![1,2,3,4].includes(emp.id)
      ) && (
        <ul className="mb-4">
          {employees
            .filter(emp => 
              emp.id && 
              emp.sector?.id === 16 && 
              !emp.is_chief && 
              ![1,2,3,4].includes(emp.id)  // <-- исключаем здесь
            )
            .sort((a, b) => Number(a.id) - Number(b.id))
            .map(emp => {
              const fullName = `${emp.user_surename} ${emp.user_name} ${emp.user_patronymic ?? ""}`.trim();
              const position = emp.position?.ru ?? "";
              const positionKz = emp.position?.kz ?? "";
              const imageUrl =
                emp.user_image && emp.user_image !== "/media/employee/None"
                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${emp.user_image}`
                  : "/default.png";

              return (
                <li
                  key={emp.id}
                  className="flex items-center gap-3 p-2 rounded-[5px] shadow bg-white"
                  onClick={() => setSelectedId(emp.id)}
                >
                  <img
                    src={imageUrl}
                    alt={fullName}
                    className="w-[60px] h-[60px] rounded-full object-cover"
                  />
                  <div>
                    <b>{fullName}</b>
                    <p className="text-sm text-gray-600">{locale === "ru" ? position : positionKz}</p>
                  </div>
                </li>
              );
            })}
        </ul>
      )}


{Object.entries(
  employees
    .filter(emp => emp.id && !emp.is_chief && emp.sector?.id !== 16)
    .reduce((acc, emp) => {
      const sectorKey = emp.sector?.id || "unknown";
      if (!acc[sectorKey]) {
        acc[sectorKey] = {
          name_ru: emp.sector?.ru || "",
          name_kz: emp.sector?.kz || "",
          employees: []
        };
      }
      acc[sectorKey].employees.push(emp);
      return acc;
    }, {})
).map(([sectorId, { name_ru, name_kz, employees }]) => (
  <div key={sectorId} className="mb-6">
    <div className="mb-2 font-semibold">
      {locale === "ru" ? name_ru : name_kz}
    </div>
    <ul className="grid grid-cols-2 gap-[10px]">
      {employees
        .sort((a, b) => {
          if (a.position?.id === 50 && b.position?.id !== 50) return -1;
          if (a.position?.id !== 50 && b.position?.id === 50) return 1;
          return Number(a.id) - Number(b.id);
        })
        .map(emp => {
          const fullName = `${emp.user_surename} ${emp.user_name} ${emp.user_patronymic ?? ""}`.trim();
          const position = emp.position?.ru ?? "";
          const positionKz = emp.position?.kz ?? "";
          const imageUrl =
            emp.user_image && emp.user_image !== "/media/employee/None"
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${emp.user_image}`
              : "/default.png";

          return (
            <li
              key={emp.id}
              className="flex items-center gap-3 p-2 rounded-[5px] shadow bg-white"
              onClick={() => setSelectedId(emp.id)}
            >
              <img
                src={imageUrl}
                alt={fullName}
                className="w-[60px] h-[60px] rounded-full object-cover"
              />
              <div>
                <b>{fullName}</b>
                <p className="text-sm text-gray-600">{locale === "ru" ? position : positionKz}</p>
              </div>
            </li>
          );
        })}
    </ul>
  </div>
))}

    </div>
  );

// 3. Боковое меню с аккордеонами
const asideMenu = (
  <aside>
    <div className="mb-2">
      <button
        onClick={() => {
          setDepartmentId(null);
          setRegionId(null);
          setActiveIndex(null);
        }}
        className={`w-full text-left rounded px-2 py-2 transition-colors duration-300 cursor-pointer
          ${departmentId === null ? "text-white bg-gradient-custom" : "text-gray-800 bg-gray-100 hover:bg-gray-150"}`}
      >
        <p>Сведения о Ректорате</p>
      </button>
    </div>

    {/* Основные аккордеоны */}
    {[
                        { index: 1, title: "Подразделения прямого подчинения ректору", title_kz: "Ректорға тікелей бағынатын бөлімшелер"  },
                        { index: 2, title: "Корпоративная и финансовая деятельность", title_kz: "Корпоративтік және қаржылық қызмет" },
                        { index: 3, title: "Академическая деятельность", title_kz: "Академиялық қызмет"  },
                        { index: 4, title: "Научная деятельность", title_kz: "Ғылыми қызмет"  },
    ].map((group) => {
      const filtered = departments.filter(dep => dep.subordination === group.index);
      if (filtered.length === 0) return null;

      const isOpen = activeIndex === group.index;

      return (
        <div key={group.index} className="mb-2">
          <button
            onClick={() => setActiveIndex(isOpen ? null : group.index)}
            className={`w-full text-left rounded px-2 py-2 transition-colors duration-300 cursor-pointer ${
              isOpen ? "text-white bg-gradient-custom" : "text-gray-800 bg-gray-100 hover:bg-gray-150"
            }`}
          >
            <p>{locale === "ru" ? group.title : group.title_kz}</p>
          </button>
          <div
            className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
              isOpen ? "max-h-[900px]" : "max-h-0"
            }`}
          >
            <ul className="pl-2 mt-2 border-l border-green-800 text-[14px]">
              {filtered.map((dep, idx) => (
                <li
                  key={dep.id ?? `dep-${idx}`}
                  className="cursor-pointer bg-gray-50 px-2 py-2 mb-2 hover:bg-gray-100 uppercase"
                  onClick={() => {
                    setDepartmentId(dep.id);
                    setRegionId(null);
                  }}
                >
                  <b>{locale === "ru" ? dep.ru : dep.kz}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    })}

    {/* Новый аккордеон "Филиалы" */}
    <div className="mb-2">
      {regions.length > 0 && (
        <>
          <button
            onClick={() => setActiveIndex(activeIndex === "filials" ? null : "filials")}
            className={`w-full text-left rounded px-2 py-2 transition-colors duration-300 cursor-pointer ${
              activeIndex === "filials"
                ? "text-white bg-gradient-custom"
                : "text-gray-800 bg-gray-100 hover:bg-gray-150"
            }`}
          >
            <p>{locale === "ru" ? 'Филиалы' : 'Филиалдар'}</p>
          </button>
          <div
            className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
              activeIndex === "filials" ? "max-h-[900px]" : "max-h-0"
            }`}
          >
            <ul className="pl-2 mt-2 border-l border-green-800 text-[14px]">
              {regions.map((item, idx) => (
                <li
                  key={item.id ?? `reg-${idx}`}
                  className="cursor-pointer bg-gray-50 px-2 py-2 mb-2 hover:bg-gray-100 uppercase"
                  onClick={() => {
                    setRegionId(item.region.id);   
                    setDepartmentId(null);
                  }}
                >
                  <b>{locale === "ru" ? item.region?.city_ru : item.region?.city_kz}</b>
                </li>

              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  </aside>
);

const currentRegionName = regions.find(r => r.region.id === regionId)?.region?.city_ru || "";
const regionEmployeesList = regionId && regionEmployees?.length > 0 && (
  <div>
    <div className="my-3">
      <b className="text-[20px]">Сотрудники филиала {currentRegionName && `– ${currentRegionName}`}</b>
    </div>

    {/* Шеф филиала */}
    {regionEmployees.some(emp => emp.is_chief && emp.id !== 1) && (
      <ul className="mb-4">
        {regionEmployees
          .filter(emp => emp.is_chief && emp.id !== 1)
          .map(emp => {
            const fullName = `${emp.user_surename} ${emp.user_name} ${emp.user_patronymic ?? ""}`.trim();
            const position = emp.position?.ru ?? "";
            const imageUrl =
              emp.user_image && emp.user_image !== "/media/employee/None"
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${emp.user_image}`
                : "/default.png";

            return (
              <li
                key={emp.id}
                className="flex items-center gap-3 p-2 rounded-[5px] shadow bg-gradient-custom text-white cursor-pointer"
                onClick={() => setSelectedId(emp.id)}
              >
                <img
                  src={imageUrl}
                  alt={fullName}
                  className="w-[60px] h-[60px] rounded-full object-cover"
                />
                <div>
                  <b>{fullName}</b>
                  <p className="text-white/90">{position}</p>
                </div>
              </li>
            );
          })}
      </ul>
    )}

    {/* Специальный сектор (если нужен такой же как в департаментах, напр. id=16) */}
    {regionEmployees.some(emp =>
      emp.id &&
      emp.sector?.id === 16 &&
      !emp.is_chief &&
      ![1, 2, 3, 4].includes(emp.id)
    ) && (
      <ul className="mb-4">
        {regionEmployees
          .filter(emp =>
            emp.id &&
            emp.sector?.id === 16 &&
            !emp.is_chief &&
            ![1, 2, 3, 4].includes(emp.id)
          )
          .sort((a, b) => Number(a.id) - Number(b.id))
          .map(emp => {
            const fullName = `${emp.user_surename} ${emp.user_name} ${emp.user_patronymic ?? ""}`.trim();
            const position = emp.position?.ru ?? "";
            const positionKz = emp.position?.kz ?? "";
            const imageUrl =
              emp.user_image && emp.user_image !== "/media/employee/None"
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${emp.user_image}`
                : "/default.png";

            return (
              <li
                key={emp.id}
                className="flex items-center gap-3 p-2 rounded-[5px] shadow bg-white cursor-pointer"
                onClick={() => setSelectedId(emp.id)}
              >
                <img
                  src={imageUrl}
                  alt={fullName}
                  className="w-[60px] h-[60px] rounded-full object-cover"
                />
                <div>
                  <b>{fullName}</b>
                  <p className="text-sm text-gray-600">{locale === "ru" ? position : positionKz}</p>
                </div>
              </li>
            );
          })}
      </ul>
    )}

    {/* Остальные сотрудники по секторам */}
    {Object.entries(
      regionEmployees
        .filter(emp => emp.id && !emp.is_chief && emp.sector?.id !== 16)
        .reduce((acc, emp) => {
          const sectorName = emp.sector?.ru || "";
          if (!acc[sectorName]) acc[sectorName] = [];
          acc[sectorName].push(emp);
          return acc;
        }, {})
    ).map(([sectorName, sectorEmployees]) => (
      <div key={sectorName} className="mb-6">
        <div className="mb-2 font-semibold">{sectorName}</div>
        <ul className="grid grid-cols-2 gap-[10px]">
          {sectorEmployees
            .sort((a, b) => {
              if (a.position?.id === 50 && b.position?.id !== 50) return -1;
              if (a.position?.id !== 50 && b.position?.id === 50) return 1;
              return Number(a.id) - Number(b.id);
            })
            .map(emp => {
              const fullName = `${emp.user_surename} ${emp.user_name} ${emp.user_patronymic ?? ""}`.trim();
              const position = emp.position?.ru ?? "";
              const positionKz = emp.position?.kz ?? "";
              const imageUrl =
                emp.user_image && emp.user_image !== "/media/employee/None"
                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${emp.user_image}`
                  : "/default.png";

              return (
                <li
                  key={emp.id}
                  className="flex items-center gap-3 p-2 rounded-[5px] shadow bg-white cursor-pointer"
                  onClick={() => setSelectedId(emp.id)}
                >
                  <img
                    src={imageUrl}
                    alt={fullName}
                    className="w-[60px] h-[60px] rounded-full object-cover"
                  />
                  <div>
                    <b>{fullName}</b>
                    <p className="text-sm text-gray-600">{locale === "ru" ? position : positionKz}</p>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    ))}
  </div>
);



const filteredDepartments = departments.filter(dep =>
  dep.ru.toLowerCase().includes(searchTerm.toLowerCase())
);


// Поисковая строка
const searchBar = (
  <div className="mb-4 relative">
    <label className="w-full flex items-center bg-gray-100 rounded-[5px] h-[50px]">
      <div className="w-[50px] h-[50px] flex items-center justify-center">
        <img src="/icons/search.svg" className="max-h-[25px] max-w-[25px]"/>
      </div>
      <input
        type="text"
        placeholder={locale === "ru" ? 'Поиск департаментов...' : 'Департаментті іздеу...'}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full focus:outline-none"
      />
    </label>
  </div>
);




  return (
    <div>
      <div className="gap-2">
      <Link href={`/${locale}/`} className="knopkaKotoruyuYaNeLubluNoAluaZastavilaMenyaEyoDelat h-[50px] flex items-center justify-center px-[30px] w-fit rounded">
        {translations.back[locale]}
      </Link>
      <h1 className="text-[32px] my-4"><b>{locale === "ru" ? 'Структура Академии' : 'Академия құрылымы'}</b></h1>
      </div>

      <div className="flex gap-[10px] max-[1100px]:flex-col-reverse">
        <div className="w-full">
          {regionId 
            ? regionEmployeesList 
            : departmentId 
              ? departmentEmployeesList 
              : staffGrid}

        </div>
        <div className="bg-white w-[400px] max-[1100px]:w-full rounded-[5px] shadow px-[10px] py-[20px] h-fit">
          {searchBar}
          {searchTerm ? (
            <ul className="mt-2">
              {filteredDepartments.length > 0 ? (
                filteredDepartments.slice(0, 5).map(dep => (
                  <li
                    key={dep.id}
                    className="cursor-pointer px-3 py-2 mb-1 rounded hover:bg-gray-100"
                    onClick={() => {
                      const group = [
                        { index: 1, title: "Подразделения прямого подчинения ректору", title_kz: "Ректорға тікелей бағынатын бөлімшелер"  },
                        { index: 2, title: "Корпоративная и финансовая деятельность", title_kz: "Корпоративтік және қаржылық қызмет" },
                        { index: 3, title: "Академическая деятельность", title_kz: "Академиялық қызмет"  },
                        { index: 4, title: "Научная деятельность", title_kz: "Ғылыми қызмет"  },
                      ].find(g => g.index === dep.subordination);

                      if (group) setActiveIndex(group.index);
                      else setActiveIndex(null);

                      setDepartmentId(dep.id);
                      setSearchTerm("");
                    }}

                  >
                    {dep.ru}
                  </li>
                ))
              ) : (
                <li className="text-gray-500 px-3 py-2">Ничего не найдено</li>
              )}
            </ul>
          ) : (
            asideMenu
          )}
        </div>
      </div>
      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col p-5 w-fit">
            <button
              onClick={handleClose}
              className="text-white w-fit hover:text-gray-100 text-[14px] p-4 bg-[rgba(0,0,0,0.2)] rounded mb-4"
            >
              {translations.back[locale]}
            </button>
            <Profile
              id={selectedId} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
