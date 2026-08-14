import { useGLTF } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { GLOW_MATERIALS, MODEL_URL } from "../lib/scene-config";
import { useLampTint } from "./useLampTint";

const skipGlow = (material: THREE.Material) =>
  GLOW_MATERIALS.includes(material.name);

type Props = {
  onPick?: (hit: ThreeEvent<PointerEvent>) => void;
};

export function Workbench({ onPick }: Props) {
  const { scene } = useGLTF(MODEL_URL);
  const level = useLampTint(scene, { skip: skipGlow });

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
      for (const material of materials) {
        material.transparent = true;
        material.depthWrite = false;
        material.blending = THREE.AdditiveBlending;
      }
    });
    return found;
  }, [scene]);

  useFrame(() => {
    const lamp = level.current;
    for (const glow of glows) {
      glow.visible = lamp > 0.02;
      const materials = Array.isArray(glow.material)
        ? glow.material
        : [glow.material];
      for (const material of materials) {
        material.opacity = lamp;
      }
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
