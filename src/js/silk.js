import * as THREE from 'three';

const vertex = /* glsl */ `
  void main() { gl_Position = vec4(position, 1.0); }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec3 uNoir;
  uniform vec3 uMagenta;
  uniform vec3 uRose;

  // simplex 2D (Ashima)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p = p * 2.04 + vec2(13.7, 7.1);
      a *= 0.5;
    }
    return v * 0.5 + 0.5;
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes.xy;
    float ar = uRes.x / uRes.y;
    vec2 p = uv;
    p.x *= ar;
    // anisotropic stretch for a fabric feel
    p *= vec2(0.7, 1.25);

    float t = uTime * 0.04;

    vec2 m = uMouse;
    m.x *= ar;
    m *= vec2(0.7, 1.25);
    float md = exp(-distance(p, m) * 2.2) * 0.3;

    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t * 0.7));
    vec2 r = vec2(
      fbm(p + 1.5 * q + vec2(1.7, 9.2) + t * 1.1 + md),
      fbm(p + 1.5 * q + vec2(8.3, 2.8) - t * 0.9)
    );
    float f = fbm(p + 1.4 * r);

    // silk folds: soft sheen bands along the flow
    float folds = pow(0.5 + 0.5 * sin(f * 5.0 + r.x * 3.0 - t * 1.6), 3.0);

    vec3 col = uNoir;
    col = mix(col, uMagenta, smoothstep(0.5, 1.08, f) * 0.42);
    col = mix(col, uRose, folds * smoothstep(0.5, 0.95, r.y) * 0.13);
    col += uRose * md * 0.16;

    // vignette to keep edges deep noir
    float vig = smoothstep(1.1, 0.3, length(uv - 0.5));
    col *= mix(0.55, 1.0, vig);

    // grain
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.028;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const hex = (h) => new THREE.Color(h);

export function initSilk(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'low-power' });
  } catch {
    return null; // fallback: CSS gradient already behind canvas
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uNoir: { value: hex('#0F0A0E') },
    uMagenta: { value: hex('#C4067E') },
    uRose: { value: hex('#E8A8C8') },
  };

  scene.add(new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms })
  ));

  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = e.clientX / window.innerWidth;
    mouse.ty = 1 - e.clientY / window.innerHeight;
  }, { passive: true });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
  }
  resize();
  window.addEventListener('resize', resize);

  let visible = true;
  let raf = null;
  const clock = new THREE.Clock();

  function frame() {
    raf = null;
    if (!visible || document.hidden) return;
    uniforms.uTime.value = clock.getElapsedTime();
    // smooth mouse follow
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    uniforms.uMouse.value.set(mouse.x, mouse.y);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  const start = () => { if (!raf) raf = requestAnimationFrame(frame); };

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  }).observe(canvas);

  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });

  start();
  return renderer;
}
