import type { LucideIcon } from 'lucide-react';

export type ToolId =
  | 'zoom'
  | 'crop'
  | 'rotate'
  | 'rect-select'
  | 'ellipse-select'
  | 'free-select'
  | 'brightness-contrast'
  | 'color-balance'
  | 'hue-saturation';

export interface ToolDefinition {
  id: ToolId;
  name: string;
  description: string;
  iconId: string;
}

export interface IconSource {
  icon: LucideIcon;
  /** Where the icon visual comes from. GIMP = official GIMP asset (none yet). */
  source: 'lucide-temporary';
  /** License note shown in THIRD_PARTY_LICENSES. */
  license: string;
}

export interface MenuEntry {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  separatorBefore?: boolean;
}

export interface MenuGroup {
  id: string;
  label: string;
  entries: MenuEntry[];
}

export interface WorkspaceLayer {
  id: string;
  name: string;
  width: number;
  height: number;
  visible: boolean;
  isActive: boolean;
  kind: 'image' | 'background';
}

export interface ImageState {
  fileName: string;
  width: number;
  height: number;
  /** Object URL from File — revoke when replaced. */
  url: string;
  naturalWidth: number;
  naturalHeight: number;
}
