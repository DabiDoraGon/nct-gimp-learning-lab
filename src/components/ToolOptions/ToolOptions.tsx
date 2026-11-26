import { TOOLS } from '@/stores/workspaceData';
import { ToolIcon } from '@/components/shared/ToolIcon';
import type { ToolId } from '@/types/gimp';

interface ToolOptionsProps {
  activeTool: ToolId;
}

function OptionSlider({ label, defaultValue = 0 }: { label: string; defaultValue?: number }) {
  return (
    <label className="flex items-center gap-2 text-xs text-ink-muted">
      <span className="w-24 shrink-0">{label}</span>
      <input
        type="range"
        min={-100}
        max={100}
        defaultValue={defaultValue}
        className="h-1.5 flex-1 accent-[var(--gimp-accent)]"
      />
    </label>
  );
}

function OptionNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded border border-line bg-surface-0 px-2 py-1.5 text-[11px] leading-relaxed text-ink-faint">
      {children}
    </p>
  );
}

const placeholders: Record<ToolId, string> = {
  zoom: 'Zoom chỉ điều khiển mức phóng hiển thị trên Canvas ở bản này.',
  crop: 'Cropping chưa được thực thi trong Prototype 01 — chỉ hiển thị tùy chọn mô phỏng.',
  rotate: 'Xoay ảnh chưa được thực thi trong Prototype 01.',
  'rect-select': 'Vùng chọn chưa được vẽ trên Canvas trong Prototype 01.',
  'ellipse-select': 'Vùng chọn chưa được vẽ trên Canvas trong Prototype 01.',
  'free-select': 'Vùng chọn tay chưa được vẽ trên Canvas trong Prototype 01.',
  'brightness-contrast': 'Thanh trượt chỉ mô phỏng — chưa tác động lên ảnh.',
  'color-balance': 'Thanh trượt chỉ mô phỏng — chưa tác động lên ảnh.',
  'hue-saturation': 'Thanh trượt chỉ mô phỏng — chưa tác động lên ảnh.',
};

export function ToolOptions({ activeTool }: ToolOptionsProps) {
  const tool = TOOLS.find((t) => t.id === activeTool);
  if (!tool) return null;

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center gap-2">
        <span className="rounded border border-line bg-surface-2 p-1.5">
          <ToolIcon iconId={tool.iconId} className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-ink-base">{tool.name}</p>
          <p className="text-[11px] text-ink-faint">Tool Options</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {activeTool === 'zoom' && (
          <>
            <div className="flex gap-1.5">
              {['Fit', '100%', '200%'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="flex-1 rounded border border-line bg-surface-2 px-2 py-1.5 text-xs text-ink-base transition-colors hover:bg-surface-3"
                >
                  {preset}
                </button>
              ))}
            </div>
            <OptionNote>{placeholders.zoom}</OptionNote>
          </>
        )}

        {(activeTool === 'rect-select' ||
          activeTool === 'ellipse-select' ||
          activeTool === 'free-select') && (
          <>
            <div className="flex flex-wrap gap-1.5">
              {['Replace', 'Add', 'Subtract'].map((mode, i) => (
                <button
                  key={mode}
                  type="button"
                  className={`rounded border px-2 py-1.5 text-xs transition-colors ${
                    i === 0
                      ? 'border-accent bg-accent-soft text-ink-base'
                      : 'border-line bg-surface-2 text-ink-muted hover:bg-surface-3'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-ink-muted">
              <input type="checkbox" className="accent-[var(--gimp-accent)]" defaultChecked />
              Antialiasing
            </label>
            <OptionNote>{placeholders[activeTool]}</OptionNote>
          </>
        )}

        {(activeTool === 'crop' || activeTool === 'rotate') && (
          <>
            {activeTool === 'crop' ? (
              <label className="flex items-center gap-2 text-xs text-ink-muted">
                <input type="checkbox" className="accent-[var(--gimp-accent)]" defaultChecked />
                Delete cropped pixels
              </label>
            ) : (
              <OptionSlider label="Angle" defaultValue={0} />
            )}
            <OptionNote>{placeholders[activeTool]}</OptionNote>
          </>
        )}

        {activeTool === 'brightness-contrast' && (
          <>
            <OptionSlider label="Brightness" />
            <OptionSlider label="Contrast" />
            <OptionNote>{placeholders['brightness-contrast']}</OptionNote>
          </>
        )}

        {activeTool === 'color-balance' && (
          <>
            <OptionSlider label="Cyan–Red" />
            <OptionSlider label="Magenta–Green" />
            <OptionSlider label="Yellow–Blue" />
            <OptionNote>{placeholders['color-balance']}</OptionNote>
          </>
        )}

        {activeTool === 'hue-saturation' && (
          <>
            <OptionSlider label="Hue" />
            <OptionSlider label="Saturation" />
            <OptionSlider label="Lightness" />
            <OptionNote>{placeholders['hue-saturation']}</OptionNote>
          </>
        )}
      </div>
    </div>
  );
}
