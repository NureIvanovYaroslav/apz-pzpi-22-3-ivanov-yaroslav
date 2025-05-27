import React from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/getUserFromToken";
import { useTranslation } from "react-i18next";
import "../App.css";

const Header = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/");
  };

  return (
    <header className="header-main">
      <div className="header-main-left">
        <a href="/" className="header-main-logo">
          apz
        </a>
        {isAuth && (
          <button
            className="header-btn"
            onClick={() => navigate("/fitness-studios")}
          >
            {t("header.studios")}
          </button>
        )}
        {isAuth && user?.roles?.includes("ADMIN") && (
          <button className="header-btn" onClick={() => navigate("/admin")}>
            {t("header.admin")}
          </button>
        )}
        {isAuth && user?.roles?.includes("SERVER_ADMIN") && (
          <button
            className="header-btn"
            onClick={() => navigate("/server-admin")}
          >
            {t("header.serverAdmin")}
          </button>
        )}
        {isAuth && user?.roles?.includes("DB_ADMIN") && (
          <button className="header-btn" onClick={() => navigate("/db-admin")}>
            {t("header.dbAdmin")}
          </button>
        )}
      </div>
      <div className="header-main-right">
        {!isAuth ? (
          <>
            <a href="/login" className="header-link-no-decoration">
              <button className="header-btn">{t("header.login")}</button>
            </a>
            <a href="/registration" className="header-link-no-decoration">
              <button className="header-btn header-btn--primary">
                {t("header.register")}
              </button>
            </a>
          </>
        ) : (
          <>
            <a href="/profile" className="header-link-no-decoration">
              <button className="header-btn">{t("header.profile")}</button>
            </a>
            <button
              className="header-btn header-btn--primary"
              onClick={handleLogout}
            >
              {t("header.logout")}
            </button>
          </>
        )}
        <div className="header-lang-switch">
          <button
            className={`header-lang-btn${
              i18n.language === "ua" ? " header-lang-btn--active" : ""
            }`}
            onClick={() => i18n.changeLanguage("ua")}
          >
            UA
          </button>
          <button
            className={`header-lang-btn${
              i18n.language === "en" ? " header-lang-btn--active" : ""
            }`}
            onClick={() => i18n.changeLanguage("en")}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
