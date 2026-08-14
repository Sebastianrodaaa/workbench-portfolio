import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { UI_HEIGHT, UI_WIDTH } from "./lib/scene-config";
import { useClickSound } from "./lib/useClickSound";
import { OS } from "./os/OS";
import { useStore } from "./store/useStore";
import "./os/henry-tokens.css";
import "./os/os.css";
import "./index.css";

/** Standalone desktop shell loaded inside the 3D monitor iframe. */
function OsShell() {
  useClickSound();
  const setBooted = useStore((state) => state.setBooted);
  const setStage = useStore((state) => state.setStage);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const type = event.data?.type;
      if (type === "monitor-enter") setStage("monitor");
      if (type === "monitor-leave") {
        setBooted(false);
        setStage("loading");
      }
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "os-ready" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, [setBooted, setStage]);

  return (
    <div
      className="screen-root"
      style={{ width: UI_WIDTH, height: UI_HEIGHT }}
    >
      <OS />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OsShell />
  </StrictMode>,
);
