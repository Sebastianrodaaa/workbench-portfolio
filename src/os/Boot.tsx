import { useEffect, useState } from "react";
import { bootLines } from "../lib/content";
import { useStore } from "../store/useStore";
import { powerOn, startupChime } from "../lib/audio";

const LINE_DELAY = 190;
const SPLASH_MS = 1750;
const FADE_MS = 380;

/**
 * What the monitor does the first time you sit down: a couple of DOS lines
 * hand off to the startup splash, which hands off to the desktop.
 */
export function Boot() {
  const setBooted = useStore((state) => state.setBooted);
  const [visible, setVisible] = useState(0);
  const [phase, setPhase] = useState<"dos" | "splash">("dos");
  const [leaving, setLeaving] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    powerOn();
    let index = 0;
    const timers: number[] = [];
    const interval = window.setInterval(() => {
      index += 1;
      setVisible(index);
      if (index < bootLines.length) return;
      window.clearInterval(interval);
      timers.push(
        window.setTimeout(() => {
          setPhase("splash");
          startupChime();
        }, 380),
      );
      timers.push(
        window.setTimeout(() => setLeaving(true), 380 + SPLASH_MS),
      );
      timers.push(
        window.setTimeout(() => setBooted(true), 380 + SPLASH_MS + FADE_MS),
      );
    }, LINE_DELAY);

    return () => {
      window.clearInterval(interval);
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [setBooted]);

  useEffect(() => {
    if (phase !== "splash") return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(100, Math.round(((now - start) / SPLASH_MS) * 100));
      setPercent(next);
      if (next < 100) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  if (phase === "splash") {
    return (
      <div className={`splash${leaving ? " done" : ""}`}>
        <div className="splash-mark">
          <span className="flag" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="splash-word">
            Workbench
            <strong>95</strong>
          </span>
        </div>
        <div className="henry-progress">
          <div className="henry-progress__bar" style={{ width: `${percent}%` }} />
        </div>
        <small>Starting the desktop...</small>
      </div>
    );
  }

  return (
    <div className="boot">
      {bootLines.slice(0, visible).map((line, index) => (
        <div key={`${line}-${index}`}>{line || "\u00a0"}</div>
      ))}
      {visible >= bootLines.length && <span className="boot-cursor" />}
    </div>
  );
}
