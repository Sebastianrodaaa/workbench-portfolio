import { useStore } from "../store/useStore";
import { Boot } from "./Boot";
import { Desktop } from "./Desktop";
import "./os.css";

export function OS() {
  const stage = useStore((state) => state.stage);
  const booted = useStore((state) => state.booted);
  // The machine wakes up the first time you sit down at it.
  const started = stage === "monitor" || booted;

  return (
    <>
      {started && !booted && <Boot />}
      {started && <Desktop />}
      <div className="crt-overlay" aria-hidden>
        <div className="crt-flicker" />
      </div>
    </>
  );
}
