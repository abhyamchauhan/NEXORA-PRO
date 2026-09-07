// NEXORA — parametric garment 3D. Pure three.js, no assets.
// Two consumers: createStage() drives the live viewer (3D Studio + hero),
// renderThumb()/bakeFrames() bake clay renders for product cards and the
// 36-frame PDP turntable. Swap buildLook() for a GLB loader later and the
// rest of the app is untouched.

import * as THREE from "https://unpkg.com/three@0.184.0/build/three.module.js";

export const BG = "#c9c7c4";
const CLAY = 0xdad7d2;

let _ro = null; // shared offscreen renderer

function offscreen(w, h) {
  if (!_ro) {
    _ro = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    _ro.shadowMap.enabled = true;
    _ro.shadowMap.type = THREE.PCFShadowMap;
    _ro.toneMapping = THREE.ACESFilmicToneMapping;
  }
  _ro.setPixelRatio(1);
  _ro.setSize(w, h, false);
  return _ro;
}

export function supported() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) { return false; }
}

/* ---------------------------------------------------------------- materials */

const FABRIC = {
  Cotton: { roughness: 0.92, metalness: 0 },
  Fleece: { roughness: 0.98, metalness: 0 },
  Denim: { roughness: 0.88, metalness: 0 },
  Twill: { roughness: 0.85, metalness: 0 },
  Leather: { roughness: 0.42, metalness: 0.06 },
  Satin: { roughness: 0.26, metalness: 0.08 },
};

function fabricMat(hex, fabric, name) {
  const f = FABRIC[fabric] || FABRIC.Cotton;
  const col = new THREE.Color(hex || "#1c1c1c");
  const lum = 0.299 * col.r + 0.587 * col.g + 0.114 * col.b;
  if (lum < 0.16) col.lerp(new THREE.Color(0x8f8f8f), 0.34 * (1 - lum / 0.16) + 0.16);
  const m = new THREE.MeshStandardMaterial({ color: col, roughness: f.roughness, metalness: f.metalness, side: THREE.DoubleSide });
  m.name = name || (fabric || "cotton").toLowerCase();
  return m;
}

const clayMat = () => new THREE.MeshStandardMaterial({ color: CLAY, roughness: 0.95, metalness: 0, name: "clay" });

/* ------------------------------------------------------------------- figure */

function lathe(profile, seg, mat, name) {
  const pts = profile.map(([x, y]) => new THREE.Vector2(Math.max(0.002, x), y));
  const g = new THREE.LatheGeometry(pts, seg || 40);
  const m = new THREE.Mesh(g, mat);
  m.name = name || "lathe";
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

function tube(r1, r2, len, mat, name) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, len, 24, 1, false), mat);
  m.name = name; m.castShadow = true; m.receiveShadow = true;
  return m;
}

function ball(r, mat, name) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 18), mat);
  m.name = name; m.castShadow = true; m.receiveShadow = true;
  return m;
}

