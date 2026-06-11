const rawApiUrl = import.meta.env.VITE_API_URL || "";

export const API_URL = rawApiUrl.replace(/\/$/, "");
export const API_BASE_URL = API_URL ? `${API_URL}/api` : "/api";

export const getUploadUrl = (fileOrUrl) => {
  if (!fileOrUrl) return "";

  // Cloudinary URL → return directly
  if (/^https?:\/\//i.test(fileOrUrl)) {
    return fileOrUrl;
  }

  // Local upload fallback
  return `${API_URL}/uploads/${fileOrUrl}`;
};