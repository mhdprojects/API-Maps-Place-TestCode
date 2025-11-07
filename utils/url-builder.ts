const buildEmbedSearchUrl = (embedKey: string, q: string) =>
  `https://www.google.com/maps/embed/v1/search?key=${embedKey}&q=${encodeURIComponent(q)}`;

const buildEmbedPlaceUrl = (embedKey: string, placeId: string) =>
  `https://www.google.com/maps/embed/v1/place?key=${embedKey}&q=place_id:${placeId}`;

const buildDirectionsUrl = (placeId: string) =>
  `https://www.google.com/maps/dir/?api=1&destination_place_id=${placeId}`;

const buildMapsUrl = (placeId: string) =>
  `https://www.google.com/maps/search/?api=1&query_place_id=${placeId}`;

export {
  buildEmbedSearchUrl,
  buildEmbedPlaceUrl,
  buildDirectionsUrl,
  buildMapsUrl
};
