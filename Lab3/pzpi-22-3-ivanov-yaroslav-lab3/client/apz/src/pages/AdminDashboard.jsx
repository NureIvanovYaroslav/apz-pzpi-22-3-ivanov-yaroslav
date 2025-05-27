import React, { useState, useEffect } from "react";
import { getUserFromToken } from "../utils/getUserFromToken";
import { useTranslation } from "react-i18next";
import "../App.css";

const ROLE_LABELS = {
  USER: "role_labels.user",
  DB_ADMIN: "role_labels.db_admin",
  SERVER_ADMIN: "role_labels.server_admin",
  ADMIN: "role_labels.admin",
};

const ROLE_OPTIONS = [
  { value: "DB_ADMIN", label: "role_labels.db_admin" },
  { value: "SERVER_ADMIN", label: "role_labels.server_admin" },
  { value: "ADMIN", label: "role_labels.admin" },
];

const AdminDashboard = () => {
  const user = getUserFromToken();
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("email");
  const [sortAsc, setSortAsc] = useState(true);
  const { t } = useTranslation();

  if (!user?.roles?.includes("ADMIN")) {
    return (
      <div className="admin-dashboard-access-denied">
        {t("admin_dashboard.access_denied")}
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setNotification("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
      else
        setNotification(data.message || t("admin_dashboard.errors.load_users"));
    } catch {
      setNotification(t("admin_dashboard.errors.connection"));
    }
    setLoading(false);
  };

  const handleAssignRole = async (userId, roleValue) => {
    if (!roleValue) return;
    setLoading(true);
    setNotification("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role: roleValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotification(t("admin_dashboard.success.assign_role"));
        fetchUsers();
      } else
        setNotification(
          data.message || t("admin_dashboard.errors.assign_role")
        );
    } catch {
      setNotification(t("admin_dashboard.errors.connection"));
    }
    setLoading(false);
  };

  const handleRemoveRole = async (userId, roleValue) => {
    if (!roleValue) return;
    setLoading(true);
    setNotification("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role: roleValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotification(t("admin_dashboard.success.remove_role"));
        fetchUsers();
      } else
        setNotification(
          data.message || t("admin_dashboard.errors.remove_role")
        );
    } catch {
      setNotification(t("admin_dashboard.errors.connection"));
    }
    setLoading(false);
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aField = (sortField === "name" ? a.name : a.email) || "";
    let bField = (sortField === "name" ? b.name : b.email) || "";
    aField = aField.toLowerCase();
    bField = bField.toLowerCase();
    if (aField < bField) return sortAsc ? -1 : 1;
    if (aField > bField) return sortAsc ? 1 : -1;
    return 0;
  });

  function RoleSelect({ value, onChange }) {
    return (
      <div className="admin-role-select-wrap">
        <select value={value} onChange={onChange} className="admin-role-select">
          <option value="" disabled>
            {t("admin_dashboard.select_role")}
          </option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role.value} value={role.value}>
              {t(role.label)}
            </option>
          ))}
        </select>
        <span className="admin-role-select-arrow">▼</span>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">{t("admin_dashboard.title")}</h2>

      {notification && (
        <div
          className={
            notification.startsWith("✅")
              ? "admin-dashboard-notification admin-dashboard-notification--success"
              : "admin-dashboard-notification admin-dashboard-notification--warn"
          }
        >
          {notification}
        </div>
      )}

      <div className="admin-dashboard-users-block">
        <h3 className="admin-dashboard-users-title">
          {t("admin_dashboard.users_title")}
        </h3>
        <button
          className="header-btn admin-dashboard-refresh-btn"
          onClick={fetchUsers}
        >
          {t("admin_dashboard.refresh_btn")}
        </button>
        <table className="admin-dashboard-table">
          <thead>
            <tr>
              <th
                className="admin-dashboard-th"
                onClick={() => {
                  if (sortField === "email") setSortAsc((asc) => !asc);
                  setSortField("email");
                }}
              >
                {t("admin_dashboard.email")}
                {sortField === "email" ? (sortAsc ? "▲" : "▼") : ""}
              </th>
              <th
                className="admin-dashboard-th"
                onClick={() => {
                  if (sortField === "name") setSortAsc((asc) => !asc);
                  setSortField("name");
                }}
              >
                {t("admin_dashboard.name")}
                {sortField === "name" ? (sortAsc ? "▲" : "▼") : ""}
              </th>
              <th className="admin-dashboard-th">
                {t("admin_dashboard.roles")}
              </th>
              <th className="admin-dashboard-th">
                {t("admin_dashboard.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((u, idx) => (
              <tr
                key={u._id || u.id}
                className={
                  idx % 2 === 0
                    ? "admin-dashboard-tr admin-dashboard-tr--even"
                    : "admin-dashboard-tr"
                }
              >
                <td className="admin-dashboard-td">{u.email}</td>
                <td className="admin-dashboard-td">{u.name || "-"}</td>
                <td className="admin-dashboard-td">
                  {(u.roles || []).length === 0 ? (
                    <span className="admin-dashboard-role-empty">—</span>
                  ) : (
                    (u.roles || []).map((role) => (
                      <span key={role} className="admin-dashboard-role-label">
                        {t(ROLE_LABELS[role] || role)}
                      </span>
                    ))
                  )}
                </td>
                <td className="admin-dashboard-td">
                  <div className="admin-dashboard-role-actions-block">
                    <RoleSelect
                      value={selectedRole[u._id || u.id] || ""}
                      onChange={(e) =>
                        setSelectedRole((prev) => ({
                          ...prev,
                          [u._id || u.id]: e.target.value,
                        }))
                      }
                    />
                    <div className="admin-dashboard-actions-row">
                      <button
                        className="header-btn"
                        onClick={() =>
                          handleAssignRole(
                            u._id || u.id,
                            selectedRole[u._id || u.id]
                          )
                        }
                        disabled={loading || !selectedRole[u._id || u.id]}
                      >
                        {t("admin_dashboard.add_btn")}
                      </button>
                      <button
                        className="header-btn admin-dashboard-btn-delete"
                        onClick={() =>
                          handleRemoveRole(
                            u._id || u.id,
                            selectedRole[u._id || u.id]
                          )
                        }
                        disabled={loading || !selectedRole[u._id || u.id]}
                      >
                        {t("admin_dashboard.remove_btn")}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
