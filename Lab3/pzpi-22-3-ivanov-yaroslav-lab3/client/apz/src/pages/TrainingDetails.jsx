import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { getTrainingTypeLabel } from "../utils/getTrainingTypeLabel";
import { translateRecommendationMessage } from "../utils/translations";
import { useTranslation } from "react-i18next";
import { convertWeight, convertHeight } from "../utils/unitConversion";
import "../App.css";

const TrainingDetails = () => {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [trainingDatas, setTrainingDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const [recommendation, setRecommendation] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState("");
  const [activeRec, setActiveRec] = useState(null);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const recommendationTypes = [
    { key: "steps", label: t("training_details.recommend_steps") },
    { key: "calories", label: t("training_details.recommend_calories") },
    { key: "heart-rate", label: t("training_details.recommend_heart") },
  ];

  const columnLabels = {
    sendingTime: t("training_details.sending_time"),
    steps: t("training_details.steps"),
    calories: t("training_details.calories"),
    heartRate: t("training_details.heart_rate"),
    distance: t("training_details.distance"),
    speed: t("training_details.speed"),
    duration: t("training_details.duration"),
    type: t("training_details.type"),
  };

  useEffect(() => {
    const fetchTraining = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/trainings/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) {
          setTraining(data);
          if (Array.isArray(data.trainingDatas) && data.trainingDatas.length) {
            const detailsRes = await fetch(`/api/training-datas`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const details = await detailsRes.json();
            const ids = data.trainingDatas.map(String);
            const filtered = Array.isArray(details)
              ? details.filter((d) =>
                  ids.includes(String(d.id || d._id || (d._id && d._id.$oid)))
                )
              : [];
            setTrainingDatas(filtered);
          } else {
            setTrainingDatas([]);
          }
        } else {
          setError(data.message || t("training_details.error_training"));
        }
      } catch {
        setError(t("training_details.error_connection"));
      }
      setLoading(false);
    };
    fetchTraining();
    // eslint-disable-next-line
  }, [id, t]);

  const handleSort = (field) => {
    if (sortField === field) setSortAsc((asc) => !asc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getSortedData = () => {
    if (!sortField) return trainingDatas;
    return [...trainingDatas].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === undefined || aVal === null) return sortAsc ? 1 : -1;
      if (bVal === undefined || bVal === null) return sortAsc ? -1 : 1;
      if (typeof aVal === "number" && typeof bVal === "number")
        return sortAsc ? aVal - bVal : bVal - aVal;
      if (
        (typeof aVal === "string" && !isNaN(Date.parse(aVal))) ||
        (typeof bVal === "string" && !isNaN(Date.parse(bVal)))
      ) {
        return sortAsc
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      }
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  };

  const fetchRecommendation = async (type) => {
    setRecLoading(true);
    setRecError("");
    setRecommendation(null);
    setActiveRec(type);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/analytics/recommendations/${type}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setRecommendation(data);
      } else {
        setRecError(data.message || t("training_details.error_recommendation"));
      }
    } catch {
      setRecError(t("training_details.error_connection"));
    }
    setRecLoading(false);
  };

  if (loading) return <div className="training-details-loading"></div>;
  if (error)
    return (
      <div className="training-details-error">
        {error}
        <br />
        <button
          className="header-btn training-details-back-btn"
          onClick={() => navigate(-1)}
        >
          {t("training_details.back")}
        </button>
      </div>
    );
  if (!training)
    return (
      <div className="training-details-error">
        {t("training_details.not_found")}
        <br />
        <button
          className="header-btn training-details-back-btn"
          onClick={() => navigate(-1)}
        >
          {t("training_details.back")}
        </button>
      </div>
    );

  return (
    <div className="training-details-container">
      <button
        className="header-btn training-details-back-btn"
        onClick={() => navigate(-1)}
      >
        {t("training_details.back")}
      </button>
      <h2 className="training-details-title">{t("training_details.title")}</h2>
      <div className="training-details-row">
        <strong>{t("training_details.type")}:</strong>{" "}
        {getTrainingTypeLabel(training.type, t)}
      </div>
      <div className="training-details-row">
        <strong>{t("training_details.start")}:</strong>{" "}
        {formatDate(training.startTime)}
      </div>
      <div className="training-details-row">
        <strong>{t("training_details.end")}:</strong>{" "}
        {formatDate(training.endTime)}
      </div>
      <div className="training-details-recommendations training-details-recommendations--row">
        {recommendationTypes.map((rec) => (
          <button
            key={rec.key}
            className={`header-btn${
              activeRec === rec.key ? " header-btn--primary" : ""
            }`}
            onClick={() => fetchRecommendation(rec.key)}
            disabled={recLoading && activeRec === rec.key}
          >
            {rec.label}
          </button>
        ))}
      </div>
      {recLoading && <div className="training-details-loading"></div>}
      {recError && <div className="training-details-error">{recError}</div>}
      {recommendation && (
        <div className="training-details-recommendation-card">
          <div className="training-details-recommendation-header">
            <span
              className={`training-details-recommendation-icon${
                recommendation.message?.toLowerCase().includes("good job") ||
                recommendation.message?.toLowerCase().includes("нормально")
                  ? " training-details-recommendation-icon--ok"
                  : " training-details-recommendation-icon--warn"
              }`}
            >
              {recommendation.message?.toLowerCase().includes("good job") ||
              recommendation.message?.toLowerCase().includes("нормально")
                ? "✅"
                : "⚠️"}
            </span>
            <span className="training-details-recommendation-message">
              {translateRecommendationMessage(recommendation.message, t)}
            </span>
          </div>
          {recommendation.indicators && (
            <div className="training-details-recommendation-section">
              <strong>{t("training_details.indicators")}:</strong>
              <ul>
                {Object.entries(recommendation.indicators).map(([key, val]) => (
                  <li key={key}>
                    <span className="training-details-recommendation-label">
                      {t(`training_details.indicator_labels.${key}`, key)}:
                    </span>{" "}
                    {typeof val === "object" && val !== null
                      ? Array.isArray(val)
                        ? val.join(", ")
                        : Object.entries(val)
                            .map(
                              ([k, v]) =>
                                `${t(
                                  `training_details.indicator_labels.${k}`,
                                  k === "lower"
                                    ? t("training_details.lower")
                                    : k === "upper"
                                    ? t("training_details.upper")
                                    : k
                                )}: ${Math.round(Number(v) * 100) / 100}`
                            )
                            .join(", ")
                      : typeof val === "number"
                      ? Math.round(val * 100) / 100
                      : String(val)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recommendation.parameters && (
            <div className="training-details-recommendation-section">
              <strong>{t("training_details.calc_details")}:</strong>
              <ul>
                {Object.entries(recommendation.parameters).map(
                  ([key, val]) =>
                    key !== "formula" && (
                      <li key={key}>
                        <span className="training-details-recommendation-label">
                          {t(`training_details.parameter_labels.${key}`, key)}:
                        </span>{" "}
                        {key === "weight"
                          ? convertWeight(val, i18n.language)
                          : key === "height"
                          ? convertHeight(val, i18n.language)
                          : typeof val === "number"
                          ? Math.round(val * 100) / 100
                          : String(val)}
                      </li>
                    )
                )}
              </ul>
            </div>
          )}
          {(recommendation.formula ||
            (recommendation.parameters &&
              recommendation.parameters.formula)) && (
            <div className="training-details-recommendation-formula">
              <strong>{t("training_details.formula")}:</strong>
              <div className="training-details-recommendation-formula-value">
                {recommendation.formula ||
                  (recommendation.parameters &&
                    recommendation.parameters.formula)}
              </div>
            </div>
          )}
        </div>
      )}
      <h3 className="training-details-table-title">
        {t("training_details.data_title")}
      </h3>
      {trainingDatas.length === 0 ? (
        <div className="training-details-empty">
          {t("training_details.no_data")}
        </div>
      ) : (
        <div className="training-details-table-wrap">
          <table className="training-details-table">
            <thead>
              <tr>
                {Object.keys(trainingDatas[0])
                  .filter(
                    (key) => key !== "training" && key !== "id" && key !== "_id"
                  )
                  .map((key) => (
                    <th
                      key={key}
                      className="training-details-th"
                      onClick={() => handleSort(key)}
                    >
                      {columnLabels[key] || key}
                      {sortField === key ? (sortAsc ? " ▲" : " ▼") : ""}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {getSortedData().map((row, idx) => (
                <tr key={row.id || row._id || idx}>
                  {Object.entries(row)
                    .filter(
                      ([key]) =>
                        key !== "training" && key !== "id" && key !== "_id"
                    )
                    .map(([key, val], i) => (
                      <td key={i} className="training-details-td">
                        {typeof val === "object" &&
                        val !== null &&
                        val.$numberDecimal
                          ? val.$numberDecimal
                          : typeof val === "object" && val !== null && val.$oid
                          ? val.$oid
                          : typeof val === "string" && !isNaN(Date.parse(val))
                          ? formatDate(val)
                          : String(val)}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrainingDetails;
