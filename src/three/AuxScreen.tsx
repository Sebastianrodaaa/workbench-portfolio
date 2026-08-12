import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CRT, surfaceNormal } from "../lib/scene-config";
import { useStore } from "../store/useStore";
import { clack } from "../lib/audio";
import { profile } from "../lib/content";

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 216;
const PHOSPHOR = "#7dffb2";
const DIM = "#1d5c3c";
const REDRAW_INTERVAL = 1 / 20;

/** The little beige terminal on the desk. Decorative, but alive. */
export function AuxScreen() {
  const auxMode = useStore((state) => state.auxMode);
  const cycleAux = useStore((state) => state.cycleAux);
  const setHovered = useStore((state) => state.setHovered);

  const { context, texture } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const context = canvas.getContext("2d")!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return { context, texture };
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  const history = useRef<number[]>(new Array(48).fill(0.4));
  const accumulator = useRef(0);
  const elapsed = useRef(0);
  const mode = useRef(auxMode);
  mode.current = auxMode;

  useFrame((_, delta) => {
    elapsed.current += delta;
    accumulator.current += delta;
    if (accumulator.current < REDRAW_INTERVAL) return;
    accumulator.current = 0;

    const fps = Math.min(1, 1 / Math.max(delta, 0.001) / 120);
    history.current.push(fps);
    history.current.shift();

    draw(context, mode.current, elapsed.current, history.current);
    texture.needsUpdate = true;
  });

  const meshOffset = useMemo(
    () =>
      surfaceNormal(CRT).multiplyScalar(0.002).toArray() as [
        number,
        number,
        number,
      ],
    [],
  );

  return (
    <group position={CRT.position} rotation={CRT.rotation}>
      <mesh
        position={meshOffset}
        renderOrder={2}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          clack();
          cycleAux();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered("Terminal — click to switch channel");
        }}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[CRT.width, CRT.height]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>
    </group>
  );
}

function draw(
  ctx: CanvasRenderingContext2D,
  mode: number,
  time: number,
  history: number[],
) {
  ctx.fillStyle = "#04160e";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.font = "12px ui-monospace, Menlo, monospace";
  ctx.textBaseline = "top";

  if (mode === 0) {
    ctx.fillStyle = PHOSPHOR;
    ctx.fillText("SYSTEM", 12, 12);
    ctx.fillStyle = DIM;
    ctx.fillText("workbench/0", 12, 30);

    const baseY = 74;
    const barWidth = 5;
    history.forEach((value, i) => {
      const height = Math.max(2, value * 62);
      ctx.fillStyle = i > history.length - 6 ? PHOSPHOR : "#2f9c64";
      ctx.fillRect(12 + i * barWidth, baseY + 62 - height, barWidth - 1, height);
    });

    ctx.fillStyle = DIM;
    ctx.fillText("frame time", 12, baseY + 70);
    ctx.fillStyle = PHOSPHOR;
    ctx.fillText(
      `${Math.round(history[history.length - 1] * 120)} fps`,
      12,
      baseY + 88,
    );
  } else if (mode === 1) {
    ctx.fillStyle = PHOSPHOR;
    ctx.fillText("SIGNAL", 12, 12);
    ctx.beginPath();
    ctx.strokeStyle = PHOSPHOR;
    ctx.lineWidth = 2;
    for (let x = 0; x <= CANVAS_WIDTH; x += 4) {
      const t = x / CANVAS_WIDTH;
      const y =
        CANVAS_HEIGHT / 2 +
        Math.sin(t * 18 + time * 3) * 28 * Math.sin(t * Math.PI) +
        Math.sin(t * 47 - time * 5) * 9 * Math.sin(t * Math.PI);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = DIM;
    ctx.fillText("no input — free running", 12, CANVAS_HEIGHT - 28);
  } else {
    const lines = [
      "READY.",
      "",
      profile.name.toUpperCase(),
      profile.shortRole.toUpperCase(),
      "",
      "USE THE BIG SCREEN",
    ];
    lines.forEach((line, i) => {
      ctx.fillStyle = i === 0 ? PHOSPHOR : "#3fbf7f";
      ctx.fillText(line, 14, 26 + i * 22);
    });
    if (Math.floor(time * 2) % 2 === 0) {
      ctx.fillStyle = PHOSPHOR;
      ctx.fillRect(14 + ctx.measureText("USE THE BIG SCREEN").width + 6, 26 + 5 * 22, 8, 12);
    }
  }

  // Scanlines over the top of everything.
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  for (let y = 0; y < CANVAS_HEIGHT; y += 3) ctx.fillRect(0, y, CANVAS_WIDTH, 1);
}
