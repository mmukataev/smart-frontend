"use client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(tz);

export default function Profile({ employee, department, sector, allEmployees, chief  }) {
  const imageName = `${employee.user_surename}-${employee.user_name}-${employee.user_patronymic}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zа-яё-]/g, '');


  // Поиск руководителя сектора
  const sectorHead = allEmployees?.find(
    (emp) => emp.sector?.id === sector?.id && emp.is_sector_head
  );

  const departmentHead = allEmployees?.find(
    (emp) => emp.department?.id === department?.id && emp.is_chief
  );

  const imageHead = `${departmentHead.user_surename}-${departmentHead.user_name}-${departmentHead.user_patronymic}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zа-яё-]/g, '');

  const getWorkDuration = (dateStr) => {
    if (!dateStr) return '';

    const startDate = new Date(dateStr);
    const now = new Date();

    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    const yearsPart = years > 0 ? `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}` : '';
    const monthsPart = months > 0 ? `${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}` : '';

    return [yearsPart, monthsPart].filter(Boolean).join(' и ');
  };

  const getOnlineStatus = (logoutTimeStr) => {
    if (!logoutTimeStr) return "Очень давно";

    const logoutDate = dayjs.utc(logoutTimeStr).tz("Asia/Almaty");
    const now = dayjs().tz("Asia/Almaty");

    const diffMinutes = now.diff(logoutDate, "minute");
    const diffHours = now.diff(logoutDate, "hour");
    const diffDays = now.diff(logoutDate, "day");

    if (diffMinutes < 2) {
      return "сейчас в сети";
    } else if (diffMinutes < 60) {
      return `был ${diffMinutes} мин назад`;
    } else if (diffHours < 24) {
      return `был ${diffHours} ч назад`;
    } else if (diffDays <= 30) {
      return `был ${diffDays} дн назад`;
    } else {
      return "давно не заходил";
    }
  };

  return (
    <div className="space-y-4 w-fit mx-auto">
      <div className="flex space-x-4">
          <img 
            src={`/images/${imageName}.jpg`}
            alt={`${employee.user_surename} ${employee.user_name}`}
            className="w-[90px] h-[90px] rounded-[15px] object-cover border"
          />

        <div className="flex flex-col justify-between">
            <p className="w-fit p-[5px] bg-gray-100 font-bold text-[11px] text-gray-500 rounded-[15px] text-center leading-[14px]">
              {getOnlineStatus(employee.last_logout)}
            </p>
            <p className='leading-[18px]'><b className='text-[var(--customDark)] text-[18px]'>{employee.user_surename} {employee.user_name} {employee.user_patronymic}</b></p>
            
          <p className="text-[var(--customGreen)] mt-[5px] flex items-center text-[14px]">
            <img src="/icons/cake.svg" width={24} />
            {employee.birth_date}
          </p>

        </div>
      </div>

      <div className="flex gap-[5px]">
        <img src="/icons/systems/case.svg" alt="briefcase" className="w-[24px] h-[24px] inline-block mr-2" />
        <div>
          <p className="text-[14px] text-[#267962] font-bold">Департамент:</p>
          <p className="text-[14px] text-[#15312A] font-bold mb-[5px]">{department?.ru}</p>

          <p className="text-[14px] text-[#267962] font-bold">Должность:</p>
          <p className="text-[14px] text-[#15312A] font-bold mb-[5px]">{employee.position.ru}</p>

          <p className="text-[14px] text-[#267962] font-bold">Дата начала работы:</p>
          <p className="text-[14px] text-[#15312A] font-bold mb-[5px]">{employee.work_start_date}</p>

          <p className="text-[14px] text-[#267962] font-bold">Стаж:</p>
          <p className="text-[14px] text-[#15312A] font-bold mb-[5px]">
            {getWorkDuration(employee.work_start_date)}
          </p>
        </div>
      </div>

      <div className="flex gap-[5px]">
        <img src="/icons/systems/phone.svg" alt="phoneicon" className="w-[24px] h-[24px] inline-block mr-2" />
          <p className="text-[14px] text-[#267962] font-bold">Телефон:</p>
          <p className="text-[14px] text-[#15312A] font-bold mb-[5px]">
            {employee.user_phone || 'Не указан'}
          </p>
      </div>
      <div className="flex gap-[5px]">
        <img src="/icons/systems/mail.svg" alt="phoneicon" className="w-[24px] h-[24px] inline-block mr-2" />
          <p className="text-[14px] text-[#267962] font-bold">Email:</p>
          <p className="text-[14px] text-[#15312A] font-bold mb-[5px]">
            {employee.user_email || 'Не указан'}
          </p>
      </div>

 {departmentHead && !employee.is_chief && (
        <div className="flex gap-[5px] items-center">
          <img src={`/images/${imageHead}.jpg`} alt="departmentHead" className="w-[75px] h-[75px] rounded-[15px] object-cover" />
          <div>
            <p className="text-[14px] text-[#267962] font-bold">Руководитель департамента:</p>
            <p className="text-[14px] text-[#15312A] font-bold">{departmentHead.user_surename} {departmentHead.user_name} {departmentHead.user_patronymic}</p>
          </div>
        </div>
      )}
      {sectorHead && !employee.is_sector_head && (
        <div className="flex gap-[5px] items-center">
              <img
            src={`/images/.jpg`}
            alt={`${chief.user_surename} ${chief.user_name}`}
            className="w-[80px] h-[80px] rounded-[10px] object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
          <div>
            <p className="text-[14px] text-[#267962] font-bold">Руководитель сектора:</p>
            <p className="text-[14px] text-[#15312A] font-bold">{sectorHead.user_surename} {sectorHead.user_name} {sectorHead.user_patronymic}</p>
          </div>
        </div>
      )}

     
    </div>
  );
}
