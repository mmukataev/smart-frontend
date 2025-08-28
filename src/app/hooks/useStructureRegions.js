import { useState, useEffect } from "react";
import axios from "axios";

export default function useStructureRegions() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRegions() {
      try {
        const res = await axios.get("https://devapi-smart.apa.kz/regions/");
        setRegions(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRegions();
  }, []);

  return { regions, loading, error };
}
