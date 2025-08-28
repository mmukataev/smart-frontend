'use client';

import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

export default function ChartsBlock({ data, magData, phdData, COLORS }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 text-center">
      {/* Круговая диаграмма */}
      <div className="p-6 bg-white shadow rounded-2xl max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          Поступившие кандидаты по программам
        </h2>
        <p className="text-3xl font-extrabold text-blue-700 mb-5">169</p>
        <div className="flex justify-center">
          <PieChart width={300} height={300}>
            <Pie
              data={data}
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Магистратура */}
      <div className="bg-white shadow rounded-2xl p-6 text-center">
        <h2 className="text-lg font-bold mb-2">
          В разрезе образовательных программ магистратуры
        </h2>
        <p className="text-3xl font-extrabold text-blue-700 mb-5">155</p>
        <PieChart width={300} height={350} className="mx-auto">
          <Pie
            data={magData}
            innerRadius={70}
            outerRadius={120}
            dataKey="value"
          >
            {magData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </div>

      {/* Докторантура */}
      <div className="bg-white shadow rounded-2xl p-6 text-center">
        <h2 className="text-lg font-bold mb-2">
          В разрезе образовательных программ докторантуры
        </h2>
        <p className="text-3xl font-extrabold text-blue-700 mb-4">14</p>
        <PieChart width={300} height={300} className="mx-auto">
          <Pie
            data={phdData}
            innerRadius={70}
            outerRadius={120}
            dataKey="value"
          >
            {phdData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}