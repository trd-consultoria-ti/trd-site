/**
 * iOS 26.1 Liquid Glass Optical Mathematics & SVG Filter Engine (MIT, adapted from 0kzh/glisse).
 * - Display P3 safe: generates separated greyscale X/Y displacement maps with 0.5 orthogonal alpha.
 * - Calibrated 1.22px directional specular rim + 0.5px crisp edge highlight.
 * - Snell's law bezel refraction (n=1.5) over squircle profile capped at 30% of shorter side (max 36px).
 * - Superellipse (n=4.2) geometric squircle clip-path fallback when CSS corner-shape: squircle is absent.
 */

export interface GlassShape {
  width: number;
  height: number;
  radius: number;
}

export interface BezelOptions {
  strength: number;
  dispersion: number;
  depth: number;
  maxDepth: number;
  relative: boolean;
  bezel: boolean;
}

export const GLASS_BEZEL_OPTIONS: BezelOptions = {
  strength: 2,
  dispersion: 0.6,
  depth: 0.3,
  maxDepth: 36,
  relative: true,
  bezel: true
};

export const RIM_WIDTH = 1.22;
export const EDGE_WIDTH = 0.5;
const MAX_CACHE_ENTRIES = 32;
const SVG_NS = 'http://www.w3.org/2000/svg';

type RgbaColour = readonly [number, number, number, number];

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const NATIVE_SQUIRCLE_EXPONENT = 4.265;

interface BoxSdfSample {
  distance: number;
  nx: number;
  ny: number;
}

function sampleBoxSdf(
  x: number,
  y: number,
  halfWidth: number,
  halfHeight: number,
  radius: number,
  exponent = 2
): BoxSdfSample {
  const c = clamp(radius, 0, Math.min(halfWidth, halfHeight));
  const qx = Math.abs(x) - halfWidth + c;
  const qy = Math.abs(y) - halfHeight + c;
  if (qx > 0 && qy > 0 && c > 0) {
    if (exponent <= 2.01) {
      const len = Math.hypot(qx, qy) || 1;
      return {
        distance: len - c,
        nx: (Math.sign(x) * qx) / len,
        ny: (Math.sign(y) * qy) / len
      };
    }
    const lp = (qx ** exponent + qy ** exponent) ** (1 / exponent);
    const invLp = lp > 1e-6 ? 1 / lp : 0;
    const gx = (qx * invLp) ** (exponent - 1);
    const gy = (qy * invLp) ** (exponent - 1);
    const gradNorm = Math.hypot(gx, gy) || 1;
    return {
      distance: (lp - c) / gradNorm,
      nx: (Math.sign(x) * gx) / gradNorm,
      ny: (Math.sign(y) * gy) / gradNorm
    };
  }
  if (qx > qy) {
    return { distance: Math.max(qx, qy) - c, nx: Math.sign(x), ny: 0 };
  }
  return { distance: Math.max(qx, qy) - c, nx: 0, ny: Math.sign(y) };
}

export function signedBoxDistance(
  x: number,
  y: number,
  halfWidth: number,
  halfHeight: number,
  radius: number,
  cornerExponent = 2
): number {
  return sampleBoxSdf(x, y, halfWidth, halfHeight, radius, cornerExponent).distance;
}

// Precomputed 256-sample Snell's law refraction profile over a squircle bezel (n = 1.5)
const BEZEL_PROFILE: Float32Array = (() => {
  const samples = new Float32Array(256);
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = Math.max(0.004, i / (samples.length - 1));
    const surface = (1 - (1 - t) ** 4) ** 0.25;
    const incident = Math.atan((1 - t) ** 3 / surface ** 3);
    const refracted = Math.asin(Math.sin(incident) / 1.5);
    const shift = Math.tan(incident - refracted) * (0.6 + surface);
    samples[i] = shift;
    if (shift > peak) peak = shift;
  }
  if (peak > 0) {
    for (let i = 0; i < samples.length; i++) {
      samples[i] = samples[i] / peak;
    }
  }
  return samples;
})();

