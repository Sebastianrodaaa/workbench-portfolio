import { useEffect } from "react";
import { mouseClick, preloadMouseClick } from "./audio";
import { useStore } from "../store/useStore";

/** Ignore look-around drags so orbiting the desk does not fire a click. */
const DRAG_PX = 8;

/**
 * Play the sampled mouse click on any real left-click after the POST screen.
 * Used in both the 3D shell and the in-monitor OS iframe.
 */
export function useClickSound() {
  useEffect(() => {
    preloadMouseClick();
    let downX = 0;
    let downY = 0;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      downX = event.clientX;
      downY = event.clientY;
    };

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (useStore.getState().stage === "loading") return;
      const target = event.target as Element | null;
      if (target?.closest("input, textarea, select")) return;
      const dx = event.clientX - downX;
      const dy = event.clientY - downY;
      if (dx * dx + dy * dy > DRAG_PX * DRAG_PX) return;
      mouseClick();
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("click", onClick, true);
    };
  }, []);
}
