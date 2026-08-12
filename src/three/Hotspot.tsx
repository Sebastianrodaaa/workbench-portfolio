import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useStore } from "../store/useStore";

type Props = {
  position: [number, number, number];
  radius?: number;
  label: string;
  onSelect: () => void;
};

/**
 * An invisible pick target with a soft pulsing ring, for props in the GLB that
 * are worth clicking but have no geometry of their own to hang events on.
 */
export function Hotspot({ position, radius = 0.045, label, onSelect }: Props) {
  const ring = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);
  const setHovered = useStore((state) => state.setHovered);
  const stage = useStore((state) => state.stage);

  useFrame(({ camera, clock }, rawDelta) => {
    const mesh = ring.current;
    if (!mesh) return;
    const delta = Math.min(rawDelta, 1 / 30);
    mesh.lookAt(camera.position);
    const visible = stage === "desk";
    const pulse = 0.85 + Math.sin(clock.elapsedTime * 2.4) * 0.12;
    const target = visible ? (hovered.current ? 1.25 : pulse) : 0.001;
    const scale = THREE.MathUtils.damp(mesh.scale.x, target, 8, delta);
    mesh.scale.setScalar(scale);
    const material = mesh.material as THREE.MeshBasicMaterial;
    material.opacity = THREE.MathUtils.damp(
      material.opacity,
      visible ? (hovered.current ? 0.9 : 0.45) : 0,
      8,
      delta,
    );
  });

  return (
    <group position={position}>
      <mesh ref={ring} renderOrder={3}>
        <ringGeometry args={[radius * 0.62, radius * 0.78, 32]} />
        <meshBasicMaterial
          color="#ffe6a8"
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        visible={false}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          if (stage !== "desk") return;
          onSelect();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          hovered.current = true;
          if (stage === "desk") setHovered(label);
        }}
        onPointerOut={() => {
          hovered.current = false;
          setHovered(null);
        }}
      >
        <sphereGeometry args={[radius, 12, 12]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
