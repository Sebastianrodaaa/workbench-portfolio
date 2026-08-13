import { create } from "zustand";

export type Stage = "loading" | "start" | "intro" | "desk" | "monitor";

export type WindowId =
  | "about"
  | "work"
  | "terminal"
  | "notes"
  | "contact"
  | "credits";

export type WindowState = {
  id: WindowId;
  x: number;
  y: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  restore?: { x: number; y: number };
};

type Store = {
  stage: Stage;
  booted: boolean;
  muted: boolean;
  lampOn: boolean;
  debug: boolean;
  hovered: string | null;
  windows: WindowState[];
  zTop: number;
  spawns: number;
  auxMode: number;

  setStage: (stage: Stage) => void;
  enter: () => void;
  setBooted: (booted: boolean) => void;
  toggleMute: () => void;
  toggleLamp: () => void;
  setHovered: (label: string | null) => void;
  cycleAux: () => void;

  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  toggleMaximizeWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, x: number, y: number) => void;
};

// Windows cascade from a point that keeps a typical panel centred on the
// 800x656 screen instead of hugging the top-left corner.
const SPAWN_ORIGIN_X = 148;
const SPAWN_ORIGIN_Y = 74;
const SPAWN_STEP = 22;

export const useStore = create<Store>((set, get) => ({
  stage: "loading",
  booted: false,
  muted: true,
  lampOn: true,
  debug: new URLSearchParams(window.location.search).has("debug"),
  hovered: null,
  windows: [],
  zTop: 10,
  spawns: 0,
  auxMode: 0,

  setStage: (stage) => set({ stage }),
  enter: () => set({ stage: "intro" }),
  setBooted: (booted) => set({ booted }),
  toggleMute: () => set({ muted: !get().muted }),
  toggleLamp: () => set({ lampOn: !get().lampOn }),
  setHovered: (hovered) => set({ hovered }),
  cycleAux: () => set({ auxMode: (get().auxMode + 1) % 3 }),

  openWindow: (id) => {
    const { windows, zTop } = get();
    if (windows.some((w) => w.id === id)) {
      set({
        zTop: zTop + 1,
        windows: windows.map((w) =>
          w.id === id ? { ...w, minimized: false, z: zTop + 1 } : w,
        ),
      });
      return;
    }
    // Cascade on a counter rather than the open window count, so a window
    // opened after a close never lands exactly on top of an existing one.
    const index = get().spawns % 8;
    set({
      zTop: zTop + 1,
      spawns: get().spawns + 1,
      windows: [
        ...windows,
        {
          id,
          x: SPAWN_ORIGIN_X + index * SPAWN_STEP,
          y: SPAWN_ORIGIN_Y + index * SPAWN_STEP,
          z: zTop + 1,
          minimized: false,
          maximized: false,
        },
      ],
    });
  },

  closeWindow: (id) =>
    set({ windows: get().windows.filter((w) => w.id !== id) }),

  focusWindow: (id) => {
    const { windows, zTop } = get();
    if (windows.find((w) => w.id === id)?.z === zTop) return;
    set({
      zTop: zTop + 1,
      windows: windows.map((w) => (w.id === id ? { ...w, z: zTop + 1 } : w)),
    });
  },

  minimizeWindow: (id) =>
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w,
      ),
    }),

  toggleMaximizeWindow: (id) =>
    set({
      windows: get().windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          return {
            ...w,
            maximized: false,
            x: w.restore?.x ?? w.x,
            y: w.restore?.y ?? w.y,
            restore: undefined,
          };
        }
        return {
          ...w,
          maximized: true,
          restore: { x: w.x, y: w.y },
          x: 0,
          y: 0,
        };
      }),
    }),

  moveWindow: (id, x, y) =>
    set({
      windows: get().windows.map((w) => {
        if (w.id !== id || w.maximized) return w;
        return { ...w, x, y };
      }),
    }),
}));
