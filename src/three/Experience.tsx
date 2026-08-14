import {
  Environment,
  Lightformer,
  OrbitControls,
  Preload,
} from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { lazy, Suspense } from "react";
import { BULB_POSITION, ORBIT, PROPS, SHOTS } from "../lib/scene-config";
import { useStore } from "../store/useStore";
import { AuxScreen } from "./AuxScreen";
import { CameraRig } from "./CameraRig";
import { Css3dBridge, Css3dSync } from "./Css3dRenderer";
import { Hotspot } from "./Hotspot";
import { Prop } from "./Prop";
import { ScreenSurface } from "./ScreenSurface";
import { Workbench } from "./Workbench";
import { clack } from "../lib/audio";

// The postprocessing stack is the single heaviest dependency here, and phones
// never render it — keep it out of the initial payload.
const Effects = lazy(() =>
  import("./Effects").then((module) => ({ default: module.Effects })),
);

type Props = {
  effects: boolean;
  compact?: boolean;
  onPick?: (hit: ThreeEvent<PointerEvent>) => void;
};

export function Experience({ effects, compact = false, onPick }: Props) {
  const toggleLamp = useStore((state) => state.toggleLamp);

  return (
    <Css3dBridge>
      {!compact && <Css3dSync />}
      <color attach="background" args={["#06060a"]} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[2.4, 3.2, 1.8]} intensity={0.45} />
      <hemisphereLight args={["#ffd7b0", "#20222c", 0.5]} />

      <Suspense fallback={null}>
        <Workbench onPick={onPick} />
        {PROPS.map((prop) => (
          <Prop key={prop.id} {...prop} />
        ))}
        <ScreenSurface />
        <AuxScreen />
        {/* Local lightformer rig instead of a CDN HDRI, so nothing is fetched
            at runtime for the handful of PBR materials in the model. */}
        <Environment resolution={64} frames={1}>
          <Lightformer
            intensity={1.4}
            position={[1.2, 2.2, 1.4]}
            scale={[3, 3, 1]}
            color="#ffe3c2"
          />
          <Lightformer
            intensity={0.6}
            position={[-2, 1.4, -1.6]}
            scale={[4, 2, 1]}
            color="#7f9dff"
          />
        </Environment>
        <Preload all />
      </Suspense>

      <Hotspot
        position={BULB_POSITION}
        radius={compact ? 0.09 : 0.05}
        label="Pull the cord"
        onSelect={() => {
          clack();
          toggleLamp();
        }}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={compact ? 0.85 : 0.55}
        zoomSpeed={compact ? 0.55 : 0.65}
        target={SHOTS.desk.target}
        {...ORBIT}
      />
      <CameraRig />
      {effects && (
        <Suspense fallback={null}>
          <Effects />
        </Suspense>
      )}
    </Css3dBridge>
  );
}
