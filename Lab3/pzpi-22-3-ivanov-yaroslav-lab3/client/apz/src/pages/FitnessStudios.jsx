import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../utils/getUserFromToken";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

const StudioCard = ({ studio, onClick }) => {
  const { t } = useTranslation();
  return (
    <div className="studio-card" onClick={onClick}>
      <h3 className="studio-card-title">{studio.studioName}</h3>
      <div className="studio-card-row">
        <span className="studio-card-label">{t("fitness_studios.email")}:</span>
        <span className="studio-card-value">{studio.email || "—"}</span>
      </div>
      <div className="studio-card-row">
        <span className="studio-card-label">
          {t("fitness_studios.address")}:
        </span>
        <span className="studio-card-value">{studio.address || "—"}</span>
      </div>
      <div className="studio-card-row">
        <span className="studio-card-label">
          {t("fitness_studios.members_count")}:
        </span>
        <span className="studio-card-value">
          {Array.isArray(studio.userFitnessStudios)
            ? studio.userFitnessStudios.length
            : 0}
        </span>
      </div>
    </div>
  );
};

const FitnessStudios = () => {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStudios = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/fitness-studios", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        let studiosArr = Array.isArray(data) ? data : [];
        studiosArr.sort((a, b) => {
          const aDate = new Date(a.createdAt || a.created_at || a.date || 0);
          const bDate = new Date(b.createdAt || b.created_at || b.date || 0);
          return bDate - aDate;
        });
        setStudios(studiosArr);
      } catch {
        setStudios([]);
        setError(t("fitness_studios.error_connection"));
      }
      setLoading(false);
    };
    fetchStudios();
    // eslint-disable-next-line
  }, [t]);

  return (
    <div>
      <div className="studio-header-row">
        <button
          className="header-btn header-btn--primary"
          onClick={() => navigate("/add-fitness-studio")}
        >
          {t("fitness_studios.add_btn")}
        </button>
      </div>
      <h2 className="studio-page-title">{t("fitness_studios.title")}</h2>
      {error ? (
        <div className="studio-error">{error}</div>
      ) : studios.length === 0 ? (
        <div className="studio-empty">{t("fitness_studios.empty")}</div>
      ) : (
        <div className="studio-list">
          {studios.map((studio) => (
            <StudioCard
              key={studio._id?.$oid || studio._id || studio.id}
              studio={studio}
              onClick={() =>
                navigate(
                  `/fitness-studios/${
                    studio._id?.$oid || studio._id || studio.id
                  }`
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FitnessStudios;
