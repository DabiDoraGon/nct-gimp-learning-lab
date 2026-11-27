
/**
 * NCT GIMP Learning Lab
 * Image Processing Engine - Prototype 02
 *
 * Xu ly anh tren du lieu pixel RGBA.
 * Anh goc duoc giu nguyen; moi lan xu ly tao ImageData moi.
 */

export type PixelMask = Uint8ClampedArray | null;

export type ColorRange =
  | 'master'
  | 'red'
  | 'yellow'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'magenta';

export interface BrightnessContrastSettings {
  brightness: number;
  contrast: number;
}

export interface ColorBalanceValues {
  cyanRed: number;
  magentaGreen: number;
  yellowBlue: number;
}

export interface ColorBalanceSettings {
  shadows: ColorBalanceValues;
  midtones: ColorBalanceValues;
  highlights: ColorBalanceValues;
}

export interface HueSaturationSettings {
  range: ColorRange;
  hue: number;
  lightness: number;
  saturation: number;
}

export interface ImageAdjustments {
  brightnessContrast?: BrightnessContrastSettings;
  colorBalance?: ColorBalanceSettings;
  hueSaturation?: HueSaturationSettings;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

const clamp = (value: number, min = 0, max = 255): number =>
  Math.min(max, Math.max(min, value));

const clampUnit = (value: number): number =>
  Math.min(1, Math.max(0, value));

const normalizeSlider = (value: number): number =>
  Math.min(100, Math.max(-100, value));

/* =========================================
   1. BRIGHTNESS - CONTRAST
========================================= */

export function applyBrightnessContrast(
  image: ImageData,
  settings: BrightnessContrastSettings,
  mask: PixelMask = null,
): ImageData {
  const { width, height, data } = image;
  const output = new Uint8ClampedArray(data);
  const brightness = normalizeSlider(settings.brightness);
  const contrast = normalizeSlider(settings.contrast);

  // Contrast factor based on the standard contrast formula.
  const effectiveContrast = Math.max(
  -150,
  Math.min(150, contrast * 1.5)
);

const contrastFactor =
  (259 * (effectiveContrast + 255)) /
  (255 * (259 - effectiveContrast));

  const brightnessOffset = (brightness / 100) * 255;

  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const amount = mask ? (mask[pixelIndex] ?? 0) / 255 : 1;

    if (amount <= 0) continue;

    for (let channel = 0; channel < 3; channel++) {
      const original = data[i + channel];

      const adjusted = clamp(
        contrastFactor * (original - 128) +
          128 +
          brightnessOffset,
      );

      output[i + channel] = clamp(
        original + (adjusted - original) * amount,
      );
    }

    // Alpha channel remains unchanged.
    output[i + 3] = data[i + 3];
  }

  return new ImageData(output, width, height);
}

/* =========================================
   2. COLOR BALANCE
========================================= */

function calculateLuminance(
  r: number,
  g: number,
  b: number,
): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function applyBalanceChannel(
  value: number,
  amount: number,
  strength: number,
): number {
  return clamp(value + amount * strength * 255);
}

export function applyColorBalance(
  image: ImageData,
  settings: ColorBalanceSettings,
  mask: PixelMask = null,
): ImageData {
  const { width, height, data } = image;
  const output = new Uint8ClampedArray(data);

  const ranges = [
    { values: settings.shadows, weight: 'shadows' },
    { values: settings.midtones, weight: 'midtones' },
    { values: settings.highlights, weight: 'highlights' },
  ] as const;

  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const selection = mask ? (mask[pixelIndex] ?? 0) / 255 : 1;

    if (selection <= 0) continue;

    const originalR = data[i];
    const originalG = data[i + 1];
    const originalB = data[i + 2];

    const luminance = calculateLuminance(
      originalR,
      originalG,
      originalB,
    );

    const shadowWeight = clampUnit((0.5 - luminance) * 2);
    const highlightWeight = clampUnit((luminance - 0.5) * 2);
    const midtoneWeight = clampUnit(
      1 - shadowWeight - highlightWeight,
    );

    let red = originalR;
    let green = originalG;
    let blue = originalB;

    for (const range of ranges) {
      const weight =
        range.weight === 'shadows'
          ? shadowWeight
          : range.weight === 'midtones'
            ? midtoneWeight
            : highlightWeight;

      const strength = weight * selection * 0.25;

      // Positive cyanRed moves toward red.
      red = applyBalanceChannel(
        red,
        normalizeSlider(range.values.cyanRed) / 100,
        strength,
      );

      // Positive magentaGreen moves toward green.
      green = applyBalanceChannel(
        green,
        normalizeSlider(range.values.magentaGreen) / 100,
        strength,
      );

      // Positive yellowBlue moves toward blue.
      blue = applyBalanceChannel(
        blue,
        normalizeSlider(range.values.yellowBlue) / 100,
        strength,
      );
    }

    output[i] = red;
    output[i + 1] = green;
    output[i + 2] = blue;
    output[i + 3] = data[i + 3];
  }

  return new ImageData(output, width, height);
}

