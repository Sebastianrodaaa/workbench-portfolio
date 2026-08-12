import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { APPS } from "./apps/registry";

type Props = {
  menuOpen: boolean;
  onToggleMenu: () => void;
};

export function Taskbar({ menuOpen, onToggleMenu }: Props) {
  const windows = useStore((state) => state.windows);
  const zTop = useStore((state) => state.zTop);
  const focusWindow = useStore((state) => state.focusWindow);
  const minimizeWindow = useStore((state) => state.minimizeWindow);
  const muted = useStore((state) => state.muted);
  const toggleMute = useStore((state) => state.toggleMute);
  const setStage = useStore((state) => state.setStage);
  const clock = useClock();

  return (
    <div className="taskbar">
      <button
        type="button"
        className="taskbar-start"
        aria-expanded={menuOpen}
        onClick={() => onToggleMenu()}
      >
        {IconStartFlag}
        Start
      </button>

      <div className="task-buttons">
        {windows.map((window) => {
          const app = APPS[window.id];
          const active = !window.minimized && window.z === zTop;
          return (
            <button
              type="button"
              key={window.id}
              className={`task-button${active ? " active" : ""}`}
              onClick={() => {
                if (active) minimizeWindow(window.id);
                else focusWindow(window.id);
              }}
            >
              {app.icon}
              <span>{app.label}</span>
            </button>
          );
        })}
      </div>

      <div className="tray">
        <button
          type="button"
          title={muted ? "Sound: off" : "Sound: on"}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          onClick={() => toggleMute()}
        >
          {muted ? IconSpeakerMuted : IconSpeaker}
        </button>
        <button
          type="button"
          title="Step away from the desk"
          aria-label="Step away from the desk"
          onClick={() => setStage("desk")}
        >
          {IconEject}
        </button>
        <span className="clock">{clock}</span>
      </div>
    </div>
  );
}

const IconStartFlag = (
  <svg viewBox="0 0 13 11" className="taskbar-start-flag" aria-hidden>
    <rect x="0" y="0" width="6" height="5" fill="#ff3b30" />
    <rect x="7" y="0" width="6" height="5" fill="#34c759" />
    <rect x="0" y="6" width="6" height="5" fill="#0a84ff" />
    <rect x="7" y="6" width="6" height="5" fill="#ffd60a" />
  </svg>
);

const IconSpeaker = (
  <svg viewBox="0 0 16 16" aria-hidden>
    <rect x="2" y="6" width="2" height="4" fill="#404040" />
    <path d="M4 6h2V4h1v8H6v-2H4z" fill="#404040" />
    <rect x="9" y="5" width="1" height="6" fill="#000080" />
    <rect x="11" y="3" width="1" height="10" fill="#000080" />
  </svg>
);

const IconSpeakerMuted = (
  <svg viewBox="0 0 16 16" aria-hidden>
    <rect x="2" y="6" width="2" height="4" fill="#808080" />
    <path d="M4 6h2V4h1v8H6v-2H4z" fill="#808080" />
    <path
      d="M9 5h1v1h1v1h1V6h1V5h1v1h-1v1h-1v1h1v1h1v1h-1v1h-1v-1h-1V9h-1v1H9V9h1V8h1V7h-1V6H9z"
      fill="#c00000"
    />
  </svg>
);

const IconEject = (
  <svg viewBox="0 0 16 16" aria-hidden>
    <rect x="2" y="11" width="12" height="2" fill="#404040" />
    <path d="M8 3l5 6H3z" fill="#000080" />
  </svg>
);

function useClock() {
  const [now, setNow] = useState(() => format(new Date()));
  useEffect(() => {
    const id = window.setInterval(() => setNow(format(new Date())), 10_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function format(date: Date) {
  return date
    .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    .replace(/\s/g, " ");
}
