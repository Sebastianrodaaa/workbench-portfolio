import { useEffect } from "react";
import { profile } from "../lib/content";
import { useStore } from "../store/useStore";
import { setMuted } from "../lib/audio";

export function Hud() {
  const stage = useStore((state) => state.stage);
  const hovered = useStore((state) => state.hovered);
  const muted = useStore((state) => state.muted);
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

  return (
    <div className={`hud${stage === "loading" || stage === "start" ? " dim" : ""}${stage === "monitor" ? " hud--monitor" : ""}`}>
      <div className="brand">
        {profile.name}
        <small>{profile.role}</small>
      </div>

      {hovered && (
        <div className="hint">
          <strong>{hovered}</strong>
        </div>
      )}
    </div>
  );
}
