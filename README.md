# API Maps Assistant

Small Express-based API and web page for embedding Google Maps and serving place-related endpoints.

This repository provides a lightweight server that exposes:

- A map embed page at `/map` (validates Google Maps embed URLs)
- An OpenAPI JSON at `/openapi.json`
- Application routes mounted under `/api` (see `routes/places.ts`)

It also includes a request-logging middleware that prints each incoming request to the terminal with timestamp, HTTP method, URL, response status, client IP and response time.

## Prerequisites

- Node.js (14+ recommended)
- npm or yarn

## Installation

1. Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd Heypico-LLM-Maps-Assistant
npm install
```

2. Create a `.env` file in the project root with required environment variables (see below).

## Required environment variables

The project reads environment variables from `.env` via `dotenv` (see `config/env.ts`). The following are required:

- `PLACES_API_KEY` — API key used by the places service
- `MAPS_EMBED_API_KEY` — API key used for map embed functionality

Optional/controlled values:
- `PORT` — port the server listens on (defaults to 8787)
- `NODE_ENV` — environment string (defaults to `development`)
- `ALLOWED_ORIGINS` — comma-separated list of allowed CORS origins (defaults to allow all when empty)

Example `.env`:

```env
PLACES_API_KEY=your_places_api_key_here
MAPS_EMBED_API_KEY=your_maps_embed_key_here
PORT=8787
ALLOWED_ORIGINS=http://localhost:3000
```

## Run

Start the server from the project root. Use whichever workflow you normally use for TypeScript or compiled code.

If you run compiled JS (for example, after building):

```bash
node ./server.js
```

If you run TypeScript directly with `ts-node` (dev):

```bash
npx ts-node server.ts
```

The server will log a startup line like:

```
API running on :8787
```

## What the request logs look like

Every incoming request is logged to the terminal. Format:

```
[ISO timestamp] METHOD URL STATUS - IP - DURATIONms
```

Example:

```
[2025-11-09T12:34:56.789Z] GET /api/places 200 - 127.0.0.1 - 12ms
```

Logs are emitted when the response finishes so the status code is included.

## Endpoints (overview)

- `GET /map?embed_url=<url>` — returns a simple HTML page with an embedded Google Maps iframe. The `embed_url` must start with `https://www.google.com/maps/embed/`.
- `GET /openapi.json` — returns the OpenAPI spec file located at the repository root.
- `/api/*` — application API routes are registered in `routes/places.ts` (see `controller/places-controller.ts` and `services/*`).

### API Routes

The project exposes a small set of API routes under the `/api` prefix. The important ones are:

- `GET /api/health`
	- Description: Simple health check for the API.
	- Response: `200` with JSON `{ "ok": true }`

- `POST /api/places/search`
	- Description: Search for places using a text query and a user-provided location string. The server will geocode `location_text` to coordinates and perform a Google Places Text Search.
	- Request body (JSON):
		- `query` (string, required) — search terms (e.g., "coffee shop").
		- `location_text` (string, required) — human-readable location to geocode (e.g., "Jakarta, Indonesia").
		- `radius_m` (number, optional) — search radius in meters (default: 2000, clamped between 200 and 10000).
		- `open_now` (boolean, optional) — whether to filter for places that are open now (default: false).
		- `max_results` (number, optional) — maximum number of results returned (default: 10, clamped between 1 and 20).

	- Success response: `200` JSON object with the following shape:

		```json
		{
			"center": { "lat": 123.45, "lng": 67.89 },
			"results": [
				{
					"place_id": "abc123",
					"name": "Place name",
					"address": "Formatted address",
					"rating": 4.2,
					"user_ratings_total": 123,
					"price_level": 2,
					"location": { "lat": ..., "lng": ... },
					"maps_url": "https://maps.google.com/...",
					"directions_url": "https://www.google.com/maps/dir/?..."
				}
			],
			"embed_url": "https://www.google.com/maps/embed?..."
		}
		```

	- Error responses:
		- `400` — if `query` or `location_text` are missing. Response body: `{ "error": "query dan location_text wajib diisi" }`.
		- `500` — internal errors (e.g., geocoding or places API failures). Response body: `{ "error": "<message>" }`.

	- Notes:
		- The route uses `config/env.ts` to read `PLACES_API_KEY` and `MAPS_EMBED_API_KEY` used for Google Places and embed URL generation.
		- Results are mapped to a simplified shape (see example above) and limited by the `max_results` value.

## Testing the logging quickly

1. Start the server.
2. Run a request from another terminal:

```bash
curl "http://localhost:8787/api/your-endpoint"
```

Then check the terminal where the server is running — you should see a request log line.

For instructions on configuring this API as a callable OpenAPI "tool" (ChatGPT Plugin or local web GUI), see `TOOLING.md`.
