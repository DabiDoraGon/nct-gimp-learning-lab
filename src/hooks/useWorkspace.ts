import { useCallback, useEffect, useRef, useState } from 'react';
import type { ImageState, ToolId, WorkspaceLayer } from '@/types/gimp';

let layerSeq = 0;
function nextLayerId() {
  layerSeq += 1;
  return `layer-${layerSeq}`;
}

export function useWorkspace() {
  const [activeTool, setActiveTool] = useState<ToolId>('zoom');
  const [image, setImage] = useState<ImageState | null>(null);
  const [layers, setLayers] = useState<WorkspaceLayer[]>([]);
  const [zoom, setZoom] = useState(1);
  const imageUrlRef = useRef<string | null>(null);

  const openImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = url;
      setImage({
        fileName: file.name,
        width: img.naturalWidth,
        height: img.naturalHeight,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        url,
      });
      setZoom(1);
      setLayers([
        {
          id: nextLayerId(),
          name: file.name,
          width: img.naturalWidth,
          height: img.naturalHeight,
          visible: true,
          isActive: true,
          kind: 'image',
        },
      ]);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  const closeImage = useCallback(() => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }
    setImage(null);
    setLayers([]);
    setZoom(1);
  }, []);

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    };
  }, []);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const selectLayer = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((l) => ({ ...l, isActive: l.id === layerId }))
    );
  }, []);

  return {
    activeTool,
    setActiveTool,
    image,
    openImage,
    closeImage,
    layers,
    toggleLayerVisibility,
    selectLayer,
    zoom,
    setZoom,
  };
}

export type Workspace = ReturnType<typeof useWorkspace>;
