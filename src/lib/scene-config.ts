import * as THREE from "three";

export const MODEL_URL = "/models/workbench.glb";

export type ScreenPlacement = {
  /** World position of the surface centre. */
  position: [number, number, number];
  /** Euler XYZ where +X is screen-right, +Y screen-up, +Z the surface normal. */
  rotation: [number, number, number];
  width: number;
  height: number;
};

/**
 * Measured off the GLB with the coplanar-face picker (run with `?debug`).
 * The model has no useful node names, so surfaces are described by transform.
 */
export const MONITOR: ScreenPlacement = {
  position: [-0.2446, 1.2763, -0.1989],
  rotation: [0, 1.2474, 0],
  width: 0.3552,
  height: 0.2914,
};

export const CRT: ScreenPlacement = {
  position: [-0.0231, 0.9637, -0.0851],
  rotation: [0, 1.4002, 0],
  width: 0.1596,
  height: 0.108,
};

/** Height of the bench top, measured with the picker (`?debug`). */
export const DESK_SURFACE_Y = 0.739;
/** Props sit a hair above the measured surface to avoid z-fighting with the GLB. */
const DESK_PROP_Y = DESK_SURFACE_Y + 0.004;

export type PropPlacement = {
  id: string;
  url: string;
  /** Where the base of the prop meets the bench, in world space. */
  position: [number, number, number];
  /** Real-world size in metres, applied to the axis named by `fit`. */
  size: number;
  fit?: "width" | "height";
  /** Yaw, in radians. */
  spin?: number;
  /** Pitch and roll, for things that don't sit perfectly flat. */
  tilt?: [number, number];
};

const MONSTER = "/models/props/monster.glb";
const ZYN = "/models/props/zyn.glb";

/**
 * Scanned clutter on clear patches of the bench. Keep these upright, spaced
 * apart, and away from the monitor / keyboard — tilts and stacks clip through
 * the desk GLB and overlapping copies z-fight.
 */
export const PROPS: PropPlacement[] = [
  {
    // Bare bench beside the mouse: the mouse ends at z -0.27, the fan starts at
    // z -0.62, and the bench lip rolls off past x 0.37.
    id: "ashtray",
    url: "/models/props/ashtray.glb",
    position: [0.19, DESK_PROP_Y, -0.47],
    size: 0.45,
    spin: 0.35,
  },
  {
    id: "monster-1",
    url: MONSTER,
    position: [0.31, DESK_PROP_Y, 0.09],
    size: 0.168,
    fit: "height",
    spin: -0.4,
  },
  {
    id: "monster-3",
    url: MONSTER,
    position: [-0.24, DESK_PROP_Y, 0.39],
    size: 0.158,
    fit: "height",
    spin: 0.35,
  },
  {
    id: "monster-4",
    url: MONSTER,
    position: [0.07, DESK_PROP_Y, 0.45],
    size: 0.155,
    fit: "height",
    spin: -1.2,
  },
  {
    id: "zyn-1",
    url: ZYN,
    position: [0.14, DESK_PROP_Y, 0.3],
    size: 0.066,
    spin: 0.9,
  },
  {
    id: "zyn-2",
    url: ZYN,
    position: [-0.2, DESK_PROP_Y, 0.42],
    size: 0.064,
    spin: 1.4,
  },
  {
    id: "zyn-4",
    url: ZYN,
    position: [-0.06, DESK_PROP_Y, 0.33],
    size: 0.06,
    spin: 2.1,
  },
];

/** Centre of the hanging bulb's glow sprite, used as the lamp hotspot. */
export const BULB_POSITION: [number, number, number] = [-0.21, 1.5, -0.016];

/** Baked glow sprites; they float in front of the monitor and eat raycasts. */
export const GLOW_MATERIALS = ["Material.032", "Material.033"];

export function surfaceNormal(placement: ScreenPlacement) {
  return new THREE.Vector3(0, 0, 1).applyEuler(
    new THREE.Euler(...placement.rotation),
  );
}

/** Camera position that frames a surface head-on, with a little padding. */
export function frontalShot(
  placement: ScreenPlacement,
  fov: number,
  padding = 1.12,
) {
  const distance =
    ((placement.height * padding) / 2) / Math.tan((fov * Math.PI) / 360);
  const position = new THREE.Vector3(...placement.position).addScaledVector(
    surfaceNormal(placement),
    distance,
  );
  return {
    position: position.toArray() as [number, number, number],
    target: placement.position,
    fov,
  };
}

export type CameraShot = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
};

export const SHOTS: Record<"intro" | "desk" | "monitor", CameraShot> = {
  intro: { position: [3.1, 2.35, 3.4], target: [-0.05, 0.95, -0.05], fov: 42 },
  desk: { position: [1.72, 1.52, 1.98], target: [-0.06, 1.02, -0.06], fov: 36 },
  monitor: frontalShot(MONITOR, 30),
};

/** Orbit limits for the free-look desk stage, so you can't leave the diorama. */
export const ORBIT = {
  minDistance: 0.85,
  maxDistance: 3.6,
  minPolarAngle: 0.35,
  maxPolarAngle: Math.PI / 2.06,
  minAzimuthAngle: -0.15,
  maxAzimuthAngle: Math.PI / 2.15,
};

/**
 * The OS is authored at a fixed pixel resolution and mapped onto the monitor
 * quad. drei's Html divides the object matrix by `400 / distanceFactor`, so
 * this keeps one CSS pixel exactly `width / uiWidth` world units.
 */
// 800px maps the panel to roughly one CSS pixel per screen pixel at the
// monitor shot, so the 11px Windows chrome lands at its intended size.
export const UI_WIDTH = 800;
export const UI_HEIGHT = Math.round(
  (UI_WIDTH * MONITOR.height) / MONITOR.width,
);
export const UI_DISTANCE_FACTOR = (400 * MONITOR.width) / UI_WIDTH;
export const TASKBAR_HEIGHT = 28;
export const MAXIMIZED_WINDOW_HEIGHT = UI_HEIGHT - TASKBAR_HEIGHT;
