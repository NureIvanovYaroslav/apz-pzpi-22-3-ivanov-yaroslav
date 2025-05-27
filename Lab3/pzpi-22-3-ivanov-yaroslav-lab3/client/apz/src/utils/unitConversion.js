export function convertWeight(weightKg, lang) {
  if (!weightKg || isNaN(weightKg)) return "-";
  if (lang === "en") {
    const lbs = weightKg * 2.20462;
    return `${Math.round(lbs * 10) / 10} lbs`;
  }
  return `${weightKg} кг`;
}

export function convertHeight(heightCm, lang) {
  if (!heightCm || isNaN(heightCm)) return "-";
  if (lang === "en") {
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }
  return `${heightCm} см`;
}