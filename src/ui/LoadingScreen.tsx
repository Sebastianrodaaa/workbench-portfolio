import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { biosDevices, biosLines } from "../lib/content";
import { useStore } from "../store/useStore";
import { beep } from "../lib/audio";

const TOTAL_MEMORY = 16384;

/**
 * First thing you see: a power-on self test that counts real loading progress
 * as memory, then hands off to the title screen.
 */
export function LoadingScreen() {
  const { progress, active } = useProgress();
  const stage = useStore((state) => state.stage);
  const setStage = useStore((state) => state.setStage);
  const [settled, setSettled] = useState(false);

  const ready = !active && progress >= 100;
  const fraction = Math.min(progress, 100) / 100;
  const memory = Math.round(fraction * TOTAL_MEMORY);
  const detected = Math.floor(fraction * (biosDevices.length + 0.001));

  useEffect(() => {
    if (!ready) return;
    // Hold at 100 for a beat so the test doesn't flash past on a warm cache.
    const id = window.setTimeout(() => setSettled(true), 420);
    return () => window.clearTimeout(id);
  }, [ready]);

  useEffect(() => {
    if (!settled) return;
    beep();
  }, [settled]);

  useEffect(() => {
    if (!settled || stage !== "loading") return;
    const id = window.setTimeout(() => setStage("start"), 900);
    return () => window.clearTimeout(id);
  }, [settled, stage, setStage]);

  return (
    <div className={`post${stage !== "loading" ? " hidden" : ""}`}>
      <div className="post-inner">
        <div className="post-head">
          <div className="post-bios">
            {biosLines.map((line, index) => (
              <div key={`${line}-${index}`}>{line || "\u00a0"}</div>
            ))}
          </div>
          <div className="post-badge">
            Energy
            <span>Star</span>
          </div>
        </div>

        <div className="post-memory">
          Memory Test : <b>{memory.toLocaleString("en-US")}K</b>{" "}
          {settled ? <span className="ok">OK</span> : ""}
        </div>

        <div className="post-devices">
          {biosDevices.slice(0, detected).map((device) => (
            <div key={device}>{device}</div>
          ))}
          {!settled && <span className="post-cursor" />}
        </div>

        <div className="post-foot">
          <div>
            {settled ? "Boot sequence complete." : "Press DEL to enter SETUP"}
          </div>
        </div>
      </div>
    </div>
  );
}
