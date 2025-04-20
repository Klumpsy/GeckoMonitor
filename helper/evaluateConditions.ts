import { Reading, Enclosure } from '../types';
import { 
  geckoSpecies, 
  evaluateCondition, 
  getConditionColor 
} from '../config/geckoConditions';

export interface EvaluatedReading {
  value: string;
  color: string;
  status: 'optimal' | 'slight-deviation' | 'severe-deviation' | 'unknown';
}

export const evaluateReading = (
  reading: number | null,
  enclosure: Enclosure | null,
  type: 'air_temperature' | 'surface_temperature' | 'humidity'
): EvaluatedReading => {

  if (reading === null || !enclosure?.gecko_species) {
    return {
      value: 'N/A',
      color: '#a1a1aa',
      status: 'unknown'
    };
  }

  const valueFormatted = type.includes('temperature') 
    ? `${reading.toFixed(1)}°C` 
    : `${reading.toFixed(1)}%`;
  
  const speciesInfo = geckoSpecies[enclosure.gecko_species];

  if (!speciesInfo) {
    return {
      value: valueFormatted,
      color: '#a1a1aa',
      status: 'unknown'
    };
  }

  const currentHour = new Date().getHours();
  const isNightTime = currentHour < 7 || currentHour >= 19;
  
  let range;
  if (type === 'humidity') {
    range = isNightTime ? speciesInfo.humidity.night : speciesInfo.humidity.day;
  } else if (type === 'air_temperature') {
    range = isNightTime ? speciesInfo.temperature.night : speciesInfo.temperature.day;
  } else if (type === 'surface_temperature' && speciesInfo.temperature.basking) {
    range = speciesInfo.temperature.basking;
  } else {
    range = isNightTime ? speciesInfo.temperature.night : speciesInfo.temperature.day;
  }
  
  const status = evaluateCondition(reading, range, isNightTime);
  const color = getConditionColor(status);
  
  return {
    value: valueFormatted,
    color,
    status
  };
};