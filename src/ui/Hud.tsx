import { useEffect } from "react";
import { profile } from "../lib/content";
import { useStore } from "../store/useStore";
import { setMuted } from "../lib/audio";
import { useTouchUi } from "../lib/device";

export function Hud() {
  const stage = useStore((state) => state.stage);
  const hovered = useStore((state) => state.hovered);
  const muted = useStore((state) => state.muted);
  const toggleMute = useStore((state) => state.toggleMute);
  const setStage = useStore((state) => state.setStage);
  const touch = useTouchUi();

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
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "request-desk") setStage("desk");
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("message", onMessage);
    };
  }, [setStage]);

  // At the desk the hint teaches the controls; once you are at the machine the
  // interface speaks for itself, so only hover labels remain.
    const hint =
    hovered ??
    (stage === "monitor"
      ? null
      : touch
        ? "Drag to look around · Tap the big monitor"
        : "Drag to look around · Click the big monitor to sit down");

  return (
    <div className={`hud${stage === "loading" || stage === "start" ? " dim" : ""}${stage === "monitor" ? " hud--monitor" : ""}`}>
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