function sampleBezel(t: number): number {
  const at = clamp(t, 0, 1) * (BEZEL_PROFILE.length - 1);
  const lower = Math.floor(at);
  const a = BEZEL_PROFILE[lower] ?? 0;
  const b = BEZEL_PROFILE[Math.min(lower + 1, BEZEL_PROFILE.length - 1)] ?? a;
  return a + (b - a) * (at - lower);
}

export function bezelDepthOf(shape: GlassShape, options: BezelOptions = GLASS_BEZEL_OPTIONS): number {
  const raw = options.depth * (options.relative ? Math.min(shape.width, shape.height) : 1);
  return Math.min(raw, options.maxDepth);
}

export function shapeOf(element: HTMLElement, style?: CSSStyleDeclaration): GlassShape | null {
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  if (!width || !height) return null;
  const computed = style ?? getComputedStyle(element);
  const radii = [
    computed.borderTopLeftRadius,
    computed.borderTopRightRadius,
    computed.borderBottomRightRadius,
    computed.borderBottomLeftRadius
  ].map((corner) =>
    corner?.endsWith('%')
      ? (Math.min(width, height) * parseFloat(corner)) / 100
      : parseFloat(corner || '0') || 0
  );
  const radius = clamp(Math.max(...radii), 0, Math.min(width / 2, height / 2));
  return { width, height, radius };
}

// --- Engine Detection ---

export function isWebKitEngine(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /AppleWebKit\//.test(ua) && !/Chrom(?:e|ium)\/|Edg\//.test(ua);
}

export function isBlinkEngine(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Chrom(?:e|ium)\//.test(navigator.userAgent);
}

export function supportsBlinkBackdropSvg(): boolean {
  if (!isBlinkEngine()) return false;
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') return false;
  return CSS.supports('backdrop-filter', 'url(#trd-lg-probe)');
}

export function supportsNativeSquircle(): boolean {
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') return false;
  return CSS.supports('corner-shape', 'squircle');
}

// --- Singleton Hidden SVG <defs> ---

let sharedDefs: SVGDefsElement | undefined;
let filterSeq = 0;

export function createSvgEl(name: string, attrs: Record<string, string | number>): SVGElement {
  const el = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, String(v));
  }
  return el;
}

export function svgDefsContainer(): SVGDefsElement {
  if (sharedDefs?.isConnected) return sharedDefs;
  const root = createSvgEl('svg', {
    width: 0,
    height: 0,
    'aria-hidden': 'true',
    'data-trd-lg-defs': 'true'
  });
  root.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;');
  sharedDefs = createSvgEl('defs', {}) as SVGDefsElement;
  root.append(sharedDefs);
  document.body.append(root);
  return sharedDefs;
}

// --- Bounded Cache Helper ---

function setBounded<K, V>(map: Map<K, V>, key: K, value: V, onEvict?: (v: V) => void): void {
  if (map.has(key)) {
    map.delete(key);
  } else if (map.size >= MAX_CACHE_ENTRIES) {
    const oldest = map.keys().next();
    if (!oldest.done) {
      const evicted = map.get(oldest.value);
      map.delete(oldest.value);
      if (evicted !== undefined && onEvict) onEvict(evicted);
    }
  }
  map.set(key, value);
}

// --- Calibrated 1.22px Specular Rim Map ---

