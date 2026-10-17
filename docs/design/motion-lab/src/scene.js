// MO: renderer, lights, theme-tinted materials and the muscle-tier shader for the motion lab.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const hex = (c) => new THREE.Color(c);
/** CSS color-mix(in srgb, a p%, b) */
export const mix = (a, b, p) => { const x = hex(a), y = hex(b); return new THREE.Color(x.r * p + y.r * (1 - p), x.g * p + y.g * (1 - p), x.b * p + y.b * (1 - p)); };
const rgbaToHex = (s) => { const m = /rgba?\(([^)]+)\)/.exec(s); if (!m) return s; const [r, g, b] = m[1].split(',').map(Number); return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join(''); };

/** Scene colours for one theme, from the app's own tokens (src/theme/themes.ts via themes.json). */
export function palette(theme) {
  const t = theme.tokens, dark = t.colorScheme === 'dark';
  const bg = t.surface2;
  return {
    bg,
    body: dark ? mix(t.text, bg, 0.62) : mix(t.text, bg, 0.30),
    cloth: dark ? mix(t.text, bg, 0.16) : mix(t.text, bg, 0.62),
    // the 3D figure is light clay, so the accent itself carries the highlight (the 2D map lightens it because
    // its body is dark); Helps is the same hue shown weaker, so the two read as one family
    main: hex(t.accent),
    helps: hex(t.accent),
    watch: hex(t.mistake),
    frame: dark ? mix(t.text, bg, 0.10) : mix(t.text, bg, 0.72),
    pad: dark ? mix(t.text, bg, 0.05) : mix(t.text, bg, 0.80),
    metal: dark ? mix(t.text, bg, 0.55) : mix(t.text, bg, 0.40),
    grip: dark ? mix(t.text, bg, 0.07) : mix(t.text, bg, 0.78),
    line: hex(rgbaToHex(t.text3)),
    text: t.text, text2: t.text2, accent: t.accent, mistake: t.mistake,
    dark,
  };
}

export function createRenderer(canvas, { width, height, pixelRatio = 1, preserve = false }) {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, preserveDrawingBuffer: preserve, powerPreference: 'low-power' });
  if (!gl) return null;
  const r = new THREE.WebGLRenderer({ canvas, context: gl, antialias: true, alpha: true });
  r.setPixelRatio(pixelRatio); r.setSize(width, height, false);
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.NeutralToneMapping; r.toneMappingExposure = 1.0;
  r.setClearColor(0x000000, 0);
  return r;
}

export function createScene(renderer) {
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.35;
  const hemi = new THREE.HemisphereLight(0xffffff, 0x404040, 0.55); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(-2.2, 3.4, 2.6); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.55); fill.position.set(2.6, 1.6, 1.8); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 1.2); rim.position.set(0.5, 2.6, -3.2); scene.add(rim);
  const shadow = contactShadow(); scene.add(shadow);
  return { scene, lights: { hemi, key, fill, rim }, shadow };
}

function contactShadow() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); const grd = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,0.55)'); grd.addColorStop(0.6, 'rgba(0,0,0,0.18)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.6), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.001; m.renderOrder = -1;
  return m;
}

/**
 * Figure material: theme body colour, clothing from COLOR_0.b, muscle tiers from COLOR_0.r (region id) and
 * COLOR_0.g (strength inside the region). uTier[id] = 0 off, 1 main, 2 helps, 3 watch.
 */
export function figureMaterial(clothMask = null) {
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.62, metalness: 0.0, map: clothMask });
  const uniforms = {
    uBody: { value: new THREE.Color() }, uCloth: { value: new THREE.Color() },
    uMain: { value: new THREE.Color() }, uHelps: { value: new THREE.Color() }, uWatch: { value: new THREE.Color() },
    uTier: { value: new Float32Array(64) }, uPulse: { value: 0 }, uShow: { value: 1 },
  };
  mat.userData.uniforms = uniforms;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
attribute vec4 color;
uniform float uTier[64];
varying float vMain; varying float vHelps; varying float vWatch; varying float vCloth;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
int rid = int(color.r * 255.0 + 0.5);
float tier = rid > 0 && rid < 64 ? uTier[rid] : 0.0;
float k = color.g;
vMain = tier > 0.5 && tier < 1.5 ? k : 0.0;
vHelps = tier > 1.5 && tier < 2.5 ? k : 0.0;
vWatch = tier > 2.5 ? k : 0.0;
vCloth = color.b;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform vec3 uBody; uniform vec3 uCloth; uniform vec3 uMain; uniform vec3 uHelps; uniform vec3 uWatch;
uniform float uPulse; uniform float uShow;
varying float vMain; varying float vHelps; varying float vWatch; varying float vCloth;`)
      .replace('#include <map_fragment>', `
#ifdef USE_MAP
float clothK = smoothstep(0.3, 0.7, texture2D(map, vMapUv).r);
#else
float clothK = step(0.5, vCloth);
#endif`)
      .replace('#include <color_fragment>', `#include <color_fragment>
vec3 base = mix(uBody, uCloth, clothK);
float pm = smoothstep(0.08, 0.9, vMain) * uShow;
float ph = smoothstep(0.08, 0.9, vHelps) * uShow;
float pw = smoothstep(0.08, 0.9, vWatch) * uShow;
base = mix(base, uHelps, ph * 0.34);
base = mix(base, uMain, pm * (0.70 + 0.14 * uPulse));
base = mix(base, uWatch, pw * 0.72);
diffuseColor.rgb = base;`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
totalEmissiveRadiance += uMain * pm * (0.05 + 0.07 * uPulse) + uWatch * pw * (0.05 + 0.05 * uPulse);`);
  };
  mat.customProgramCacheKey = () => 'mo-figure-3';
  return mat;
}

export function applyFigurePalette(mat, pal) {
  const u = mat.userData.uniforms;
  u.uBody.value.copy(pal.body); u.uCloth.value.copy(pal.cloth);
  u.uMain.value.copy(pal.main); u.uHelps.value.copy(pal.helps); u.uWatch.value.copy(pal.watch);
}

export function setTiers(mat, regionIds, tiers) {
  const arr = mat.userData.uniforms.uTier.value; arr.fill(0);
  for (const [muscle, tier] of Object.entries(tiers)) { const id = regionIds[muscle]; if (id) arr[id] = tier; }
}

export function machineMaterials(pal) {
  return {
    frame: new THREE.MeshStandardMaterial({ color: pal.frame, roughness: 0.55, metalness: 0.25 }),
    pad: new THREE.MeshStandardMaterial({ color: pal.pad, roughness: 0.5, metalness: 0.0 }),
    metal: new THREE.MeshStandardMaterial({ color: pal.metal, roughness: 0.28, metalness: 0.85 }),
    grip: new THREE.MeshStandardMaterial({ color: pal.grip, roughness: 0.85, metalness: 0.0 }),
  };
}
