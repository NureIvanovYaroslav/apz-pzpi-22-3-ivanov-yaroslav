import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../utils/getUserFromToken";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { getTrainingTypeLabel } from "../utils/getTrainingTypeLabel";
import { useTranslation } from "react-i18next";
import "../App.css";

const TrainingCard = ({ training, onClick }) => {
  const { t } = useTranslation();
  return (
    <div className="training-card" onClick={onClick}>
      <h3 className="training-card-title">
        {getTrainingTypeLabel(training.type, t)}
      </h3>
      <div className="training-card-row">
        <span className="training-card-label">{t("home.start")}:</span>
        <span className="training-card-value">
          {formatDate(training.startTime)}
        </span>
      </div>
      <div className="training-card-row">
        <span className="training-card-label">{t("home.end")}:</span>
        <span className="training-card-value">
          {formatDate(training.endTime)}
        </span>
      </div>
    </div>
  );
};

const Home = () => {
  const [user, setUser] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const tokenUser = getUserFromToken();
        if (!tokenUser) {
          setError("not-auth");
          setLoading(false);
          return;
        }
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/users/${tokenUser.id || tokenUser._id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          setError(data.message || t("home.error_user"));
        }
      } catch {
        setError(t("home.error_connection"));
      }
      setLoading(false);
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchTrainings = async () => {
      if (!user || !user.device) {
        setTrainings([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/trainings/device/${user.device}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        let arr = [];
        if (Array.isArray(data)) {
          arr = data;
        } else if (data && Array.isArray(data.trainings)) {
          arr = data.trainings;
        } else if (data && data.message === "Trainings not found") {
          arr = [];
        } else {
          setTrainings([]);
          setError(data.message || t("home.error_trainings"));
          setLoading(false);
          return;
        }
        setTrainings(arr);
        setError("");
      } catch {
        setTrainings([]);
        setError(t("home.error_connection"));
      }
      setLoading(false);
    };
    if (user && user.device) {
      fetchTrainings();
    }
    // eslint-disable-next-line
  }, [user]);

  if (loading) return null;

  if (error === "not-auth") {
    return (
      <div className="home-auth-info">
        <h2>{t("home.welcome")}</h2>
        <p>
          {t("home.please_auth")} <a href="/login">{t("home.login")}</a>{" "}
          {t("home.or")} <a href="/registration">{t("home.register")}</a>.
        </p>
      </div>
    );
  }

  if (error && user && user.device) {
    return (
      <div>
        <h2 className="home-title">{t("home.my_trainings")}</h2>
        <div className="home-empty-wrap">
          <div className="home-empty-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
              alt="No trainings"
              className="home-empty-img"
            />
            <div className="home-empty-title">{t("home.no_trainings")}</div>
            <div className="home-empty-desc">
              {t("home.start_training_hint")}
              <br />
              {t("home.all_trainings_hint")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !user.device) {
    return (
      <div className="home-auth-info home-auth-info--device">
        <h2>{t("home.track_trainings_title")}</h2>
        <p>{t("home.track_trainings")}</p>
        <button
          className="header-btn header-btn--primary"
          onClick={() => navigate("/add-device")}
        >
          {t("home.add_device")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="home-title">{t("home.my_trainings")}</h2>
      {trainings.length === 0 ? (
        <div className="home-empty-wrap">
          <div className="home-empty-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
              alt="No trainings"
              className="home-empty-img"
            />
            <div className="home-empty-title">{t("home.no_trainings")}</div>
            <div className="home-empty-desc">
              {t("home.start_training_hint")}
              <br />
              {t("home.all_trainings_hint")}
            </div>
          </div>
        </div>
      ) : (
        <div className="training-list">
          {trainings
            .slice()
            .sort((a, b) =>
              new Date(a.startTime) < new Date(b.startTime) ? 1 : -1
            )
            .map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                onClick={() => navigate(`/trainings/${training.id}`)}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Home;
