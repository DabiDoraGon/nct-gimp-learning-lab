import { useCallback, useRef, useState } from 'react';
import { MenuBar } from '@/components/MenuBar/MenuBar';
import { Toolbox } from '@/components/Toolbox/Toolbox';
import { CanvasWorkspace } from '@/components/CanvasWorkspace/CanvasWorkspace';
import { ToolOptions } from '@/components/ToolOptions/ToolOptions';
import { LayersPanel } from '@/components/LayersPanel/LayersPanel';
import { MobileSheet } from '@/components/shared/MobileSheet';
import { ToolIcon } from '@/components/shared/ToolIcon';
import { useTheme } from '@/hooks/useTheme';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useIsDesktop } from '@/hooks/useUi';
import { TOOLS } from '@/stores/workspaceData';
import { ColorBalanceMission } from '@/components/ColorBalanceMission/ColorBalanceMission';
import type { ToolId } from '@/types/gimp';

type SheetId = 'toolbox' | 'options' | 'layers' | null;

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    activeTool,
    setActiveTool,
    image,
    processedImageUrl,
    openImage,
    layers,
    toggleLayerVisibility,
    selectLayer,
    zoom,
    setZoom,
    brightnessContrast,
    setBrightness,
    setContrast,
    resetBrightnessContrast,
} = useWorkspace();
  const isDesktop = useIsDesktop();
  const [sheet, setSheet] = useState<SheetId>(null);
  const [isColorBalanceMissionOpen, setIsColorBalanceMissionOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeToolDef = TOOLS.find((t) => t.id === activeTool);
  const handleOpenFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  const handleSelectTool = useCallback((tool: ToolId) => {
  setActiveTool(tool);

  if (tool === 'color-balance') {
    setIsColorBalanceMissionOpen(true);
  }
}, [setActiveTool]);

  const toggleSheet = (id: Exclude<SheetId, null>) =>
    setSheet((s) => (s === id ? null : id));

  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface-0 text-ink-base">
      <MenuBar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenImage={handleOpenFileDialog}
        hasImage={!!image}
      />

      {/* Desktop: fixed three-region layout */}
      <div className="flex min-h-0 flex-1">
        {isDesktop && (
          <aside className="w-64 shrink-0 border-r border-line gimp-panel">
            <Toolbox layout="sidebar" activeTool={activeTool} onSelectTool={handleSelectTool} />
          </aside>
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <CanvasWorkspace
            image={image}
            processedImageUrl={processedImageUrl}
            zoom={zoom}
            onZoomChange={setZoom}
            onOpenImage={openImage}
            toolName={activeToolDef?.name ?? ''}
            fileInputRef={fileInputRef}
          />
        </main>

        {isDesktop && (
          <div className="flex w-72 shrink-0 flex-col border-l border-line gimp-panel">
            <div className="max-h-[45%] shrink-0 overflow-y-auto border-b border-line">
              <ToolOptions
                activeTool={activeTool}
                brightness={brightnessContrast.brightness}
                contrast={brightnessContrast.contrast}
                onBrightnessChange={setBrightness}
                onContrastChange={setContrast}
                onResetBrightnessContrast={resetBrightnessContrast}
              />
            </div>
            <div className="min-h-0 flex-1">
              <LayersPanel
                layers={layers}
                onToggleVisibility={toggleLayerVisibility}
                onSelect={selectLayer}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom action bar */}
      {!isDesktop && (
        <nav className="safe-nav flex items-stretch border-t border-line bg-surface-1">
          {(
            [
              ['toolbox', 'ui-menu', 'Tools'],
              ['options', 'ui-options', 'Options'],
              ['layers', 'ui-layers', 'Layers'],
            ] as const
          ).map(([id, iconId, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleSheet(id)}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] transition-colors ${
                sheet === id ? 'bg-surface-3 text-ink-base' : 'text-ink-muted hover:bg-surface-2'
              }`}
              aria-expanded={sheet === id}
            >
              <ToolIcon iconId={iconId} className="h-5 w-5" />
              {label}
            </button>
          ))}
        </nav>
      )}

      {/* Mobile sliding sheet */}
      {!isDesktop && sheet && (
        <MobileSheet
          title={
            sheet === 'toolbox'
              ? 'Toolbox'
              : sheet === 'options'
                ? 'Tool Options'
                : 'Layers'
          }
          onClose={() => setSheet(null)}
        >
          {sheet === 'toolbox' && (
            <Toolbox layout="sheet" activeTool={activeTool} onSelectTool={setActiveTool} />
          )}
          {sheet === 'options' && (
            <ToolOptions
              activeTool={activeTool}
              brightness={brightnessContrast.brightness}
              contrast={brightnessContrast.contrast}
              onBrightnessChange={setBrightness}
              onContrastChange={setContrast}
              onResetBrightnessContrast={resetBrightnessContrast} 
            />
)}
          {sheet === 'layers' && (
            <LayersPanel
              layers={layers}
              onToggleVisibility={toggleLayerVisibility}
              onSelect={selectLayer}
            />
          )}
        </MobileSheet>
      )}
            {isColorBalanceMissionOpen && (
        <ColorBalanceMission
          onClose={() => setIsColorBalanceMissionOpen(false)}
        />
      )}
    </div>
  );
}