export function computeRimMap(
  shape: GlassShape,
  shine: number,
  density: number,
  edge: RgbaColour = [0, 0, 0, 0],
  cornerExponent = 2
): { columns: number; rows: number; data: Uint8ClampedArray } {
  const { width, height, radius } = shape;
  const columns = Math.max(1, Math.round(width * density));
  const rows = Math.max(1, Math.round(height * density));
  const data = new Uint8ClampedArray(columns * rows * 4);
  const halfW = width / 2;
  const halfH = height / 2;
  const corner = clamp(radius, 0, Math.min(halfW, halfH));
  const halfPx = 0.5 / density;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = ((col + 0.5) / columns) * width - halfW;
      const y = ((row + 0.5) / rows) * height - halfH;
      const sdf = sampleBoxSdf(x, y, halfW, halfH, corner, cornerExponent);
      const depth = -sdf.distance;
      if (depth < -halfPx || depth > 2 * RIM_WIDTH) continue;

      const { nx, ny } = sdf;

      const facing = Math.abs(nx + ny);
      const along = Math.max(0, depth) / (RIM_WIDTH * Math.sqrt(Math.max(1, facing)));
      const cover = clamp((depth + halfPx) * density, 0, 1);
      const lined = clamp((Math.min(EDGE_WIDTH, depth + halfPx) - Math.max(0, depth - halfPx)) * density, 0, 1);
      const light = along < 1 ? shine * Math.min(1, facing) ** 1.5 * (1 - along ** 1.5) * cover : 0;
      const line = edge[3] * lined * (1 - light);
      const alpha = light + line;
      if (alpha <= 0) continue;

      const idx = (row * columns + col) * 4;
      data[idx] = Math.round((255 * light + edge[0] * line) / alpha);
      data[idx + 1] = Math.round((255 * light + edge[1] * line) / alpha);
      data[idx + 2] = Math.round((255 * light + edge[2] * line) / alpha);
      data[idx + 3] = Math.round(255 * clamp(alpha, 0, 1));
    }
  }

  return { columns, rows, data };
}

let colourProbeCtx: CanvasRenderingContext2D | null | undefined;
const rimUrlCache = new Map<string, string>();

function parseCssRgba(colour: string): RgbaColour {
  if (!colour || colour === 'transparent') return [0, 0, 0, 0];
  colourProbeCtx ??= document.createElement('canvas').getContext('2d');
  if (!colourProbeCtx) return [0, 0, 0, 0];
  colourProbeCtx.fillStyle = '#0000';
  colourProbeCtx.fillStyle = colour;
  const serialized = String(colourProbeCtx.fillStyle);
  if (serialized.startsWith('#')) {
    const r = parseInt(serialized.slice(1, 3), 16);
    const g = parseInt(serialized.slice(3, 5), 16);
    const b = parseInt(serialized.slice(5, 7), 16);
    return [r, g, b, 1];
  }
  const parts = (serialized.match(/[\d.]+/g) ?? []).map(Number);
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, parts[3] ?? 1];
}

export function paintCalibratedRim(element: HTMLElement): void {
  if (typeof document === 'undefined') return;
  const style = getComputedStyle(element);
  const shape = shapeOf(element, style);
  if (!shape) return;

  const isDark =
    document.documentElement.classList.contains('dark') ||
    document.documentElement.getAttribute('data-theme') === 'dark';
  const rawShine = parseFloat(style.getPropertyValue('--lg-rim-shine'));
  const shine = Number.isFinite(rawShine) ? clamp(rawShine, 0, 1) : isDark ? 0.13 : 0.3;
  const edge = parseCssRgba(style.getPropertyValue('--lg-edge').trim());
  const density = Math.min(window.devicePixelRatio || 1, 3);
  const cornerExponent = supportsNativeSquircle() ? NATIVE_SQUIRCLE_EXPONENT : 2;
  const key = `${Math.round(shape.width)}x${Math.round(shape.height)}|${shape.radius.toFixed(1)}|${cornerExponent}|${shine.toFixed(2)}|${edge.join(',')}|${density}`;

  let cssUrl = rimUrlCache.get(key);
  if (!cssUrl) {
    const { columns, rows, data } = computeRimMap(shape, shine, density, edge, cornerExponent);
    const canvas = document.createElement('canvas');
    canvas.width = columns;
    canvas.height = rows;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(columns, rows);
    img.data.set(data);
    ctx.putImageData(img, 0, 0);
    cssUrl = `url("${canvas.toDataURL()}")`;
    setBounded(rimUrlCache, key, cssUrl);
  }

  element.style.setProperty('--lg-rim', cssUrl);
  element.setAttribute('data-lg-rim', '');
}

