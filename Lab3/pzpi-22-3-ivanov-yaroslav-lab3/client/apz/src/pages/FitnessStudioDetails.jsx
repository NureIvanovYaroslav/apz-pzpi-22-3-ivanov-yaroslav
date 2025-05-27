import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

const FitnessStudioDetails = () => {
  const { id } = useParams();
  const [studio, setStudio] = useState(null);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState("name");
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
        else
          setError(data.message || t("fitness_studio_details.error_loading"));
      } catch {
        setError(t("fitness_studio_details.error_connection"));
      }
    };
    fetchStudio();
    // eslint-disable-next-line
  }, [id, t]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api/user-fitness-studios/fitness-studio/${
            studio.id || studio._id
          }/users`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await res.json();
        if (Array.isArray(data)) setUsers(data);
        else setUsers([]);
      } catch {
        setUsers([]);
      }
    };
    if (studio) fetchUsers();
  }, [studio]);

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

  const handleDelete = async () => {
    if (!window.confirm(t("fitness_studio_details.confirm_delete"))) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/fitness-studios/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) navigate("/fitness-studios");
      else {
        const data = await res.json();
        setError(data.message || t("fitness_studio_details.error_delete"));
      }
    } catch {
      setError(t("fitness_studio_details.error_connection"));
    }
  };

  if (error) return <div className="studio-error">{error}</div>;
  if (!studio)
    return (
      <div className="studio-empty">{t("fitness_studio_details.loading")}</div>
    );

  return (
    <div className="fitness-studio-details-container fitness-studio-details-container--wide">
      <button
        className="header-btn fitness-studio-details-back-btn"
        type="button"
        onClick={() => navigate("/fitness-studios")}
      >
        {t("fitness_studio_details.back_btn")}
      </button>
      <h2 className="fitness-studio-details-title">{studio.studioName}</h2>
      <div className="fitness-studio-details-row">
        <strong>{t("fitness_studio_details.email")}:</strong>{" "}
        <span>{studio.email}</span>
      </div>
      <div className="fitness-studio-details-row">
        <strong>{t("fitness_studio_details.address")}:</strong>{" "}
        <span>{studio.address}</span>
      </div>
      <h3 className="fitness-studio-details-users-title">
        {t("fitness_studio_details.members_title")}
      </h3>
      {users.length === 0 ? (
        <div className="fitness-studio-details-empty">
          {t("fitness_studio_details.no_members")}
        </div>
      ) : (
        <div className="fitness-studio-details-table-wrap">
          <table className="fitness-studio-details-table">
            <thead>
              <tr>
                <th
                  className="fitness-studio-details-th"
                  onClick={() => handleSort("name")}
                >
                  {t("fitness_studio_details.user_name")}
                  {sortField === "name" ? (sortAsc ? " ▲" : " ▼") : ""}
                </th>
                <th
                  className="fitness-studio-details-th"
                  onClick={() => handleSort("email")}
                >
                  {t("fitness_studio_details.user_email")}
                  {sortField === "email" ? (sortAsc ? " ▲" : " ▼") : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id || user._id}>
                  <td className="fitness-studio-details-td">
                    {user.name || "-"}
                  </td>
                  <td className="fitness-studio-details-td">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="fitness-studio-details-actions">
        <button
          className="header-btn"
          onClick={() =>
            navigate(`/edit-fitness-studio/${studio.id || studio._id}`)
          }
        >
          {t("fitness_studio_details.edit_btn")}
        </button>
        <button
          className="header-btn fitness-studio-details-btn-delete"
          onClick={handleDelete}
        >
          {t("fitness_studio_details.delete_btn")}
        </button>
        <button
          className="header-btn header-btn--primary"
          onClick={() =>
            navigate(`/add-user-to-fitness-studio/${studio.id || studio._id}`)
          }
        >
          {t("fitness_studio_details.edit_members_btn")}
        </button>
      </div>
    </div>
  );
};

export default FitnessStudioDetails;
