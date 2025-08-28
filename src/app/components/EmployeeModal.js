export default function EmployeeModal({ employee, onClose }) {
  const imageUrl = employee.user_image?.startsWith("http")
    ? employee.user_image
    : `https://devapi-smart.apa.kz${employee.user_image}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] relative text-black">
        <button onClick={onClose} className="absolute top-2 right-3 text-xl">×</button>
        <h2 className="text-xl font-bold mb-4">Информация о сотруднике</h2>
        <p><strong>ФИО:</strong> {employee.user_surename} {employee.user_name} {employee.user_patronymic}</p>
        <p><strong>Email:</strong> {employee.user_email}</p>
        <p><strong>Телефон:</strong> {employee.user_phone}</p>
        <p><strong>Дата рождения:</strong> {employee.birth_date}</p>
        <p><strong>Дата начала работы:</strong> {employee.work_start_date}</p>
        <p><strong>Руководитель:</strong> {employee.is_chief ? "Да" : "Нет"}</p>
        <p><strong>Секторный руководитель:</strong> {employee.is_sector_head ? "Да" : "Нет"}</p>
        {employee.user_image && (
          <img
            src={imageUrl}
            alt="Фото"
            className="mt-4 w-24 h-24 rounded-full object-cover mx-auto"
          />
        )}
      </div>
    </div>
  );
}