// Stylized mannequin, 1.72m, y-up, feet at y=0.
export function buildFigure() {
  const mat = clayMat();
  const fig = new THREE.Group();
  fig.name = "mannequin";

  const torso = lathe([[0.15, 0.90], [0.135, 0.99], [0.113, 1.09], [0.128, 1.18], [0.152, 1.26], [0.140, 1.34], [0.108, 1.40], [0.062, 1.44]], 44, mat, "torso");
  const pelvis = lathe([[0.001, 0.80], [0.10, 0.855], [0.152, 0.90], [0.15, 0.95]], 40, mat, "pelvis");
  const neck = tube(0.048, 0.052, 0.10, mat, "neck"); neck.position.set(0, 1.475, 0);
  const head = ball(0.098, mat, "head"); head.position.set(0, 1.60, 0.005); head.scale.set(0.92, 1.12, 1);
  const hair = ball(0.104, mat, "hair"); hair.position.set(0, 1.615, -0.014); hair.scale.set(0.96, 1.02, 1);
  fig.add(torso, pelvis, neck, head, hair);

  const leg = (side) => {
    const hip = new THREE.Group(); hip.name = "hip" + side; hip.position.set(0.082 * side, 0.885, 0);
    const thigh = tube(0.088, 0.062, 0.44, mat, "thigh"); thigh.position.y = -0.22; hip.add(thigh);
    const knee = new THREE.Group(); knee.name = "knee" + side; knee.position.y = -0.44;
    knee.add(ball(0.058, mat, "kneecap"));
    const calf = tube(0.058, 0.036, 0.42, mat, "calf"); calf.position.y = -0.21; knee.add(calf);
    const ankle = new THREE.Group(); ankle.position.y = -0.42;
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.032, 0.20), mat); foot.name = "foot";
    foot.position.set(0, -0.014, 0.055); foot.castShadow = true; ankle.add(foot);
    const heel = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.055, 0.032), mat); heel.name = "heel";
    heel.position.set(0, -0.05, -0.025); heel.castShadow = true; ankle.add(heel);
    knee.add(ankle); hip.add(knee);
    return hip;
  };

  const arm = (side) => {
    const sh = new THREE.Group(); sh.name = "shoulder" + side; sh.position.set(0.148 * side, 1.365, 0);
    sh.add(ball(0.052, mat, "shoulderball"));
    const upper = tube(0.049, 0.038, 0.30, mat, "upperarm"); upper.position.y = -0.15; sh.add(upper);
    const el = new THREE.Group(); el.name = "elbow" + side; el.position.y = -0.30;
    el.add(ball(0.038, mat, "elbowball"));
    const fore = tube(0.036, 0.028, 0.27, mat, "forearm"); fore.position.y = -0.135; el.add(fore);
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.10, 0.026), mat); hand.name = "hand";
    hand.position.y = -0.32; hand.castShadow = true; el.add(hand);
    sh.add(el);
    return sh;
  };

  const legL = leg(1), legR = leg(-1), armL = arm(1), armR = arm(-1);
  fig.add(legL, legR, armL, armR);
  fig.userData.rig = { legL, legR, armL, armR, head, torso, kneeL: legL.getObjectByName("knee1"), kneeR: legR.getObjectByName("knee-1"), elbowL: armL.getObjectByName("elbow1"), elbowR: armR.getObjectByName("elbow-1") };
  pose(fig, 0);
  return fig;
}

// t = 0 → contrapposto stance; t > 0 → walk cycle phase (radians)
export function pose(fig, t) {
  const r = fig.userData.rig; if (!r) return;
  if (!t) {
    r.legL.rotation.x = -0.10; r.legR.rotation.x = 0.13; r.legR.rotation.z = -0.04;
    r.kneeL.rotation.x = 0.06; r.kneeR.rotation.x = -0.10;
    r.armL.rotation.x = 0.14; r.armL.rotation.z = -0.045;
    r.armR.rotation.x = -0.20; r.armR.rotation.z = 0.055;
    r.elbowL.rotation.x = -0.30; r.elbowR.rotation.x = -0.55;
    fig.position.y = 0; fig.rotation.z = 0;
    return;
  }
  const s = Math.sin(t), c = Math.cos(t);
  r.legL.rotation.x = -0.38 * s; r.legR.rotation.x = 0.38 * s;
  r.kneeL.rotation.x = 0.36 * Math.max(0, -s) + 0.06;
  r.kneeR.rotation.x = 0.36 * Math.max(0, s) + 0.06;
  r.armL.rotation.x = 0.34 * s; r.armR.rotation.x = -0.34 * s;
  r.elbowL.rotation.x = -0.35 - 0.2 * Math.max(0, s);
  r.elbowR.rotation.x = -0.35 - 0.2 * Math.max(0, -s);
  fig.position.y = 0.012 * Math.abs(c);
  fig.rotation.z = 0.02 * s;
}

/* ----------------------------------------------------------------- garments */

function sleeve(fig, side, len, wide, mat) {
  const sh = side > 0 ? fig.userData.rig.armL : fig.userData.rig.armR;
  const s = new THREE.Mesh(new THREE.CylinderGeometry(wide, wide * 0.86, len, 22, 1, false), mat);
  s.name = "sleeve"; s.castShadow = true; s.receiveShadow = true;
  s.position.set(0, -len / 2 + 0.03, 0);
  s.rotation.z = -0.04 * side;
  sh.add(s);
  const cap = ball(wide * 0.92, mat, "sleevecap"); cap.position.y = 0.02; cap.scale.set(1, 0.7, 1); sh.add(cap);
  return s;
}

