Every trip doubles as a loading screen. While the portal, warp, or cloud animation plays, the game downloads the destination's map tiles, OpenStreetMap building details, and (in the U.S.) fill-in building footprints in parallel; builds the neighbourhood nearest first out toward the view distance; then compiles shaders and uploads geometry before revealing it. The progress bar names each stage. The nearest 320 m is always complete on arrival. Farther blocks get a nine-second building budget and the rest streams in as you explore. A slow detail service is given up to 20 seconds and then continues in the background, so a trip never fails because of it.

# Elsewhere

A full-screen 3D travel game powered by OpenFreeMap and Three.js. The world fills the window. A floating glass dock opens travel, saved places, party, and settings. There is no scrolling page around the game.

This project stays local. No deployment or source upload is part of these commands.

## Run locally

Use Node.js 22 or newer. From this project folder:

```sh
npm install
npm run build
npm run dev
```

On Windows PowerShell, use `npm.cmd` if script execution is disabled:

```powershell
cd C:\Users\kadam\Desktop\BeAll\elsewhere
npm.cmd run build
npm.cmd run dev
```

Open **http://127.0.0.1:4173**. If the server is already running, refresh that address after rebuilding. Opening `dist/index.html` directly does not work: browsers require an HTTP server for the game modules and map worker. The game now explains this instead of leaving a loading spinner.

Edit files in `src/`, then run the build again. `dist/app.js` and `dist/map-worker.js` are generated files; the server does not rebuild automatically.

## Play

- **Play:** close the menu and return to the world.
- **Travel** or **T / slash:** search for a city, landmark, address, or `latitude, longitude`. Choose Portal jump, Warp speed, or Cloud dive. Try the destination cards or Surprise me.
- **Fly:** double-tap **Space** (or press **F**, or the Fly button) to take off; do it again to land. While flying, look where you want to go and use **WASD**; **Space** climbs, **C** descends, **Shift** boosts from 12 m/s to 45 m/s. Fly down onto a roof or the street to land there.
- **Look:** click the world for mouse look (Esc releases it). On touchscreens, drag.
- **V:** switch between first and third person. In third person, drag to swing the camera around your explorer. **+ / -** zoom the view; the arrow button faces north.
- **WASD / arrows:** walk at a real 1.4 m/s (5 km/h). Hold **Shift** to run at 3.8 m/s. **Space** jumps. Curbs step up; buildings block you. On phones, use the on-screen buttons (the two right-hand ones jump/climb and descend).
- **Your explorer:** click your avatar (bottom left) to change name, colors, headwear, and backpack.
- **Saved:** return to bookmarked places. The bookmark next to the current location saves it.
- **Party:** create a room, copy an invite, and chat. Edit your name through the player avatar.
- **Sun / moon:** switch the time of day. The speaker toggles ambient sound. The expand button enters browser fullscreen.
- **Settings → Street life:** adjust ambient pedestrian density from quiet streets (0) to a lively neighbourhood (100).
- **Escape:** close menus and dialogs, or cancel a trip.

The world is at real-world scale: one unit is one meter, the player is 1.7 m tall with eyes at 1.68 m, and the first-person view uses a natural 58° field of view. Building footprints and available heights come from the map; buildings without height information use an estimate. The world is built in chunks of roughly 150-300 m (each zoom-14 map tile split 8 x 8). The default view distance is 1,200 m. Every loaded block and its props stay resident in all directions throughout that distance, with an extra border for buildings crossing chunk edges. Walking and flight prefetch ahead of travel. Chunks unload only beyond an additional retention margin, so turning around or crossing a chunk boundary does not discard nearby streets. Origin changes on long journeys translate existing geometry instead of clearing the world. Distant scenery fades into a light atmospheric haze.

## Street life

Nearby sidewalks and mapped footpaths now have animated residents with varied outfits, skin tones, backpacks, heights, and walking speeds. They pause, turn, yield to the player and each other, and stay off carriageways and out of buildings. They walk back along their route where no safe connection is known; this version does not infer traffic crossings or bridge navigation. These are local simulated residents, separate from Supabase players and the online count. Reduced-motion mode keeps them still.

Mapped cafés, restaurants, and retail businesses gain street-facing windows, framed doors, awnings, and signs with their actual map names. Planters, menu boards, and café seating appear where there is enough clearance; mapped bicycle racks gain illustrative parked bikes. Names and building locations come from OpenFreeMap. The entrance positions, storefront designs, furnishings, and residents are generated scenery, not surveyed replicas or live occupancy. Unknown or upper-floor businesses do not produce invented freestanding shops.

