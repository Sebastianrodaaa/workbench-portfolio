import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { adaptedFov, isCompactUi } from "../lib/device";
import { SHOTS, type CameraShot } from "../lib/scene-config";
import { useStore } from "../store/useStore";

type OrbitLike = {
  enabled: boolean;
  target: THREE.Vector3;
  update: () => void;
};

const SETTLE_DISTANCE = 0.012;

function pullBack(
  position: [number, number, number],
  target: [number, number, number],
  amount: number,
): [number, number, number] {
  const pos = new THREE.Vector3(...position);
  const look = new THREE.Vector3(...target);
  pos.sub(look).multiplyScalar(amount).add(look);
  return pos.toArray() as [number, number, number];
}

export function CameraRig() {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const controls = useThree((state) => state.controls) as OrbitLike | null;
  const size = useThree((state) => state.size);
  const stage = useStore((state) => state.stage);
  const setStage = useStore((state) => state.setStage);

  const goal = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());
  const handedOver = useRef(false);
  const advanced = useRef(false);

  useEffect(() => {
    const shot = SHOTS.intro;
    camera.position.set(...shot.position);
    camera.fov = shot.fov;
    camera.updateProjectionMatrix();
    lookAt.current.set(...shot.target);
    camera.lookAt(lookAt.current);
  }, [camera]);

  useEffect(() => {
    handedOver.current = false;
    advanced.current = false;
    if (controls) controls.enabled = false;
  }, [stage, controls]);

  useFrame((_, rawDelta) => {
    if (handedOver.current) return;

    // Coming back from a background tab hands us a huge delta, which would
    // teleport the camera instead of easing it.
    const delta = Math.min(rawDelta, 1 / 30);
    const compact = isCompactUi();
    const aspect = size.width / Math.max(size.height, 1);

    // On a phone the OS is a full-screen overlay, so stay at the desk instead
    // of dollying into a CRT you can't actually use.
    const shot: CameraShot =
      stage === "monitor" && !compact
        ? SHOTS.monitor
        : stage === "loading" || stage === "start"
          ? SHOTS.intro
          : SHOTS.desk;

    const fov = adaptedFov(shot.fov, aspect);
    const position =
      aspect < 1.05 ? pullBack(shot.position, shot.target, 1.2) : shot.position;

    // The opening dolly is deliberately slower than the desk/monitor hops.
    const smoothing = stage === "intro" ? 1.15 : 0.62;

    goal.current.set(...position);
    easing.damp3(camera.position, goal.current, smoothing, delta);
    easing.damp3(lookAt.current, shot.target, smoothing * 0.8, delta);
    easing.damp(camera, "fov", fov, smoothing, delta);
    camera.updateProjectionMatrix();
    camera.lookAt(lookAt.current);

    if (controls) controls.target.copy(lookAt.current);

    const settled = camera.position.distanceTo(goal.current) < SETTLE_DISTANCE;
    if (!settled) return;

    if (stage === "intro") {
      // A latch, because frames keep arriving before React re-renders with the
      // new stage and this must not fire twice.
      if (!advanced.current) {
        advanced.current = true;
        setStage("desk");
      }
      return;
    }
    if (stage === "desk" && controls) {
      // Hand the camera back to the user once the move has finished.
      controls.enabled = true;
      controls.update();
      handedOver.current = true;
      return;
    }
    if (compact && stage === "monitor") {
      if (controls) controls.enabled = false;
      handedOver.current = true;
    }
  });

  return null;
}
