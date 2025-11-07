import axios from 'axios';
import { ENV } from '../config/env.js';

type SearchParams = {
  lat: number;
  lng: number;
  query: string;
  radius: number;
  openNow: boolean;
  max: number;
};

export async function placesTextSearch(p: SearchParams): Promise<any[]> {
  const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  const { data } = await axios.get(url, {
    params: {
      query: p.query,
      location: `${p.lat},${p.lng}`,
      radius: p.radius,
      opennow: p.openNow ? true : undefined,
      key: ENV.PLACES_API_KEY
    }
  });

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places error: ${data.status}`);
  }
  return (data.results || []).slice(0, p.max);
}