// --- Greyscale Bezel Displacement Field & Maps (Immune to Chrome Display P3 Bug) ---

export function computeLensField(
  shape: GlassShape,
  options: BezelOptions = GLASS_BEZEL_OPTIONS,
  density = 2,
  cornerExponent = 2
): { columns: number; rows: number; data: Float32Array } {
  const { width, height, radius } = shape;
  const columns = Math.max(1, Math.round(width * density));
  const rows = Math.max(1, Math.round(height * density));
  const data = new Float32Array(columns * rows * 4);
  const halfW = width / 2;
  const halfH = height / 2;
  const depth = bezelDepthOf(shape, options);
  const round = clamp(Math.max(radius, depth), 0, Math.min(halfW, halfH));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = ((col + 0.5) / columns) * width - halfW;
      const y = ((row + 0.5) / rows) * height - halfH;
      const edge = signedBoxDistance(x, y, halfW, halfH, radius, cornerExponent);
      if (edge >= 0) continue;

      let px = 0;
      let py = 0;
      let amount = 0;
      if (depth > 0 && -edge < depth) {
        const bevelSdf = sampleBoxSdf(x, y, halfW, halfH, round, cornerExponent);
        px = bevelSdf.nx;
        py = bevelSdf.ny;
        amount = sampleBezel(-edge / depth);
      }

      const bends = Math.min(1, amount * 20, -edge);
      const idx = (row * columns + col) * 4;
      data[idx] = px * amount;
      data[idx + 1] = py * amount;
      data[idx + 2] = Math.max(0, bends);
      data[idx + 3] = clamp(-edge, 0, 1);
    }
  }

  return { columns, rows, data };
}

interface EncodedGreyMaps {
  across: string;
  down: string;
  alphaMask: string;
}

const greyMapCache = new Map<string, EncodedGreyMaps>();

function encodeGreyscaleBezelMaps(
  shape: GlassShape,
  options: BezelOptions,
  density: number,
  cornerExponent = 2
): EncodedGreyMaps | null {
  const key = `${Math.round(shape.width)}x${Math.round(shape.height)}|${shape.radius.toFixed(1)}|${cornerExponent}|${density}`;
  const cached = greyMapCache.get(key);
  if (cached) return cached;

  const field = computeLensField(shape, options, density, cornerExponent);
  const { columns, rows, data } = field;
  const acrossData = new Uint8ClampedArray(columns * rows * 4);
  const downData = new Uint8ClampedArray(columns * rows * 4);
  const maskData = new Uint8ClampedArray(columns * rows * 4);

  for (let i = 0; i < columns * rows; i++) {
    const p = i * 4;
    const pullX = data[p];
    const pullY = data[p + 1];
    const bends = data[p + 2];
    const inside = data[p + 3];

    if (inside <= 0) {
      acrossData[p] = acrossData[p + 1] = acrossData[p + 2] = 128;
      acrossData[p + 3] = 255;
      downData[p] = downData[p + 1] = downData[p + 2] = 128;
      downData[p + 3] = 255;
      maskData[p] = maskData[p + 1] = maskData[p + 2] = 128;
      maskData[p + 3] = 0;
      continue;
    }

    const gx = Math.round((0.5 - 0.5 * pullX) * 255);
    const gy = Math.round((0.5 - 0.5 * pullY) * 255);
    acrossData[p] = acrossData[p + 1] = acrossData[p + 2] = gx;
    acrossData[p + 3] = 255;
    downData[p] = downData[p + 1] = downData[p + 2] = gy;
    downData[p + 3] = 255;
    maskData[p] = maskData[p + 1] = maskData[p + 2] = 128;
    maskData[p + 3] = Math.round(255 * bends);
  }

  const canvas = document.createElement('canvas');
  canvas.width = columns;
  canvas.height = rows;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const img = ctx.createImageData(columns, rows);
  const toUrl = (buf: Uint8ClampedArray): string => {
    img.data.set(buf);
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL();
  };

  const result: EncodedGreyMaps = {
    across: toUrl(acrossData),
    down: toUrl(downData),
    alphaMask: toUrl(maskData)
  };
  setBounded(greyMapCache, key, result);
  return result;
}

