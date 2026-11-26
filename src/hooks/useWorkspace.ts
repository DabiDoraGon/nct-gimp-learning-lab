
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ImageState, ToolId, WorkspaceLayer } from '@/types/gimp';
import {
  applyBrightnessContrast,
  DEFAULT_BRIGHTNESS_CONTRAST,
} from '@/engine/imageProcessor';
import type { BrightnessContrastSettings } from '@/engine/imageProcessor';

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

  // Brightness - Contrast settings
  const [brightnessContrast, setBrightnessContrast] =
    useState<BrightnessContrastSettings>({
      ...DEFAULT_BRIGHTNESS_CONTRAST,
    });

  // URL of the original image
  const imageUrlRef = useRef<string | null>(null);

  // URL of the processed preview
  const processedUrlRef = useRef<string | null>(null);

  const [processedImageUrl, setProcessedImageUrl] =
    useState<string | null>(null);

  // Open image
  const openImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }

      imageUrlRef.current = url;

      setImage({
        fileName: file.name,
        width: img.naturalWidth,
        height: img.naturalHeight,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        url,
      });

      setBrightnessContrast({
        ...DEFAULT_BRIGHTNESS_CONTRAST,
      });

      setProcessedImageUrl(null);
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

  // Process original image whenever settings change
  useEffect(() => {
    if (!image) {
      setProcessedImageUrl(null);
      return;
    }

    let cancelled = false;
    let temporaryUrl: string | null = null;

    const img = new Image();

    img.onload = () => {
      if (cancelled) return;

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d', {
        willReadFrequently: true,
      });

      if (!ctx) return;

      try {
        ctx.drawImage(img, 0, 0);

        const originalPixels = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );

        const processedPixels = applyBrightnessContrast(
          originalPixels,
          brightnessContrast,
        );

        ctx.putImageData(processedPixels, 0, 0);

        canvas.toBlob((blob) => {
          if (cancelled || !blob) return;

          temporaryUrl = URL.createObjectURL(blob);

          if (processedUrlRef.current) {
            URL.revokeObjectURL(processedUrlRef.current);
          }

          processedUrlRef.current = temporaryUrl;
          setProcessedImageUrl(temporaryUrl);
        }, 'image/png');
      } catch (error) {
        console.error('Image processing error:', error);
      }
    };

    img.onerror = () => {
      console.error('Cannot load original image for processing.');
    };

    img.src = image.url;

    return () => {
      cancelled = true;

      if (temporaryUrl) {
        URL.revokeObjectURL(temporaryUrl);
      }
    };
  }, [image, brightnessContrast]);

  // Update brightness
  const setBrightness = useCallback((value: number) => {
    setBrightnessContrast((prev) => ({
      ...prev,
      brightness: value,
    }));
  }, []);

  // Update contrast
  const setContrast = useCallback((value: number) => {
    setBrightnessContrast((prev) => ({
      ...prev,
      contrast: value,
    }));
  }, []);

  // Reset brightness and contrast
  const resetBrightnessContrast = useCallback(() => {
    setBrightnessContrast({
      ...DEFAULT_BRIGHTNESS_CONTRAST,
    });
  }, []);

  // Close image
  const closeImage = useCallback(() => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }

    if (processedUrlRef.current) {
      URL.revokeObjectURL(processedUrlRef.current);
      processedUrlRef.current = null;
    }

    setImage(null);
    setProcessedImageUrl(null);
    setLayers([]);
    setZoom(1);

    setBrightnessContrast({
      ...DEFAULT_BRIGHTNESS_CONTRAST,
    });
  }, []);

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }

      if (processedUrlRef.current) {
        URL.revokeObjectURL(processedUrlRef.current);
      }
    };
  }, []);

  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId
          ? { ...layer, visible: !layer.visible }
          : layer,
      ),
    );
  }, []);

  // Select active layer
  const selectLayer = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) => ({
        ...layer,
        isActive: layer.id === layerId,
      })),
    );
  }, []);

  return {
    activeTool,
    setActiveTool,
    image,
    processedImageUrl,
    openImage,
    closeImage,
    layers,
    toggleLayerVisibility,
    selectLayer,
    zoom,
    setZoom,
    brightnessContrast,
    setBrightness,
    setContrast,
    resetBrightnessContrast,
  };
}

export type Workspace = ReturnType<typeof useWorkspace>;
