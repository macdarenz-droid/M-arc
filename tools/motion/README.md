# Motion asset pipeline

Builds the shared 3D figure and the machine bodies for the motion view. Design and rules: `docs/FORM-GUIDE-ARCHITECTURE.md`. Every Meshy task, its prompt and its cost: `meshy-ledger.json`.

Tools (outside the app's npm dependencies): Meshy CLI `npm exec --yes --package=meshy-cli@0.4.0 -- meshy`, Blender's Python module `pip install bpy==5.0.1` (Python 3.11), Node 22.

| Step | Command | Output |
|---|---|---|
| Figure: rig finish | `python tools/motion/figure_rig.py <meshy-rigged.glb> figure.glb figure.meta.json` | twist bones, 15 finger bones per hand, cleaned arm and armpit weights, clothing mask |
| Figure: muscles | `python tools/motion/regions.py figure.glb figure.glb figure.regions.json` | region id and strength per vertex (COLOR_0) |
| Machine body | `python tools/motion/machine_prep.py <meshy.glb> <out.glb> tools/motion/machines/<name>.json` | metres, floor at 0, seat split out, materials frame/pad/metal, decimated |
| Pack for the page | `gltfpack -i <in.glb> -o docs/design/motion-lab/assets/<name>.glb -cc -kn -km -ke -kv` | meshopt-compressed; keeps COLOR_0 (custom attributes are dropped) |
| Probe | `node tools/motion/probe.mjs <three.js package dir>` | 17 numeric checks on the pilot; exit 1 on any failure |
| Lab themes | `node tools/motion/lab-themes.mjs` | `docs/design/motion-lab/src/themes.json` from `src/theme/themes.ts` |

Check every output on rendered frames before using it.
