import { TOOLS } from '@/stores/workspaceData';
import { ToolIcon } from '@/components/shared/ToolIcon';
import type { ToolId } from '@/types/gimp';

interface ToolboxProps {
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
  layout: 'sidebar' | 'sheet';
}

export function Toolbox({ activeTool, onSelectTool, layout }: ToolboxProps) {
  return (
    <div className="flex h-full flex-col">
      <div
        className={`grid gap-1 p-1.5 ${
          layout === 'sidebar' ? 'grid grid-cols-3' : 'grid grid-cols-3 sm:grid-cols-5'
        }`}
      >
        {TOOLS.map((tool) => {
          const isActive = tool.id === activeTool;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelectTool(tool.id)}
              title={`${tool.name} — ${tool.description}`}
              aria-pressed={isActive}
              className={`group flex min-h-11 flex-col items-center justify-center gap-1 rounded border px-1 py-2 text-[10px] leading-tight transition-colors ${
                isActive
                  ? 'border-accent bg-accent-soft text-ink-base'
                  : 'border-transparent text-ink-muted hover:border-line hover:bg-surface-2 hover:text-ink-base active:bg-surface-3'
              }`}
            >
              <ToolIcon iconId={tool.iconId} className="h-6 w-6" />
              <span
                className="w-full truncate text-center"
                title={tool.name}
              >
                {tool.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
