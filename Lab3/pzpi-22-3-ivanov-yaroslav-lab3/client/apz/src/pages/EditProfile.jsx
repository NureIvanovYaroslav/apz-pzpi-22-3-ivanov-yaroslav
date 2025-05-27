import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/getUserFromToken";
import { useTranslation } from "react-i18next";
import { convertWeight, convertHeight } from "../utils/unitConversion";
import { formatDate } from "../utils/formatDate";
import "../App.css";

const EditProfile = () => {
  const { t, i18n } = useTranslation();
  const fields = [
    { key: "name", label: t("profile.name"), type: "text" },
    { key: "birthDate", label: t("profile.birthDate"), type: "date" },
    {
      key: "weight",
      label: `${t("profile.weight")} (${t("profile.kg")})`,
      type: "number",
    },
    {
      key: "height",
      label: `${t("profile.height")} (${t("profile.cm")})`,
      type: "number",
    },
    { key: "country", label: t("profile.country"), type: "text" },
    { key: "sex", label: t("profile.sex"), type: "select" },
  ];

  const sexOptions = [
    { value: "female", label: t("profile.female") },
    { value: "male", label: t("profile.male") },
  ];

  const [user, setUser] = useState(null);
  const [editKey, setEditKey] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const tokenUser = getUserFromToken();

  useEffect(() => {
    if (!tokenUser) return;
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/users/${tokenUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser({
          ...data,
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString().slice(0, 10)
            : "",
          weight:
            data.weight !== undefined && data.weight !== null
              ? String(data.weight)
              : "",
          height:
            data.height !== undefined && data.height !== null
              ? String(data.height)
              : "",
        });
      } catch {
        setUser(null);
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, [tokenUser]);

  const startEdit = (key) => {
    setEditKey(key);
    setEditValue(user[key] ?? "");
    setError("");
  };

  const cancelEdit = () => {
    setEditKey(null);
    setEditValue("");
    setError("");
  };

  const saveEdit = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const body = { [editKey]: editValue };
      if (editKey === "weight" || editKey === "height") {
        body[editKey] = editValue === "" ? null : Number(editValue);
      }
      const res = await fetch(`/api/users/${tokenUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || t("profile.edit_error"));
      } else {
        setUser((prev) => ({ ...prev, [editKey]: editValue }));
        setEditKey(null);
        setEditValue("");
      }
    } catch {
      setError(t("profile.edit_connection_error"));
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <h1 className="profile-page-title">{t("profile.edit_title")}</h1>
      <div className="profile-page-info">
        {fields.map((f) => (
          <div className="profile-page-row" key={f.key}>
            <div className="profile-page-row-content">
              <span className="profile-page-label">{f.label}:</span>
              {editKey === f.key ? (
                f.type === "select" ? (
                  <select
                    className="profile-edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  >
                    {sexOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="profile-edit-input"
                    type={f.type}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                )
              ) : (
                <span className="profile-page-value">
                  {f.key === "weight"
                    ? convertWeight(user[f.key], i18n.language)
                    : f.key === "height"
                    ? convertHeight(user[f.key], i18n.language)
                    : f.key === "birthDate" && user[f.key]
                    ? formatDate(user[f.key], i18n.language, { dateOnly: true })
                    : f.type === "select"
                    ? sexOptions.find((opt) => opt.value === user[f.key])
                        ?.label || "-"
                    : user[f.key] || "-"}
                </span>
              )}
            </div>
            <div className="profile-page-row-actions">
              {editKey === f.key ? (
                <>
                  <button
                    className="header-btn header-btn--primary profile-edit-save-btn"
                    onClick={saveEdit}
                    disabled={loading}
                  >
                    {t("profile.save_btn")}
                  </button>
                  <button
                    className="header-btn profile-edit-cancel-btn"
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    {t("profile.cancel_btn")}
                  </button>
                </>
              ) : (
                <button
                  className="header-btn profile-edit-btn"
                  onClick={() => startEdit(f.key)}
                >
                  {t("profile.edit_btn")}
                </button>
              )}
            </div>
            {editKey === f.key && error && (
              <div className="profile-edit-error">{error}</div>
            )}
          </div>
        ))}
      </div>
      <button
        className="header-btn profile-edit-back-btn"
        onClick={() => navigate("/profile")}
      >
        {t("profile.back_btn")}
      </button>
    </div>
  );
};

export default EditProfile;
