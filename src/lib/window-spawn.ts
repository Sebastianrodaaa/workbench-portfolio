import { APPS } from "../os/apps/registry";
import { TASKBAR_HEIGHT, UI_HEIGHT, UI_WIDTH } from "./scene-config";
import type { WindowId } from "../store/useStore";

const SPAWN_STEP = 28;
const MARGIN = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export function opensMaximized(id: WindowId) {
  return APPS[id].openMaximized === true;
}

/** Place a window in the middle of the desktop, with a small cascade offset. */
export function spawnWindowPosition(id: WindowId, cascadeIndex: number) {
  const { width, height } = APPS[id];
  const desktopHeight = UI_HEIGHT - TASKBAR_HEIGHT;
  const baseX = Math.round((UI_WIDTH - width) / 2);
  const baseY = Math.round((desktopHeight - height) / 2);
  const offset = cascadeIndex * SPAWN_STEP;

  return {
    x: clamp(baseX + offset, MARGIN, UI_WIDTH - width - MARGIN),
    y: clamp(baseY + offset, MARGIN, desktopHeight - height - MARGIN),
  };
}
