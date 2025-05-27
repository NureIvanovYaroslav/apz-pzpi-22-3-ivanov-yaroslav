import React, { useState } from "react";
import { getUserFromToken } from "../utils/getUserFromToken";
import { formatDate } from "../utils/formatDate";
import { formatBytes } from "../utils/formatBytes";
import { useTranslation } from "react-i18next";
import "../App.css";

const LOGS_PER_PAGE = 10;

const ServerAdminDashboard = () => {
  const user = getUserFromToken();
  const [serverStatus, setServerStatus] = useState(null);
  const [config, setConfig] = useState(null);
  const [configEdit, setConfigEdit] = useState("");
  const [logs, setLogs] = useState([]);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const [deleteDate, setDeleteDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const [activeBlock, setActiveBlock] = useState(null);
  const { t } = useTranslation();

  if (!user?.roles?.includes("SERVER_ADMIN")) {
    return (
      <div className="server-admin-access-denied">
        {t("server_admin.access_denied")}
      </div>
    );
  }

  const handleCheckServerStatus = async () => {
    setLoading(true);
    setNotification("");
    setActiveBlock("status");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/server-status", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setServerStatus(data);
        setNotification("");
      } else {
        setNotification(data.message || t("server_admin.errors.status"));
      }
    } catch {
      setNotification(t("server_admin.errors.connection"));
    }
    setLoading(false);
  };

  const handleGetConfig = async () => {
    setLoading(true);
    setNotification("");
    setActiveBlock("config");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/server-config", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setConfig(data);
        setConfigEdit(JSON.stringify(data, null, 2));
        setNotification("");
      } else {
        setNotification(data.message || t("server_admin.errors.config"));
      }
    } catch {
      setNotification(t("server_admin.errors.connection"));
    }
    setLoading(false);
  };

  const handleUpdateConfig = async () => {
    setLoading(true);
    setNotification("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/server-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: configEdit,
      });
      const data = await res.json();
      if (res.ok) {
        setNotification(t("server_admin.success.config_updated"));
        setConfig(data);
      } else {
        setNotification(data.message || t("server_admin.errors.config_update"));
      }
    } catch {
      setNotification(t("server_admin.errors.connection"));
    }
    setLoading(false);
  };

  const handleGetLogs = async () => {
    setLoading(true);
    setNotification("");
    setActiveBlock("logs");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/logs", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setLogs(Array.isArray(data) ? data : []);
        setLogsPage(1);
        setNotification("");
      } else {
        setNotification(data.message || t("server_admin.errors.logs"));
      }
    } catch {
      setNotification(t("server_admin.errors.connection"));
    }
    setLoading(false);
  };

  const handleDeleteLogs = async () => {
    if (!window.confirm(t("server_admin.confirm.delete_all_logs"))) return;
    setLoading(true);
    setNotification("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/logs", {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setLogs([]);
        setNotification(t("server_admin.success.logs_deleted"));
      } else {
        setNotification(data.message || t("server_admin.errors.logs_delete"));
      }
    } catch {
      setNotification(t("server_admin.errors.connection"));
    }
    setLoading(false);
  };

  const handleDeleteLogsByDate = async () => {
    if (
      !window.confirm(
        t("server_admin.confirm.delete_logs_by_date", { date: deleteDate })
      )
    )
      return;
    setLoading(true);
    setNotification("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/logs/by-date?date=${deleteDate}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setNotification(
          t("server_admin.success.logs_deleted_by_date", { date: deleteDate })
        );
        handleGetLogs();
      } else {
        setNotification(
          data.message || t("server_admin.errors.logs_delete_by_date")
        );
      }
    } catch {
      setNotification(t("server_admin.errors.connection"));
    }
    setLoading(false);
  };

  const totalPages = Math.max(1, Math.ceil(logs.length / LOGS_PER_PAGE));
  const paginatedLogs = logs.slice(
    (logsPage - 1) * LOGS_PER_PAGE,
    (logsPage - 1) * LOGS_PER_PAGE + LOGS_PER_PAGE
  );

  const serverStatusLabels = {
    status: t("server_admin.status"),
    uptime: t("server_admin.uptime"),
    memoryUsage: t("server_admin.memory_usage"),
    timestamp: t("server_admin.timestamp"),
    rss: t("server_admin.rss"),
    heapTotal: t("server_admin.heap_total"),
    heapUsed: t("server_admin.heap_used"),
    external: t("server_admin.external"),
    arrayBuffers: t("server_admin.array_buffers"),
  };

  return (
    <div className="server-admin-container">
      <h2 className="server-admin-title">{t("server_admin.title")}</h2>

      {notification && (
        <div
          className={
            notification.startsWith("✅")
              ? "server-admin-notification server-admin-notification--success"
              : "server-admin-notification server-admin-notification--warn"
          }
        >
          {notification}
        </div>
      )}

      <div className="server-admin-btns-col">
        <button
          className={`header-btn server-admin-main-btn${
            activeBlock === "status" ? " server-admin-main-btn--active" : ""
          }`}
          onClick={handleCheckServerStatus}
          disabled={loading}
        >
          {loading && activeBlock === "status"
            ? t("server_admin.loading.status")
            : t("server_admin.check_status")}
        </button>
        {activeBlock === "status" && serverStatus && (
          <div className="server-admin-status-wrap">
            <div className="server-admin-status-card">
              <h4 className="server-admin-status-title">
                {t("server_admin.status_title")}
              </h4>
              <ul className="server-admin-status-list">
                <li>
                  <span className="server-admin-status-label">
                    {serverStatusLabels.status}:
                  </span>{" "}
                  {serverStatus.status === "OK" ? "🟢 OK" : serverStatus.status}
                </li>
                <li>
                  <span className="server-admin-status-label">
                    {serverStatusLabels.uptime}:
                  </span>{" "}
                  {serverStatus.uptime
                    ? serverStatus.uptime.toFixed(1) +
                      " " +
                      t("server_admin.sec")
                    : "—"}
                </li>
                <li>
                  <span className="server-admin-status-label">
                    {serverStatusLabels.timestamp}:
                  </span>{" "}
                  {serverStatus.timestamp
                    ? formatDate(serverStatus.timestamp)
                    : "—"}
                </li>
                {serverStatus.memoryUsage && (
                  <li className="server-admin-status-list-nested">
                    <span className="server-admin-status-label">
                      {serverStatusLabels.memoryUsage}:
                    </span>
                    <ul className="server-admin-status-list-inner">
                      <li>
                        <span className="server-admin-status-label">
                          {serverStatusLabels.rss}:
                        </span>{" "}
                        {formatBytes(serverStatus.memoryUsage.rss)}
                      </li>
                      <li>
                        <span className="server-admin-status-label">
                          {serverStatusLabels.heapTotal}:
                        </span>{" "}
                        {formatBytes(serverStatus.memoryUsage.heapTotal)}
                      </li>
                      <li>
                        <span className="server-admin-status-label">
                          {serverStatusLabels.heapUsed}:
                        </span>{" "}
                        {formatBytes(serverStatus.memoryUsage.heapUsed)}
                      </li>
                      <li>
                        <span className="server-admin-status-label">
                          {serverStatusLabels.external}:
                        </span>{" "}
                        {formatBytes(serverStatus.memoryUsage.external)}
                      </li>
                      <li>
                        <span className="server-admin-status-label">
                          {serverStatusLabels.arrayBuffers}:
                        </span>{" "}
                        {formatBytes(serverStatus.memoryUsage.arrayBuffers)}
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        <button
          className={`header-btn server-admin-main-btn${
            activeBlock === "config" ? " server-admin-main-btn--active" : ""
          }`}
          onClick={handleGetConfig}
          disabled={loading}
        >
          {loading && activeBlock === "config"
            ? t("server_admin.loading.config")
            : t("server_admin.get_config")}
        </button>
        {activeBlock === "config" && config && (
          <div className="server-admin-config-wrap">
            <textarea
              value={configEdit}
              onChange={(e) => setConfigEdit(e.target.value)}
              rows={10}
              className="server-admin-config-textarea"
            />
            <button
              className="header-btn header-btn--primary server-admin-config-btn"
              onClick={handleUpdateConfig}
              disabled={loading}
            >
              {t("server_admin.update_config")}
            </button>
          </div>
        )}

        <button
          className={`header-btn server-admin-main-btn${
            activeBlock === "logs" ? " server-admin-main-btn--active" : ""
          }`}
          onClick={handleGetLogs}
          disabled={loading}
        >
          {loading && activeBlock === "logs"
            ? t("server_admin.loading.logs")
            : t("server_admin.view_logs")}
        </button>
        {activeBlock === "logs" && logs.length > 0 && (
          <div className="server-admin-logs-wrap">
            <table className="server-admin-logs-table">
              <thead>
                <tr>
                  <th>{t("server_admin.log_date")}</th>
                  <th>{t("server_admin.log_user")}</th>
                  <th>{t("server_admin.log_description")}</th>
                  <th>{t("server_admin.log_status")}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{formatDate(log.date)}</td>
                    <td>{log.userId}</td>
                    <td>{log.description}</td>
                    <td>
                      {log.success ? (
                        <span className="server-admin-log-success">
                          {t("server_admin.log_success")}
                        </span>
                      ) : (
                        <span className="server-admin-log-error">
                          {t("server_admin.log_error")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="server-admin-logs-pagination">
              <button
                className="header-btn"
                onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                disabled={logsPage === 1}
              >
                {"<"}
              </button>
              <span>
                {t("server_admin.page")} {logsPage} {t("server_admin.of")}{" "}
                {totalPages}
              </span>
              <button
                className="header-btn"
                onClick={() => setLogsPage((p) => Math.min(totalPages, p + 1))}
                disabled={logsPage === totalPages}
              >
                {">"}
              </button>
            </div>
            <div className="server-admin-logs-actions">
              <button
                className="header-btn server-admin-logs-delete-btn"
                onClick={handleDeleteLogs}
                disabled={loading}
              >
                {t("server_admin.delete_all_logs")}
              </button>
              <form
                className="server-admin-logs-delete-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteLogsByDate();
                }}
              >
                <label
                  htmlFor="delete-log-date"
                  className="server-admin-logs-delete-label"
                >
                  {t("server_admin.delete_logs_by_date")}
                </label>
                <div className="server-admin-logs-delete-date-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="server-admin-logs-delete-date-icon"
                  >
                    <rect
                      width="18"
                      height="18"
                      x="3"
                      y="4"
                      fill="#b00"
                      fillOpacity="0.12"
                      rx="3"
                    />
                    <rect
                      width="18"
                      height="18"
                      x="3"
                      y="4"
                      stroke="#b00"
                      strokeWidth="2"
                      rx="3"
                    />
                    <path stroke="#b00" strokeWidth="2" d="M8 2v4M16 2v4" />
                    <rect
                      width="14"
                      height="8"
                      x="5"
                      y="9"
                      fill="#fff"
                      rx="1"
                    />
                  </svg>
                  <input
                    id="delete-log-date"
                    type="date"
                    value={deleteDate}
                    onChange={(e) => setDeleteDate(e.target.value)}
                    className="server-admin-logs-delete-date-input"
                    max={new Date().toISOString().slice(0, 10)}
                  />
                </div>
                <button
                  type="submit"
                  className="header-btn server-admin-logs-delete-btn"
                  disabled={loading}
                >
                  {t("server_admin.delete_by_date_btn")}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerAdminDashboard;
