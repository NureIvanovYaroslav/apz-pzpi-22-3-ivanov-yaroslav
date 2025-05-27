export function getTrainingTypeLabel(type, t) {
  switch (type) {
    case "run":
      return t("training_type.run");
    case "walk":
      return t("training_type.walk");
    case "strength":
      return t("training_type.strength");
    case "cycle":
      return t("training_type.cycle");
    default:
      return type;
  }
}
