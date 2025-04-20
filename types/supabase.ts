import { Enclosure, Reading } from ".";

export interface Database {
    public: {
      Tables: {
        gecko_enclosures: {
          Row: {
            id: number;
            name: string;
            description: string | null;
            created_at: string;
          };
          Insert: {
            id?: number;
            name: string;
            description?: string | null;
            created_at?: string;
          };
          Update: {
            id?: number;
            name?: string;
            description?: string | null;
            created_at?: string;
          };
        };
        gecko_readings: {
          Row: {
            id: number;
            enclosure_id: number;
            timestamp: string;
            humidity: number | null;
            air_temperature: number | null;
            surface_temperature: number | null;
            created_at: string;
          };
          Insert: {
            id?: number;
            enclosure_id: number;
            timestamp?: string;
            humidity?: number | null;
            air_temperature?: number | null;
            surface_temperature?: number | null;
            created_at?: string;
          };
          Update: {
            id?: number;
            enclosure_id?: number;
            timestamp?: string;
            humidity?: number | null;
            air_temperature?: number | null;
            surface_temperature?: number | null;
            created_at?: string;
          };
        };
      };
      Views: {
        [_ in never]: never;
      };
      Functions: {
        [_ in never]: never;
      };
      Enums: {
        [_ in never]: never;
      };
    };
  }

  export interface UseEnclosuresResult {
    enclosures: Enclosure[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    addEnclosure: (enclosure: Enclosure) => void;
  }
  
  export interface UseReadingsResult {
    readings: Reading[];
    loading: boolean;
    error: Error | null;
    refetch: (enclosureId: number) => Promise<void>;
  }