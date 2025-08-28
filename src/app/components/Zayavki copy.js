'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSsoOrders } from '@/context/SsoOrdersContext';

export default function Zayavki() {
  const { ssoOrders, ssoTechdeskOrders } = useSsoOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // по 4 заявки на страницу

  // Объединяем массивы: сначала absence, потом techdesk
  const allOrders = [
    ...ssoOrders.map(o => ({ ...o, source: 'absence' })),
    ...ssoTechdeskOrders.map(o => ({ ...o, source: 'techdesk' }))
  ];

  const totalPages = Math.ceil(allOrders.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentOrders = allOrders.slice(startIndex, startIndex + pageSize);

  return (
    <div className="px-[20px] flex-1 py-[30px] bg-white rounded-[15px] shadow">
      <div className='w-full flex items-center justify-between'>
        <h2 className="text-[24px] font-bold text-[var(--customDark)] mb-4">Ваши заявки</h2>
      </div>

      <ul>
        {currentOrders.map((order, i) => (
          <Link
            key={i}
            href={order.link || '#'} // если ссылки нет — не падаем
            target={order.link ? "_blank" : undefined}
            rel={order.link ? "noreferrer" : undefined}
            className="p-[10px] mb-2 flex gap-[5px] items-center justify-between bg-[var(--customBackground)] rounded-[5px]"
          >
            <div className='flex gap-[5px]'>
              <div className='w-[40px] h-[40px] flex items-center justify-center rounded-[5px]' title={order.source === 'techdesk' ? "Techdesk" : "Absence"}>
                <img 
                  src={order.source === 'techdesk' ? "/icons/laptop.svg" : "/icons/table.svg"} 
                  width={30} 
                  height={30}
                />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--customDark)]">
                  {order.order_type_kz} <span className='text-gray-400'><i>#{order.name}</i></span>
                </h3>
                <p className="text-[14px] text-[var(--customGray)]">
                  {order.status} 
                  {order.user_data_that_has?.fullname 
                    ? ` у ${order.user_data_that_has.fullname}` 
                    : ''
                  }
                </p>
              </div>
            </div>
            <img src='/icons/angle-right.svg' width={25} className='hover:opacity-[50%]'/>
          </Link>
        ))}
      </ul>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-gradient-custom text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
