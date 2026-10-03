"use client";

import { useEffect, useRef } from "react";

// Two passes: a quarter-res "field" pass (nebula + eclipse ring) with mipmaps,
// then a full-res pass that turns the field into ASCII glyphs. The mip chain of
// the field doubles as a cheap wide blur for the halation glow.

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FIELD_FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uPointer;
uniform float uEnergy;
uniform float uBloom;
out vec4 o;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 2.03; a *= 0.5; }
  return v;
}
float sdSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
}

// One lily tepal: pointed blade along angle ang, bent by curl.
// Returns (coverage, shading) with a bright midrib and a lit rim.
vec2 petal(vec2 p, float ang, float L, float W, float curl) {
  vec2 d = vec2(cos(ang), sin(ang));
  vec2 q = vec2(dot(p, d), dot(p, vec2(-d.y, d.x)));
  float x = q.x / L;
  float xc = clamp(x, 0.0, 1.0);
  q.y -= curl * xc * xc * L;
  float w = W * L * pow(sin(3.14159 * pow(xc, 1.35)), 0.8) * (0.25 + 0.75 * smoothstep(0.0, 0.3, xc));
  float e = w - abs(q.y);
  float cov = smoothstep(0.0, 0.004, e) * step(0.0, x) * step(x, 1.0);
  float mid = exp(-pow(q.y / (w + 1e-4), 2.0) * 5.0);
  float rim = smoothstep(0.012, 0.0, e) * cov;
  float veins = 0.5 + 0.5 * sin(q.y / (w + 1e-4) * 9.0);
  mid *= 1.0;
  return vec2(cov, 0.4 + 0.35 * mid * (1.0 - 0.4 * xc) + 0.05 * veins * xc + 0.45 * rim);
}

