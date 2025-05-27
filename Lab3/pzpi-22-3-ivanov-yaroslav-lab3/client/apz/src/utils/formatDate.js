import i18n from "../i18n";

export function formatDate(date, lang, opts = {}) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);

  const lng = lang || i18n.language || "ua";
  const locale = lng === "en" ? "en-US" : "uk-UA";

  const options = opts.dateOnly
    ? { year: "numeric", month: "2-digit", day: "2-digit" }
    : locale === "en-US"
    ? {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    : {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };

  return d.toLocaleString(locale, options);
}
