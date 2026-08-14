import { useEffect, useRef } from "react";
import { postToOs } from "../lib/monitor-bridge";
import { useCompactUi } from "../lib/device";
import { useStore } from "../store/useStore";

/**
 * On phones the CSS3D CRT is too small to use, so the same OS iframe is shown
 * as a full-screen desktop when you sit down at the monitor.
 */
export function MobileOs() {
  const stage = useStore((state) => state.stage);
  const compact = useCompactUi();
  const open = compact && stage === "monitor";
  const prevStage = useRef(stage);

  useEffect(() => {
    if (!compact) return;
    if (stage === "monitor") postToOs({ type: "monitor-enter" });
    if (prevStage.current === "monitor" && stage !== "monitor") {
      postToOs({ type: "monitor-leave" });
    }
    prevStage.current = stage;
  }, [compact, stage]);

  if (!compact) return null;

  return (
    <div
      className={`mobile-os${open ? " mobile-os--open" : ""}`}
      aria-hidden={!open}
    >
      <iframe
        id="workbench-os"
        title="Workbench desktop"
        src="/os.html"
        allow="autoplay"
        onLoad={() => {
          if (useStore.getState().stage === "monitor") {
            postToOs({ type: "monitor-enter" });
          }
        }}
      />
    </div>
  );
}
