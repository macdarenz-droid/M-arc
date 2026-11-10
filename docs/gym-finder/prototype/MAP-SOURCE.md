# Makati map source

Example area only: central Makati, Philippines. This is not the user's location.

Retrieved 2026-10-01T01:04:39.924296+00:00 through one bounded public Overpass query. OSM base timestamp: 2026-10-01T01:02:03Z.

Source endpoint: https://overpass-api.de/api/interpreter

[Reproducible query URL](https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A35%5D%3B%28way%5Bhighway%5D%2814.549%2C121.015%2C14.568%2C121.035%29%3Bway%5Bleisure%3Dpark%5D%2814.549%2C121.015%2C14.568%2C121.035%29%3Bnwr%5Bleisure%3Dfitness_centre%5D%2814.549%2C121.015%2C14.568%2C121.035%29%3Bnwr%5Bsport%3Dfitness%5D%2814.549%2C121.015%2C14.568%2C121.035%29%3B%29%3Bout%20body%20geom%3B)

```overpass
[out:json][timeout:35];(way[highway](14.549,121.015,14.568,121.035);way[leisure=park](14.549,121.015,14.568,121.035);nwr[leisure=fitness_centre](14.549,121.015,14.568,121.035);nwr[sport=fitness](14.549,121.015,14.568,121.035););out body geom;
```

Compact GeoJSON: embedded in `source.html` under the `mf-map-data` script element, originally 139636 bytes; 1223 road ways grouped into 250 road features, 26 park polygons and 15 fitness POIs. Roads simplified at approximately 2 metres, coordinates rounded to six decimals; original gym-node coordinates preserved. Service roads, footways, steps and corridors omitted for file size. Source geometries intersecting the requested bounds can extend outside it; clip rendering to bounds. The standalone export embeds the same geometry; no separate map-data download is needed.

Display attribution: **© OpenStreetMap contributors**, linking to https://www.openstreetmap.org/copyright . [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/) dataset; the derived GeoJSON is supplied under the same license. Preserve attribution and include this provenance when redistributing. Licensing guidance verified on 1 October 2026 at the OSM copyright page.

## Three gym nodes

| OSM name | Longitude | Latitude | Source |
|---|---:|---:|---|
| Fitness First | 121.0206416 | 14.5575096 | [OSM node 255062467](https://www.openstreetmap.org/node/255062467) |
| Gold's Gym | 121.0246015 | 14.5521252 | [OSM node 2206278008](https://www.openstreetmap.org/node/2206278008) |
| Anytime Fitness | 121.026356 | 14.5628773 | [OSM node 5471894127](https://www.openstreetmap.org/node/5471894127) |

These are actual OSM node coordinates, not invented pins or confirmed entrances. Current business operation, precise indoor floor/entrance, prices, equipment, ratings, crowd levels and availability were not independently verified. Keep illustrative details visibly separate from sourced names/coordinates. There are additional fitness/yoga POIs in the GeoJSON; their categories are retained where provided.
