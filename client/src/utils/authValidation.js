const NAME_REGEX = /^[A-Za-z.\s]{3,40}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const normalizeName = (value = "") => value.trim().replace(/\s+/g, " ");
export const normalizeEmail = (value = "") => value.trim().toLowerCase();

export const validateName = (value = "") => {
  const normalized = normalizeName(value);

  if (!normalized) return "Full name is required";
  if (!NAME_REGEX.test(normalized)) {
    return "Use 3 to 40 letters, spaces, or periods only";
  }

  return "";
};

export const validateEmail = (value = "") => {
  const normalized = normalizeEmail(value);

  if (!normalized) return "Email address is required";
  if (!EMAIL_REGEX.test(normalized)) {
    return "Enter a valid email address";
  }

  return "";
};

export const validatePassword = (value = "") => {
  if (!value) return "Password is required";
  if (!PASSWORD_REGEX.test(value)) {
    return "Use 8-64 characters with uppercase, lowercase, number, and special character";
  }

  return "";
};

export const validateConfirmPassword = (password = "", confirmPassword = "") => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};

export const validateLoginPassword = (value = "") => {
  if (!value) return "Password is required";
  if (value.length > 64) return "Password must be 64 characters or fewer";
  return "";
};

export const getPasswordStrength = (value = "") => {
  if (!value) {
    return { label: "Weak", score: 0 };
  }

  let score = 0;

  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z\d]/.test(value)) score += 1;
  if (value.length >= 12) score += 1;

  if (score <= 2) return { label: "Weak", score: 1 };
  if (score <= 4) return { label: "Medium", score: 2 };
  return { label: "Strong", score: 3 };
};
