import { ToolIcon } from '@/components/shared/ToolIcon';
import type { WorkspaceLayer } from '@/types/gimp';

interface LayersPanelProps {
  layers: WorkspaceLayer[];
  onToggleVisibility: (id: string) => void;
  onSelect: (id: string) => void;
}

export function LayersPanel({ layers, onToggleVisibility, onSelect }: LayersPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <ToolIcon iconId="ui-layers" className="h-4 w-4 text-ink-muted" />
        <span className="text-xs font-medium text-ink-base">Layers</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {layers.length === 0 ? (
          <p className="px-3 py-4 text-[11px] text-ink-faint">
            No layers yet. Open an image to create one.
          </p>
        ) : (
          <ul className="flex flex-col">
            {[...layers].reverse().map((layer) => (
              <li key={layer.id}>
                <button
                  type="button"
                  onClick={() => onSelect(layer.id)}
                  className={`flex min-h-12 w-full items-center gap-2 border-b border-line px-2.5 text-left transition-colors ${
                    layer.isActive ? 'bg-accent-soft' : 'hover:bg-surface-2'
                  }`}
                >
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(layer.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        e.preventDefault();
                        onToggleVisibility(layer.id);
                      }
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink-base active:bg-surface-3"
                    aria-label={layer.visible ? 'Hide layer' : 'Show layer'}
                    aria-pressed={layer.visible}
                  >
                    <ToolIcon
                      iconId={layer.visible ? 'ui-eye-open' : 'ui-eye-closed'}
                      className="h-5 w-5"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-xs ${
                        layer.isActive ? 'font-medium text-ink-base' : 'text-ink-muted'
                      }`}
                    >
                      {layer.name}
                    </span>
                    <span className="block text-[10px] text-ink-faint">
                      {layer.kind === 'image' ? 'Image layer' : 'Background'} — {layer.width} ×{' '}
                      {layer.height} px
                    </span>
                  </span>
                  {layer.isActive && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
