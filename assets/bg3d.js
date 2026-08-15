/* ============================================================
   WEBRO — 3D page backgrounds
   ============================================================
   One scene per page, chosen with  <body data-bg="h1">.

     h1  Home      Orbital Network Sphere
     s3  Services  Connected Node Web
     p1  Pricing   Ascending Columns
     a2  About     Double Helix
     c1  Contact   Globe with Reach Arcs

   Mobile policy — the animation DOES run on phones, but:
     • Three.js loads only after first paint, never blocking the page
     • object counts and pixel ratio drop on small screens
     • the loop pauses when the tab is hidden or the canvas is scrolled away
     • reduced-motion or data-saver skips 3D entirely and keeps the CSS aurora

   The CSS aurora behind this canvas always renders, so if 3D is skipped or
   fails, the page still looks finished — never blank.
   ============================================================ */
(function () {
'use strict';

const KEY = document.body.dataset.bg;
if (!KEY) return;                                   // page opted out (FAQ, legal)

const canvas = document.getElementById('bgfx');
if (!canvas) return;

/* Add ?debug=1 to any page URL to see exactly what the 3D layer is doing.
   Built in because mobile failures are otherwise invisible — no console. */
const DEBUG = location.search.indexOf('debug=1') !== -1;
function log(msg){
  console.log('[bg3d] ' + msg);
  if (!DEBUG) return;
  let box = document.getElementById('bg3d-debug');
  if (!box){
    box = document.createElement('div');
    box.id = 'bg3d-debug';
    box.style.cssText = 'position:fixed;left:8px;top:8px;z-index:9999;background:#12301b;' +
      'color:#c2d98a;font:11px ui-monospace,monospace;padding:8px 10px;border-radius:8px;' +
      'max-width:80vw;white-space:pre-line;line-height:1.5';
    document.body.appendChild(box);
  }
  box.textContent += msg + '\n';
}

/* Only reduced-motion opts out now. Data-saver used to skip 3D entirely, which
   silently disabled it on plenty of mobile connections — instead we just run
   the lighter phone tier. */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) { canvas.style.display = 'none'; log('skipped: reduced motion'); return; }

/* ---------- device tiers ----------
   Phones still get the animation, just fewer objects and a lower pixel
   ratio — that is the difference between 60fps and a hot battery. */
const W = innerWidth;
const TIER = W < 700 ? 'phone' : W < 1100 ? 'tablet' : 'desktop';
const Q = {
  phone:   { ratio: 1.5, scale: 0.45 },
  tablet:  { ratio: 1.75, scale: 0.7 },
  desktop: { ratio: 2,   scale: 1 }
}[TIER];

const n = (base, min = 3) => Math.max(min, Math.round(base * Q.scale));

/* Deep enough to read against the light beige background. */
const C = { lime:0x5f7d1e, sage:0x6f8f30, deep:0x3c5610, gold:0x9a7430 };

let THREE, renderer, scene, camera, sceneApi = null, raf = null, t = 0, running = false;
let mouse = { x:0, y:0 }, target = { x:0, y:0 };

function size(){
  return { w: Math.max(1, innerWidth), h: Math.max(1, innerHeight) };
}

function resize(){
  const { w, h } = size();
  canvas.style.width  = w + 'px';
  canvas.style.height = h + 'px';
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

const std  = (color, opacity = .5, flat = true) => new THREE.MeshStandardMaterial({
  color, emissive:0x1a2411, metalness:.18, roughness:.6, flatShading:flat, transparent:true, opacity });
const line = (color, opacity = .34) => new THREE.LineBasicMaterial({ color, transparent:true, opacity });

/* ============================================================
   SCENES
   ============================================================ */
const SCENES = {

/* -------- HOME : Orbital Network Sphere -------- */
h1(){
  camera.position.z = 9;
  const g = new THREE.Group(); scene.add(g);
  const globe = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(3.1, TIER === 'phone' ? 1 : 2)), line(C.lime,.3));
  g.add(globe);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(3.05, 1), std(C.sage,.08,false)); g.add(core);

  const nodes = [];
  for (let i = 0, N = n(26, 10); i < N; i++){
    const m = new THREE.Mesh(new THREE.SphereGeometry(.075, 8, 8), std(C.deep,.7,false));
    m.userData = { r: 3.9 + Math.random()*1.5, a: Math.random()*6.28,
                   e: (Math.random()-.5)*2.2, sp: .0016 + Math.random()*.0028 };
    g.add(m); nodes.push(m);
  }
  return function(){
    globe.rotation.y += .0013; core.rotation.y += .0013;
    nodes.forEach(nd => {
      const u = nd.userData; u.a += u.sp;
      nd.position.set(Math.cos(u.a)*u.r, u.e + Math.sin(t*.5 + u.a)*.25, Math.sin(u.a)*u.r);
    });
    g.rotation.y = mouse.x*.4; g.rotation.x = mouse.y*.28;
  };
},

