import useEventListener from "../../../../../hooks/useEventListener";
import { useEffect, useState } from "preact/compat";
import { getFromStorage, saveToStorage } from "../../../../../utils/storage";
import { getFaviconStorageKey, updateFaviconColor } from "../../../../../utils/favicon";

const FAVICON_STORAGE_KEY = "FAVICON_COLOR";

const storageKey = getFaviconStorageKey();

const getColorsFromStorage = () => {
  return getFromStorage(FAVICON_STORAGE_KEY) as Record<string, string> | null;
};

export const useBrowserTabSync = () => {
  const [faviconColor, setFaviconColor] = useState(() => getColorsFromStorage()?.[storageKey]);

  const handleUpdateColor = () => {
    const colorsFromStorage = getColorsFromStorage();
    const color = colorsFromStorage?.[storageKey];
    setFaviconColor(color);
  };

  const changeFaviconColor = (color?: string) => {
    const { [storageKey]: _, ...colorsFromStorage } = getColorsFromStorage() || {};
    const nextColors = { ...colorsFromStorage };

    if (color) {
      nextColors[storageKey] = color;
    }

    saveToStorage(FAVICON_STORAGE_KEY, nextColors);
  };

  useEffect(() => {
    handleUpdateColor();
  }, []);

  useEffect(() => {
    updateFaviconColor(faviconColor);
  }, [faviconColor]);

  useEventListener("storage", handleUpdateColor);

  return {
    faviconColor,
    changeFaviconColor,
  };
};
