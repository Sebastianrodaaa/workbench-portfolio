import { Text } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { postToOs, onOsReady } from "../lib/monitor-bridge";
import {
  MONITOR,
  UI_HEIGHT,
  UI_WIDTH,
  surfaceNormal,
} from "../lib/scene-config";
import {
  createIdleScreenTexture,
  createShadowTexture,
  createSmudgeTexture,
} from "../lib/screen-textures";
import { useStore } from "../store/useStore";
import { useCss3dScene } from "./Css3dRenderer";

const IFRAME_PADDING = 24;
const SCREEN_Z = 0.004;
const LAYER_SCALE = 0.0011;

type ScreenLayerProps = {
  texture: THREE.Texture;
  opacity: number;
  offset: number;
  blending?: THREE.Blending;
  materialRef?: RefObject<THREE.MeshBasicMaterial | null>;
};

function ScreenLayer({
  texture,
  opacity,
  offset,
  blending = THREE.NormalBlending,
  materialRef,
}: ScreenLayerProps) {
  return (
    <mesh position={[0, 0, offset]} renderOrder={4}>
      <planeGeometry args={[MONITOR.width, MONITOR.height]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={opacity}
        blending={blending}
        depthWrite={false}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function ScreenSurface() {
  const cssScene = useCss3dScene();
  const stage = useStore((state) => state.stage);
  const setStage = useStore((state) => state.setStage);
  const setHovered = useStore((state) => state.setHovered);

  const idleMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const shadowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const smudgeMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const dimmerRef = useRef<THREE.MeshBasicMaterial>(null);
  const cssObjectRef = useRef<CSS3DObject | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const uiOpacity = useRef(0);
  const overlayStrength = useRef(0);
  const prevStage = useRef(stage);

  const idleTexture = useMemo(() => createIdleScreenTexture(), []);
  const smudgeTexture = useMemo(() => createSmudgeTexture(), []);
  const shadowTexture = useMemo(() => createShadowTexture(), []);

  const normal = useMemo(() => surfaceNormal(MONITOR), []);
  const worldPosition = useMemo(
    () =>
      new THREE.Vector3(...MONITOR.position).addScaledVector(normal, SCREEN_Z),
    [normal],
  );

  useEffect(() => {
    const container = document.createElement("div");
    container.className = "monitor-shell";
    container.style.width = `${UI_WIDTH}px`;
    container.style.height = `${UI_HEIGHT}px`;
    container.style.opacity = "0";
    container.style.background = "transparent";
    container.style.pointerEvents = "none";

    const iframe = document.createElement("iframe");
    iframe.id = "workbench-os";
    iframe.title = "Workbench desktop";
    iframe.src = new URL("/os.html", window.location.href).href;
    iframe.className = "monitor-jitter";
    iframe.frameBorder = "0";
    iframe.loading = "eager";
    iframe.style.width = `${UI_WIDTH}px`;
    iframe.style.height = `${UI_HEIGHT}px`;
    iframe.style.padding = `${IFRAME_PADDING}px`;
    iframe.style.boxSizing = "border-box";
    iframe.style.border = "0";
    iframe.style.background = "#008080";
    iframe.addEventListener("load", () => {
      if (useStore.getState().stage === "monitor") {
        postToOs({ type: "monitor-enter" });
      }
    });
    container.appendChild(iframe);

    const object = new CSS3DObject(container);
    object.position.copy(worldPosition);
    object.rotation.set(...MONITOR.rotation);
    object.scale.set(
      MONITOR.width / UI_WIDTH,
      MONITOR.height / UI_HEIGHT,
      1,
    );

    cssScene.add(object);
    cssObjectRef.current = object;
    iframeRef.current = iframe;
    containerRef.current = container;

    return () => {
      cssScene.remove(object);
      cssObjectRef.current = null;
      iframeRef.current = null;
      containerRef.current = null;
    };
  }, [cssScene, worldPosition]);

  useEffect(() => {
    if (prevStage.current === stage) return;
    if (stage === "monitor") postToOs({ type: "monitor-enter" });
    if (prevStage.current === "monitor" && stage !== "monitor") {
      postToOs({ type: "monitor-leave" });
    }
    prevStage.current = stage;
  }, [stage]);

  useEffect(
    () =>
      onOsReady(() => {
        if (useStore.getState().stage === "monitor") {
          postToOs({ type: "monitor-enter" });
        }
      }),
    [],
  );

  useEffect(
    () => () => {
      idleTexture.dispose();
      smudgeTexture.dispose();
      shadowTexture.dispose();
    },
    [idleTexture, shadowTexture, smudgeTexture],
  );

  useFrame(({ camera }, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const engaged = stage === "monitor";

    const container = containerRef.current;
    if (container) {
      const toCamera = new THREE.Vector3()
        .subVectors(camera.position, worldPosition)
        .normalize();
      const facing = toCamera.dot(normal);
      const wanted =
        engaged && facing > 0.35 ? Math.min(1, (facing - 0.35) * 5) : 0;
      uiOpacity.current = THREE.MathUtils.damp(
        uiOpacity.current,
        wanted,
        10,
        delta,
      );

      const next = uiOpacity.current;
      container.style.opacity = String(next);
      container.style.visibility = next < 0.04 ? "hidden" : "visible";
      container.style.pointerEvents = engaged && next > 0.35 ? "auto" : "none";
    }

    overlayStrength.current = THREE.MathUtils.damp(
      overlayStrength.current,
      engaged ? uiOpacity.current : 0,
      10,
      delta,
    );
    const overlays = overlayStrength.current;

    const idleMat = idleMatRef.current;
    if (idleMat) {
      idleMat.opacity = THREE.MathUtils.damp(
        idleMat.opacity,
        engaged ? 0 : 1,
        12,
        delta,
      );
    }

    const shadowMat = shadowMatRef.current;
    if (shadowMat) shadowMat.opacity = overlays * 0.38;

    const smudgeMat = smudgeMatRef.current;
    if (smudgeMat) smudgeMat.opacity = overlays * 0.1;

    const dimmer = dimmerRef.current;
    if (dimmer) {
      if (engaged) {
        const view = new THREE.Vector3()
          .subVectors(camera.position, worldPosition)
          .normalize();
        const facing = Math.max(view.dot(normal), 0);
        const distance = camera.position.distanceTo(worldPosition);
        const distanceFactor = 1 / (distance / 2.4);
        dimmer.opacity =
          ((1 - Math.min(1, distanceFactor)) * 0.35 + (1 - facing) * 0.28) *
          overlays;
      } else {
        dimmer.opacity = THREE.MathUtils.damp(dimmer.opacity, 0, 12, delta);
      }
    }
  });

  const focusMonitor = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (stage === "desk" || stage === "intro") {
      setStage("monitor");
    }
  };

  const showClickPrompt = stage === "intro" || stage === "desk";
  const maxLayerOffset = 10 * LAYER_SCALE;

  return (
    <group position={MONITOR.position} rotation={MONITOR.rotation}>
      <mesh
        name="monitor-screen"
        position={[0, 0, 0.0016]}
        onClick={focusMonitor}
        onPointerOver={(event) => {
          event.stopPropagation();
          if (stage === "desk" || stage === "intro") {
            setHovered("Click me — sit down at the big monitor");
          }
        }}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[MONITOR.width, MONITOR.height, 24, 18]} />
        <meshBasicMaterial
          ref={idleMatRef}
          map={idleTexture}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* WebGL hole so desk geometry can occlude the CSS3D desktop. */}
      <mesh position={[0, 0, SCREEN_Z - 0.0004]}>
        <planeGeometry args={[MONITOR.width, MONITOR.height]} />
        <meshLambertMaterial
          transparent
          opacity={0}
          blending={THREE.NoBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      <ScreenLayer
        texture={shadowTexture}
        opacity={0}
        offset={4 * LAYER_SCALE}
        materialRef={shadowMatRef}
      />
      <ScreenLayer
        texture={smudgeTexture}
        opacity={0}
        offset={6 * LAYER_SCALE}
        blending={THREE.AdditiveBlending}
        materialRef={smudgeMatRef}
      />

      <mesh position={[0, 0, maxLayerOffset - 0.0002]}>
        <planeGeometry args={[MONITOR.width, MONITOR.height]} />
        <meshBasicMaterial
          ref={dimmerRef}
          color="#000000"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <EnclosingFrame depth={maxLayerOffset} />
      <ClickPrompt show={showClickPrompt} />
    </group>
  );
}

function EnclosingFrame({ depth }: { depth: number }) {
  const halfW = MONITOR.width / 2;
  const halfH = MONITOR.height / 2;
  const material = (
    <meshBasicMaterial color="#2a2b26" toneMapped={false} side={THREE.DoubleSide} />
  );

  return (
    <>
      <mesh position={[-halfW, 0, depth / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth, MONITOR.height]} />
        {material}
      </mesh>
      <mesh position={[halfW, 0, depth / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth, MONITOR.height]} />
        {material}
      </mesh>
      <mesh position={[0, halfH, depth / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[MONITOR.width, depth]} />
        {material}
      </mesh>
      <mesh position={[0, -halfH, depth / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[MONITOR.width, depth]} />
        {material}
      </mesh>
    </>
  );
}

const skipRaycast = () => {};

function ClickPrompt({ show }: { show: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }, rawDelta) => {
    const root = group.current;
    if (!root) return;
    const delta = Math.min(rawDelta, 1 / 30);
    const blink = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.5));
    const next = THREE.MathUtils.damp(root.scale.x, show ? 1 : 0, 10, delta);
    root.scale.setScalar(next);
    root.visible = next > 0.04;

    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material;
      if (!mat || Array.isArray(mat) || !("opacity" in mat)) return;
      mat.transparent = true;
      mat.depthWrite = false;
      mat.opacity = next * (mesh === root.children[0] ? 0.78 : blink);
    });

    const label = root.children[1] as {
      fillOpacity?: number;
      outlineOpacity?: number;
    };
    if (label.fillOpacity != null) {
      label.fillOpacity = next * blink;
      label.outlineOpacity = next * blink;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0.0028]} visible={false}>
      <mesh raycast={skipRaycast}>
        <planeGeometry args={[0.28, 0.078]} />
        <meshBasicMaterial
          color="#07141c"
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <Text
        fontSize={0.032}
        color="#e8fbff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
        outlineWidth={0.0016}
        outlineColor="#021018"
        raycast={skipRaycast}
      >
        CLICK ME
      </Text>
    </group>
  );
}
