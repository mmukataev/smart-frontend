"use client";

import { useState, useEffect } from "react";
import ChatModernComponent from "@/components/ChatModernComponent";
import Profile from "@/components/Profile";
import { useLocale } from "@/hooks/useLocale";

export default function ChatModern({ selectedUser: controlledUser, onSelectUser: controlledSetUser }) {
    const locale = useLocale();
    const [internalUser, setInternalUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Если приходит controlledUser — обновляем локальное состояние
    useEffect(() => {
        if (controlledUser !== undefined && controlledUser !== internalUser) {
            setInternalUser(controlledUser);
        }
    }, [controlledUser]);

    // Хендлер выбора юзера — обновляем локальный стейт и при необходимости дергаем внешний коллбек
    const handleSelectUser = (user) => {
        setInternalUser(user);
        if (controlledSetUser) {
            controlledSetUser(user);
        }
    };

    const handleClose = () => setSelectedUserId(null);
    const handleCloseChat = () => handleSelectUser(null);

    return (
        <>
            <div className="w-[70px] relative h-[calc(100vh-20px)] bg-white rounded-[10px] shadow">
                {internalUser ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm">
                        <div className="flex flex-col w-fit h-full p-[10px]">
                            <button
                                onClick={handleCloseChat}
                                className="text-white w-fit hover:text-gray-100 text-[14px] p-4 bg-[rgba(0,0,0,0.2)] rounded mb-4 absolute right-[20px] top-[20px]"
                            >
                                {locale === "ru" ? 'Закрыть чат' : 'Чатты жабу'}
                            </button>
                            <ChatModernComponent
                                selectedUser={internalUser}
                                onSelectUser={handleSelectUser}
                                onSelectUserId={setSelectedUserId}
                            />
                        </div>
                    </div>
                ) : (
                    <ChatModernComponent
                        selectedUser={internalUser}
                        onSelectUser={handleSelectUser}
                        onSelectUserId={setSelectedUserId}
                    />
                )}
            </div>

            {selectedUserId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="flex flex-col p-5 w-fit">
                        <button
                            onClick={handleClose}
                            className="text-white w-fit hover:text-gray-100 text-[14px] p-4 bg-[rgba(0,0,0,0.2)] rounded mb-4"
                        >
                            {locale === "ru" ? 'Назад' : 'Артқа'}
                        </button>
                        <Profile id={selectedUserId} />
                    </div>
                </div>
            )}
        </>
    );
}
