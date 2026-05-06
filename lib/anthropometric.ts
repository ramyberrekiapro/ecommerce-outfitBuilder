export function computeBMI(weightKg: number, heightCm: number): number {
  return weightKg / Math.pow(heightCm / 100, 2);
}

export function getSilhouetteDescriptor(bmi: number): string {
  if (bmi < 18.5) return "slim, lean build";
  if (bmi < 25) return "average athletic build";
  if (bmi < 30) return "medium full build";
  return "fuller, curvy build";
}

export function getHeightCategory(heightCm: number): string {
  if (heightCm < 165) return "petite";
  if (heightCm <= 178) return "average height";
  return "tall";
}
