import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/getUserFromToken";
import { translateStatus } from "../utils/translations";
import { useTranslation } from "react-i18next";
import "../App.css";

const AddDevice = () => {
  const [deviceId, setDeviceId] = useState("");
  const [frequency, setFrequency] = useState("60");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newDevice, setNewDevice] = useState(null);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCreateDevice = async () => {
    setError("");
    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      const user = getUserFromToken();
      const userId = user?.id || user?._id;
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: "disabled",
          sendDataFrequency: 60,
          user: userId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setNewDevice(data);
        setDeviceId(data.id);
      } else if (res.ok && data._id) {
        setNewDevice({ ...data, id: data._id });
        setDeviceId(data._id);
      } else {
        setError(data.message || t("add_device.errors.create_failed"));
      }
    } catch {
      setError(t("add_device.errors.connection"));
    }
    setCreating(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!deviceId) {
      setError(t("add_device.errors.device_id_required"));
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/devices/${deviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: "enabled",
          sendDataFrequency: Number(frequency),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/");
      } else {
        setError(data.message || t("add_device.errors.add_failed"));
      }
    } catch {
      setError(t("add_device.errors.connection"));
    }
    setLoading(false);
  };

  return (
    <div className="add-device-container add-device-container--wide">
      <h2 className="add-device-title">{t("add_device.title")}</h2>
      <div className="add-device-create-row">
        <span className="add-device-create-label">
          {t("add_device.no_device")}
        </span>
        <button
          className="header-btn"
          onClick={handleCreateDevice}
          disabled={creating}
        >
          {t("add_device.create_btn")}
        </button>
      </div>
      {newDevice && (
        <div className="add-device-new-card">
          <div>
            <strong>{t("add_device.new_id")}:</strong>{" "}
            <span className="add-device-new-id">{newDevice.id}</span>
          </div>
          <div>
            <strong>{t("add_device.status")}:</strong>{" "}
            {translateStatus(newDevice.status || "disabled", t)}
          </div>
          <div>
            <strong>{t("add_device.frequency")}:</strong> 60{" "}
            {t("add_device.seconds")}
          </div>
          <div className="add-device-new-hint">{t("add_device.copy_hint")}</div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="add-device-form">
        <label className="add-device-label">
          {t("add_device.device_id")}
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="add-device-input"
            required
          />
        </label>
        <label className="add-device-label">
          {t("add_device.frequency_label")}
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="add-device-input"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="60">60</option>
            <option value="120">120</option>
            <option value="180">180</option>
            <option value="300">300</option>
            <option value="600">600</option>
          </select>
        </label>
        {error && <div className="add-device-error">{error}</div>}
        <button
          className="header-btn header-btn--primary add-device-submit"
          type="submit"
          disabled={loading}
        >
          {t("add_device.add_btn")}
        </button>
      </form>
    </div>
  );
};

export default AddDevice;
