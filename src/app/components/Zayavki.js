'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSsoOrders } from '@/context/SsoOrdersContext';

import { useLocale } from '@/hooks/useLocale';
import translations from '@/translations/translations';

export default function Zayavki() {
  const locale = useLocale();
  const { ssoOrders, ssoTechdeskOrders, ssoHelpdeskOrders, loading } = useSsoOrders();

  const [filter, setFilter] = useState('all');

  const allOrders = [
    ...ssoOrders.map(o => ({ ...o, source: 'absence' })),
    ...ssoTechdeskOrders.map(o => ({ ...o, source: 'techdesk' })),
    ...ssoHelpdeskOrders.map(o => ({ ...o, source: 'helpdesk' }))
  ];

  const filteredOrders = allOrders.filter(order => {
    if (filter === 'all') return true;
    return order.source === filter;
  });

  const isEmpty = !loading && filteredOrders.length === 0;

  return (
    <div className="px-[20px] w-1/2 py-[30px] max-[1200px]:w-full bg-white rounded-[15px] max-h-[600px] shadow flex flex-col items-start">
      <div className='w-full flex items-center justify-between mb-4'>
        <h2 className="text-[24px] font-bold text-[var(--customDark)]">
          {translations.zayavki.title[locale]}
        </h2>
      </div>

        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-gray-200 bg-[var(--customBackground)] h-[60px] w-full outline-none rounded px-3 py-2 mb-4 text-[14px] bg-white"
        >
          <option value="all">{translations.zayavki.all[locale]}</option>
          <option value="absence">{translations.zayavki.absense[locale]}</option>
          <option value="techdesk">{translations.zayavki.techdesk[locale]}</option>
          <option value="helpdesk">{translations.zayavki.helpdesk[locale]}</option>
        </select>

      <ul className='h-full overflow-y-auto w-full flex-1'>
        {loading && (
          <div className="w-full flex justify-center items-center h-[200px]">
            <div className="loader"></div>
          </div>
        )}

        {!loading && filteredOrders.map((order, i) => (
          <Link
            key={i}
            href={order.link || order.url ||'#'}
            target={order.link ? "_blank" : undefined}
            rel={order.link ? "noreferrer" : undefined}
            className="p-[10px] mb-2 flex gap-[5px] items-center justify-between bg-[var(--customBackground)] rounded-[5px]"
          >
            <div className='flex gap-[5px]'>
              <div 
                className='w-[40px] h-[40px] flex items-center justify-center rounded-[5px]' 
                title={order.source}
              >
                <img 
                  src={
                    order.source === 'techdesk' ? "/icons/laptop.svg" 
                    : order.source === 'helpdesk' ? "/icons/gate.svg" 
                    : "/icons/table.svg"
                  } 
                  width={30} 
                  height={30}
                />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--customDark)]">
                  {order[`order_type_${locale}`] || order.title || order[`problemType${locale === 'kz' ? 'Kz' : 'Ru'}`]}
                  <span className='text-gray-400'><i>#{order.name || order.id}</i></span>
                </h3>
                <p className="text-[14px] text-[var(--customGray)]">
                  {order.status || order.state} 
                  {order.user_data_that_has?.fullname 
                    ? ` у ${order.user_data_that_has.fullname}` 
                    : `${order.description}` 
                  }
                </p>
              </div>
            </div>
            <img src='/icons/angle-right.svg' width={25} className='hover:opacity-[50%]'/>
          </Link>
        ))}

        {isEmpty && (
          <div className="w-full flex justify-center items-center h-[200px] text-gray-500 text-[16px]">
            {translations.zayavki.nodata[locale]}
          </div>
        )}
      </ul>
    </div>
  );
}
