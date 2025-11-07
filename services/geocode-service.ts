import axios from 'axios';
import { ENV } from '../config/env.js';

export async function geocodeLocation(locationText: string): Promise<{ lat: number; lng: number }> {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json';
  const { data } = await axios.get(url, { params: { address: locationText, key: ENV.PLACES_API_KEY } });

  if (data.status !== 'OK' || !data.results?.[0]) {
    throw new Error('Location not found');
  }
  return data.results[0].geometry.location; 
}
