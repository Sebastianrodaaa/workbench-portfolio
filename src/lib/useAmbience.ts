import { useEffect } from "react";
import { preloadAmbience, preloadStartupSound, setAmbienceFocus } from "./audio";
import { useStore } from "../store/useStore";

/** Keeps the office loop in sync with where the camera is. */
export function useAmbience() {
  const stage = useStore((state) => state.stage);

  useEffect(() => {
    preloadAmbience();
    preloadStartupSound();
  }, []);

  useEffect(() => {
    if (stage === "loading" || stage === "start") return;
    setAmbienceFocus(stage === "monitor");
  }, [stage]);
}
