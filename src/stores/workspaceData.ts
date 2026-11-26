import type { MenuGroup, ToolDefinition } from '@/types/gimp';

export const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'file',
    label: 'File',
    entries: [
      { id: 'file-open', label: 'Open Image…', shortcut: 'Ctrl+O' },
      { id: 'file-placeholder-1', label: 'Save', disabled: true },
      { id: 'file-placeholder-2', label: 'Export As…', disabled: true },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    entries: [
      { id: 'edit-placeholder-1', label: 'Undo', shortcut: 'Ctrl+Z', disabled: true },
      { id: 'edit-placeholder-2', label: 'Redo', shortcut: 'Ctrl+Y', disabled: true },
    ],
  },
  {
    id: 'view',
    label: 'View',
    entries: [
      { id: 'view-placeholder-1', label: 'Zoom In', disabled: true },
      { id: 'view-placeholder-2', label: 'Zoom Out', disabled: true },
    ],
  },
  {
    id: 'image',
    label: 'Image',
    entries: [
      { id: 'image-placeholder-1', label: 'Canvas Size…', disabled: true },
      { id: 'image-placeholder-2', label: 'Scale Image…', disabled: true },
    ],
  },
  {
    id: 'colors',
    label: 'Colors',
    entries: [
      { id: 'colors-placeholder-1', label: 'Brightness–Contrast…', disabled: true },
      { id: 'colors-placeholder-2', label: 'Hue–Saturation…', disabled: true },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    entries: [
      { id: 'tools-placeholder-1', label: 'Selection Tools', disabled: true },
      { id: 'tools-placeholder-2', label: 'Transform Tools', disabled: true },
    ],
  },
  {
    id: 'select',
    label: 'Select',
    entries: [
      { id: 'select-placeholder-1', label: 'All', disabled: true },
      { id: 'select-placeholder-2', label: 'None', disabled: true },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    entries: [
      { id: 'help-about', label: 'About NCT GIMP Learning Lab' },
      { id: 'help-placeholder-1', label: 'User Manual', disabled: true },
    ],
  },
];

export const TOOLS: ToolDefinition[] = [
  { id: 'zoom', name: 'Zoom', description: 'Change magnification of the canvas', iconId: 'tool-zoom' },
  { id: 'crop', name: 'Crop', description: 'Trim the image edges', iconId: 'tool-crop' },
  { id: 'rotate', name: 'Rotate', description: 'Rotate the image or layer', iconId: 'tool-rotate' },
  { id: 'rect-select', name: 'Rectangle Select', description: 'Select a rectangular region', iconId: 'tool-rect-select' },
  { id: 'ellipse-select', name: 'Ellipse Select', description: 'Select an elliptical region', iconId: 'tool-ellipse-select' },
  { id: 'free-select', name: 'Free Select', description: 'Select a hand-drawn region', iconId: 'tool-free-select' },
  { id: 'brightness-contrast', name: 'Brightness–Contrast', description: 'Adjust light and contrast', iconId: 'tool-brightness-contrast' },
  { id: 'color-balance', name: 'Color Balance', description: 'Shift color balance', iconId: 'tool-color-balance' },
  { id: 'hue-saturation', name: 'Hue–Saturation', description: 'Adjust hue and saturation', iconId: 'tool-hue-saturation' },
];
