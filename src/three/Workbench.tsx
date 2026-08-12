import { useGLTF } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { GLOW_MATERIALS, MODEL_URL } from "../lib/scene-config";
import { useLampTint } from "./useLampTint";

type Props = {
  onPick?: (hit: ThreeEvent<PointerEvent>) => void;
};

export function Workbench({ onPick }: Props) {
  const { scene } = useGLTF(MODEL_URL);
  const level = useLampTint(scene);

  const glows = useMemo(() => {
    const found: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      if (!materials.some((m) => GLOW_MATERIALS.includes(m.name))) return;
      found.push(child);
      // These billboards hang in front of the monitor and would swallow
      // every click aimed at the screen.
      child.raycast = () => null;
    });
    return found;
  }, [scene]);

  useFrame(() => {
    const visible = level.current > 0.08;
    for (const glow of glows) {
      if (glow.visible !== visible) glow.visible = visible;
    }
  });

  return (
    <primitive
      object={scene}
      onPointerDown={
        onPick
          ? (event: ThreeEvent<PointerEvent>) => {
              event.stopPropagation();
              onPick(event);
            }
          : undefined
      }
    />
  );
}

useGLTF.preload(MODEL_URL);
