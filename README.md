# Elsewhere

A playable, responsive 3D travel prototype built with Three.js. Search a city, landmark, street address, or `latitude, longitude`, choose Portal jump, Warp speed, or Cloud dive, and explore the destination on foot or from above.

## Run locally

Requires Node.js 22 or newer.

```sh
npm install
npm run build
npm run dev
```

On Windows PowerShell with script execution disabled, use `npm.cmd` in place of `npm`. The preview URL is `http://127.0.0.1:4173`.

## Included

- Offline geometry snapshots for Lower Manhattan, Shibuya/Tokyo, the Eiffel Tower neighborhood/Paris, and Oia/Santorini. The app itself must first load from an HTTP server.
- Real OpenStreetMap building footprints, recorded heights/levels, roads, parks, and available water polygons. Unspecified building heights are estimates. Three-dimensional terrain and detailed facades are not reconstructed. Shorelines, the Eiffel Tower, and Brooklyn Bridge are stylized approximations.
- On-demand address/place search using [Photon](https://github.com/komoot/photon), or MapTiler when a browser key is supplied. Coordinate entry also works without geocoding.
- On-demand neighborhood geometry through Overpass, bounded to roughly 1 km around the selected destination. Cached in memory for the current session. Featured snapshots avoid repeated provider requests.
- Orbit, zoom, WASD/arrow movement, building collisions, Shift to run, touch controls, day/night lighting, ambient sound, fullscreen, bookmarks, and persistent explorer names.
- Actual local multiplayer via BroadcastChannel between tabs in the same browser profile. Random party links, player positions, party travel notifications, and chat.
- Supabase Realtime adapter for cross-device presence, movement broadcasts, and chat. It requires your project configuration; it is not connected by default.

## Connect APIs

Open **Settings** (sliders icon at the bottom of the left rail). Browser overrides are stored locally. Set shared defaults in `dist/config.json` before publishing when everyone should use the same services.

### Better geocoding

Set `maptilerKey` to a domain-restricted MapTiler browser key. [MapTiler geocoding API](https://docs.maptiler.com/cloud/api/geocoding/). Photon remains the keyless default. Photonâ€™s demo service permits reasonable use but has no availability guarantee; use your own instance or a commercial provider before scaling. Search only runs on explicit submission, is throttled, and is cached during the session. Public OSM Nominatim is deliberately not used.

For hosted/self-operated alternatives, set `photonUrl` to a Photon-compatible API endpoint and `overpassUrl` to an Overpass-compatible interpreter endpoint. These services must permit browser CORS requests. Places with little OSM coverage may have sparse scenery; failed loads preserve the current world and report the failure.

### Cross-device multiplayer

1. Create a Supabase project with Realtime enabled and public channels allowed.
2. Set `supabaseUrl` and `supabaseKey` (a publishable `sb_publishable_â€¦` key or legacy **anon** key). Do not use a secret/service-role key. The settings screen rejects those.
3. Use the same Supabase project on both devices. For a shared deployment, put these public client settings in `dist/config.json`.
4. Open **Invite friends** and share the generated room link. Both devices must have access to the hosted site; Sites deployments start owner-private. Site access must be changed deliberately before friends on other accounts can open it.

Party rooms use random room identifiers and public Supabase Broadcast/Presence channels. This prototype has no server-authoritative movement, authenticated private-room authorization, persistent chat history, moderation, or account system. For a public game, add authenticated private channels and an authoritative game server. [Supabase Presence](https://supabase.com/docs/guides/realtime/presence) and [Broadcast](https://supabase.com/docs/guides/realtime/broadcast).

The client throttles movement updates, uses Presence only for membership, expires inactive peers, bounds incoming messages, escapes user content, and deduplicates events that arrive over both local and remote transports.

## Structure

- `src/world.js` â€” Three.js renderer, geographic scene construction, player movement/collisions.
- `src/geo.js` â€” Coordinates, heights, destination catalog, bounded Overpass queries.
- `src/party.js` â€” Local and Supabase transport adapter.
- `src/app.js` â€” UI, geocoding, travel lifecycle, settings, saved places, and sound.
- `src/index.html`, `src/styles.css` â€” Responsive interface.
- `dist/config.json` â€” Shared **public** connection settings. Never store server secrets here.
- `scripts/fetch-assets.mjs` â€” Optional map/photo snapshot preparation; existing assets are preserved.
- `.openai/hosting.json` â€” Sites project identity and static hosting configuration.

## Verification

```sh
npm test
npm run build
npm run dev
# In another terminal; uses installed Google Chrome on Windows:
node tests/browser.mjs
```

The browser test covers all four included destinations, three travel modes, walking, bookmarks, day/night, two-tab presence/chat, search resolution, failed destination loading, rejected private keys, keyboard dialogs, and mobile overflow. It records non-blocking live Photon/Overpass connectivity checks. Screenshots and results are written to ignored `artifacts/`. Cross-device Supabase behavior requires credentials and has not been tested against a live project.

## Data and imagery

Map extracts are Â© [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), licensed under [ODbL](https://opendatacommons.org/licenses/odbl/1-0/). Raw derived extracts are included in `dist/assets/*.json` with provenance. Destination photos are from Unsplash, identified by their photo IDs in `scripts/fetch-assets.mjs`; see the [Unsplash license](https://unsplash.com/license). No photos are used as a substitute for the interactive 3D environment.

