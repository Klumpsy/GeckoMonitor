import { ChartData, Reading } from "@/types";

export const formatChartData = (
  readings: Reading[], 
  dataType: 'humidity' | 'air_temp' | 'surface_temp'
): ChartData => {
  if (!readings || readings.length === 0) {
    return {
      labels: [],
      datasets: [{ data: [] }],
    };
  }

  const filteredReadings = readings.filter(reading => {
    if (dataType === 'humidity') return reading.humidity !== null;
    if (dataType === 'air_temp') return reading.air_temperature !== null;
    return reading.surface_temperature !== null;
  });

  if (filteredReadings.length === 0) {
    return {
      labels: [],
      datasets: [{ data: [] }],
    };
  }

  let dataPoints = filteredReadings;
  if (filteredReadings.length > 24) {
    const step = Math.ceil(filteredReadings.length / 24);
    dataPoints = filteredReadings.filter((_, i) => i % step === 0);
  }

  const labels = dataPoints.map(reading => {
    const date = new Date(reading.timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  });

  const data = dataPoints.map(reading => {
    if (dataType === 'humidity') return reading.humidity as number;
    if (dataType === 'air_temp') return reading.air_temperature as number;
    return reading.surface_temperature as number;
  });

  return {
    labels,
    datasets: [{ data }],
  };
};