import { useEffect, useState } from "react";

export default function useDailyQuote(date = null) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    // Получаем employee_id из localStorage (только на клиенте)
    const storedId = localStorage.getItem("employee_id");
    if (storedId) {
      setEmployeeId(parseInt(storedId));
    }
  }, []);

  useEffect(() => {
    if (!employeeId) return;

    const fetchQuote = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/quote/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_id: employeeId,
            ...(date && { date }),
          }),
        });

        if (!response.ok) {
          throw new Error("Ошибка при получении цитаты");
        }

        const data = await response.json();
        setQuote(data);
      } catch (err) {
        setError(err.message || "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [employeeId, date]);

  return { quote, loading, error };
}
