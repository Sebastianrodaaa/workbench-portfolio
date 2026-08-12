import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SHOTS, type CameraShot } from "../lib/scene-config";
import { useStore } from "../store/useStore";

type OrbitLike = {
  enabled: boolean;
  target: THREE.Vector3;
  update: () => void;
};

const SETTLE_DISTANCE = 0.012;

export function CameraRig() {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const controls = useThree((state) => state.controls) as OrbitLike | null;
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

    const shot: CameraShot =
      stage === "monitor"
        ? SHOTS.monitor
        : stage === "loading" || stage === "start"
          ? SHOTS.intro
          : SHOTS.desk;

    // The opening dolly is deliberately slower than the desk/monitor hops.
    const smoothing = stage === "intro" ? 1.15 : 0.62;

    goal.current.set(...shot.position);
    easing.damp3(camera.position, goal.current, smoothing, delta);
    easing.damp3(lookAt.current, shot.target, smoothing * 0.8, delta);
    easing.damp(camera, "fov", shot.fov, smoothing, delta);
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
    }
  });

  return null;
}
