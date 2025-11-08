Configure this API as a "tool" / function in a Web GUI

You can expose this API's OpenAPI spec (`/openapi.json`) to web-based LLM GUIs so the model can call your endpoints as a tool/function. Below are two common setups and example configuration snippets.

Notes & assumptions:
- This project already serves `openapi.json` at `GET /openapi.json` (see project root).
- The instructions assume you run the server locally or host it so the GUI can reach `http://localhost:8787/openapi.json` (or your public URL).
- Be careful with API keys and CORS when exposing the spec to third-party services.

1) ChatGPT Plugins / OpenAI "Tool" via OpenAPI (developer/plugin flow)

If you want to use this API as a ChatGPT Plugin (or similar OpenAI tool that accepts OpenAPI specs), create an `ai-plugin.json` manifest and host it together with your `openapi.json`. A minimal `ai-plugin.json` example:

```json
{
  "schema_version": "v1",
  "name_for_human": "LLM Maps Assistant",
  "name_for_model": "llm_maps_assistant",
  "description_for_human": "Search places and get a map/embed URL using Google Places.",
  "description_for_model": "Use this tool to search places by text query and return structured results (embed_url, maps links, etc.).",
  "auth": { "type": "none" },
  "api": { "type": "openapi", "url": "http://localhost:8787/openapi.json", "is_user_authenticated": false },
  "contact_email": "your-email@example.com",
  "legal_info_url": "https://example.com/legal"
}
```

Steps:
- Run this server so `http://localhost:8787/openapi.json` is reachable.
- Host `ai-plugin.json` and any plugin assets (logo) on a reachable URL on the same host (or a public URL).
- In the ChatGPT Plugins developer settings (or plugin installation flow), add your plugin by URL.

Security notes:
- If your API requires API keys (it does for Google Places), do not embed those in the public manifest. Use the server-side keys (the server already reads them from `.env`).
- Consider adding authentication for any sensitive endpoints before exposing publicly.

2) Local LLM web UIs (OpenWebUI / other local tools)

Some local web UIs or tool-bridging layers accept an OpenAPI spec URL and expose the endpoints as tools the model can call. The process is typically:

- Start the server so `http://localhost:8787/openapi.json` is available.
- In the web UI's tool configuration, add a new tool that uses an OpenAPI spec and point it to that URL.
- Optionally provide an API key or set CORS if the UI runs in a browser and requires cross-origin access.

Generic tips for successful configuration
- Ensure `ALLOWED_ORIGINS` in `.env` allows the web UI origin if the UI runs in a browser.
- If the GUI supports example requests in the OpenAPI spec, the `examples` already present in `openapi.json` can help the tool detect the right parameters.
- Test the `/api/health` endpoint after configuring the tool to verify connectivity:

```bash
curl http://localhost:8787/api/health
```

If you want, I can also:
- Add a hosted `ai-plugin.json` and a short script to serve both the plugin manifest and `openapi.json` under a simple static route, or
- Add an npm script to `package.json` to start the server and serve a local plugin manifest for quick testing.
