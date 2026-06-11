import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/axios";
import {
  normalizeEmail,
  validateEmail,
  validateLoginPassword,
} from "../utils/authValidation";

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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12S5.25 5.25 12 5.25 21.75 12 21.75 12 18.75 18.75 12 18.75 2.25 12 2.25 12Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15.75A3.75 3.75 0 1 0 12 8.25a3.75 3.75 0 0 0 0 7.5Z"
          />
        </>
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.58 10.58A2 2 0 0 0 13.42 13.42"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.88 5.09A10.94 10.94 0 0 1 12 4.88c6.75 0 9.75 7.12 9.75 7.12a16.72 16.72 0 0 1-4.13 5.17"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.23 6.23A16.8 16.8 0 0 0 2.25 12S5.25 19.12 12 19.12c1.72 0 3.2-.37 4.47-.96"
          />
        </>
      )}
    </svg>
  );
}

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    if (name === "email") return validateEmail(value);
    if (name === "password") return validateLoginPassword(value);
    return "";
  };

  const validateForm = (nextData) => {
    const nextErrors = {
      email: validateEmail(nextData.email),
      password: validateLoginPassword(nextData.password),
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const payload = {
      email: normalizeEmail(data.email),
      password: data.password,
    };

    setTouched({ email: true, password: true });

    if (!validateForm(payload)) {
      toast.error("Please correct the highlighted fields");
      return;
    }

    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", payload);

      localStorage.setItem("token", res.data.token);

      if (res.data.role === "student") navigate("/student");
      if (res.data.role === "warden") navigate("/warden");
      if (res.data.role === "admin") navigate("/admin");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Unable to sign in"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          Sign in to CampusCare
        </h2>
        <p className="mt-2 text-center text-sm text-brandText-muted">
          Welcome back! Please enter your details.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="portal-panel px-6 py-8 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="portal-label">
                Email address
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@college.edu"
                  aria-invalid={Boolean(shouldShowError("email"))}
                  aria-describedby={shouldShowError("email") ? "login-email-error" : undefined}
                  className={`portal-input ${
                    shouldShowError("email")
                      ? "border-status-error focus:border-status-error focus:ring-status-error/10"
                      : ""
                  }`}
                />
              </div>
              {shouldShowError("email") ? (
                <p id="login-email-error" className="mt-1.5 text-xs font-medium text-status-error">
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
                  value={data.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={Boolean(shouldShowError("password"))}
                  aria-describedby={
                    shouldShowError("password") ? "login-password-error" : undefined
                  }
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
              {shouldShowError("password") ? (
                <p id="login-password-error" className="mt-1.5 text-xs font-medium text-status-error">
                  {errors.password}
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between pt-1">
              {/* <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-brandBorder text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-brandText-muted">
                  Remember me
                </label>
              </div> */}

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-hover">
                  Forgot password?
                </a>
              </div>
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
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-brandText-muted">
            Need an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary transition hover:text-primary-hover"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
