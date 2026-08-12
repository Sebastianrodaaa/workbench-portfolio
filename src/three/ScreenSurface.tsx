import { Html } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  MONITOR,
  UI_DISTANCE_FACTOR,
  UI_HEIGHT,
  UI_WIDTH,
  surfaceNormal,
} from "../lib/scene-config";
import { useStore } from "../store/useStore";
import { OS } from "../os/OS";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Stand-in phosphor glow. The DOM interface renders on top of this quad, so
 * mostly what you see of it is the bloom halo bleeding past the bezel.
 */
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPower;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;

    // Bright enough that the tube reads as powered from across the room, where
    // the DOM interface is not yet drawn over it. Cool grey, not phosphor: the
    // desktop drawn on top of this is Windows teal.
    vec3 base = mix(vec3(0.045, 0.085, 0.105), vec3(0.10, 0.19, 0.24), uv.y);
    float scan = 0.5 + 0.5 * sin((uv.y * 620.0) - uTime * 5.0);
    base += scan * 0.06;

    float grain = hash(floor(uv * vec2(260.0, 200.0)) + floor(uTime * 24.0));
    base += (grain - 0.5) * 0.035;

    vec2 centred = uv - 0.5;
    float vignette = smoothstep(0.85, 0.16, length(centred * vec2(1.05, 1.2)));
    base *= 0.35 + vignette * 0.9;

    float flicker = 0.97 + 0.03 * sin(uTime * 41.0) * sin(uTime * 7.3);

    // Power-on wipe: a bright band opens out from the middle of the tube.
    float open = smoothstep(0.0, 0.55, uPower);
    float band = smoothstep(open, open - 0.06, abs(centred.y) * 2.0);
    float warm = smoothstep(0.45, 1.0, uPower);

    vec3 colour = base * flicker * band;
    colour += vec3(0.55, 0.78, 0.95) * (1.0 - warm) * band * 0.5;

    gl_FragColor = vec4(colour, 1.0);
    #include <colorspace_fragment>
  }
`;

export function ScreenSurface() {
  const stage = useStore((state) => state.stage);
  const setStage = useStore((state) => state.setStage);
  const setHovered = useStore((state) => state.setHovered);

  const uiRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const opacity = useRef(0);
  const power = useRef(0);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPower: { value: 0 } }),
    [],
  );

  const normal = useMemo(() => surfaceNormal(MONITOR), []);
  const worldPosition = useMemo(
    () => new THREE.Vector3(...MONITOR.position),
    [],
  );
  const toCamera = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);

    const on = stage !== "loading" && stage !== "start";
    power.current = THREE.MathUtils.damp(power.current, on ? 1 : 0, 1.6, delta);

    // Read the uniforms off the live material: the object handed to the
    // `uniforms` prop is not necessarily the one the material ends up holding.
    const live = materialRef.current?.uniforms;
    if (live) {
      live.uTime.value += delta;
      live.uPower.value = power.current;
    }

    const element = uiRef.current;
    if (!element) return;

    // Only paint the DOM desktop once you are seated at the monitor. Leaving it
    // visible while orbiting at the desk makes the CSS3D layer shear and flicker,
    // especially along the bottom edge / taskbar.
    toCamera.subVectors(camera.position, worldPosition).normalize();
    const facing = toCamera.dot(normal);
    const showUi = stage === "monitor";
    const wanted =
      showUi && facing > 0.35 ? Math.min(1, (facing - 0.35) * 5) : 0;
    const next = THREE.MathUtils.damp(opacity.current, wanted, 10, delta);

    opacity.current = next;
    element.style.opacity = String(next);
    element.style.visibility = next < 0.04 ? "hidden" : "visible";
  });

  const focusMonitor = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (stage === "desk") {
      setStage("monitor");
    }
  };

  return (
    <group position={MONITOR.position} rotation={MONITOR.rotation}>
      <mesh
        name="crt-screen"
        position={[0, 0, 0.0016]}
        onClick={focusMonitor}
        onPointerOver={(event) => {
          event.stopPropagation();
          if (stage === "desk") setHovered("Sit down at the machine");
        }}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[MONITOR.width, MONITOR.height]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          toneMapped={false}
        />
      </mesh>

      <Html
        transform
        distanceFactor={UI_DISTANCE_FACTOR}
        position={[0, 0, 0.004]}
        zIndexRange={[8, 0]}
        occlude={false}
        wrapperClass="screen-wrapper"
        // drei puts this on its own wrapper div; without it the panel keeps
        // eating scene clicks even when our own root is inert.
        pointerEvents={stage === "monitor" ? "auto" : "none"}
      >
        <div
          ref={uiRef}
          className="screen-root"
          style={{
            width: UI_WIDTH,
            height: UI_HEIGHT,
            opacity: 0,
            // Driven by React, not the render loop: a stalled frame loop must
            // never leave the panel swallowing clicks meant for the scene.
            pointerEvents: stage === "monitor" ? "auto" : "none",
          }}
        >
          <OS />
        </div>
      </Html>
    </group>
  );
}
