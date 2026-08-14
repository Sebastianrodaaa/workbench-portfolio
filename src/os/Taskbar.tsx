import { cloneElement, useEffect, useRef, useState } from "react";
import {
  Logo,
  ReaderEject,
  Sndvol32300,
  Sndvol32302,
} from "@react95/icons";
import { postToParent } from "../lib/monitor-bridge";
import { useStore } from "../store/useStore";
import type { Stage } from "../store/useStore";
import { APPS, DESKTOP_ORDER } from "./apps/registry";
import { OsButton } from "./chrome/OsButton";

function stepAwayFromDesk(setStage: (stage: Stage) => void) {
  setStage("desk");
  postToParent({ type: "request-desk" });
}

export function Taskbar() {
  const windows = useStore((state) => state.windows);
  const zTop = useStore((state) => state.zTop);
  const focusWindow = useStore((state) => state.focusWindow);
  const minimizeWindow = useStore((state) => state.minimizeWindow);
  const openWindow = useStore((state) => state.openWindow);
  const muted = useStore((state) => state.muted);
  const toggleMute = useStore((state) => state.toggleMute);
  const setStage = useStore((state) => state.setStage);
  const clock = useClock();
  const [startOpen, setStartOpen] = useState(false);
  const startRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (startRef.current?.contains(event.target as Node)) return;
      setStartOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [startOpen]);

  return (
    <footer className="henry-toolbar">
      <div className="henry-toolbar__inner">
        <div className="henry-toolbar__start" ref={startRef}>
          {startOpen && (
            <div className="henry-start-menu">
              <div className="henry-start-menu__sidebar" aria-hidden>
                Workbench
              </div>
              <div className="henry-start-menu__items">
                {DESKTOP_ORDER.map((id) => {
                  const app = APPS[id];
                  return (
                    <button
                      type="button"
                      key={id}
                      className="henry-start-menu__item"
                      onClick={() => {
                        openWindow(id);
                        setStartOpen(false);
                      }}
                    >
                      {cloneElement(app.icon32)}
                      <span>{app.label}</span>
                    </button>
                  );
                })}
                <div className="henry-start-menu__rule" />
                <button
                  type="button"
                  className="henry-start-menu__item"
                  onClick={() => {
                    setStartOpen(false);
                    stepAwayFromDesk(setStage);
                  }}
                >
                  <ReaderEject variant="32x32_4" />
                  <span>Step away...</span>
                </button>
              </div>
            </div>
          )}
          <OsButton
            className="henry-start-button"
            onClick={() => setStartOpen((open) => !open)}
          >
            <Logo variant="16x16_4" />
            Start
          </OsButton>
        </div>

        <div className="henry-toolbar__tabs">
          {windows.map((window) => {
            const app = APPS[window.id];
            const active = !window.minimized && window.z === zTop;
            return (
              <button
                type="button"
                key={window.id}
                className={`henry-task-tab${active ? " henry-task-tab--active" : ""}`}
                onClick={() => {
                  if (active) minimizeWindow(window.id);
                  else focusWindow(window.id);
                }}
              >
                {cloneElement(app.icon16)}
                <span>{app.label}</span>
              </button>
            );
          })}
        </div>

        <div className="henry-toolbar__tray">
          <button
            type="button"
            title={muted ? "Sound: off" : "Sound: on"}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            onClick={() => toggleMute()}
          >
            {muted ? (
              <Sndvol32302 variant="32x32_4" />
            ) : (
              <Sndvol32300 variant="16x16_4" />
            )}
          </button>
          <button
            type="button"
            title="Step away from the desk"
            aria-label="Step away from the desk"
            onClick={() => stepAwayFromDesk(setStage)}
          >
            <ReaderEject variant="16x16_4" />
          </button>
          <span className="henry-toolbar__clock">{clock}</span>
        </div>
      </div>
    </footer>
  );
}

function useClock() {
  const [now, setNow] = useState(() => format(new Date()));
  useEffect(() => {
    const id = window.setInterval(() => setNow(format(new Date())), 10_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function format(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const mins = minutes < 10 ? `0${minutes}` : String(minutes);
  return `${hours}:${mins} ${amPm}`;
}