// Lily: three back tepals, three front ones, stamens with orange anthers,
// a stem with two leaves and a closed bud. Output rgb + alpha = 1 - flower.
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float aspect = uRes.x / uRes.y;
  float t = uTime;
  float S = aspect > 1.0 ? 0.38 : 0.4 * aspect;

  // Cursor: petals part around it, the whole flower leans toward it.
  vec2 pp = (uPointer - 0.5) * vec2(aspect, 1.0);
  vec2 dp = p - pp;
  p -= dp * exp(-dot(dp, dp) * 30.0) * (0.12 + 0.25 * uEnergy);
  vec2 c = (aspect > 1.0 ? vec2(0.5 * aspect - 0.47, 0.09) : vec2(0.0, 0.2)) + clamp(pp, -0.6, 0.6) * 0.025 + uMouse * 0.01;
  vec2 f = p - c;

  // Wind: layered gusts. The head drifts and leans, the stem bends to follow.
  float wind = 0.55 * sin(t * 0.55) + 0.3 * sin(t * 1.37 + 1.3) + 0.25 * (noise(vec2(t * 0.35, 3.0)) - 0.5) * 2.0;
  float flutter = 0.5 + 0.5 * abs(wind);
  vec2 base = vec2(c.x + 0.05, -0.62);
  c += vec2(wind * 0.022, -abs(wind) * 0.006);
  f = p - c;

  float open = uBloom;
  float L = S * mix(0.35, 1.0, open);
  float spin = 0.35 + 0.07 * wind;

  float cov = 0.0;
  float sh = 0.0;
  for (int i = 0; i < 3; i++) {
    float a = spin + 3.14159 / 3.0 + float(i) * 2.0944 + 0.035 * flutter * sin(t * 2.3 + float(i) * 2.0);
    vec2 pt = petal(f, a, L * 0.92, mix(0.08, 0.17, open), 0.14 + 0.05 * wind);
    sh = mix(sh, pt.y * 0.8, pt.x);
    cov = max(cov, pt.x);
  }
  for (int i = 0; i < 3; i++) {
    float a = spin + float(i) * 2.0944 + 0.04 * flutter * sin(t * 2.9 + float(i) * 1.3);
    vec2 pt = petal(f, a, L, mix(0.08, 0.2, open), -0.2 + 0.06 * wind * sin(float(i) * 2.1 + 0.5));
    sh = mix(sh, pt.y, pt.x);
    cov = max(cov, pt.x);
  }

  // Throat: warm green-yellow glow at the heart of the flower.
  float r = length(f);
  vec3 petalCol = vec3(1.0, 0.97, 0.92) * (1.0 + 0.25 * exp(-r / (0.12 * L)));
  vec3 col = petalCol * sh * cov;

  // Stamens and pistil, drawn over the petals.
  float stam = 0.0;
  float anth = 0.0;
  for (int i = 0; i < 6; i++) {
    float a = spin + 0.3 + float(i) * 1.0472 + 0.06 * flutter * sin(t * 3.4 + float(i));
    vec2 d = vec2(cos(a), sin(a));
    vec2 n = vec2(-d.y, d.x);
    vec2 mid = d * L * 0.3 + n * L * 0.04;
    vec2 tip = d * L * 0.58 * open + n * L * 0.02;
    stam = max(stam, smoothstep(0.007, 0.002, min(sdSeg(f, vec2(0.0), mid), sdSeg(f, mid, tip))));
    vec2 q = f - tip;
    q = vec2(dot(q, n), dot(q, d));
    anth = max(anth, smoothstep(1.0, 0.6, length(q / vec2(0.06 * L, 0.022 * L))));
  }
  vec2 pistTip = vec2(cos(spin + 1.9), sin(spin + 1.9)) * L * 0.68 * open;
  stam = max(stam, smoothstep(0.007, 0.002, sdSeg(f, vec2(0.0), pistTip)));
  float knob = smoothstep(0.016 * L / 0.4, 0.0, length(f - pistTip) - 0.008);
  col = mix(col, vec3(0.95, 0.92, 0.86), stam * 0.9);
  col = mix(col, vec3(1.0), knob);
  col = mix(col, vec3(1.0, 0.98, 0.95) * 1.3, anth);
  float flower = max(max(cov, stam), max(anth, knob));

  // Stem, leaves and bud behind the flower.
  float sway = 0.12 * wind;
  float sv = clamp((p.y - base.y) / (c.y - base.y), 0.0, 1.0);
  float sx = mix(base.x, c.x, sv * sv) + 0.02 * sin(sv * 3.0);
  float stem = smoothstep(0.006, 0.002, abs(p.x - sx)) * step(p.y, c.y - 0.05);
  vec2 l1 = petal(p - vec2(sx, c.y - 0.55 * S), -0.55 + sway, S * 0.9, 0.14, 0.18);
  vec2 l2 = petal(p - vec2(sx, c.y - 0.85 * S), 3.14159 + 0.75 + sway, S * 0.8, 0.14, -0.15);
  vec2 budBase = c + vec2(0.18, 0.12) * S / 0.4;
  float budStem = smoothstep(0.005, 0.002, sdSeg(p, c + vec2(0.02, -0.08) * S / 0.4, budBase));
  vec2 bud = petal(p - budBase, 1.15 + sway * 2.0, S * 0.55, 0.16, 0.05);
  float leaf = max(l1.x, l2.x);
  vec3 back = vec3(0.32, 0.31, 0.3) * max(stem, budStem) + vec3(0.36, 0.35, 0.33) * leaf * (l1.x > 0.0 ? l1.y : l2.y);
  back = mix(back, vec3(0.95, 0.95, 0.82) * bud.y, bud.x);
  float backMask = max(max(stem, budStem), max(leaf, bud.x));
  col = mix(back * backMask, col, flower);

  // Faint nebula behind everything.
  // Space behind: the colour nebula band from the first version.
  float tn = t * 0.03;
  vec2 q2 = vec2(fbm(p * 1.2 + vec2(tn, 0.0)), fbm(p * 1.2 + vec2(5.2, -tn)));
  float n = fbm(p * 1.6 + 2.4 * q2 + vec2(0.3 * tn, -0.5 * tn));
  float n2 = fbm(p * 3.1 - 1.7 * q2 + 9.0);
  float band = exp(-pow(dot(p, normalize(vec2(0.42, 1.0))) * 1.5, 2.0));
  float dens = smoothstep(0.3, 0.88, n) * (0.25 + 0.95 * band);
  vec3 bg = vec3(0.012, 0.014, 0.028);
  bg += vec3(0.10, 0.15, 0.32) * dens * 1.5;
  bg += vec3(1.0, 0.42, 0.14) * pow(smoothstep(0.35, 0.85, n * n2 * 1.7), 2.0) * band * 0.5;
  bg += vec3(1.0, 0.9, 0.8) * pow(dens, 5.0) * 0.6;
  float any = max(flower, backMask);
  col = mix(bg, col, any);
  o = vec4(col, 1.0 - any);
}`;

const ASCII_FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uCell;
uniform float uGlyphCount;
uniform float uRamp;
uniform vec4 uClear0; // text boxes kept free of glyphs: center xy, half size zw (device px, y up)
uniform vec4 uClear1;
uniform sampler2D uField;
uniform sampler2D uGlyphs;
uniform vec2 uPointer;
uniform float uEnergy;
out vec4 o;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }

float fbm1(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y) - 0.5;
}

float sdBox(vec2 p, vec2 b) { vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }

vec3 shade(vec2 fc) {
  vec2 uv = fc / uRes;
  vec2 cell = floor(fc / uCell);
  vec2 local = fract(fc / uCell);
  vec2 cuv = (cell + 0.5) * uCell / uRes;
  vec4 f = texture(uField, cuv);

  // Cursor light: lifts nearby glyphs and scrambles them for a beat.
  vec2 dpx = (cuv - uPointer) * uRes / uRes.y;
  float rad = 0.14 + 0.05 * uEnergy;
  float edge = fbm1(fc * 0.012 + uTime * 0.2) * 0.04;
  float m = smoothstep(rad + 0.03, rad * 0.2, length(dpx) + edge);

  float fl = dot(f.rgb, vec3(0.3, 0.55, 0.15));
  float nebL = smoothstep(0.22, 0.5, fl * 1.9) * fl * 1.9;
  float lum = clamp((f.a > 0.5 ? nebL : pow(fl, 1.4) * 1.0) + m * (0.12 + 0.25 * fl), 0.0, 0.999);

  // ASCII stars: each one is born as ".", swells to "+"/"*", then fades out.
  float h = hash(cell + 17.0);
  if (h > 0.9955 && f.a > 0.5) {
    float ph = fract(uTime * (0.06 + 0.12 * fract(h * 91.0)) + h * 37.0);
    float life = smoothstep(0.0, 0.12, ph) * smoothstep(0.55, 0.25, ph);
    lum = max(lum, life * (0.55 + 0.44 * fract(h * 13.0)));
  }
  float idx = floor(lum * uRamp);

  // Contours: where the image has a strong edge near the flower, draw it
  // with a glyph aligned to the edge so the shape reads as a drawing.
  vec2 px = uCell / uRes;
  vec4 fx1 = texture(uField, cuv + vec2(px.x, 0.0)), fx0 = texture(uField, cuv - vec2(px.x, 0.0));
  vec4 fy1 = texture(uField, cuv + vec2(0.0, px.y)), fy0 = texture(uField, cuv - vec2(0.0, px.y));
  vec3 W3 = vec3(0.3, 0.55, 0.15);
  vec2 grad = vec2(dot(fx1.rgb - fx0.rgb, W3), dot(fy1.rgb - fy0.rgb, W3));
  float near = 1.0 - min(min(fx1.a, fx0.a), min(min(fy1.a, fy0.a), f.a));
  float mag = length(grad);
  bool contour = near > 0.5 && mag > 0.22;
  if (contour) {
    float a = mod(atan(grad.y, grad.x) + 0.3927, 3.14159);
    float k = floor(a / 0.7854);
    idx = uRamp + k;
    lum = max(lum, 0.8);
  }
  float flick = hash(cell + floor(uTime * 12.0));
  if (lum > 0.08 && flick < m * 0.35) idx = floor(hash(cell * 1.7 + floor(uTime * 12.0)) * uRamp);
  float g = texture(uGlyphs, vec2((idx + local.x) / uGlyphCount, 1.0 - local.y)).r;
  vec2 cc = (cell + 0.5) * uCell;
  float clr = min(sdBox(cc - uClear0.xy, uClear0.zw), sdBox(cc - uClear1.xy, uClear1.zw)) - uCell * 2.0;
  g *= smoothstep(0.0, uCell * 5.0, clr);
  vec3 tint = contour ? vec3(1.0) : (f.a < 0.5 ? vec3(0.91, 0.89, 0.855) : vec3(0.79, 0.8, 0.88) * 0.85);
  vec3 col = tint * g * (contour ? 1.0 : 0.14 + 0.75 * lum) * (1.0 + 0.6 * m);

  // Halation: neutral bloom from the mip chain, strongest just outside bright shapes.
  vec3 b1 = textureLod(uField, uv, 3.0).rgb;
  vec3 b2 = textureLod(uField, uv, 5.0).rgb;
  float l1 = dot(b1, vec3(0.3, 0.55, 0.15));
  float l2 = dot(b2, vec3(0.3, 0.55, 0.15));
  // Smooth inside/outside mask from the mip chain (the point-sampled one is blocky).
  vec4 s1 = textureLod(uField, uv, 1.5);
  float out_ = smoothstep(0.15, 0.85, s1.a);
  float inL = dot(s1.rgb, W3) * (1.0 - out_);
  float glow = max(l2 * 1.2 - fl, 0.0) * out_;
  col += vec3(1.0, 0.29, 0.11) * pow(glow, 1.3) * (0.55 + 0.35 * m);
  // Space: the nebula colour as a smooth wash, glyphs stay neutral.
  col += b2 * out_ * 0.22;
  // Inside the flower: a soft cream light so petals glow instead of going black.
  col += vec3(0.91, 0.89, 0.855) * inL * 0.22;
  // Mist filter: lifted blacks and a soft neutral bloom.
  col += vec3(l2) * 0.05 + vec3(0.012, 0.011, 0.016);
  return col;
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uRes;
  o = vec4(max(shade(fc), 0.0), 1.0);
}`;

