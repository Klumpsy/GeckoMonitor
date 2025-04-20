import { useState, useEffect } from 'react';
import { supabase } from '../supabaseConfig';
import { Enclosure, Reading, TimeRange } from '../types';
import { UseEnclosuresResult, UseReadingsResult } from '../types/supabase';

export const useEnclosures = (): UseEnclosuresResult => {
  const [enclosures, setEnclosures] = useState<Enclosure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEnclosures = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('gecko_enclosures')
        .select('*');
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      setEnclosures(data as Enclosure[]);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error fetching enclosures:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnclosures();
  }, []);

  const addEnclosure = (enclosure: Enclosure): void => {
    setEnclosures(prev => [...prev, enclosure]);
  };

  return { enclosures, loading, error, refetch: fetchEnclosures, addEnclosure };
};

export const useReadings = (
  enclosureId: number | null,
  timeRange: TimeRange
): UseReadingsResult => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReadings = async (id: number): Promise<void> => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const now = new Date();
      let startDate = new Date();
      
      if (timeRange === '24h') {
        startDate.setHours(startDate.getHours() - 24);
      } else if (timeRange === '7d') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (timeRange === '30d') {
        startDate.setDate(startDate.getDate() - 30);
      }
      
      const { data, error: supabaseError } = await supabase
        .from('gecko_readings')
        .select('*')
        .eq('enclosure_id', id)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      setReadings(data as Reading[]);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error fetching readings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enclosureId) {
      fetchReadings(enclosureId);
    }
  }, [enclosureId, timeRange]);

  return { 
    readings, 
    loading, 
    error, 
    refetch: fetchReadings 
  };
};