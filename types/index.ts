export interface Enclosure {
    id: number;
    name: string;
    description?: string;
    gecko_species?: string;
    created_at?: string;
    image_url?: string;
  }
  
  export interface Reading {
    id: number;
    enclosure_id: number;
    timestamp: string;
    humidity: number | null;
    air_temperature: number | null;
    surface_temperature: number | null;
    created_at?: string;
  }
  
  export interface User {
    id: string;
    email?: string;
    app_metadata: {
      provider?: string;
      [key: string]: any;
    };
    user_metadata: {
      [key: string]: any;
    };
    aud: string;
    created_at?: string;
  }
  
  export interface ChartData {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
    legend?: string[];
  }
  
  
  export type TimeRange = '24h' | '7d' | '30d';