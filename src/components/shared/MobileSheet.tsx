import { ToolIcon } from '@/components/shared/ToolIcon';
import { useClickOutside } from '@/hooks/useUi';

interface MobileSheetProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Bottom sheet for phone screens: scrim, slide-up animation, drag handle,
 * tap-outside to close, and safe-area padding. Content is capped so the
 * canvas stays visible behind it.
 */
export function MobileSheet({ title, onClose, children }: MobileSheetProps) {
  const sheetRef = useClickOutside<HTMLDivElement>(onClose);

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <div className="animate-scrim-in absolute inset-0 bg-black/50" aria-hidden="true" />
      <div
        ref={sheetRef}
        role="dialog"
        aria-label={title}
        className="animate-sheet-up relative max-h-[62vh] rounded-t-lg border-t border-line gimp-panel shadow-[0_-8px_24px_rgba(0,0,0,0.4)]"
      >
        <div className="flex justify-center pt-2" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-line" />
        </div>
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-xs font-medium text-ink-base">{title}</span>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink-base active:bg-surface-3"
            aria-label="Close panel"
          >
            <ToolIcon iconId="ui-close" className="h-5 w-5" />
          </button>
        </div>
        <div className="safe-b max-h-[calc(62vh-3.5rem)] overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
