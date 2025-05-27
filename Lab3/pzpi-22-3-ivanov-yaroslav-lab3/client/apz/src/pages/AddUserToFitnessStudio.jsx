import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/getUserFromToken";
import { useTranslation } from "react-i18next";
import "../App.css";

const AddUserToFitnessStudio = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [fitnessUsers, setFitnessUsers] = useState([]);
  const [studio, setStudio] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("email");
  const [sortAsc, setSortAsc] = useState(true);
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
        if (res.ok) setStudio(data);
      } catch {}
    };
    fetchStudio();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/users", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (Array.isArray(data)) setUsers(data);
        else
          setError(
            data.message || t("add_user_to_fitness_studio.errors.load_users")
          );
      } catch {
        setError(t("add_user_to_fitness_studio.errors.connection"));
      }
    };
    fetchUsers();
    // eslint-disable-next-line
  }, [t]);

  useEffect(() => {
    const fetchFitnessUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api/user-fitness-studios/fitness-studio/${id}/users`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await res.json();
        if (Array.isArray(data)) setFitnessUsers(data);
        else setFitnessUsers([]);
      } catch {
        setFitnessUsers([]);
      }
    };
    fetchFitnessUsers();
  }, [id, success]);

  const handleAdd = async (userId) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user-fitness-studios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId, fitnessStudioId: id }),
      });
      const data = await res.json();
      if (res.ok) setSuccess(t("add_user_to_fitness_studio.success_add"));
      else
        setError(
          data.message || t("add_user_to_fitness_studio.errors.add_failed")
        );
    } catch {
      setError(t("add_user_to_fitness_studio.errors.connection"));
    }
    setLoading(false);
  };

  const handleRemove = async (userId) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/user-fitness-studios`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId, fitnessStudioId: id }),
      });
      const data = await res.json();
      if (res.ok) setSuccess(t("add_user_to_fitness_studio.success_remove"));
      else
        setError(
          data.message || t("add_user_to_fitness_studio.errors.remove_failed")
        );
    } catch {
      setError(t("add_user_to_fitness_studio.errors.connection"));
    }
    setLoading(false);
  };

  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if ((a[sortField] || "") < (b[sortField] || "")) return sortAsc ? -1 : 1;
    if ((a[sortField] || "") > (b[sortField] || "")) return sortAsc ? 1 : -1;
    return 0;
  });

  const isUserInStudio = (userId) =>
    fitnessUsers.some((u) => u.id === userId || u._id === userId);

  return (
    <div className="fitness-studio-details-container">
      <button
        className="header-btn fitness-studio-details-back-btn"
        onClick={() => navigate(`/fitness-studios/${id}`)}
      >
        {t("add_user_to_fitness_studio.back_btn", {
          studio: studio?.studioName ? `«${studio.studioName}»` : "",
        })}
      </button>
      <h2 className="fitness-studio-details-title">
        {t("add_user_to_fitness_studio.title")}
      </h2>
      {error && <div className="add-fitness-studio-error">{error}</div>}
      {success && (
        <div className="fitness-studio-details-success">{success}</div>
      )}
      <div className="fitness-studio-details-table-wrap">
        {users.length === 0 ? (
          <div className="fitness-studio-details-empty">
            {t("add_user_to_fitness_studio.no_users")}
          </div>
        ) : (
          <table className="fitness-studio-details-table">
            <thead>
              <tr>
                <th
                  className="fitness-studio-details-th"
                  onClick={() => handleSort("email")}
                >
                  {t("add_user_to_fitness_studio.email")}
                  {sortField === "email" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th
                  className="fitness-studio-details-th"
                  onClick={() => handleSort("name")}
                >
                  {t("add_user_to_fitness_studio.name")}
                  {sortField === "name" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th className="fitness-studio-details-th"></th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id || user._id}>
                  <td className="fitness-studio-details-td">{user.email}</td>
                  <td className="fitness-studio-details-td">
                    {user.name || "-"}
                  </td>
                  <td className="fitness-studio-details-td">
                    {isUserInStudio(user.id || user._id) ? (
                      <button
                        className="header-btn fitness-studio-details-btn-delete"
                        onClick={() => handleRemove(user.id || user._id)}
                        disabled={loading}
                      >
                        {t("add_user_to_fitness_studio.remove_btn")}
                      </button>
                    ) : (
                      <button
                        className="header-btn"
                        onClick={() => handleAdd(user.id || user._id)}
                        disabled={loading}
                      >
                        {t("add_user_to_fitness_studio.add_btn")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AddUserToFitnessStudio;
