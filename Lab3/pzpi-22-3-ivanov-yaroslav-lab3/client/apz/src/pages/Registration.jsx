import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

const Registration = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) return setError(t("registration.errors.email_required"));
    if (password.length < 7)
      return setError(t("registration.errors.password_length"));
    if (password !== repeatPassword)
      return setError(t("registration.errors.passwords_not_match"));

    try {
      const res = await fetch("/api/auth/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || t("registration.errors.registration_failed"));
      } else {
        localStorage.setItem("token", data.accessToken);
        setIsAuth(true);
        navigate("/");
      }
    } catch {
      setError(t("registration.errors.connection"));
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">{t("registration.title")}</h2>
        <label className="auth-label">
          {t("registration.email")}
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
        <label className="auth-label">
          {t("registration.password")}
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={7}
            autoComplete="new-password"
          />
        </label>
        <label className="auth-label">
          {t("registration.repeat_password")}
          <input
            className="auth-input"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>
        {error && <div className="auth-error">{error}</div>}
        <button
          className="header-btn header-btn--primary auth-btn"
          type="submit"
        >
          {t("registration.submit")}
        </button>
      </form>
    </div>
  );
};

export default Registration;