/* =========================================
   3. RGB <-> HSL CONVERSION
========================================= */

function rgbToHsl(
  r: number,
  g: number,
  b: number,
): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }

  if (h < 0) h += 360;

  return { h, s, l };
}

function hslToRgb(
  h: number,
  s: number,
  l: number,
): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  s = clampUnit(s);
  l = clampUnit(l);

  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - chroma / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    [r, g, b] = [chroma, x, 0];
  } else if (h < 120) {
    [r, g, b] = [x, chroma, 0];
  } else if (h < 180) {
    [r, g, b] = [0, chroma, x];
  } else if (h < 240) {
    [r, g, b] = [0, x, chroma];
  } else if (h < 300) {
    [r, g, b] = [x, 0, chroma];
  } else {
    [r, g, b] = [chroma, 0, x];
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

/* =========================================
   4. HUE RANGE WEIGHT
========================================= */

const COLOR_CENTERS: Record<Exclude<ColorRange, 'master'>, number> = {
  red: 0,
  yellow: 60,
  green: 120,
  cyan: 180,
  blue: 240,
  magenta: 300,
};

function circularHueDistance(a: number, b: number): number {
  const distance = Math.abs(a - b);
  return Math.min(distance, 360 - distance);
}

function getHueRangeWeight(
  hue: number,
  range: ColorRange,
): number {
  if (range === 'master') return 1;

  const center = COLOR_CENTERS[range];
  const distance = circularHueDistance(hue, center);

  // Smooth transition between neighboring color ranges.
  const radius = 60;

  if (distance >= radius) return 0;

  return 0.5 * (1 + Math.cos((Math.PI * distance) / radius));
}

/* =========================================
   5. HUE - SATURATION
========================================= */

export function applyHueSaturation(
  image: ImageData,
  settings: HueSaturationSettings,
  mask: PixelMask = null,
): ImageData {
  const { width, height, data } = image;
  const output = new Uint8ClampedArray(data);

  const hueShift = normalizeSlider(settings.hue) * 1.8;
  const lightness = normalizeSlider(settings.lightness) / 100;
  const saturation = normalizeSlider(settings.saturation) / 100;

  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const selection = mask ? (mask[pixelIndex] ?? 0) / 255 : 1;

    if (selection <= 0) continue;

    const originalR = data[i];
    const originalG = data[i + 1];
    const originalB = data[i + 2];

    const hsl = rgbToHsl(
      originalR,
      originalG,
      originalB,
    );

    const rangeWeight = getHueRangeWeight(
      hsl.h,
      settings.range,
    );

    const amount = selection * rangeWeight;

    if (amount <= 0) continue;

    const adjustedHue = hsl.h + hueShift * amount;

    const adjustedLightness = clampUnit(
      hsl.l + lightness * amount * 0.5,
    );

    const adjustedSaturation = clampUnit(
      hsl.s * (1 + saturation * amount),
    );

    const [r, g, b] = hslToRgb(
      adjustedHue,
      adjustedSaturation,
      adjustedLightness,
    );

    output[i] = clamp(originalR + (r - originalR) * selection);
    output[i + 1] = clamp(originalG + (g - originalG) * selection);
    output[i + 2] = clamp(originalB + (b - originalB) * selection);
    output[i + 3] = data[i + 3];
  }

  return new ImageData(output, width, height);
}

/* =========================================
   6. COMBINED IMAGE PROCESSOR
========================================= */

export function processImage(
  original: ImageData,
  adjustments: ImageAdjustments,
  mask: PixelMask = null,
): ImageData {
  let result = new ImageData(
    new Uint8ClampedArray(original.data),
    original.width,
    original.height,
  );

  if (adjustments.brightnessContrast) {
    result = applyBrightnessContrast(
      result,
      adjustments.brightnessContrast,
      mask,
    );
  }

  if (adjustments.colorBalance) {
    result = applyColorBalance(
      result,
      adjustments.colorBalance,
      mask,
    );
  }

  if (adjustments.hueSaturation) {
    result = applyHueSaturation(
      result,
      adjustments.hueSaturation,
      mask,
    );
  }

  return result;
}

/* =========================================
   7. DEFAULT SETTINGS
========================================= */

export const DEFAULT_BRIGHTNESS_CONTRAST: BrightnessContrastSettings = {
  brightness: 0,
  contrast: 0,
};

export const DEFAULT_COLOR_BALANCE: ColorBalanceSettings = {
  shadows: {
    cyanRed: 0,
    magentaGreen: 0,
    yellowBlue: 0,
  },
  midtones: {
    cyanRed: 0,
    magentaGreen: 0,
    yellowBlue: 0,
  },
  highlights: {
    cyanRed: 0,
    magentaGreen: 0,
    yellowBlue: 0,
  },
};

export const DEFAULT_HUE_SATURATION: HueSaturationSettings = {
  range: 'master',
  hue: 0,
  lightness: 0,
  saturation: 0,
};
