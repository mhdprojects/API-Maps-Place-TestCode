import type { Request, Response } from 'express';
import { geocodeLocation } from '../services/geocode-service.js';
import { placesTextSearch } from '../services/places-service.js';
import { buildDirectionsUrl, buildEmbedSearchUrl, buildMapsUrl } from '../utils/url-builder.js';
import { ENV } from '../config/env.js';

export async function searchPlaces(req: Request, res: Response) {
  const {
    query,
    location_text,
    radius_m = 2000,
    open_now = false,
    max_results = 10
  } = req.body ?? {};

  if (!query || !location_text) {
    return res.status(400).json({ error: 'query dan location_text wajib diisi' });
  }

  const radius = Math.min(Math.max(Number(radius_m) || 2000, 200), 10000);
  const max = Math.min(Math.max(Number(max_results) || 10, 1), 20);
  const openNow = Boolean(open_now);

  try {
    const { lat, lng } = await geocodeLocation(location_text);
    const results = await placesTextSearch({ lat, lng, query, radius, openNow, max });

    const mapped = results.map((r: any) => ({
      place_id: r.place_id,
      name: r.name,
      address: r.formatted_address,
      rating: r.rating,
      user_ratings_total: r.user_ratings_total,
      price_level: r.price_level,
      location: r.geometry?.location,
      maps_url: buildMapsUrl(r.place_id),
      directions_url: buildDirectionsUrl(r.place_id)
    }));

    const embed_query = `${query} near ${location_text}`;
    const embed_url = buildEmbedSearchUrl(ENV.MAPS_EMBED_API_KEY, embed_query);

    return res.json({ center: { lat, lng }, results: mapped, embed_url });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? 'Internal error' });
  }
}
