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
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.03; a *= 0.5; }
  return v;
}

// The "real" image: a colour nebula along a diagonal band. The ASCII pass
// reads its luminance; the cursor reveals it as is.
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float aspect = uRes.x / uRes.y;
  float t = uTime * 0.03;

  vec2 pp = (uPointer - 0.5) * vec2(aspect, 1.0);
  vec2 dp = p - pp;
  float lens = exp(-dot(dp, dp) * 14.0) * (0.3 + 1.2 * uEnergy);
  vec2 np = p + vec2(-dp.y, dp.x) * lens * 0.25 + uMouse * 0.04;

  vec2 q = vec2(fbm(np * 1.2 + vec2(t, 0.0)), fbm(np * 1.2 + vec2(5.2, -t)));
  float n = fbm(np * 1.6 + 2.4 * q + vec2(0.3 * t, -0.5 * t));
  float n2 = fbm(np * 3.1 - 1.7 * q + 9.0);

  float band = exp(-pow(dot(p, normalize(vec2(0.42, 1.0))) * 1.5, 2.0));
  float dens = smoothstep(0.3, 0.88, n) * (0.25 + 0.95 * band);

  vec3 col = vec3(0.012, 0.014, 0.028);
  col += vec3(0.10, 0.15, 0.32) * dens * 1.3;
  col += vec3(1.0, 0.42, 0.14) * pow(smoothstep(0.35, 0.85, n * n2 * 1.7), 2.0) * band * 1.2;
  col += vec3(1.0, 0.9, 0.8) * pow(dens, 5.0) * 0.9;
  o = vec4(col, 1.0);
}`;

const ASCII_FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uCell;
uniform float uGlyphCount;
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

float lumOf(vec3 c) { return dot(c, vec3(0.3, 0.55, 0.15)); }

vec3 shade(vec2 fc) {
  vec2 uv = fc / uRes;
  vec2 cell = floor(fc / uCell);
  vec2 local = fract(fc / uCell);
  vec2 cuv = (cell + 0.5) * uCell / uRes;

  // Real image under the ASCII, plus pinpoint stars at full resolution.
  vec3 real = texture(uField, uv).rgb;
  real = 1.0 - exp(-real * 2.4); // tonemap so the reveal never clips to white
  vec2 sc = floor(fc / 3.0);
  float sh = hash(sc + 3.1);
  float tw = 0.6 + 0.4 * sin(uTime * (0.5 + 2.0 * fract(sh * 77.0)) + sh * 40.0);
  real += vec3(1.0, 0.95, 0.9) * step(0.9975, sh) * tw * 0.9;

  // ASCII: a few quiet glyphs, low opacity, driven by the image luminance.
  float lum = clamp(lumOf(texture(uField, cuv).rgb) * 2.2, 0.0, 0.999);
  float h = hash(cell + 17.0);
  // ASCII stars: each one is born as ".", swells to "+"/"*", then fades out.
  if (h > 0.989) {
    float ph = fract(uTime * (0.06 + 0.12 * fract(h * 91.0)) + h * 37.0);
    float life = smoothstep(0.0, 0.12, ph) * smoothstep(0.55, 0.25, ph);
    lum = max(lum, life * (0.55 + 0.44 * fract(h * 13.0)));
  }
  float idx = floor(lum * uGlyphCount);
  float g = texture(uGlyphs, vec2((idx + local.x) / uGlyphCount, 1.0 - local.y)).r;
  vec3 ascii = mix(vec3(0.55, 0.58, 0.66), vec3(1.0, 0.9, 0.8), lum) * g * (0.18 + 0.55 * lum);

  // Cursor window: inside it the ASCII dissolves into the real image.
  vec2 dpx = (fc - uPointer * uRes) / uRes.y;
  float rad = 0.16 + 0.05 * uEnergy;
  float edge = fbm1(fc * 0.012 + uTime * 0.2) * 0.05;
  float m = smoothstep(rad + 0.02, rad * 0.35, length(dpx) + edge);
  vec3 col = mix(ascii, real + ascii * 0.3, m);

  // Halation: soft mip blur of the image, red-orange fringe.
  vec3 b1 = textureLod(uField, uv, 3.0).rgb;
  vec3 b2 = textureLod(uField, uv, 5.0).rgb;
  float glow = lumOf(b1) * 0.5 + lumOf(b2) * 0.8;
  col += vec3(1.0, 0.3, 0.1) * pow(glow, 1.5) * (0.35 + 0.5 * m);
  col += b1 * 0.12;
  return col;
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uRes;
  vec3 col = shade(fc);

  // Vignette, then animated grain on top.
  vec2 vc = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  col *= smoothstep(1.15, 0.2, length(vc));
  float gr = hash(fc + fract(uTime * 7.31) * vec2(311.0, 173.0)) - 0.5;
  col += gr * 0.085;
  o = vec4(max(col, 0.0), 1.0);
}`;

const GLYPHS = " .:-+*";

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

export function SpaceField() {
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

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const fieldTex = gl.createTexture();
    const fbo = gl.createFramebuffer();
    const glyphTex = gl.createTexture();

    let W = 0, H = 0, FW = 0, FH = 0, cell = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.floor(canvas.clientWidth * dpr);
      H = Math.floor(canvas.clientHeight * dpr);
      canvas.width = W;
      canvas.height = H;
      FW = Math.max(1, Math.floor(W / 4));
      FH = Math.max(1, Math.floor(H / 4));
      cell = Math.round((window.innerWidth < 640 ? 8 : 10) * dpr);

      gl.bindTexture(gl.TEXTURE_2D, fieldTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, FW, FH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fieldTex, 0);
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
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, fieldTex);
      gl.generateMipmap(gl.TEXTURE_2D);

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
      gl.uniform2f(u(asciiProg, "uPointer"), ptr.x, ptr.y);
      gl.uniform1f(u(asciiProg, "uEnergy"), ptr.energy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.activeTexture(gl.TEXTURE0);

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
  }, []);

  return <canvas ref={ref} aria-hidden className="soon-canvas" />;
}
