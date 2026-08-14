import { useEffect } from "react";
import { profile } from "../lib/content";
import { useStore } from "../store/useStore";
import { setMuted } from "../lib/audio";

export function Hud() {
  const stage = useStore((state) => state.stage);
  const hovered = useStore((state) => state.hovered);
  const muted = useStore((state) => state.muted);
  const toggleMute = useStore((state) => state.toggleMute);
  const setStage = useStore((state) => state.setStage);

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (useStore.getState().stage === "monitor") setStage("desk");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setStage]);

  // At the desk the hint teaches the controls; once you are at the machine the
  // interface speaks for itself, so only hover labels remain.
  const hint =
    hovered ??
    (stage === "monitor"
      ? null
      : "Drag to look around · Click the big monitor to sit down");

  return (
    <div className={`hud${stage === "loading" || stage === "start" ? " dim" : ""}`}>
      <div className="brand">
        {profile.name}
        <small>{profile.role}</small>
      </div>

      <div className="controls">
        {stage === "monitor" && (
          <button type="button" onClick={() => setStage("desk")}>
            ← Step back
          </button>
        )}
        <button type="button" onClick={toggleMute}>
          {muted ? "Sound off" : "Sound on"}
        </button>
      </div>

      {hint && (
        <div className="hint">{hovered ? <strong>{hint}</strong> : hint}</div>
      )}
    </div>
  );
}
