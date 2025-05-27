import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

const Login = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) return setError(t("login.errors.email_required"));
    if (!password) return setError(t("login.errors.password_required"));

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || t("login.errors.invalid"));
      } else {
        localStorage.setItem("token", data.accessToken);
        setIsAuth(true);
        navigate("/");
      }
    } catch {
      setError(t("login.errors.connection"));
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">{t("login.title")}</h2>
        <label className="auth-label">
          {t("login.email")}
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
          {t("login.password")}
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error && <div className="auth-error">{error}</div>}
        <button
          className="header-btn header-btn--primary auth-btn"
          type="submit"
        >
          {t("login.submit")}
        </button>
      </form>
    </div>
  );
};

export default Login;