// --- Blink Backdrop Filter Injection (Isolated from Safari WebKit Bug 245510) ---

interface CachedBackdropFilter {
  id: string;
  filterEl: SVGElement;
}

const backdropFilterCache = new Map<string, CachedBackdropFilter>();

export function fitBlinkBackdropFilter(element: HTMLElement, options: BezelOptions = GLASS_BEZEL_OPTIONS): void {
  if (!supportsBlinkBackdropSvg()) return;
  const shape = shapeOf(element);
  if (!shape) return;

  const density = Math.min(window.devicePixelRatio || 1, 2);
  const depth = bezelDepthOf(shape, options);
  const reach = options.strength * depth;
  const cornerExponent = supportsNativeSquircle() ? NATIVE_SQUIRCLE_EXPONENT : 2;
  const key = `${Math.round(shape.width)}x${Math.round(shape.height)}|${shape.radius.toFixed(1)}|${cornerExponent}|${reach.toFixed(1)}|${options.dispersion}`;

  let entry = backdropFilterCache.get(key);
  if (!entry) {
    const maps = encodeGreyscaleBezelMaps(shape, options, density, cornerExponent);
    if (!maps) return;

    const id = `trd-lg-bf-${++filterSeq}`;
    const filterEl = createSvgEl('filter', {
      id,
      x: 0,
      y: 0,
      width: shape.width,
      height: shape.height,
      filterUnits: 'userSpaceOnUse',
      primitiveUnits: 'userSpaceOnUse',
      'color-interpolation-filters': 'sRGB'
    });

    const addImage = (href: string, result: string) =>
      createSvgEl('feImage', {
        href,
        x: 0,
        y: 0,
        width: shape.width,
        height: shape.height,
        preserveAspectRatio: 'none',
        result
      });

    filterEl.append(
      addImage(maps.across, 'across'),
      addImage(maps.down, 'down'),
      addImage(maps.alphaMask, 'mask'),
      createSvgEl('feFlood', { 'flood-color': 'rgb(128,128,128)', result: 'neutral' })
    );

    for (const axis of ['across', 'down']) {
      const comp = createSvgEl('feComponentTransfer', { in: `${axis}-grey`, result: `${axis}-pull` });
      comp.append(createSvgEl('feFuncA', { type: 'linear', slope: 0, intercept: 0.5 }));
      filterEl.append(
        createSvgEl('feComposite', { in: axis, in2: 'neutral', operator: 'over', result: `${axis}-grey` }),
        comp
      );
    }

    const channels: ReadonlyArray<readonly [string, number]> = [
      ['1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.3333 0', 1 + 0.2 * options.dispersion],
      ['0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0.3333 0', 1 + 0.1 * options.dispersion],
      ['0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 0.3333 0', 1]
    ];

    channels.forEach(([matrixVals, factor], idx) => {
      filterEl.append(
        createSvgEl('feDisplacementMap', {
          in: 'SourceGraphic',
          in2: 'across-pull',
          scale: (reach * factor).toFixed(2),
          xChannelSelector: 'R',
          yChannelSelector: 'A',
          result: `ax-${idx}`
        }),
        createSvgEl('feDisplacementMap', {
          in: `ax-${idx}`,
          in2: 'down-pull',
          scale: (reach * factor).toFixed(2),
          xChannelSelector: 'A',
          yChannelSelector: 'R',
          result: `ray-${idx}`
        }),
        createSvgEl('feColorMatrix', {
          in: `ray-${idx}`,
          type: 'matrix',
          values: matrixVals,
          result: `c-${idx}`
        })
      );
    });

    filterEl.append(
      createSvgEl('feComposite', { in: 'c-0', in2: 'c-1', operator: 'arithmetic', k2: 1, k3: 1, result: 'c-01' }),
      createSvgEl('feComposite', { in: 'c-01', in2: 'c-2', operator: 'arithmetic', k2: 1, k3: 1, result: 'spread' }),
      createSvgEl('feColorMatrix', {
        in: 'spread',
        type: 'matrix',
        values: '3 0 0 0 0  0 3 0 0 0  0 0 3 0 0  0 0 0 1 0',
        result: 'bent'
      }),
      createSvgEl('feComposite', { in: 'bent', in2: 'mask', operator: 'in', result: 'inside' }),
      createSvgEl('feComposite', { in: 'SourceGraphic', in2: 'mask', operator: 'out', result: 'outside' }),
      createSvgEl('feComposite', { in: 'inside', in2: 'outside', operator: 'arithmetic', k2: 1, k3: 1 })
    );

    svgDefsContainer().append(filterEl);
    entry = { id, filterEl };
    setBounded(backdropFilterCache, key, entry, (evicted) => {
      evicted.filterEl.remove();
    });
  }

  element.style.setProperty('--lg-filter', `url("#${entry.id}")`);
}

