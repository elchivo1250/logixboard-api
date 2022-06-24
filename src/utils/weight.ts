const correctionFactors: any = {
  'OUNCES': 10000,
  'KILOGRAMS': 1,
  'GRAMS': 1,
  'POUNDS': 1000,
  'TONNES': 1,
  'TONS': 1,
};


const conversionFactors: any = {
  'OUNCES': 283495,
  'KILOGRAMS': 1000,
  'GRAMS': 1,
  'POUNDS': 453592,
  'TONNES': 1000000,
  'TONS': 907185,
};

export const convertWeight = (weight: number, unitFrom: string, unitTo: string): number => {
  const grams: number = convertToGrams(weight, unitFrom);
  return convertFromGrams(grams, unitTo);
};

export const convertToGrams = (weight: number, unit: string): number => {
  if (!Object.keys(conversionFactors).includes(unit)) {
    throw new Error("You're trying to convert from an unknown unit");
  }

  return (weight * conversionFactors[unit]) / correctionFactors[unit];
}

export const convertFromGrams = (weight: number, unit: string): number => {
  if (!Object.keys(conversionFactors).includes(unit)) {
    throw new Error("You're trying to convert from an unknown unit");
  }

  return (weight / conversionFactors[unit]) * correctionFactors[unit];
}