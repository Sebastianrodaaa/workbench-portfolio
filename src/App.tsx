import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import * as THREE from "three";
import { useClickSound } from "./lib/useClickSound";
import { useAmbience } from "./lib/useAmbience";
import { Experience } from "./three/Experience";
import { Hud } from "./ui/Hud";
import { LoadingScreen } from "./ui/LoadingScreen";
import { StartScreen } from "./ui/StartScreen";
import { pickCoplanarQuad, type QuadInfo } from "./lib/pick-quad";
import { SHOTS } from "./lib/scene-config";
import { useStore } from "./store/useStore";
import "./ui/ui.css";

if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).useStore = useStore;
}

export default function App() {
  const debug = useStore((state) => state.debug);
  useClickSound();
  useAmbience();
  const [pick, setPick] = useState<{
    point: [number, number, number];
    quad: QuadInfo | null;
  } | null>(null);

  // Coarse pointers are usually phones: skip the effect stack and cap the
  // pixel ratio harder.
  const lowPower = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
    [],
  );

  return (
    <div className="stage">
      <Canvas
        flat
        shadows={false}
        dpr={lowPower ? [1, 1.5] : [1, 2]}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          alpha: false,
        }}
        camera={{
          position: SHOTS.intro.position,
          fov: SHOTS.intro.fov,
          near: 0.02,
          far: 60,
        }}
      >
        <Experience
          effects={!lowPower}
          onPick={
            debug
              ? (event) => {
                  const quad = pickCoplanarQuad(
                    event as unknown as THREE.Intersection,
                  );
                  const next = {
                    point: event.point
                      .toArray()
                      .map((n) => Number(n.toFixed(4))) as [
                      number,
                      number,
                      number,
                    ],
                    quad,
                  };
                  setPick(next);
                  console.info("[pick]", next);
                }
              : undefined
          }
        />
      </Canvas>

      <Hud />
      <LoadingScreen />
      <StartScreen />

      {debug && (
        <pre
          style={{
            position: "fixed",
            left: 12,
            bottom: 12,
            zIndex: 200,
            margin: 0,
            padding: 12,
            font: "12px ui-monospace, monospace",
            color: "#8ef",
            background: "rgba(0,0,0,.72)",
            borderRadius: 8,
            pointerEvents: "none",
          }}
        >
          {pick ? JSON.stringify(pick, null, 2) : "debug — click a surface"}
        </pre>
      )}
    </div>
  );
}
