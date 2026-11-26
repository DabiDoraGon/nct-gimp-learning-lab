import { useState } from 'react';
import { MENU_GROUPS } from '@/stores/workspaceData';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { useClickOutside } from '@/hooks/useUi';
import type { Theme } from '@/hooks/useTheme';

interface MenuBarProps {
  theme: Theme;
  onToggleTheme: () => void;
  onOpenImage: () => void;
  hasImage: boolean;
}

export function MenuBar({ theme, onToggleTheme, onOpenImage, hasImage }: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useClickOutside<HTMLDivElement>(() => setOpenMenu(null));

  const handleEntryClick = (entryId: string, disabled?: boolean) => {
    if (disabled) return;
    if (entryId === 'file-open') {
      setOpenMenu(null);
      onOpenImage();
      return;
    }
    // Other functional entries (About) are display-only in this prototype;
    // closing the menu is enough of an acknowledgement.
    setOpenMenu(null);
  };

  return (
    <div className="flex items-center gap-1 border-b border-line bg-surface-1 px-1.5 py-1">
      <span className="mr-1 hidden select-none px-1 text-[11px] font-semibold uppercase tracking-wide text-ink-faint md:inline">
        NCT GIMP Lab
      </span>
      <div className="relative flex min-w-0 flex-1 items-center gap-0.5" ref={menuRef}>
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto scrollbar-none">
          {MENU_GROUPS.map((group) => (
            <div key={group.id} className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === group.id ? null : group.id)}
                className={`whitespace-nowrap rounded px-2 py-1.5 text-xs transition-colors ${
                  openMenu === group.id
                    ? 'bg-surface-3 text-ink-base'
                    : 'text-ink-muted hover:bg-surface-2 hover:text-ink-base'
                }`}
                aria-expanded={openMenu === group.id}
              >
                {group.label}
              </button>
              {openMenu === group.id && (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-50 mt-1 min-w-44 rounded border border-line bg-surface-2 py-1 shadow-lg shadow-black/40"
                >
                  {group.entries.map((entry) => (
                    <div key={entry.id}>
                      {entry.separatorBefore && <div className="my-1 border-t border-line" />}
                      <button
                        type="button"
                        disabled={entry.disabled}
                        onClick={() => handleEntryClick(entry.id, entry.disabled)}
                        className={`flex w-full items-center justify-between gap-6 px-3 py-1.5 text-left text-xs ${
                          entry.disabled
                            ? 'cursor-not-allowed text-ink-faint'
                            : 'text-ink-base hover:bg-surface-3'
                        }`}
                        role="menuitem"
                      >
                        <span>{entry.label}</span>
                        {entry.shortcut && (
                          <span className="text-[10px] text-ink-faint">{entry.shortcut}</span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {hasImage && (
        <span className="hidden max-w-[12rem] truncate rounded bg-surface-2 px-2 py-1 text-[11px] text-ink-muted md:inline">
          image loaded
        </span>
      )}
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>
  );
}
