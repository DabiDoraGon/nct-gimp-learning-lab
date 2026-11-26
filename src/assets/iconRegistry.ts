/**
 * Independent icon registry.
 *
 * Every icon the app renders goes through this registry so the whole visual
 * layer can be swapped later. Current state:
 *
 * - NO official GIMP icon assets are embedded. GIMP's own icon theme ships
 *   inside GPL-3.0 source, but each individual asset has not been verified
 *   for redistribution inside this project yet (attribution, source variants,
 *   trademark guidance). Until that audit is done we render temporary
 *   placeholders from Lucide and label them as such.
 *
 * To replace with official GIMP icons later:
 *   1. Verify each SVG from the GIMP source tree (icons/Default/) and its
 *      license headers.
 *   2. Drop the files into src/assets/gimp-icons/.
 *   3. Update the entries below to point at the local asset files.
 *
 * See THIRD_PARTY_LICENSES for the licensing status of what ships today.
 */
import {
  ZoomIn,
  Crop,
  RotateCw,
  BoxSelect,
  Circle,
  Lasso,
  SunMedium,
  Palette,
  Droplets,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Minus,
  Image as ImageIcon,
  FolderOpen,
  Layers,
  SlidersHorizontal,
  Menu,
  Check,
} from 'lucide-react';
import type { IconSource } from '@/types/gimp';

const TEMP_LICENSE = 'ISC — Lucide contributors (temporary placeholder, not an official GIMP icon)';

function temp(icon: IconSource['icon']): IconSource {
  return { icon, source: 'lucide-temporary', license: TEMP_LICENSE };
}

export const iconRegistry: Record<string, IconSource> = {
  // Tool icons
  'tool-zoom': temp(ZoomIn),
  'tool-crop': temp(Crop),
  'tool-rotate': temp(RotateCw),
  'tool-rect-select': temp(BoxSelect),
  'tool-ellipse-select': temp(Circle),
  'tool-free-select': temp(Lasso),
  'tool-brightness-contrast': temp(SunMedium),
  'tool-color-balance': temp(Palette),
  'tool-hue-saturation': temp(Droplets),

  // UI chrome
  'ui-eye-open': temp(Eye),
  'ui-eye-closed': temp(EyeOff),
  'ui-theme-light': temp(Sun),
  'ui-theme-dark': temp(Moon),
  'ui-chevron-down': temp(ChevronDown),
  'ui-chevron-up': temp(ChevronUp),
  'ui-close': temp(X),
  'ui-plus': temp(Plus),
  'ui-minus': temp(Minus),
  'ui-image': temp(ImageIcon),
  'ui-open': temp(FolderOpen),
  'ui-layers': temp(Layers),
  'ui-options': temp(SlidersHorizontal),
  'ui-menu': temp(Menu),
  'ui-check': temp(Check),
};

export type IconRegistryId = keyof typeof iconRegistry;

export function getIcon(id: string): IconSource {
  const entry = iconRegistry[id];
  if (!entry) {
    throw new Error(`Icon "${id}" is not registered in iconRegistry`);
  }
  return entry;
}
