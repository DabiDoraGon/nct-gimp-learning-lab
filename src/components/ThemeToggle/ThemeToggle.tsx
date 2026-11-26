import { ToolIcon } from '@/components/shared/ToolIcon';
import type { Theme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-1.5 rounded border border-line bg-surface-2 px-2.5 py-1.5 text-xs font-medium text-ink-base transition-colors hover:bg-surface-3 active:bg-surface-3"
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <ToolIcon
        iconId={theme === 'dark' ? 'ui-theme-light' : 'ui-theme-dark'}
        className="h-4 w-4 text-warn"
      />
      <span className="hidden sm:inline capitalize">{next}</span>
    </button>
  );
}
