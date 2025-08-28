'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie"; // npm install js-cookie
import ChatModern from "@/components/ChatModern";

export default function ChatPage() {
    const params = useParams();
    const chatUser = params.chatUser;

    const [chatList, setChatList] = useState([]);

    useEffect(() => {
        // читаем куку
        const storedList = Cookies.get("chatList");
        if (storedList) {
            try {
                const parsedList = JSON.parse(storedList);
                setChatList(parsedList);
                console.log("Parsed chatList:", parsedList);
            } catch (err) {
                console.error("Ошибка парсинга chatList:", err);
            }
        }
    }, []);

    return (
        <>
            <h2>Список чатов</h2>
            <ul>
                {chatList.map((login, index) => (
                    <li key={index}>{login}</li>
                ))}
            </ul>

            {/* Если хочешь также открыть конкретный чат */}
            {chatUser && <ChatModern chatUser={chatUser} />}
        </>
    );
}