function pleatedSkirt(mat, top, drop, radius) {
  const g = new THREE.Group(); g.name = "skirt";
  const n = 24;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const w = (2 * Math.PI * radius) / n * 1.5;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(w, drop, 0.012), mat);
    panel.name = "pleat";
    panel.castShadow = true; panel.receiveShadow = true;
    const rr = radius * (i % 2 ? 1 : 0.86);
    panel.position.set(Math.sin(a) * rr, top - drop / 2, Math.cos(a) * rr);
    panel.rotation.y = a;
    panel.rotation.x = 0.11 * (i % 2 ? 1 : 0.6);
    g.add(panel);
  }
  g.add(lathe([[radius * 0.7, top], [radius * 0.78, top - 0.03]], 40, mat, "waistband"));
  return g;
}

function pantLeg(fig, side, mat, hem, wide) {
  const hip = side > 0 ? fig.userData.rig.legL : fig.userData.rig.legR;
  const len = 0.885 - hem;
  const l = new THREE.Mesh(new THREE.CylinderGeometry(wide * 0.95, wide, len, 26, 1, false), mat);
  l.name = "pantleg"; l.castShadow = true; l.receiveShadow = true;
  l.position.y = -len / 2 + 0.02;
  l.material.side = THREE.DoubleSide;
  hip.add(l);
}

function plinth() {
  const g = new THREE.Group(); g.name = "plinth";
  const m = new THREE.MeshStandardMaterial({ color: 0xcfccc7, roughness: 0.96, metalness: 0, name: "plinth" });
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.055, 0.62), m); base.position.y = 0.0275;
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.05, 0.50), m); top.position.y = 0.08;
  [base, top].forEach((x) => { x.castShadow = true; x.receiveShadow = true; g.add(x); });
  return g;
}

// spec: { garment, color, fabric }
export function buildLook(spec) {
  const s = spec || {};
  const mat = fabricMat(s.color, s.fabric);
  const root = new THREE.Group(); root.name = "look";

  if (s.garment === "cap" || s.garment === "bag") {
    root.add(plinth());
    if (s.garment === "cap") {
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.115, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2), mat);
      crown.name = "crown"; crown.position.y = 0.105; crown.scale.set(1, 0.86, 1);
      crown.castShadow = true; crown.receiveShadow = true;
      const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.014, 32, 1, false, -Math.PI / 2.4, Math.PI / 1.2), mat);
      visor.name = "visor"; visor.position.set(0, 0.108, 0.03); visor.rotation.x = -0.10; visor.scale.z = 0.92;
      visor.castShadow = true;
      const button = ball(0.016, mat, "button"); button.position.y = 0.203;
      root.add(crown, visor, button);
    } else {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.34, 0.13), mat);
      body.name = "tote"; body.position.y = 0.275; body.castShadow = true; body.receiveShadow = true;
      root.add(body);
      [-1, 1].forEach((k) => {
        const strap = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.010, 10, 28, Math.PI), mat);
        strap.name = "strap"; strap.position.set(0, 0.44, 0.045 * k); strap.castShadow = true;
        root.add(strap);
      });
    }
    root.userData.frameTarget = new THREE.Vector3(0, 0.26, 0);
    root.userData.frameRadius = 1.45;
    return root;
  }

  const fig = buildFigure();
  root.add(fig);
  root.userData.figure = fig;
  root.userData.frameTarget = new THREE.Vector3(0, 0.94, 0);
  root.userData.frameRadius = 3.55;

  switch (s.garment) {
    case "hoodie": {
      root.add(lathe([[0.196, 0.80], [0.206, 0.88], [0.202, 1.04], [0.196, 1.18], [0.206, 1.30], [0.190, 1.38], [0.124, 1.42]], 44, mat, "hoodbody"));
      sleeve(fig, 1, 0.56, 0.070, mat); sleeve(fig, -1, 0.56, 0.070, mat);
      const hood = new THREE.Mesh(new THREE.SphereGeometry(0.138, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.58), mat);
      hood.name = "hood"; hood.position.set(0, 1.405, -0.105); hood.rotation.x = -0.72; hood.scale.set(1.02, 1.2, 0.86);
      hood.castShadow = true; hood.receiveShadow = true;
      root.add(hood);
      break;
    }
    case "tee":
      root.add(lathe([[0.195, 0.92], [0.204, 1.02], [0.198, 1.16], [0.208, 1.30], [0.190, 1.38], [0.118, 1.42]], 44, mat, "teebody"));
      sleeve(fig, 1, 0.22, 0.064, mat); sleeve(fig, -1, 0.22, 0.064, mat);
      break;
    case "vest":
      root.add(lathe([[0.188, 1.00], [0.196, 1.10], [0.192, 1.22], [0.200, 1.31], [0.176, 1.37], [0.112, 1.41]], 44, mat, "vestbody"));
      break;
    case "jacket": {
      root.add(lathe([[0.202, 0.83], [0.212, 0.91], [0.208, 1.06], [0.202, 1.20], [0.212, 1.31], [0.196, 1.38], [0.130, 1.41]], 44, mat, "jacketbody"));
      sleeve(fig, 1, 0.60, 0.074, mat); sleeve(fig, -1, 0.60, 0.074, mat);
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.026, 12, 30, Math.PI * 1.35), mat);
      collar.name = "collar"; collar.position.set(0, 1.415, -0.01); collar.rotation.set(-1.35, 0, Math.PI * 0.82);
      collar.castShadow = true;
      const placket = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.56, 0.016), mat);
      placket.name = "placket"; placket.position.set(0, 1.10, 0.226); placket.castShadow = true;
      root.add(collar, placket);
      break;
    }
    case "pants": {
      root.add(lathe([[0.158, 0.86], [0.165, 0.92], [0.150, 0.955]], 40, mat, "waistband"));
      pantLeg(fig, 1, mat, 0.06, 0.135); pantLeg(fig, -1, mat, 0.06, 0.135);
      break;
    }
    case "skirt":
      root.add(pleatedSkirt(mat, 1.05, 0.34, 0.195));
      break;
    case "dress":
      root.add(lathe([[0.155, 1.26], [0.148, 1.20], [0.142, 1.06], [0.185, 0.86], [0.245, 0.66], [0.268, 0.55]], 48, mat, "dressbody"));
      break;
    default:
      root.add(lathe([[0.195, 0.92], [0.204, 1.10], [0.208, 1.30], [0.118, 1.42]], 40, mat, "shell"));
  }
  return root;
}