// --- Self-Contained Control Refraction (filter: url() — works on Chrome, Safari iOS & Firefox) ---

export interface ElementLensHandle {
  updatePosition(x: number, y: number, width: number, height: number, amount: number): void;
  clear(): void;
  destroy(): void;
}

export function createElementLens(target: HTMLElement, radius: number, strength = 0.22): ElementLensHandle {
  const isBox = isWebKitEngine();
  const baseName = `trd-lg-el-${++filterSeq}`;
  let version = 0;
  let filterEl: SVGElement | null = null;
  let imgAcross: SVGElement | null = null;
  let imgDown: SVGElement | null = null;
  let imgMask: SVGElement | null = null;
  let dispAcross: SVGElement | null = null;
  let dispDown: SVGElement | null = null;
  let lastShapeKey = '';
  let lastPlacedKey = '';

  const ensureFilter = (w: number, h: number) => {
    const sk = `${Math.round(w)}x${Math.round(h)}|${radius.toFixed(1)}`;
    if (filterEl && sk === lastShapeKey) return;
    lastShapeKey = sk;
    filterEl?.remove();

    const maps = encodeGreyscaleBezelMaps(
      { width: Math.max(12, w), height: Math.max(12, h), radius: Math.min(radius, Math.min(w, h) / 2) },
      { ...GLASS_BEZEL_OPTIONS, depth: 0.35, maxDepth: 14, strength },
      Math.min(window.devicePixelRatio || 1, 2)
    );
    if (!maps) return;

    const unit = isBox ? 'objectBoundingBox' : 'userSpaceOnUse';
    filterEl = createSvgEl('filter', {
      id: `${baseName}-${++version}`,
      filterUnits: unit,
      primitiveUnits: unit,
      'color-interpolation-filters': 'sRGB'
    });
    if (isBox) {
      filterEl.setAttribute('x', '0');
      filterEl.setAttribute('y', '0');
      filterEl.setAttribute('width', '1');
      filterEl.setAttribute('height', '1');
    }

    imgAcross = createSvgEl('feImage', { href: maps.across, preserveAspectRatio: 'none', result: 'across' });
    imgDown = createSvgEl('feImage', { href: maps.down, preserveAspectRatio: 'none', result: 'down' });
    imgMask = createSvgEl('feImage', { href: maps.alphaMask, preserveAspectRatio: 'none', result: 'mask' });

    const neutral = createSvgEl('feFlood', { 'flood-color': 'rgb(128,128,128)', result: 'neutral' });
    const compA = createSvgEl('feComponentTransfer', { in: 'across-g', result: 'across-pull' });
    compA.append(createSvgEl('feFuncA', { type: 'linear', slope: 0, intercept: 0.5 }));
    const compD = createSvgEl('feComponentTransfer', { in: 'down-g', result: 'down-pull' });
    compD.append(createSvgEl('feFuncA', { type: 'linear', slope: 0, intercept: 0.5 }));

    dispAcross = createSvgEl('feDisplacementMap', {
      in: 'SourceGraphic',
      in2: 'across-pull',
      scale: 0,
      xChannelSelector: 'R',
      yChannelSelector: 'A',
      result: 'ax'
    });
    dispDown = createSvgEl('feDisplacementMap', {
      in: 'ax',
      in2: 'down-pull',
      scale: 0,
      xChannelSelector: 'A',
      yChannelSelector: 'R',
      result: 'bent'
    });

    filterEl.append(
      imgAcross,
      imgDown,
      imgMask,
      neutral,
      createSvgEl('feComposite', { in: 'across', in2: 'neutral', operator: 'over', result: 'across-g' }),
      compA,
      createSvgEl('feComposite', { in: 'down', in2: 'neutral', operator: 'over', result: 'down-g' }),
      compD,
      dispAcross,
      dispDown,
      createSvgEl('feComposite', { in: 'bent', in2: 'mask', operator: 'in', result: 'inside' }),
      createSvgEl('feComposite', { in: 'SourceGraphic', in2: 'mask', operator: 'out', result: 'outside' }),
      createSvgEl('feComposite', { in: 'inside', in2: 'outside', operator: 'arithmetic', k2: 1, k3: 1 })
    );

    svgDefsContainer().append(filterEl);
  };

  return {
    updatePosition: (x: number, y: number, width: number, height: number, amount: number) => {
      const tw = target.offsetWidth;
      const th = target.offsetHeight;
      if (!tw || !th || !width || !height || amount <= 0.01) {
        target.style.removeProperty('filter');
        lastPlacedKey = '';
        return;
      }
      ensureFilter(width, height);
      if (!filterEl || !imgAcross || !imgDown || !imgMask || !dispAcross || !dispDown) return;

      const placedKey = `${x.toFixed(1)},${y.toFixed(1)},${width.toFixed(1)},${height.toFixed(1)},${amount.toFixed(2)}`;
      if (placedKey === lastPlacedKey) return;
      lastPlacedKey = placedKey;

      const reach = Math.min(width, height) * strength * amount;
      const rect = isBox
        ? {
            x: (x / tw).toFixed(4),
            y: (y / th).toFixed(4),
            width: (width / tw).toFixed(4),
            height: (height / th).toFixed(4)
          }
        : {
            x: x.toFixed(1),
            y: y.toFixed(1),
            width: width.toFixed(1),
            height: height.toFixed(1)
          };

      if (!isBox) {
        filterEl.setAttribute('x', '0');
        filterEl.setAttribute('y', '0');
        filterEl.setAttribute('width', String(tw));
        filterEl.setAttribute('height', String(th));
      }
      for (const node of [imgAcross, imgDown, imgMask, dispAcross]) {
        for (const [k, v] of Object.entries(rect)) {
          node.setAttribute(k, v);
        }
      }
      dispAcross.setAttribute('scale', String(isBox ? reach / tw : reach));
      dispDown.setAttribute('scale', String(isBox ? reach / th : reach));

      // WebKit caches SVG filter output by ID until the filter ID mutates.
      if (isBox) {
        filterEl.id = `${baseName}-${++version}`;
      }
      target.style.filter = `url("#${filterEl.id}")`;
    },
    clear: () => {
      target.style.removeProperty('filter');
      lastPlacedKey = '';
    },
    destroy: () => {
      target.style.removeProperty('filter');
      filterEl?.remove();
      filterEl = null;
    }
  };
}

