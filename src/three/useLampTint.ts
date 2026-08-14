import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useStore } from "../store/useStore";

/** Everything in the room fades toward this when the bulb is off. */
const LAMP_OFF_TINT = new THREE.Color("#38414f");

type Tintable = {
  material: THREE.Material & { color?: THREE.Color };
  base: THREE.Color;
};

type Options = {
  envMapIntensity?: number;
  /** Scans and glossy props read better with a little roughness added. */
  roughnessBoost?: number;
  /**
   * Ceiling for metalness. Photogrammetry converted from spec/gloss often comes
   * out fully metallic, which renders black against this room's tiny env map.
   */
  maxMetalness?: number;
  /** Skip color tint — glow sprites go black over the CRT if darkened. */
  skip?: (material: THREE.Material) => boolean;
};

/**
 * Dims every material under `root` with the workshop lamp, and returns the
 * eased lamp level so callers can drive anything else off it.
 */
export function useLampTint(
  root: THREE.Object3D,
  {
    envMapIntensity = 0.35,
    roughnessBoost = 0.15,
    maxMetalness = 1,
    skip,
  }: Options = {},
): RefObject<number> {
  const level = useRef(1);

  const tintables = useMemo(() => {
    const found: Tintable[] = [];
    const seen = new Set<THREE.Material>();

    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      for (const material of materials) {
        if (!material || seen.has(material) || skip?.(material)) continue;
        seen.add(material);
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = envMapIntensity;
          material.roughness = Math.min(1, material.roughness + roughnessBoost);
          material.metalness = Math.min(material.metalness, maxMetalness);
        }
        const colored = material as THREE.Material & { color?: THREE.Color };
        if (colored.color) {
          found.push({ material: colored, base: colored.color.clone() });
        }
      }
    });

    return found;
  }, [root, envMapIntensity, roughnessBoost, maxMetalness, skip]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const target = useStore.getState().lampOn ? 1 : 0;
    const next = THREE.MathUtils.damp(level.current, target, 3.2, delta);
    if (Math.abs(next - level.current) < 0.0005) return;
    level.current = next;
    for (const { material, base } of tintables) {
      material.color!.copy(LAMP_OFF_TINT).lerp(base, next);
    }
  });

  return level;
}