// Lens pass over the finished ASCII frame: overall softness, mist bloom,
// red halation around anything bright, vignette and grain.
const POST_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uScene;
uniform vec2 uRes;
uniform float uTime;
out vec4 o;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }

vec3 blur(vec2 uv, float lod) {
  vec2 d = exp2(lod) / uRes * 0.75;
  return 0.25 * (textureLod(uScene, uv + vec2(d.x, d.y), lod).rgb + textureLod(uScene, uv + vec2(-d.x, d.y), lod).rgb
               + textureLod(uScene, uv + vec2(d.x, -d.y), lod).rgb + textureLod(uScene, uv + vec2(-d.x, -d.y), lod).rgb);
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uRes;
  vec3 W3 = vec3(0.3, 0.55, 0.15);
  vec3 sharp = texture(uScene, uv).rgb;
  vec3 s1 = blur(uv, 0.8);
  vec3 s3 = blur(uv, 3.0);
  vec3 s5 = blur(uv, 5.0);

  vec3 col = mix(sharp, s1, 0.5);
  col += s3 * 0.22 + s5 * 0.12;
  float halo = max(dot(s3, W3) * 1.3 + dot(s5, W3) * 1.1 - dot(sharp, W3) * 0.6, 0.0);
  col += vec3(1.0, 0.29, 0.11) * halo * 0.28;

  vec2 vc = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  col *= smoothstep(1.15, 0.2, length(vc));
  float gr = hash(fc + fract(uTime * 7.31) * vec2(311.0, 173.0)) - 0.5;
  col += gr * 0.1;
  o = vec4(max(col, 0.0), 1.0);
}`;

// 0-5: luminance ramp, 6-9: contour glyphs picked by edge direction.
const GLYPHS = " .:-+*|\\-/";
const RAMP = 6;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

function program(gl: WebGL2RenderingContext, frag: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.bindAttribLocation(p, 0, "aPos");
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  return p;
}

function glyphAtlas(cell: number) {
  const c = document.createElement("canvas");
  c.width = cell * GLYPHS.length;
  c.height = cell;
  const ctx = c.getContext("2d")!;
  const mono = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#fff";
  ctx.font = `${Math.round(cell * 0.92)}px ${mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < GLYPHS.length; i++) ctx.fillText(GLYPHS[i], i * cell + cell / 2, cell / 2 + cell * 0.04);
  return c;
}

