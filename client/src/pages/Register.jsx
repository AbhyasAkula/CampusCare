import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/axios";
import {
  getPasswordStrength,
  normalizeEmail,
  normalizeName,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/authValidation";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const strengthClasses = {
  Weak: "bg-status-error",
  Medium: "bg-status-warning",
  Strong: "bg-status-success",
};

const strengthTextClasses = {
  Weak: "text-status-error",
  Medium: "text-status-warning",
  Strong: "text-status-success",
};

function EyeIcon({ open }) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12S5.25 5.25 12 5.25 21.75 12 21.75 12 18.75 18.75 12 18.75 2.25 12 2.25 12Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75A3.75 3.75 0 1 0 12 8.25a3.75 3.75 0 0 0 0 7.5Z" />
        </>
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A2 2 0 0 0 13.42 13.42" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 5.09A10.94 10.94 0 0 1 12 4.88c6.75 0 9.75 7.12 9.75 7.12a16.72 16.72 0 0 1-4.13 5.17" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.23 6.23A16.8 16.8 0 0 0 2.25 12S5.25 19.12 12 19.12c1.72 0 3.2-.37 4.47-.96" />
        </>
      )}
    </svg>
  );
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (name, value, nextForm = form) => {
    if (name === "name") return validateName(value);
    if (name === "email") return validateEmail(value);
    if (name === "password") return validatePassword(value);
    if (name === "confirmPassword") {
      return validateConfirmPassword(nextForm.password, value);
    }
    return "";
  };

  const validateForm = (nextForm) => {
    const nextErrors = {
      name: validateName(nextForm.name),
      email: validateEmail(nextForm.email),
      password: validatePassword(nextForm.password),
      confirmPassword: validateConfirmPassword(
        nextForm.password,
        nextForm.confirmPassword
      ),
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);

    setErrors((prev) => {
      const nextErrors = {
        ...prev,
        [name]: validateField(name, value, nextForm),
      };

      if (name === "password" || name === "confirmPassword") {
        nextErrors.confirmPassword = validateConfirmPassword(
          nextForm.password,
          nextForm.confirmPassword
        );
      }

      return nextErrors;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, form),
      ...(name === "password" || name === "confirmPassword"
        ? {
            confirmPassword: validateConfirmPassword(
              form.password,
              form.confirmPassword
            ),
          }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const payload = {
      name: normalizeName(form.name),
      email: normalizeEmail(form.email),
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!validateForm(payload)) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsLoading(true);

    try {
      await API.post("/auth/register", payload);
      toast.success("Registration successful. You can sign in now.");
      setForm(initialForm);
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Unable to create your account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);
  const shouldShowError = (field) => touched[field] && errors[field];

  return (
    <div className="portal-shell flex min-h-screen flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)]">
            <span className="text-xl font-bold">C</span>
          </div>
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-brandText">
          Create your CampusCare account
        </h2>
        <p className="mt-2 text-center text-sm text-brandText-muted">
          Register as a student to access hostel services.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="portal-panel px-6 py-8 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name" className="portal-label">
                Full name
              </label>
              <div className="mt-1.5">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="name"
                  placeholder="Enter your full name"
                  aria-invalid={Boolean(shouldShowError("name"))}
                  aria-describedby={shouldShowError("name") ? "name-error" : undefined}
                  className={`portal-input ${
                    shouldShowError("name")
                      ? "border-status-error focus:border-status-error focus:ring-status-error/10"
                      : ""
                  }`}
                />
              </div>
              {shouldShowError("name") ? (
                <p id="name-error" className="mt-1.5 text-xs font-medium text-status-error">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="email" className="portal-label">
                Email address
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@college.edu"
                  aria-invalid={Boolean(shouldShowError("email"))}
                  aria-describedby={shouldShowError("email") ? "email-error" : undefined}
                  className={`portal-input ${
                    shouldShowError("email")
                      ? "border-status-error focus:border-status-error focus:ring-status-error/10"
                      : ""
                  }`}
                />
              </div>
              {shouldShowError("email") ? (
                <p id="email-error" className="mt-1.5 text-xs font-medium text-status-error">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="portal-label">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  aria-invalid={Boolean(shouldShowError("password"))}
                  aria-describedby={shouldShowError("password") ? "password-error" : undefined}
                  className={`portal-input pr-10 ${
                    shouldShowError("password")
                      ? "border-status-error focus:border-status-error focus:ring-status-error/10"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 inline-flex items-center text-brandText-muted transition hover:text-brandText focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {/* <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-brandText-muted">Password strength</span>
                  <span className={`${strengthTextClasses[passwordStrength.label] || "text-brandText-muted"}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strengthClasses[passwordStrength.label] || ""}`}
                    style={{ width: `${(passwordStrength.score / 3) * 100}%` }}
                  />
                </div>
              </div> */}

              {shouldShowError("password") ? (
                <p id="password-error" className="mt-1.5 text-xs font-medium text-status-error">
                  {errors.password}
                </p>
              ) : (
                <p className="mt-2 text-[11px] leading-relaxed text-brandText-muted">
                  {/* Use 8-64 characters with uppercase, lowercase, number, and special character. */}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="portal-label">
                Confirm password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  aria-invalid={Boolean(shouldShowError("confirmPassword"))}
                  aria-describedby={
                    shouldShowError("confirmPassword")
                      ? "confirm-password-error"
                      : undefined
                  }
                  className={`portal-input pr-10 ${
                    shouldShowError("confirmPassword")
                      ? "border-status-error focus:border-status-error focus:ring-status-error/10"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 inline-flex items-center text-brandText-muted transition hover:text-brandText focus:outline-none"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>
              {shouldShowError("confirmPassword") ? (
                <p
                  id="confirm-password-error"
                  className="mt-1.5 text-xs font-medium text-status-error"
                >
                  {errors.confirmPassword}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="portal-button-primary w-full disabled:cursor-not-allowed disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-brandText-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary transition hover:text-primary-hover"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
