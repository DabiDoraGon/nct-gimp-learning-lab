import { useCallback, useRef, useState } from 'react';
import { ToolIcon } from '@/components/shared/ToolIcon';
import type { ImageState } from '@/types/gimp';

interface CanvasWorkspaceProps {
  image: ImageState | null;
  zoom: number;
  onZoomChange: (z: number) => void;
  onOpenImage: (file: File) => void;
  toolName: string;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 8;
const ZOOM_STEP = 1.25;

export function CanvasWorkspace({
  image,
  zoom,
  onZoomChange,
  onOpenImage,
  toolName,
  fileInputRef,
}: CanvasWorkspaceProps) {
  const [dragOver, setDragOver] = useState(false);
  const pinchState = useRef<{ dist: number; startZoom: number } | null>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file && file.type.startsWith('image/')) {
        onOpenImage(file);
      }
    },
    [onOpenImage]
  );

  const setZoomClamped = useCallback(
    (z: number) => onZoomChange(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))),
    [onZoomChange]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && image) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchState.current = { dist, startZoom: zoom };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchState.current && image) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const ratio = dist / pinchState.current.dist;
      setZoomClamped(pinchState.current.startZoom * ratio);
    }
  };

  const handleTouchEnd = () => {
    pinchState.current = null;
  };

  const displayedZoom = image ? zoom : 1;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Canvas area */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden gimp-inset border"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!image ? (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <ToolIcon iconId="ui-image" className="h-12 w-12 text-ink-faint" />
            <p className="max-w-xs text-sm text-ink-muted">
              Chưa có ảnh nào được mở. Hãy mở ảnh từ thiết bị của bạn để bắt đầu.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-colors hover:opacity-90 active:opacity-80"
            >
              <ToolIcon iconId="ui-open" className="h-4 w-4" />
              Open Image
            </button>
          </div>
        ) : (
          <img
            src={image.url}
            alt={image.fileName}
            className="max-h-full max-w-full select-none object-contain"
            style={{
              width: `${displayedZoom * 100}%`,
              height: 'auto',
              imageRendering: displayedZoom >= 3 ? 'pixelated' : 'auto',
            }}
            draggable={false}
          />
        )}
        {dragOver && (
          <div className="pointer-events-none absolute inset-2 rounded border-2 border-dashed border-accent bg-accent-soft/60" />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* Bottom status + zoom bar */}
      <div className="flex items-center gap-2 border-t border-line bg-surface-1 px-2 py-1.5 text-[11px] text-ink-muted">
        <span className="min-w-0 flex-1 truncate">
          {image ? `${image.fileName} — ${image.width} × ${image.height} px` : 'No image open'}
        </span>
        <span className="hidden shrink-0 sm:inline">{toolName}</span>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => setZoomClamped(displayedZoom / ZOOM_STEP)}
            disabled={!image}
            className="flex h-11 w-11 items-center justify-center rounded text-ink-base transition-colors hover:bg-surface-3 disabled:opacity-40"
            aria-label="Zoom out"
          >
            <ToolIcon iconId="ui-minus" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomClamped(1)}
            disabled={!image}
            className="flex h-11 min-w-12 items-center justify-center rounded px-1 tabular-nums text-ink-base transition-colors hover:bg-surface-3 disabled:opacity-40"
            aria-label="Reset zoom to 100%"
            title="Reset zoom"
          >
            {Math.round(displayedZoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => setZoomClamped(displayedZoom * ZOOM_STEP)}
            disabled={!image}
            className="flex h-11 w-11 items-center justify-center rounded text-ink-base transition-colors hover:bg-surface-3 disabled:opacity-40"
            aria-label="Zoom in"
          >
            <ToolIcon iconId="ui-plus" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
