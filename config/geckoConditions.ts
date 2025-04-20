export interface ConditionRange {
    min: number;
    max: number;
    ideal: number;
  }
  
  export interface GeckoConditions {
    species: string;
    temperature: {
      day: ConditionRange;
      night: ConditionRange;
      basking?: ConditionRange;
    };
    humidity: {
      day: ConditionRange;
      night: ConditionRange;
    };
    description?: string;
  }
  
  export const geckoSpecies: { [key: string]: GeckoConditions } = {
    "Leopard Gecko": {
      species: "Leopard Gecko",
      temperature: {
        day: { min: 24, max: 29, ideal: 27 },
        night: { min: 18, max: 23, ideal: 21 },
        basking: { min: 30, max: 35, ideal: 32 },
      },
      humidity: {
        day: { min: 30, max: 40, ideal: 35 },
        night: { min: 40, max: 50, ideal: 45 },
      },
      description: "Desert species that requires low humidity and a warm basking spot."
    },
    "Crested Gecko": {
      species: "Crested Gecko",
      temperature: {
        day: { min: 22, max: 26, ideal: 24 },
        night: { min: 18, max: 22, ideal: 20 },
      },
      humidity: {
        day: { min: 50, max: 70, ideal: 60 },
        night: { min: 60, max: 80, ideal: 70 },
      },
      description: "Tropical species that prefers moderate temperatures and higher humidity."
    },
    "Day Gecko": {
      species: "Day Gecko",
      temperature: {
        day: { min: 25, max: 30, ideal: 28 },
        night: { min: 20, max: 24, ideal: 22 },
        basking: { min: 32, max: 38, ideal: 35 },
      },
      humidity: {
        day: { min: 50, max: 70, ideal: 60 },
        night: { min: 60, max: 80, ideal: 70 },
      },
      description: "Active diurnal species that needs UVB lighting, warm temperatures, and moderate to high humidity."
    },
    "Gargoyle Gecko": {
      species: "Gargoyle Gecko",
      temperature: {
        day: { min: 22, max: 26, ideal: 24 },
        night: { min: 18, max: 22, ideal: 20 },
      },
      humidity: {
        day: { min: 50, max: 70, ideal: 60 },
        night: { min: 60, max: 80, ideal: 70 },
      },
      description: "Similar to Crested Geckos, they prefer moderate temperatures and higher humidity."
    },
    "African Fat-Tailed Gecko": {
      species: "African Fat-Tailed Gecko",
      temperature: {
        day: { min: 25, max: 29, ideal: 27 },
        night: { min: 21, max: 24, ideal: 22 },
        basking: { min: 30, max: 33, ideal: 31 },
      },
      humidity: {
        day: { min: 40, max: 60, ideal: 50 },
        night: { min: 50, max: 70, ideal: 60 },
      },
      description: "Similar to Leopard Geckos but prefer slightly higher humidity levels."
    }
  };
  
  export const SLIGHT_DEVIATION_THRESHOLD = 0.15;
  export const SEVERE_DEVIATION_THRESHOLD = 0.30;
  
  export const evaluateCondition = (
    value: number | null, 
    range: ConditionRange,
    isNightTime: boolean = false
  ): 'optimal' | 'slight-deviation' | 'severe-deviation' | 'unknown' => {
    if (value === null) return 'unknown';
    
    const { min, max } = range;
    const range_size = max - min;
    
    if (value >= min && value <= max) {
      return 'optimal';
    }
    
    const deviation = value < min 
      ? (min - value) / range_size 
      : (value - max) / range_size;
    
    if (deviation <= SLIGHT_DEVIATION_THRESHOLD) {
      return 'slight-deviation';
    } else if (deviation <= SEVERE_DEVIATION_THRESHOLD) {
      return 'severe-deviation';
    } else {
      return 'severe-deviation';
    }
  };
  
  export const getConditionColor = (
    evaluation: 'optimal' | 'slight-deviation' | 'severe-deviation' | 'unknown'
  ): string => {
    switch (evaluation) {
      case 'optimal':
        return '#4ade80';
      case 'slight-deviation':
        return '#fb923c';
      case 'severe-deviation':
        return '#ef4444';
      case 'unknown':
      default:
        return '#a1a1aa';
    }
  };