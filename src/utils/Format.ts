// src/utils/format.ts
export const formatNumber = (value: number): string =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatPercentage = (value: number | null | undefined): string =>
  value !== null && value !== undefined ? `${formatNumber(value)}%` : "-";

export const getPercentageColor = (value: number | null | undefined) =>
  value && value < 0 ? "text-red-500" : "text-green-600";


