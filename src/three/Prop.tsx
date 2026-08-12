import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { PROPS, type PropPlacement } from "../lib/scene-config";
import { useLampTint } from "./useLampTint";

function clonePropScene(template: THREE.Object3D) {
  const scene = template.clone(true);
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    if (Array.isArray(child.material)) {
      child.material = child.material.map((material) => material.clone());
      return;
    }
    if (child.material) child.material = child.material.clone();
  });
  return scene;
}

/**
 * A scanned object dropped onto the desk. Scans arrive at arbitrary scale and
 * origin, so the model is measured once and re-based: centred on its footprint,
 * standing on y = 0, and scaled to a real-world size.
 */
export function Prop({
  url,
  position,
  size,
  fit = "width",
  spin = 0,
  tilt = [0, 0],
}: PropPlacement) {
  const { scene: template } = useGLTF(url);
  const scene = useMemo(() => clonePropScene(template), [template]);
  useLampTint(scene, {
    roughnessBoost: 0.1,
    envMapIntensity: 0.7,
    maxMetalness: 0.15,
  });

  const { offset, scale } = useMemo(() => {
    // Measured on a clone: the live object is parented to a scaled group by
    // the time this recomputes, and its world box would fold that back in.
    const bounds = new THREE.Box3().setFromObject(scene.clone());
    const extent = bounds.getSize(new THREE.Vector3());
    const centre = bounds.getCenter(new THREE.Vector3());
    return {
      offset: [-centre.x, -bounds.min.y, -centre.z] as [
        number,
        number,
        number,
      ],
      scale: size / (fit === "height" ? extent.y : Math.max(extent.x, extent.z)),
    };
  }, [scene, size, fit]);

  return (
    <group position={position} rotation={[tilt[0], spin, tilt[1]]} scale={scale}>
      <group position={offset}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

for (const url of new Set(PROPS.map((prop) => prop.url))) {
  useGLTF.preload(url);
}
