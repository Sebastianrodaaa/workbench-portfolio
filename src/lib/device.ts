import { useEffect, useState } from "react";

/** Phones and small tablets: the CRT OS is unusable in CSS3D, so we overlay it. */
const COMPACT_QUERY = "(max-width: 820px)";
const TOUCH_QUERY = "(pointer: coarse)";

export function isCompactUi() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(COMPACT_QUERY).matches;
}

export function isTouchUi() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(TOUCH_QUERY).matches;
}

export function useCompactUi() {
  const [compact, setCompact] = useState(isCompactUi);
  useEffect(() => {
    const query = window.matchMedia(COMPACT_QUERY);
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return compact;
}

export function useTouchUi() {
  const [touch, setTouch] = useState(isTouchUi);
  useEffect(() => {
    const query = window.matchMedia(TOUCH_QUERY);
    const sync = () => setTouch(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return touch;
}

/**
 * Perspective cameras use vertical FOV, so a tall phone sees a sliver of the
 * desk. Widen the FOV until a usable horizontal slice of the workbench fits.
 */
export function adaptedFov(baseFov: number, aspect: number) {
  if (aspect >= 1.05) return baseFov;
  const targetHorizontal = (40 * Math.PI) / 180;
  const vertical =
    ((2 * Math.atan(Math.tan(targetHorizontal / 2) / aspect)) * 180) / Math.PI;
  return Math.min(64, Math.max(baseFov, vertical));
}
