// components/UserSearch.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export default function UserSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await axios.get(`/api/users/search?q=${searchQuery}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error('Ошибка поиска:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Поиск сотрудника по ФИО"
        className="w-full text-white placeholder-white focus:outline-none bg-transparent"
      />

      {searchResults.length > 0 && (
        <ul className="absolute z-10 bg-white text-black w-full shadow rounded mt-1 max-h-[200px] overflow-auto">
          {searchResults.map((user) => (
            <li
              key={user.id}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleUserClick(user)}
            >
              {user.display_name}
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedUser.display_name}</h2>
            <p>Должность: {selectedUser.title}</p>
            <p>Отдел: {selectedUser.department}</p>
            <p>Онлайн: {selectedUser.last_logout ? dayjs(selectedUser.last_logout).format('YYYY-MM-DD HH:mm') : '—'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
