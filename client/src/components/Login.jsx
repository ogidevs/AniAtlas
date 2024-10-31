import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import "daisyui/dist/full.css";
import { useTranslation } from "react-i18next";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formValues;

    if (isRegister) {
      if (password !== confirmPassword) {
        toast.error(t("register.passwordMismatch"));
        return;
      }
      await register(username, email, password);
    } else {
      await login(username, password);
    }
  };

  const toggleMode = () => setIsRegister(!isRegister);

  return (
    <div className="flex items-center justify-center my-8">
      <div className="card w-96 shadow-lg rounded-lg">
        <div className="card-body p-6">
          <h2 className="card-title text-2xl font-semibold mb-4">
            {isRegister ? t("register.title") : t("login.title")}
          </h2>
          <p className="mb-4 text-sm text-center text-gray-500">
            {isRegister ? t("register.desc") : t("login.desc")}
          </p>
          <form onSubmit={handleSubmit}>
            <FormInput
              label={t(isRegister ? "register.username" : "login.username")}
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder={t(
                isRegister
                  ? "register.usernamePlaceholder"
                  : "login.usernamePlaceholder"
              )}
              required
            />
            {isRegister && (
              <FormInput
                label={t("register.email")}
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder={t("register.emailPlaceholder")}
                required
              />
            )}
            <FormInput
              label={t(isRegister ? "register.password" : "login.password")}
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder={t(
                isRegister
                  ? "register.passwordPlaceholder"
                  : "login.passwordPlaceholder"
              )}
              required
            />
            {isRegister && (
              <FormInput
                label={t("register.confirmPassword")}
                type="password"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                placeholder={t("register.confirmPasswordPlaceholder")}
                required
              />
            )}
            <button
              type="submit"
              className="btn btn-primary w-full bg-indigo-500 hover:bg-indigo-600 border-none"
            >
              {isRegister ? t("register.title") : t("login.title")}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            {isRegister ? t("login.title") : t("register.title")}?{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-indigo-500 hover:underline"
            >
              {isRegister ? t("login.title") : t("register.title")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div className="form-group mb-4">
    <label htmlFor={name} className="label">
      <span className="label-text text-gray-700">{label}:</span>
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="input input-bordered w-full border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 placeholder-gray-500"
    />
  </div>
);

export default Login;
