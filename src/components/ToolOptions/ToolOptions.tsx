
import { TOOLS } from '@/stores/workspaceData';
import { ToolIcon } from '@/components/shared/ToolIcon';
import type { ToolId } from '@/types/gimp';

interface ToolOptionsProps {
  activeTool: ToolId;
  brightness?: number;
  contrast?: number;
  onBrightnessChange?: (value: number) => void;
  onContrastChange?: (value: number) => void;
  onResetBrightnessContrast?: () => void;
}

function OptionSlider({
  label,
  value = 0,
  onChange,
}: {
  label: string;
  value?: number;
  onChange?: (value: number) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-ink-muted">
      <span className="w-24 shrink-0">{label}</span>
      <input
        type="range"
        min={-100}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="h-1.5 flex-1 accent-[var(--gimp-accent)]"
      />
      <span className="w-8 text-right tabular-nums">
        {value}
      </span>
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
  zoom: 'Zoom chỉ điều khiển mức phóng hiển thị trên Canvas.',
  crop: 'Cắt ảnh chưa được triển khai.',
  rotate: 'Xoay ảnh chưa được triển khai.',
  'rect-select': 'Vùng chọn hình chữ nhật chưa được triển khai.',
  'ellipse-select': 'Vùng chọn hình elip chưa được triển khai.',
  'free-select': 'Vùng chọn tự do chưa được triển khai.',
  'brightness-contrast': 'Điều chỉnh độ sáng và độ tương phản của ảnh.',
  'color-balance': 'Điều chỉnh cân bằng màu sắc.',
  'hue-saturation': 'Điều chỉnh tông màu, độ sáng và độ bão hòa.',
};

export function ToolOptions({
  activeTool,
  brightness = 0,
  contrast = 0,
  onBrightnessChange,
  onContrastChange,
  onResetBrightnessContrast,
}: ToolOptionsProps) {
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
              <OptionSlider label="Angle" />
            )}
            <OptionNote>{placeholders[activeTool]}</OptionNote>
          </>
        )}

        {activeTool === 'brightness-contrast' && (
          <>
            <OptionSlider
              label="Brightness"
              value={brightness}
              onChange={onBrightnessChange}
            />
            <OptionSlider
              label="Contrast"
              value={contrast}
              onChange={onContrastChange}
            />
            <button
              type="button"
              onClick={onResetBrightnessContrast}
              className="rounded border border-line bg-surface-2 px-3 py-2 text-xs text-ink-base hover:bg-surface-3"
            >
              Reset
            </button>
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