/* -------------------------------------------------------------------- scene */

function makeScene(bg) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bg || BG);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x8f8d8a, 0.62); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.55);
  key.position.set(1.9, 3.1, 2.3); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.5; key.shadow.camera.far = 12;
  key.shadow.camera.left = -1.6; key.shadow.camera.right = 1.6;
  key.shadow.camera.top = 2.6; key.shadow.camera.bottom = -0.4;
  key.shadow.bias = -0.0008; key.shadow.radius = 3;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.34); fill.position.set(-2.4, 1.5, 1.2); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.5); rim.position.set(-0.4, 1.8, -3); scene.add(rim);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: new THREE.Color(bg || BG), roughness: 1, metalness: 0 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.name = "ground";
  scene.add(ground);
  return scene;
}

function placeCamera(cam, look, azimuth, elevation, zoom) {
  const t = look.userData.frameTarget || new THREE.Vector3(0, 0.9, 0);
  const r = (look.userData.frameRadius || 3) / (zoom || 1);
  const el = elevation == null ? 0.06 : elevation;
  cam.position.set(t.x + Math.sin(azimuth) * r * Math.cos(el), t.y + Math.sin(el) * r + 0.12, t.z + Math.cos(azimuth) * r * Math.cos(el));
  cam.lookAt(t);
}

/* ---------------------------------------------------------- offscreen bakes */

export async function renderThumb(spec, opts) {
  const o = opts || {};
  const w = o.w || 520, h = o.h || 640;
  const r = offscreen(w, h);
  const scene = makeScene(o.bg);
  const look = buildLook(spec);
  scene.add(look);
  const cam = new THREE.PerspectiveCamera(26, w / h, 0.1, 60);
  look.rotation.y = o.angle == null ? -0.42 : o.angle;
  placeCamera(cam, look, 0.16, 0.045, o.zoom || 0.98);
  r.render(scene, cam);
  const url = r.domElement.toDataURL("image/jpeg", 0.88);
  dispose(scene);
  return url;
}

