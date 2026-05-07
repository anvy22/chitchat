import { useState, useCallback } from "react";
import { canvasService } from "@/services/canvas/canvas-service";
import { CanvasData } from "@/types";

/**
 * Hook for loading a canvas by ID.
 */
export function useLoadCanvas() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadCanvas = useCallback(async (id: string): Promise<CanvasData | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await canvasService.loadCanvas(id);
      return data;
    } catch (err: any) {
      console.error("Failed to load canvas:", err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { loadCanvas, isLoading, error };
}

/**
 * Hook for saving a canvas.
 */
export function useSaveCanvas() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveCanvas = useCallback(async (data: CanvasData): Promise<boolean> => {
    setIsSaving(true);
    setError(null);
    try {
      await canvasService.saveCanvas(data);
      console.log("Canvas saved successfully!");
      return true;
    } catch (err: any) {
      console.error("Failed to save canvas:", err);
      setError(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { saveCanvas, isSaving, error };
}

/**
 * Hook for listing all canvases.
 */
export function useCanvases() {
  const [canvases, setCanvases] = useState<CanvasData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCanvases = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await canvasService.listCanvases();
      setCanvases(data);
    } catch (err: any) {
      console.error("Failed to list canvases:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { canvases, fetchCanvases, isLoading, error };
}
