import { useEffect } from "react";
import { preloadAmbience, setAmbienceFocus } from "./audio";
import { useStore } from "../store/useStore";

/** Keeps the office loop in sync with where the camera is. */
export function useAmbience() {
  const stage = useStore((state) => state.stage);

  useEffect(() => {
    preloadAmbience();
  }, []);

  useEffect(() => {
    if (stage === "loading" || stage === "start") return;
    setAmbienceFocus(stage === "monitor");
  }, [stage]);
}
