import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

const AddFitnessStudio = () => {
  const [form, setForm] = useState({
    studioName: "",
    email: "",
    address: "",
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddStudio = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.studioName || !form.email || !form.address) {
      setFormError(t("add_fitness_studio.errors.required"));
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/fitness-studios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || t("add_fitness_studio.errors.add_failed"));
      } else {
        navigate("/fitness-studios");
      }
    } catch {
      setFormError(t("add_fitness_studio.errors.connection"));
    }
    setLoading(false);
  };

  return (
    <div className="add-fitness-studio-container add-fitness-studio-container--wide">
      <button
        className="header-btn add-fitness-studio-back-btn"
        type="button"
        onClick={() => navigate("/fitness-studios")}
      >
        {t("add_fitness_studio.back_btn")}
      </button>
      <h2 className="add-fitness-studio-title">
        {t("add_fitness_studio.title")}
      </h2>
      <form onSubmit={handleAddStudio} className="add-fitness-studio-form">
        <label className="add-fitness-studio-label">
          {t("add_fitness_studio.studio_name")}
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
          {t("add_fitness_studio.email")}
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
          {t("add_fitness_studio.address")}
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
          {t("add_fitness_studio.submit")}
        </button>
      </form>
    </div>
  );
};

export default AddFitnessStudio;
