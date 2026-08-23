import { useEffect } from "react";
import { mouseClick, preloadMouseClick } from "./audio";
import { postToParent } from "./monitor-bridge";
import { useStore } from "../store/useStore";

/** Ignore look-around drags so orbiting the desk does not fire a click. */
const DRAG_PX = 8;

const inOsFrame = () => window.parent !== window;

function shouldPlay(event: MouseEvent, downX: number, downY: number) {
  if (event.button !== 0) return false;
  const target = event.target as Element | null;
  if (target?.closest("input, textarea, select")) return false;
  const dx = event.clientX - downX;
  const dy = event.clientY - downY;
  return dx * dx + dy * dy <= DRAG_PX * DRAG_PX;
}

/**
 * Play the sampled mouse click on any real left-click after the POST screen.
 * Monitor clicks happen inside the OS iframe, which has its own muted audio
 * graph — those are forwarded here so they play through the parent bus.
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
      if (!shouldPlay(event, downX, downY)) return;
      if (inOsFrame()) {
        postToParent({ type: "os-click" });
        return;
      }
      if (useStore.getState().stage === "loading") return;
      mouseClick();
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("click", onClick, true);

    if (!inOsFrame()) {
      const onMessage = (event: MessageEvent) => {
        if (event.data?.type === "os-click") mouseClick();
      };
      window.addEventListener("message", onMessage);
      return () => {
        window.removeEventListener("pointerdown", onPointerDown, true);
        window.removeEventListener("click", onClick, true);
        window.removeEventListener("message", onMessage);
      };
    }

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("click", onClick, true);
    };
  }, []);
}
