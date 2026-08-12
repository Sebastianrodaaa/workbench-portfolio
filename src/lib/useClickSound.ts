import { useEffect } from "react";
import { mouseClick, preloadMouseClick } from "./audio";
import { useStore } from "../store/useStore";

/** Play a mouse click when interacting with the in-scene OS on the monitor. */
export function useClickSound() {
  useEffect(() => {
    preloadMouseClick();
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (useStore.getState().stage !== "monitor") return;
      const target = event.target as Element | null;
      if (!target?.closest(".screen-root")) return;
      if (target.closest("input, textarea, select")) return;
      mouseClick();
    };

    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);
}