// --- Geometric Superellipse (Squircle n ≈ 4.2) Clip-Path Fallback ---

const squircleClipCache = new Map<string, { id: string; clipEl: SVGElement }>();

function parseCornerPx(raw: string, width: number, height: number): number {
  const parsed = raw.endsWith('%')
    ? (Math.min(width, height) * parseFloat(raw)) / 100
    : parseFloat(raw) || 0;
  return clamp(parsed, 0, Math.min(width / 2, height / 2));
}

function buildSquirclePath(
  width: number,
  height: number,
  radii: [number, number, number, number],
  exponent = 4.2
): string {
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  const maxR = Math.min(w / 2, h / 2);
  const [tl, tr, br, bl] = radii.map((r) => clamp(r, 0, maxR));
  if (tl <= 0.5 && tr <= 0.5 && br <= 0.5 && bl <= 0.5) return 'M 0 0 H 1 V 1 H 0 Z';

  // Superellipse corner blend per corner so mobile bottom-sheets keep sharp bottom edges.
  const steps = 10;
  const pts: string[] = [];

  const corner = (rPx: number, sharpX: number, sharpY: number, startRad: number, endRad: number) => {
    if (rPx <= 0.5) {
      pts.push(`${sharpX} ${sharpY}`);
      return;
    }
    const rx = rPx / w;
    const ry = rPx / h;
    const cx = sharpX > 0.5 ? 1 - rx : rx;
    const cy = sharpY > 0.5 ? 1 - ry : ry;
    for (let i = 0; i <= steps; i++) {
      const t = startRad + ((endRad - startRad) * i) / steps;
      const cosT = Math.cos(t);
      const sinT = Math.sin(t);
      const px = cx + rx * Math.sign(cosT) * Math.abs(cosT) ** (2 / exponent);
      const py = cy + ry * Math.sign(sinT) * Math.abs(sinT) ** (2 / exponent);
      pts.push(`${px.toFixed(4)} ${py.toFixed(4)}`);
    }
  };

  // Top-right -> Bottom-right -> Bottom-left -> Top-left
  corner(tr, 1, 0, -Math.PI / 2, 0);
  corner(br, 1, 1, 0, Math.PI / 2);
  corner(bl, 0, 1, Math.PI / 2, Math.PI);
  corner(tl, 0, 0, Math.PI, (3 * Math.PI) / 2);

  return `M ${pts[0]} L ${pts.slice(1).join(' L ')} Z`;
}

