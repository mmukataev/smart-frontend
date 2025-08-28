'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useLocale } from '@/hooks/useLocale';

export default function ChatModernComponent({ selectedUser, onSelectUser, onSelectUserId }) {
    const locale = useLocale();
    const [chatToken, setChatToken] = useState(null);
    const [logins, setLogins] = useState([]);
    const [userDataMap, setUserDataMap] = useState({});

    useEffect(() => {
        const token = Cookies.get('chatToken');
        setChatToken(token);

        const rawList = Cookies.get('chatList');
        if (rawList) {
            try {
                const parsedList = JSON.parse(rawList)
                    .filter(login => login !== 'test' && login !== 'rocket.cat');
                setLogins(parsedList);
            } catch (err) {
                console.error('Ошибка парсинга chatList:', err);
            }
        }
    }, []);

    const BackendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        async function fetchUserData() {
            const results = {};
            await Promise.all(
                logins.map(async (login) => {
                    try {
                        const res = await fetch(
                            `${BackendUrl}/employee-by-email/?email=${encodeURIComponent(login)}@apa.kz`
                        );
                        if (res.ok) {
                            const data = await res.json();
                            results[login] = {
                                fio: data?.fio || login,
                                id: data?.id || login,
                                position: data?.position || { kz: '', ru: '' },
                                photo: data?.photo || '/default.png'
                            };
                        } else {
                            results[login] = { fio: login, photo: '/default.png' };
                        }
                    } catch {
                        results[login] = { fio: login, photo: '/default.png' };
                    }
                })
            );
            setUserDataMap(results);
        }

        if (logins.length > 0) {
            fetchUserData();
        }
    }, [logins]);

    return (
        <div className={`flex w-fit h-full bg-white rounded-[5px] shadow`}>
            <div className="flex flex-col gap-[10px] p-[10px]">
                <div className='w-[50px] h-[50px] flex items-center justify-center'>
                    <img src='/icons/chat.svg' />
                </div>
                {logins.map((login) => {
                    const userData = userDataMap[login] || {};
                    return (
                        <img
                            key={login}
                            src={userData.photo}
                            alt={userData.fio}
                            onClick={() => onSelectUser(login)}
                            className="w-[50px] h-[50px] rounded-[15px] object-cover border border-[2px] border-green-700 cursor-pointer"
                        />
                    );
                })}
            </div>
            {selectedUser && chatToken ? (
                <div className="w-[700px] flex flex-col">
                    <button 
                        onClick={() => onSelectUserId(userDataMap[selectedUser]?.id)}
                        className="flex bg-gradient-custom items-center gap-3 px-[15px] py-[10px] text-white"
                    >
                        <img
                            src={userDataMap[selectedUser]?.photo || '/default.png'}
                            alt={userDataMap[selectedUser]?.fio || selectedUser}
                            className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                        <div>
                            <b className="font-semibold">
                                {userDataMap[selectedUser]?.fio || selectedUser}
                            </b>
                            <p className="text-sm text-start">
                                {locale === "ru" ? userDataMap[selectedUser]?.position.ru : userDataMap[selectedUser]?.position.kz}
                            </p>
                        </div>
                    </button>

                    <iframe
                        src={`https://chat.apa.kz/direct/${selectedUser}?resumeToken=${chatToken}&createDirect=1`}
                        className="w-full flex-1 border-0 bg-gray-50"
                    />
                </div>
            ) : null}
        </div>
    );
}