Crowds use shared instanced geometry, capped at 80 nearby people at maximum density (48 by default), independently of the building view distance. Store furniture remains part of its map chunk; shop signs share a texture atlas per chunk. Existing residents persist across block refreshes, and walking paths move with the world origin on long journeys. No new API key, Blender installation, or paid service is needed for this layer.

## Maps and startup

[OpenFreeMap](https://openfreemap.org/) supplies OpenMapTiles-compatible vector tiles without an account or API key. The game reads its TileJSON endpoint to discover current tile URLs, rather than pinning a dated tile release. Three.js builds a stylized environment from roads, water, parks, building footprints, recorded heights, and courtyard holes.

The four featured starting worlds have bundled OSM snapshots. These appear first, while live OpenFreeMap data loads in a worker. Loading tiles and decoding geometry does not block the render loop. When the live map arrives, the game preserves your camera and player position where the updated geometry allows it.

If the map service fails, the current world remains playable. The source badge explicitly identifies an offline snapshot; click it to retry live tiles. Trips to other locations have bounded loading times and can be canceled. Failed trips keep the previous destination. Missing game files and graphics startup errors show recovery instructions.

[Photon](https://github.com/komoot/photon) handles general destination and address search. Search happens on submission, with caching and throttling. Coordinates bypass geocoding. The public Photon service is suitable for this prototype; use a dedicated endpoint before scaling to many users.

The output is an animated, colorful style rather than photographs, with mapped footprints, measured heights where available, and recorded colours where supplied. From the map: building footprints, heights and recorded colours; street centerlines and classes; one-way streets; parks, gardens, flowerbeds, woods, meadows, cemeteries, sports pitches, playgrounds; water, pools, rivers and canals; railways, piers, and parking aisles; and available street furniture points (waste baskets, bollards, bike racks, bus stops, post boxes, drinking fountains, subway entrances, artworks, information boards, restaurant points). Generated to match local conventions: facade windows in real floor heights with storefronts and lit windows at night; doors, porch lights, flower beds, front paths, driveways, patios and mailboxes on houses; asphalt, lane markings (double yellow in the Americas), raised curbs, crosswalks, traffic signals that cycle, stop signs, streetlights, street trees, fire hydrants, parked cars, and traffic that drives on the correct side. Trees sway and water ripples. Generated details are plausible, not exact copies of the real ones. Road widths use mapped widths or lane counts when available, then road-class estimates; sidewalks are inferred. Missing building heights and facade designs are estimates. Unspecified roofs use the mapped extrusion; supported explicit gable tags stay within the recorded height. Overlapping building parts share a clean exterior surface instead of flickering duplicate walls. This is a stylized reconstruction, not a 1:1 scan: OpenFreeMap does not supply facade photographs, complete architectural geometry, terrain elevation, or every real-world object. The Eiffel Tower and Brooklyn Bridge have approximate landmark models.

The detail loader supplements tiles with OpenStreetMap building types, floor counts, materials, multi-part footprints, courtyard holes, roof bases, and road tags. This distinguishes canopies/carports, solar roofs, greenhouses, parking garages, and occupied buildings. Apartment wings keep their separate outlines and mapped heights. Glass-tagged building parts use glazed exteriors; interior rooms are not modeled. Solar-covered parking has support columns, panel grids, and illustrative parked cars. When a solar polygon groups an entire parking installation, mapped driving aisles separate the roof into rows; panel pitch, supports, bay markings, and occupancy are estimates. Geometry matching prevents a canopy correction from changing unrelated buildings sharing the same tile ID.

Street names appear near the player and in the lower-left HUD. Named attractions, cinemas, parks, and other major places get floating markers with distance. Markers are de-duplicated and limited to avoid covering the scene. Names come from the map, not generated guesses.

Details load in a background worker from the configured Overpass endpoint, around an 800 m neighbourhood. The default service has a bounded fallback to the read-only OpenStreetMap small-area API (350 m, no more than once per minute while moving). Up to six neighbourhood responses are cached on this device for 24 hours; up to twelve stay in memory. Map/search/detail requests send the requested location to those services. Use a dedicated Overpass-compatible endpoint before scaling this prototype to many players. If both detail services fail, base tiles remain playable and Settings shows the failure. Blocks stay visible until replacement geometry is ready. The detailed neighbourhood can be smaller than the view distance.

Verified example: the Yellow/Green lots by Rutgers Cinema are mapped as solar-roof multipolygons, and Livingston Apartments A/B/C have individual footprints. The checked OSM data does **not** provide their floor counts, facade materials, or the glass lounge geometry above the cinema. The checked Margate neighbourhood lacks the apartment-complex footprints in OSM; they now come from the surveyed footprints described below. Those specific details cannot be reproduced one-to-one from these tiles or tags. Unknown heights remain estimates; exact facades need additional surveyed/model data. `tests/fixtures/rutgers-structures.json` records the source geometry checked on 2026-10-13 and its ODbL attribution.

## Missing buildings

Where OpenStreetMap has no building, U.S. destinations are filled in from FEMA/ORNL [USA Structures](https://gis-fema.hub.arcgis.com/pages/usa-structures), a national inventory of structures over 450 sq ft traced from aerial imagery. Each footprint carries an occupancy class (single-family, multi-family, retail...) and often a measured height. Fill-ins become ordinary buildings, so houses, apartments, and shops get their usual facades, yards, and collisions. Residential fill-ins get grey shingle roofs, the common case seen from above. Other heights default to modest floor counts.

A mapped OSM building always wins: a footprint is skipped if it substantially overlaps any mapped building, even one drawn differently. Automated traces sometimes outline a parking lot or courtyard. Any footprint with a street or parking aisle running through it is rejected, unless the road is mapped as covered, a tunnel, or a drive-through. At the Margate apartments in Edison, NJ, this keeps all 15 apartment rows confirmed against 2020 NJOGIS aerial imagery and rejects the three traced parking areas (`tests/fixtures/margate-footprints.json`). Footprints give outlines and heights, not roof shapes, so these roofs are flat. Outside the U.S., only OSM buildings appear. Turn this off under Settings > Advanced map services.

## Nature

Lawns, parks, meadows, and other green areas use a meter-scale grass texture and swaying instanced grass tufts near the player, with wildflowers and, in wild areas, rocks. Outside dense centres, unmapped ground between streets and buildings is treated as lawn: it gets the same texture and tufts, a few shade trees per yard, and foundation shrubs along house and apartment walls. Parking, pitches, water, roads, and sidewalks stay clear. Mapped residential land keeps its yard trees and shrubs too. Plant positions are generated and deterministic per block. They are not surveyed.

## Settings

Open **Settings** in the glass dock. Defaults live in `dist/config.json`; browser overrides are stored locally:

```json
{
  "photonUrl": "https://photon.komoot.io/api/",
  "openFreeMapUrl": "https://tiles.openfreemap.org/planet",
  "osmDetails": true,
  "buildingFootprints": true,
  "osmDetailsUrl": "https://overpass-api.de/api/interpreter",
  "supabaseUrl": "https://oxkecdcvidhtuhgskfat.supabase.co",
  "supabaseKey": "sb_publishable_9da5wl3DnsPkITGj9nn87A_50x1wK1K",
  "renderDistance": 1200,
  "crowdDensity": 60
}
```

**View distance** (250-2500 m, default 1200 m) sets how far around you the world is built, on foot and in flight. The old 320 m cutoff for small props has been removed. Larger values show more of the city and need a faster computer. Near the poles, where map chunks are small, the reach is capped to keep the chunk count bounded.

No Google Maps or MapTiler key is needed. An alternative map endpoint must provide OpenMapTiles-compatible vector TileJSON, detailed zoom levels, and browser CORS access; do not enter a style JSON URL. Running locally still makes requests to the configured public map/search/detail services. Advanced map services lets you disable detail lookups or use your own Overpass endpoint. A custom endpoint is used exclusively, without the public fallback.

## Accounts and multiplayer

The game uses the Supabase project `oxkecdcvidhtuhgskfat` by default (`dist/config.json`), with its public publishable key. Players create an account with an email and password from the explorer panel (bottom left), or when they pick a locked destination. Without an account, a guest can tour the four starter cities: New York, Tokyo, Paris, and Santorini. Guests stay within 3 km of the city and keep their explorer on this device. An account unlocks every destination, search result, coordinate, and party invite, saves the explorer to the `elsewhere_profiles` table, and enables online play. A trip that needed an account continues automatically after signing in. These rules run in the browser: they shape the game, but they cannot protect the public map data. Database rows are protected by row-level security in the migration. If Supabase is removed in Settings, there are no accounts and nothing is locked.

Supabase setup for this project:

- The migration in `supabase/migrations/` has already been run.
- **Authentication > Sign In / Providers > Email** is on, with email confirmation. New accounts open the confirmation link in the same browser and are then signed in.
- **Authentication > URL Configuration:** add `http://127.0.0.1:4173` (and any address the game is hosted at) to Redirect URLs, or confirmation links return to the project's Site URL instead of the game.
- The built-in email service sends only a few messages per hour. Configure custom SMTP before inviting many players.

Party rooms connect tabs in the same browser profile through BroadcastChannel, with presence, movement, destination invitations, and chat; guests can use this. Signed-in players also join private Supabase Realtime channels, authorized by room membership in the database, to play across devices. Secret and service-role keys are rejected in Settings.

Other devices also need a reachable copy of the game. This development server listens on loopback, so its localhost address only opens on this computer. LAN access or hosting can be configured separately when requested. Realtime movement is peer supplied; this prototype does not have an authoritative game server or persistent chat.

## Source

- `src/app.js`: game menus, travel, startup recovery, settings, and interaction.
- `src/world.js`: renderer, player physics (walking, running, jumping, flying, roofs, curbs), collisions, traffic, lighting, landmarks.
- `src/facades.js`: one shared shader for facades (windows, storefronts, night lights), painted props, swaying foliage, glowing lamps, glass, traffic signals, and animated water.
- `src/chunks.js`: loads nearest chunks first, prefetches ahead, retains all in-range geometry, and shifts resident meshes when the origin changes.
- `src/footprints.js`: FEMA/ORNL fill-in footprints for unmapped U.S. buildings, with overlap and road-crossing checks.
- `src/nature.js`: grass ground texture, instanced grass tufts, and where vegetation may not grow.
- `src/structures.js` / `src/osm-details.js`: source geometry, semantic building and road matching, detail streaming, caching, and failure recovery.
- `src/map-labels.js`: mapped street names and attraction markers.
- `src/building-surfaces.js`: removes coplanar duplicate walls and covered roofs between mapped building parts.
- `src/first-person.js` / `src/avatar.js`: mouse look, walking speed, and the customizable explorer.
- `src/chunk-builder.js`: turns one chunk of map data into geometry: buildings, houses and yards, streets, curbs, crosswalks, signals, land cover, water, and street furniture.
- `src/props.js`: real-size models (trees, flowers, benches, lamps, cars...) merged into a few meshes per chunk.
- `src/scenery.js`: sky dome.
- `src/packed.js`: transferable typed-array format for decoded map features (keeps the worker handoff from stalling the game).
- `src/map-client.js` / `src/map-worker.js`: a pool of background workers that download and decode tiles and build chunk geometry, so the render loop only uploads finished meshes.
- `src/openfreemap.js`: tile discovery, downloads, decoding, splitting features into chunks, and bundled-snapshot conversion.
- `src/geo.js`: projections, destinations, height estimates, and snapshot query helper.
- `src/party.js`: local rooms and optional Supabase Realtime adapter.
- `src/index.html` / `src/styles.css`: full-screen layout, liquid glass controls, and bootstrap recovery.
- `dist/assets/`: bundled snapshot geometry and destination photos.
- `scripts/fetch-assets.mjs`: optional maintenance of the bundled OSM snapshots/photos. Runtime map loading uses OpenFreeMap.
- `.openai/hosting.json`: retained metadata from earlier hosting preparation. Local commands do not use it or publish anything.

## Verification

```sh
npm test
npm run build
node scripts/check-openfreemap.mjs
```

With the local server running, in another terminal:

```sh
node tests/browser.mjs
node tests/streaming-browser.mjs
node tests/street-life-browser.mjs
```

The browser check uses Chrome at its standard Windows location, or the executable path in `CHROME_PATH`. It verifies live destination changes, all three travel styles, a coordinate destination, movement, bookmarks, desktop/mobile viewport sizing, two-tab party chat, unavailable map recovery, hung settings requests, missing bundles, and direct-file startup guidance. The streaming check also asserts mesh identity through turns, chunk boundaries, and origin changes, full-distance props, the view-distance slider, and day/night rendering. The street-life check visits Rutgers, verifies mapped storefronts and moving residents, and exercises crowd controls, persistence, night, and mobile layouts. Screenshots and results are written to ignored `artifacts/`.

## Attribution

Fill-in building footprints (U.S.): Oak Ridge National Laboratory and FEMA Geospatial Response Office, [USA Structures](https://gis-fema.hub.arcgis.com/pages/usa-structures), CC BY 4.0. The credit appears in the game whenever fill-ins are shown.

Map data: [OpenFreeMap](https://openfreemap.org/), [OpenMapTiles](https://www.openmaptiles.org/), and [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). OSM data is available under the ODbL. Source credits remain visible in the game. The bundled snapshots retain their OSM attribution. See `dist/assets/LICENSE.md` for photo and snapshot credits.