/* -------- SERVICES : Connected Node Web --------
   The pair loop is O(n²), so node count matters far more here than
   anywhere else. Phones get roughly a quarter of the desktop count. */
s3(){
  camera.position.z = 11;
  const g = new THREE.Group(); scene.add(g);
  const N = n(44, 14), pts = [], dots = [];
  for (let i = 0; i < N; i++){
    const v = new THREE.Vector3((Math.random()-.5)*17, (Math.random()-.5)*11, (Math.random()-.5)*8);
    v.userData = { v: new THREE.Vector3((Math.random()-.5)*.012, (Math.random()-.5)*.012, (Math.random()-.5)*.008) };
    pts.push(v);
    const d = new THREE.Mesh(new THREE.SphereGeometry(.085, 8, 8), std(C.deep,.7,false));
    g.add(d); dots.push(d);
  }
  const lgeo = new THREE.BufferGeometry();
  lgeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N*N*6), 3));
  const lines = new THREE.LineSegments(lgeo, line(C.lime,.22)); g.add(lines);
  const lpos = lgeo.attributes.position.array;
  const LIM = [8.5, 5.5, 4];

  return function(){
    let k = 0;
    pts.forEach((p, i) => {
      p.add(p.userData.v);
      ['x','y','z'].forEach((ax, ai) => { if (Math.abs(p[ax]) > LIM[ai]) p.userData.v[ax] *= -1; });
      dots[i].position.copy(p);
    });
    for (let i = 0; i < N; i++) for (let j = i+1; j < N; j++){
      if (pts[i].distanceTo(pts[j]) < 3.4){
        lpos[k++]=pts[i].x; lpos[k++]=pts[i].y; lpos[k++]=pts[i].z;
        lpos[k++]=pts[j].x; lpos[k++]=pts[j].y; lpos[k++]=pts[j].z;
      }
    }
    lgeo.setDrawRange(0, k/3);
    lgeo.attributes.position.needsUpdate = true;
    g.rotation.y = mouse.x*.3; g.rotation.x = mouse.y*.2;
  };
},

/* -------- PRICING : Ascending Columns -------- */
p1(){
  camera.position.z = 13;
  const g = new THREE.Group(); scene.add(g);
  const bars = [], N = n(22, 10);
  for (let i = 0; i < N; i++){
    const m = new THREE.Mesh(new THREE.BoxGeometry(.5, 4, .5), std(i % 5 === 0 ? C.gold : C.sage, .42));
    m.position.set((i - N/2) * (22/N) * .95, 0, Math.sin(i*.8)*2.2);
    m.userData = { o: i*.35 };
    g.add(m); bars.push(m);
  }
  g.rotation.x = .16;
  return function(){
    bars.forEach(m => {
      const h = 1.6 + (Math.sin(t*.9 + m.userData.o)*.5 + .5)*3.4;
      m.scale.y = h/4; m.position.y = h/2 - 2.6;
    });
    g.rotation.y = mouse.x*.26 + Math.sin(t*.14)*.07;
  };
},

/* -------- ABOUT : Double Helix -------- */
a2(){
  camera.position.z = 11;
  const g = new THREE.Group(); scene.add(g);
  const N = n(54, 20), A = [], B = [], rungs = [];
  for (let i = 0; i < N; i++){
    const a = new THREE.Mesh(new THREE.SphereGeometry(.14, 8, 8), std(C.deep,.72,false));
    const b = new THREE.Mesh(new THREE.SphereGeometry(.14, 8, 8), std(C.gold,.72,false));
    g.add(a, b); A.push(a); B.push(b);
    if (i % 3 === 0){
      const r = new THREE.Mesh(new THREE.CylinderGeometry(.028,.028,1,5), std(C.sage,.32,false));
      g.add(r); rungs.push({ mesh:r, i });
    }
  }
  g.rotation.z = .34;
  return function(){
    for (let i = 0; i < N; i++){
      const y = (i/N - .5)*11, th = i*.42 + t*.55;
      A[i].position.set(Math.cos(th)*1.75, y, Math.sin(th)*1.75);
      B[i].position.set(Math.cos(th+Math.PI)*1.75, y, Math.sin(th+Math.PI)*1.75);
    }
    rungs.forEach(({ mesh, i }) => {
      mesh.position.copy(A[i].position).add(B[i].position).multiplyScalar(.5);
      mesh.scale.y = A[i].position.distanceTo(B[i].position);
      mesh.lookAt(B[i].position); mesh.rotateX(Math.PI/2);
    });
    g.rotation.y = mouse.x*.34;
  };
},

