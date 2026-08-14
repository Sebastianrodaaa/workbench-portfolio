import { useCallback, useEffect } from "react";
import { profile } from "../lib/content";
import { playStartupSound, startAmbience, startHum } from "../lib/audio";
import { useTouchUi } from "../lib/device";
import { useStore } from "../store/useStore";

const SHOWCASE_YEAR = 2026;

export function StartScreen() {
  const stage = useStore((state) => state.stage);
  const setStage = useStore((state) => state.setStage);
  const muted = useStore((state) => state.muted);
  const toggleMute = useStore((state) => state.toggleMute);
  const touch = useTouchUi();

  const begin = useCallback(() => {
    playStartupSound();
    startHum();
    startAmbience();
    if (muted) toggleMute();
    setStage("intro");
  }, [muted, toggleMute, setStage]);

  useEffect(() => {
    if (stage !== "start") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") begin();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, begin]);

  return (
    <div className={`start-screen${stage !== "start" ? " hidden" : ""}`}>
      <div className="start-panel">
        <p className="start-title">
          {profile.name} Portfolio Showcase {SHOWCASE_YEAR}
        </p>
        <p className="start-subtitle">
          {touch ? "Tap start to begin" : "Click start to begin"}
        </p>
        <button type="button" className="start-button" autoFocus onClick={begin}>
          START
        </button>
      </div>
    </div>
  );
}
