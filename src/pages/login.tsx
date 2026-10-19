import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { login } from "../lib/api";

type LoginMethod = "email" | "id";
type UserRole = "student" | "staff";

type FormErrors = {
  email?: string;
  idNumber?: string;
  password?: string;
};

const studentTypes = ["UG", "PG", "ODL", "PC", "IP"];

const validateEmail = (email: string): string => {
  const value = email.trim();

  if (!value) return "Please enter your email address.";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Please enter a valid email address.";
  }

  return "";
};

const validatePassword = (password: string): string => {
  if (!password) return "Please enter your password.";

  if (password.length < 6) {
    return "Your password must contain at least 6 characters.";
  }

  return "";
};

const validateId = (id: string, role: UserRole): string => {
  const value = id.trim().toUpperCase();

  if (!value) {
    return role === "staff"
      ? "Please enter your staff ID."
      : "Please enter your student ID.";
  }

  const parts = value.split("/");

  if (parts.length !== 4 || parts.some((part) => !part)) {
    return "Use the format EDU/UG/2026/001 or EDU/STF/2026/001.";
  }

  if (parts[0] !== "EDU") {
    return "Your ID must begin with EDU.";
  }

  if (role === "staff" && parts[1] !== "STF") {
    return "Your staff ID must begin with EDU/STF.";
  }

  if (role === "student" && !studentTypes.includes(parts[1])) {
    return "Your student ID must contain a valid student category.";
  }

  if (!/^\d{4}$/.test(parts[2])) {
    return "The year in your ID must contain four digits.";
  }

  if (!/^[A-Z0-9-]+$/.test(parts[3])) {
    return "Your ID number contains invalid characters.";
  }

  return "";
};

export default function Login() {
  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [role, setRole] = useState<UserRole>("student");
  const [studentType, setStudentType] = useState("UG");

  const [form, setForm] = useState({
    email: "",
    idNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const clearErrors = () => {
    setErrors({});
    setSubmitError("");
  };

  const changeLoginMethod = (method: LoginMethod) => {
    setLoginMethod(method);
    clearErrors();
  };

  const changeRole = (nextRole: UserRole) => {
    setRole(nextRole);
    clearErrors();
  };

  const updateField = (
    field: "email" | "idNumber" | "password",
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setSubmitError("");
  };

  const getFormattedId = () => {
    const value = form.idNumber.trim().toUpperCase();

    // Accept either a complete ID or just the year/number portion.
    if (value.startsWith("EDU/")) return value;

    const category = role === "staff" ? "STF" : studentType;

    return `EDU/${category}/${value}`;
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (loginMethod === "email") {
      const emailError = validateEmail(form.email);

      if (emailError) nextErrors.email = emailError;
    } else {
      const idError = validateId(getFormattedId(), role);

      if (idError) nextErrors.idNumber = idError;
    }

    const passwordError = validatePassword(form.password);

    if (passwordError) nextErrors.password = passwordError;

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    /*
     * Your current API helper authenticates with email and password only.
     * Do not send an ID as if it were an email address.
     */
    if (loginMethod === "id") {
      setSubmitError(
        "ID login is not connected yet. Please use email login until the ID authentication endpoint is configured."
      );
      return;
    }

    try {
      setLoading(true);
      const response = await login(
        form.email.trim().toLowerCase(),
        form.password,
        role
      );
      const data = response?.data ?? response;
      const accountRole = String(
        data?.user?.role ??
          data?.user?.user_type ??
          data?.role ??
          data?.user_type ??
          ""
      ).toUpperCase();
      if (accountRole.includes("SUPER_ADMIN")) {
        navigate("/superadmin/dashboard");
      } else if (
        accountRole.includes("STAFF") ||
        accountRole.includes("LECTURER")
      ) {
        navigate("/staff/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to your EduNova account.
            </p>
          </div>

          {/* Login method */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => changeLoginMethod("email")}
              className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                loginMethod === "email"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Email
            </button>

            <button
              type="button"
              onClick={() => changeLoginMethod("id")}
              className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                loginMethod === "id"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ID Number
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Account type applies to both login methods */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Account Type
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => changeRole("student")}
                  aria-pressed={role === "student"}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    role === "student"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Student
                </button>

                <button
                  type="button"
                  onClick={() => changeRole("staff")}
                  aria-pressed={role === "staff"}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    role === "staff"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Staff
                </button>
              </div>
            </div>

            {/* Email login */}
            {loginMethod === "email" && (
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {role === "staff" ? "Staff Email" : "Student Email"}
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    onBlur={() => {
                      const message = validateEmail(form.email);

                      setErrors((previous) => ({
                        ...previous,
                        email: message || undefined,
                      }));
                    }}
                    placeholder={
                      role === "staff"
                        ? "Enter your registered staff email"
                        : "Enter your registered student email"
                    }
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "email-error" : undefined
                    }
                    className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 ${
                      errors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-300 focus:border-blue-500"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}

                <p className="mt-2 text-xs text-slate-500">
                  {role === "staff"
                    ? "Use the email address registered to your staff account."
                    : "Use the email address registered to your student account."}
                </p>
              </div>
            )}

            {/* ID login */}
            {loginMethod === "id" && (
              <>
                {role === "student" && (
                  <div>
                    <label
                      htmlFor="studentType"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Student Category
                    </label>

                    <select
                      id="studentType"
                      value={studentType}
                      onChange={(event) => {
                        setStudentType(event.target.value);
                        setErrors((previous) => ({
                          ...previous,
                          idNumber: undefined,
                        }));
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {studentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="idNumber"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    {role === "staff" ? "Staff ID" : "Student ID"}
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="idNumber"
                      name="idNumber"
                      type="text"
                      autoComplete="username"
                      value={form.idNumber}
                      onChange={(event) =>
                        updateField("idNumber", event.target.value)
                      }
                      onBlur={() => {
                        const message = validateId(getFormattedId(), role);

                        setErrors((previous) => ({
                          ...previous,
                          idNumber: message || undefined,
                        }));
                      }}
                      placeholder={
                        role === "staff"
                          ? "EDU/STF/2026/001"
                          : `EDU/${studentType}/2026/001`
                      }
                      aria-invalid={Boolean(errors.idNumber)}
                      aria-describedby={
                        errors.idNumber ? "id-error" : undefined
                      }
                      className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 ${
                        errors.idNumber
                          ? "border-red-400 focus:border-red-500"
                          : "border-slate-300 focus:border-blue-500"
                      }`}
                    />
                  </div>

                  {errors.idNumber && (
                    <p id="id-error" className="mt-2 text-sm text-red-600">
                      {errors.idNumber}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-500">
                    {role === "staff"
                      ? "Enter the ID assigned to your staff account."
                      : "Enter the ID assigned to your student account."}
                  </p>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  placeholder="Enter your password"
                  className={`w-full rounded-xl border py-3 pl-10 pr-12 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 ${
                    errors.password
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-300 focus:border-blue-500"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p
                  id="password-error"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember and forgot password */}
            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* API error */}
            {submitError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                `Sign In as ${role === "staff" ? "Staff" : "Student"}`
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Having trouble accessing your account?{" "}
            <Link
              to="/contact"
              className="font-medium text-blue-700 hover:underline"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}