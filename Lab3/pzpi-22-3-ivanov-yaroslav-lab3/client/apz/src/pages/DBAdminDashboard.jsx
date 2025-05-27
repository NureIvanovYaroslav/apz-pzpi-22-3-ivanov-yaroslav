import React, { useState } from "react";
import { getUserFromToken } from "../utils/getUserFromToken";
import { useTranslation } from "react-i18next";
import "../App.css";

const fieldLabels = (t) => ({
  db: t("db_admin.db"),
  collections: t("db_admin.collections"),
  objects: t("db_admin.objects"),
  size: t("db_admin.size"),
  storageSize: t("db_admin.storageSize"),
  indexes: t("db_admin.indexes"),
  indexSize: t("db_admin.indexSize"),
  status: t("db_admin.status"),
  state: t("db_admin.state"),
  host: t("db_admin.host"),
  name: t("db_admin.name"),
});

const stateDescriptions = (t) => ({
  0: t("db_admin.state_disconnected"),
  1: t("db_admin.state_connected"),
  2: t("db_admin.state_connecting"),
  3: t("db_admin.state_disconnecting"),
  99: t("db_admin.state_unknown"),
});

const DBAdminDashboard = () => {
  const [backupPath, setBackupPath] = useState("");
  const [lastBackupPath, setLastBackupPath] = useState("");
  const [lastBackupName, setLastBackupName] = useState("");
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const { t } = useTranslation();
  const user = getUserFromToken();
  if (!user?.roles?.includes("DB_ADMIN")) {
    return (
      <div className="db-admin-access-denied">
        {t("db_admin.access_denied")}
      </div>
    );
  }

  const handleBackup = async () => {
    setBackupLoading(true);
    setNotification("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      let backupFullPath = data.backupPath || data.path || "";
      let name = "";

      if (!backupFullPath && data.message) {
        const match = data.message.match(/Backup created at (.+)$/);
        if (match) {
          backupFullPath = match[1];
        }
      }
      if (backupFullPath) {
        name = backupFullPath.split(/[\\/]/).filter(Boolean).pop() || "";
      }

      setLastBackupPath(backupFullPath);
      setLastBackupName(name);

      setNotification(t("db_admin.success_backup", { name }));
    } catch {
      setNotification(t("db_admin.errors.connection"));
    }
    setBackupLoading(false);
  };

  const handleRestore = async () => {
    if (!backupPath) {
      setNotification(t("db_admin.errors.no_backup_name"));
      return;
    }
    setRestoreLoading(true);
    setNotification("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ backupName: backupPath }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotification(t("db_admin.success_restore"));
      } else {
        setNotification(data.message || t("db_admin.errors.restore_failed"));
      }
    } catch {
      setNotification(t("db_admin.errors.connection"));
    }
    setRestoreLoading(false);
  };

  const handleCheckStatus = async () => {
    setStatusLoading(true);
    setStatus(null);
    setNotification("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/database-status", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data);
      } else {
        setNotification(data.message || t("db_admin.errors.status_failed"));
      }
    } catch {
      setNotification(t("db_admin.errors.connection"));
    }
    setStatusLoading(false);
  };

  const labels = fieldLabels(t);
  const states = stateDescriptions(t);

  return (
    <div className="db-admin-container">
      <h2 className="db-admin-title">{t("db_admin.title")}</h2>

      {notification && (
        <div
          className={
            notification.startsWith("✅")
              ? "db-admin-notification db-admin-notification--success"
              : "db-admin-notification db-admin-notification--warn"
          }
        >
          {notification}
        </div>
      )}

      <div className="db-admin-section">
        <button
          className="header-btn db-admin-main-btn header-btn--primary"
          onClick={handleBackup}
          disabled={backupLoading}
        >
          {backupLoading
            ? t("db_admin.loading.backup")
            : t("db_admin.create_backup")}
        </button>
        {lastBackupName && (
          <div className="db-admin-last-backup">
            <strong>{t("db_admin.last_backup_name")}:</strong> {lastBackupName}
          </div>
        )}
      </div>

      <div className="db-admin-section">
        <label htmlFor="restore-path" className="db-admin-label">
          {t("db_admin.restore_label")}
        </label>
        <input
          id="restore-path"
          type="text"
          placeholder={t("db_admin.restore_placeholder")}
          value={backupPath}
          onChange={(e) => setBackupPath(e.target.value)}
          className="db-admin-input"
        />
        <button
          className="header-btn db-admin-main-btn"
          onClick={handleRestore}
          disabled={restoreLoading}
        >
          {restoreLoading
            ? t("db_admin.loading.restore")
            : t("db_admin.restore_btn")}
        </button>
      </div>

      <div className="db-admin-section">
        <button
          className="header-btn db-admin-main-btn"
          onClick={handleCheckStatus}
          disabled={statusLoading}
        >
          {statusLoading
            ? t("db_admin.loading.status")
            : t("db_admin.check_status")}
        </button>
      </div>

      {status && (
        <div className="db-admin-status-card">
          <h4 className="db-admin-status-title">
            {t("db_admin.status_title")}
          </h4>
          <ul className="db-admin-status-list">
            {Object.entries(status).map(([key, val]) => (
              <li key={key} className="db-admin-status-list-item">
                <span className="db-admin-status-label">
                  {labels[key] || key}:
                </span>{" "}
                {key === "state"
                  ? states[val] || `${val} (${t("db_admin.state_unknown")})`
                  : key === "status"
                  ? t(
                      `db_admin.connection_statuses.${String(
                        val
                      ).toLowerCase()}`,
                      String(val)
                    )
                  : typeof val === "number"
                  ? val.toLocaleString(t("profile.locale") || "uk-UA")
                  : String(val)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DBAdminDashboard;