export async function bakeFrames(spec, opts) {
  const o = opts || {};
  const count = o.count || 36, w = o.w || 560, h = o.h || 700;
  const r = offscreen(w, h);
  const scene = makeScene(o.bg);
  const look = buildLook(spec);
  scene.add(look);
  const cam = new THREE.PerspectiveCamera(26, w / h, 0.1, 60);
  placeCamera(cam, look, 0.1, 0.05, o.zoom || 1.0);
  const frames = [];
  for (let i = 0; i < count; i++) {
    look.rotation.y = (i / count) * Math.PI * 2;
    r.render(scene, cam);
    frames.push(r.domElement.toDataURL("image/jpeg", 0.82));
    if (o.onProgress) o.onProgress((i + 1) / count);
    if (i % 4 === 3) await new Promise((res) => setTimeout(res, 0));
  }
  dispose(scene);
  return frames;
}

function dispose(obj) {
  obj.traverse((n) => {
    if (n.geometry) n.geometry.dispose();
    if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach((m) => m.dispose());
  });
}

/* ------------------------------------------------------------- live viewer */

export function createStage(container, spec, opts) {
  const o = opts || {};
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:none;cursor:grab";
  container.appendChild(renderer.domElement);

  const scene = makeScene(o.bg);
  const cam = new THREE.PerspectiveCamera(26, 1, 0.1, 60);
  let look = buildLook(spec);
  scene.add(look);

  let az = 0.18, el = 0.05, zoom = 1, spin = -0.0016, wire = false, animate = false, t = 0, raf = 0, alive = true;

  const resize = () => {
    const w = container.clientWidth || 600, h = container.clientHeight || 700;
    renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize); ro.observe(container);

  const loop = () => {
    if (!alive) return;
    raf = requestAnimationFrame(loop);
    if (!drag.active) look.rotation.y += spin;
    if (animate && look.userData.figure) { t += 0.055; pose(look.userData.figure, t); }
    placeCamera(cam, look, az, el, zoom);
    renderer.render(scene, cam);
  };

  const drag = { active: false, x: 0, y: 0 };
  const el0 = renderer.domElement;
  const down = (e) => { drag.active = true; drag.x = e.clientX; drag.y = e.clientY; el0.style.cursor = "grabbing"; el0.setPointerCapture && el0.setPointerCapture(e.pointerId); };
  const move = (e) => {
    if (!drag.active) return;
    look.rotation.y += (e.clientX - drag.x) * 0.011;
    el = Math.max(-0.30, Math.min(0.62, el + (e.clientY - drag.y) * -0.004));
    drag.x = e.clientX; drag.y = e.clientY;
  };
  const up = () => { drag.active = false; el0.style.cursor = "grab"; };
  el0.addEventListener("pointerdown", down);
  el0.addEventListener("pointermove", move);
  el0.addEventListener("pointerup", up);
  el0.addEventListener("pointercancel", up);
  el0.addEventListener("wheel", (e) => { e.preventDefault(); zoom = Math.max(0.6, Math.min(2.6, zoom * (e.deltaY > 0 ? 0.92 : 1.08))); }, { passive: false });

  const setWire = (on) => {
    wire = on;
    look.traverse((n) => { if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach((m) => { m.wireframe = on; }); });
  };

  loop();

  return {
    setSpec(next) {
      const y = look.rotation.y;
      scene.remove(look); dispose(look);
      look = buildLook(next); look.rotation.y = y;
      scene.add(look); setWire(wire);
      if (animate && look.userData.figure) pose(look.userData.figure, t);
    },
    setWireframe: setWire,
    isWireframe: () => wire,
    toggleAnimate(on) {
      animate = on == null ? !animate : on;
      if (!animate && look.userData.figure) pose(look.userData.figure, 0);
      return animate;
    },
    isAnimating: () => animate,
    zoomBy(k) { zoom = Math.max(0.6, Math.min(2.6, zoom * k)); return zoom; },
    reset() { az = 0.18; el = 0.05; zoom = 1; look.rotation.y = 0; },
    setSpin(v) { spin = v; },
    dispose() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); dispose(scene); renderer.dispose(); if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); },
  };
}