export function applySquircleClip(element: HTMLElement): void {
  if (supportsNativeSquircle()) {
    element.style.removeProperty('clip-path');
    return;
  }
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  if (!width || !height) return;
  const computed = getComputedStyle(element);
  const tl = parseCornerPx(computed.borderTopLeftRadius || '0px', width, height);
  const tr = parseCornerPx(computed.borderTopRightRadius || '0px', width, height);
  const br = parseCornerPx(computed.borderBottomRightRadius || '0px', width, height);
  const bl = parseCornerPx(computed.borderBottomLeftRadius || '0px', width, height);
  const minHalf = Math.min(width / 2, height / 2);
  if ((tl <= 1 && tr <= 1 && br <= 1 && bl <= 1) || (tl >= minHalf - 1 && tr >= minHalf - 1 && br >= minHalf - 1 && bl >= minHalf - 1)) {
    element.style.removeProperty('clip-path');
    return;
  }

  const key = `${Math.round(width)}x${Math.round(height)}|${tl.toFixed(1)},${tr.toFixed(1)},${br.toFixed(1)},${bl.toFixed(1)}`;
  let entry = squircleClipCache.get(key);
  if (!entry) {
    const id = `trd-lg-sq-${++filterSeq}`;
    const clipEl = createSvgEl('clipPath', { id, clipPathUnits: 'objectBoundingBox' });
    const pathEl = createSvgEl('path', { d: buildSquirclePath(width, height, [tl, tr, br, bl], 4.2) });
    clipEl.append(pathEl);
    svgDefsContainer().append(clipEl);
    entry = { id, clipEl };
    setBounded(squircleClipCache, key, entry, (evicted) => evicted.clipEl.remove());
  }
  element.style.clipPath = `url("#${entry.id}")`;
}