/* -------- CONTACT : Globe with Reach Arcs -------- */
c1(){
  camera.position.z = 9;
  const g = new THREE.Group(); scene.add(g);
  const R = 2.7;
  g.add(new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(R, TIER === 'phone' ? 1 : 2)), line(C.lime,.26)));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(R*.99, 24, 18), std(C.sage,.07,false)));

  const ll = (lat, lon) => new THREE.Vector3(
    R*Math.cos(lat*Math.PI/180)*Math.cos(lon*Math.PI/180),
    R*Math.sin(lat*Math.PI/180),
    R*Math.cos(lat*Math.PI/180)*Math.sin(lon*Math.PI/180));

  const jaipur = ll(26.9, 75.8);
  const hub = new THREE.Mesh(new THREE.SphereGeometry(.13, 10, 10), std(C.gold,.9,false));
  hub.position.copy(jaipur); g.add(hub);

  // US, UK, UAE, Canada, Australia, Japan, Singapore — the markets you serve
  const dests = [[38,-97],[54,-2],[24,54],[56,-106],[-25,133],[35,138],[1,103]]
                  .slice(0, TIER === 'phone' ? 4 : 7);

  const arcs = dests.map(([la, lo]) => {
    const end = ll(la, lo);
    const mid = jaipur.clone().add(end).multiplyScalar(.5).normalize().multiplyScalar(R*1.62);
    const curve = new THREE.QuadraticBezierCurve3(jaipur, mid, end);
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(36)), line(C.gold,.36)));
    const city = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 8), std(C.deep,.8,false));
    city.position.copy(end); g.add(city);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.085, 8, 8), std(C.gold,.9,false));
    g.add(dot);
    return { curve, dot, o: Math.random() };
  });

  return function(){
    g.rotation.y += .0016;
    arcs.forEach(a => a.dot.position.copy(a.curve.getPoint((t*.22 + a.o) % 1)));
    g.rotation.x = mouse.y*.24; g.position.x = mouse.x*.5;
  };
}
};

/* ============================================================
   RUNTIME
   ============================================================ */
function frame(){
  raf = requestAnimationFrame(frame);
  t += .01;
  mouse.x += (target.x - mouse.x)*.05;
  mouse.y += (target.y - mouse.y)*.05;
  try { sceneApi(); }
  catch (err) { console.error('[bg3d] update failed:', err); stop(); return; }
  renderer.render(scene, camera);
}
function start(){ if (!running && sceneApi){ running = true; frame(); } }
function stop(){ running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

function init(){
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias: TIER !== 'phone' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, Q.ratio));
  } catch (err) {
    log('WebGL unavailable: ' + err.message);
    canvas.style.display = 'none';
    return;
  }

  scene  = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, 1, .1, 200);
  scene.add(new THREE.AmbientLight(0xcdd9a8, .95));
  const l1 = new THREE.PointLight(0xbfe06b, 1.1, 80); l1.position.set(6,6,9); scene.add(l1);
  const l2 = new THREE.PointLight(0xd8c48a, .75, 80); l2.position.set(-8,-4,7); scene.add(l2);

  const build = SCENES[KEY];
  if (!build){ log('no scene named ' + KEY); canvas.style.display = 'none'; return; }
  sceneApi = build();

  resize();
  let drawable = 0;
  scene.traverse(o => { if (o.isMesh || o.isLine || o.isPoints || o.isLineSegments) drawable++; });
  log('rendering ' + drawable + ' objects at ' + canvas.width + 'x' + canvas.height);
  addEventListener('resize', resize, { passive:true });

  // Pointer parallax on desktop only — on touch it would fight scrolling.
  if (!matchMedia('(pointer: coarse)').matches){
    addEventListener('pointermove', e => {
      target.x = e.clientX / innerWidth  - .5;
      target.y = e.clientY / innerHeight - .5;
    }, { passive:true });
  }

  // Don't burn battery in a background tab.
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  start();
}

/* Load Three.js after first paint. Two CDNs: if one is blocked or slow on a
   mobile network the second is tried before giving up. */
const CDNS = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js'
];

function loadFrom(i){
  if (i >= CDNS.length){
    log('all CDNs failed — keeping CSS background');
    canvas.style.display = 'none';
    return;
  }
  log('loading three.js (' + (i + 1) + '/' + CDNS.length + ')');
  const s = document.createElement('script');
  s.src = CDNS[i];
  s.async = true;
  s.onload = () => {
    THREE = window.THREE;
    if (THREE) { log('three.js r' + THREE.REVISION + ' loaded'); init(); }
    else loadFrom(i + 1);
  };
  s.onerror = () => { log('CDN ' + (i + 1) + ' failed'); loadFrom(i + 1); };
  document.head.appendChild(s);
}

function boot(){
  log('scene=' + KEY + ' tier=' + TIER + ' ' + innerWidth + 'x' + innerHeight);
  loadFrom(0);
}

if ('requestIdleCallback' in window) requestIdleCallback(boot, { timeout: 2000 });
else setTimeout(boot, 700);

})();
