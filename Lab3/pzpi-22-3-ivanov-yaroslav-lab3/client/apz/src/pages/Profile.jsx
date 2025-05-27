import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/getUserFromToken";
import { useTranslation } from "react-i18next";
import { convertWeight, convertHeight } from "../utils/unitConversion";
import "../App.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const tokenUser = getUserFromToken();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!tokenUser) return;
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/users/${tokenUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [tokenUser]);

  if (!user) return null;

  return (
    <div className="profile-page">
      <h1 className="profile-page-title">{t("profile.title")}</h1>
      <div className="profile-page-info">
        <div className="profile-page-row">
          <span className="profile-page-label">{t("profile.email")}:</span>
          <span className="profile-page-value">{user.email}</span>
        </div>
        <div className="profile-page-row">
          <span className="profile-page-label">{t("profile.name")}:</span>
          <span className="profile-page-value">{user.name || "-"}</span>
        </div>
        <div className="profile-page-row">
          <span className="profile-page-label">{t("profile.birthDate")}:</span>
          <span className="profile-page-value">
            {user.birthDate
              ? new Date(user.birthDate).toLocaleDateString(
                  t("profile.locale") || "uk-UA"
                )
              : "-"}
          </span>
        </div>
        <div className="profile-page-row">
          <span className="profile-page-label">{t("profile.weight")}:</span>
          <span className="profile-page-value">
            {convertWeight(user.weight, i18n.language)}
          </span>
        </div>
        <div className="profile-page-row">
          <span className="profile-page-label">{t("profile.height")}:</span>
          <span className="profile-page-value">
            {convertHeight(user.height, i18n.language)}
          </span>
        </div>
        <div className="profile-page-row">
          <span className="profile-page-label">{t("profile.country")}:</span>
          <span className="profile-page-value">{user.country || "-"}</span>
        </div>
        <div className="profile-page-row">
          <span className="profile-page-label">{t("profile.sex")}:</span>
          <span className="profile-page-value">
            {user.sex === "female"
              ? t("profile.female")
              : user.sex === "male"
              ? t("profile.male")
              : "-"}
          </span>
        </div>
      </div>
      <button
        className="header-btn header-btn--primary profile-page-edit-btn"
        onClick={() => navigate("/edit-profile")}
      >
        {t("profile.edit_btn")}
      </button>
    </div>
  );
};

export default Profile;
