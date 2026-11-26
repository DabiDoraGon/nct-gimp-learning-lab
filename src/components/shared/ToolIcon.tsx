import { getIcon } from '@/assets/iconRegistry';

interface ToolIconProps {
  iconId: string;
  className?: string;
}

/**
 * Renders an icon from the independent registry in src/assets/iconRegistry.ts.
 * These are temporary placeholders (Lucide), NOT official GIMP icons —
 * swap registry entries later to switch every icon at once.
 */
export function ToolIcon({ iconId, className = 'h-5 w-5' }: ToolIconProps) {
  const { icon: Icon } = getIcon(iconId);
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