export function SpaceField({ clearSelectors = [] }: { clearSelectors?: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) return; // CSS background stays as fallback

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let disposed = false;

    const fieldProg = program(gl, FIELD_FRAG);
    const asciiProg = program(gl, ASCII_FRAG);
    const postProg = program(gl, POST_FRAG);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const fieldTex = gl.createTexture();
    const fbo = gl.createFramebuffer();
    const glyphTex = gl.createTexture();
    const sceneTex = gl.createTexture();
    const sceneFbo = gl.createFramebuffer();

    let W = 0, H = 0, FW = 0, FH = 0, cell = 0;
    const clear = [new Float32Array([-1e4, -1e4, 1, 1]), new Float32Array([-1e4, -1e4, 1, 1])];
    const measureClear = (dpr: number) => {
      const top = canvas.getBoundingClientRect().top;
      clearSelectors.forEach((sel, i) => {
        const el = sel ? document.querySelector(sel) : null;
        if (!el || i > 1) return;
        const r = el.getBoundingClientRect();
        clear[i].set([(r.left + r.width / 2) * dpr, H - (r.top - top + r.height / 2) * dpr, (r.width / 2) * dpr, (r.height / 2) * dpr]);
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.floor(canvas.clientWidth * dpr);
      H = Math.floor(canvas.clientHeight * dpr);
      canvas.width = W;
      canvas.height = H;
      FW = Math.max(1, Math.floor(W / 4));
      FH = Math.max(1, Math.floor(H / 4));
      cell = Math.round((window.innerWidth < 640 ? 7 : 8) * dpr);
      measureClear(dpr);

      gl.bindTexture(gl.TEXTURE_2D, fieldTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, FW, FH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fieldTex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      gl.bindTexture(gl.TEXTURE_2D, sceneTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      gl.bindTexture(gl.TEXTURE_2D, glyphTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glyphAtlas(cell));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    // Pointer in uv space (y up). On touch screens an autopilot wanders after
    // 3s idle; on desktop the window only follows the real mouse.
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const autopilot = !window.matchMedia("(hover: hover)").matches;
    const ptr = { x: 0.5, y: autopilot ? 0.5 : -2, tx: 0.5, ty: autopilot ? 0.5 : -2, energy: 0, last: -1e9 };
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = 1 - e.clientY / window.innerHeight;
      ptr.energy = Math.min(1, ptr.energy + Math.hypot(nx - ptr.tx, ny - ptr.ty) * 6);
      ptr.tx = nx;
      ptr.ty = ny;
      ptr.last = performance.now();
      mouse.tx = (nx - 0.5) * 2;
      mouse.ty = (ny - 0.5) * 2;
    };

    const u = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const start = performance.now();

    const draw = (now: number) => {
      const time = reduced ? 40 : (now - start) / 1000 + 40;
      if (autopilot && now - ptr.last > 3000) {
        const a = time * 0.18;
        ptr.tx = 0.5 + 0.28 * Math.sin(a * 1.3);
        ptr.ty = 0.5 + 0.22 * Math.sin(a * 0.9 + 1.2);
      }
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      ptr.x += (ptr.tx - ptr.x) * 0.09;
      ptr.y += (ptr.ty - ptr.y) * 0.09;
      ptr.energy *= 0.94;

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, FW, FH);
      gl.useProgram(fieldProg);
      gl.uniform2f(u(fieldProg, "uRes"), FW, FH);
      gl.uniform1f(u(fieldProg, "uTime"), time);
      gl.uniform2f(u(fieldProg, "uMouse"), mouse.x, mouse.y);
      gl.uniform2f(u(fieldProg, "uPointer"), ptr.x, ptr.y);
      gl.uniform1f(u(fieldProg, "uEnergy"), ptr.energy);
      const b = reduced ? 1 : Math.min(1, (now - start) / 1800);
      gl.uniform1f(u(fieldProg, "uBloom"), 1 - Math.pow(1 - b, 3));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, fieldTex);
      gl.generateMipmap(gl.TEXTURE_2D);

      gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFbo);
      gl.viewport(0, 0, W, H);
      gl.useProgram(asciiProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fieldTex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, glyphTex);
      gl.uniform1i(u(asciiProg, "uField"), 0);
      gl.uniform1i(u(asciiProg, "uGlyphs"), 1);
      gl.uniform2f(u(asciiProg, "uRes"), W, H);
      gl.uniform1f(u(asciiProg, "uTime"), time);
      gl.uniform1f(u(asciiProg, "uCell"), cell);
      gl.uniform1f(u(asciiProg, "uGlyphCount"), GLYPHS.length);
      gl.uniform1f(u(asciiProg, "uRamp"), RAMP);
      gl.uniform4fv(u(asciiProg, "uClear0"), clear[0]);
      gl.uniform4fv(u(asciiProg, "uClear1"), clear[1]);
      gl.uniform2f(u(asciiProg, "uPointer"), ptr.x, ptr.y);
      gl.uniform1f(u(asciiProg, "uEnergy"), ptr.energy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sceneTex);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.useProgram(postProg);
      gl.uniform1i(u(postProg, "uScene"), 0);
      gl.uniform2f(u(postProg, "uRes"), W, H);
      gl.uniform1f(u(postProg, "uTime"), time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reduced && !disposed) raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      if (reduced) draw(performance.now());
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(draw);
    };

    document.fonts.ready.then(() => {
      if (disposed) return;
      resize();
      raf = requestAnimationFrame(draw);
      canvas.dataset.ready = "1";
    });

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [clearSelectors.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={ref} aria-hidden className="soon-canvas" />;
}
