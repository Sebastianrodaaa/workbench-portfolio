import "./henry-tokens.css";
import { useStore } from "../store/useStore";
import { Boot } from "./Boot";
import { Desktop } from "./Desktop";
import "./os.css";

export function OS() {
  const stage = useStore((state) => state.stage);
  const booted = useStore((state) => state.booted);
  const started = stage === "monitor" || booted;

  return (
    <>
      {started && !booted && <Boot />}
      {started && <Desktop />}
    </>
  );
}
