import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

const EditFitnessStudio = () => {
  const { id } = useParams();
  const [studio, setStudio] = useState(null);
  const [form, setForm] = useState({
    studioName: "",
    email: "",
    address: "",
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/fitness-studios/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) {
          setStudio(data);
          setForm({
            studioName: data.studioName || "",
            email: data.email || "",
            address: data.address || "",
          });
        } else {
          setFormError(
            data.message || t("edit_fitness_studio.errors.load_failed")
          );
        }
      } catch {
        setFormError(t("edit_fitness_studio.errors.connection"));
      }
    };
    fetchStudio();
    // eslint-disable-next-line
  }, [id, t]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditStudio = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.studioName || !form.email || !form.address) {
      setFormError(t("edit_fitness_studio.errors.required"));
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/fitness-studios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(
          data.message || t("edit_fitness_studio.errors.edit_failed")
        );
      } else {
        navigate(`/fitness-studios/${id}`);
      }
    } catch {
      setFormError(t("edit_fitness_studio.errors.connection"));
    }
    setLoading(false);
  };

  return (
    <div className="add-fitness-studio-container">
      <button
        className="header-btn add-fitness-studio-back-btn"
        type="button"
        onClick={() => navigate(`/fitness-studios/${id}`)}
      >
        {t("edit_fitness_studio.back_btn", {
          studio: studio?.studioName ? `«${studio.studioName}»` : "",
        })}
      </button>
      <h2 className="add-fitness-studio-title">
        {t("edit_fitness_studio.title")}
      </h2>
      <form onSubmit={handleEditStudio} className="add-fitness-studio-form">
        <label className="add-fitness-studio-label">
          {t("edit_fitness_studio.studio_name")}
          <input
            type="text"
            name="studioName"
            value={form.studioName}
            onChange={handleFormChange}
            className="add-fitness-studio-input"
            required
          />
        </label>
        <label className="add-fitness-studio-label">
          {t("edit_fitness_studio.email")}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleFormChange}
            className="add-fitness-studio-input"
            required
          />
        </label>
        <label className="add-fitness-studio-label">
          {t("edit_fitness_studio.address")}
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleFormChange}
            className="add-fitness-studio-input"
            required
          />
        </label>
        {formError && (
          <div className="add-fitness-studio-error">{formError}</div>
        )}
        <button
          className="header-btn header-btn--primary add-fitness-studio-submit"
          type="submit"
          disabled={loading}
        >
          {t("edit_fitness_studio.submit")}
        </button>
      </form>
    </div>
  );
};

export default EditFitnessStudio;
