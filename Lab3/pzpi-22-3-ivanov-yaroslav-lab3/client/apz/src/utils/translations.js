export function translateRecommendationMessage(message, t) {
  if (!message) return "";
  const patterns = [
    { key: "walk_more_average", re: /You walked more than in average, good job/i },
    { key: "walk_less_average", re: /You walked less than in average, don't lose your progression/i },
    { key: "walk_more_usual", re: /You walked more than usual, good job/i },
    { key: "walk_less_usual", re: /You walked less than usual, don't lose your progression/i },
    { key: "burned_more_calories", re: /You burned more calories than usual in this workout, good job/i },
    { key: "burned_fewer_calories", re: /You burned fewer calories than usual in this workout, try harder/i },
    { key: "heart_very_high", re: /During this training your heart rate was very high, you should take a break/i },
    { key: "heart_high", re: /During this training your heart rate was high, try not to overexert yourself/i },
    { key: "heart_low", re: /During this training your heart rate was low, look out for your health/i },
    { key: "heart_normal", re: /During this training your heart rate was normal, keep it up/i },
    { key: "not_enough_data", re: /Not enough data to calculate statistics/i },
    { key: "no_heart_data", re: /No heart rate data available/i },
    { key: "unable_calculate_calories", re: /Unable to calculate calories/i },
    { key: "training_not_found", re: /Training not found/i }
  ];
  for (const { key, re } of patterns) {
    if (re.test(message)) return t(`recommendation_messages.${key}`);
  }
  return message;
}

export function translateStatus(status, t) {
  if (t) {
    if (status === "enabled") return t("add_device.status_enabled");
    if (status === "disabled") return t("add_device.status_disabled");
  }
  if (status === "enabled") return "активний";
  if (status === "disabled") return "неактивний";
  return status;
}