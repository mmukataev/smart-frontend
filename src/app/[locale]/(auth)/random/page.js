'use client';

import { useState } from "react";

export default function RandomSyrkaDyrka() {
  const options = ["YES", "NO"];
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState(null);

  const spinWheel = () => {
    if (spinning) return; // запретить повторный клик во время вращения
    setSpinning(true);
    setResult(null);

    // Выбираем случайный результат
    const selectedIndex = Math.floor(Math.random() * options.length);

    // Угол поворота (несколько оборотов + сектор)
    const spins = 5 * 360; // 5 оборотов
    const sectorAngle = 360 / options.length;
    const newAngle = spins + (selectedIndex * sectorAngle) + (sectorAngle / 2);

    setAngle(prev => prev + newAngle);

    // Через 3 секунды показываем результат
    setTimeout(() => {
      setSpinning(false);
      setResult(options[selectedIndex]);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="relative w-64 h-64 border-4 border-black rounded-full overflow-hidden">
        <div
          className="absolute w-full h-full transition-transform duration-[3000ms] ease-out"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          {/* Сектор 1 */}
          <div
            className="absolute w-1/2 h-full bg-green-500 text-white flex items-center justify-center"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)", transform: "rotate(0deg)", transformOrigin: "100% 50%" }}
          >
            да
          </div>
          {/* Сектор 2 */}
          <div
            className="absolute w-1/2 h-full bg-red-500 text-white flex items-center justify-center"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)", transform: "rotate(180deg)", transformOrigin: "100% 50%" }}
          >
            нет
          </div>
        </div>
        {/* Указатель */}
        <div className="absolute top-1/2 left-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-black transform -translate-x-1/2 -translate-y-full" />
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {spinning ? "Крутим..." : "Запустить колесо"}
      </button>

      {result && (
        <div className="mt-4 text-xl font-bold">
          Выпало: {result}
        </div>
      )}
    </div>
  );
}
