import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://devapi-smart.apa.kz";

export default function useUploadPhoto() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadPhoto = async (file) => {
    if (!file) return false;

    const formData = new FormData();
    formData.append("user_image", file);

    try {
      setUploading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/upload/user-photo`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Не удалось загрузить изображение");

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadPhoto,
    uploading,
    error,
  };
}
