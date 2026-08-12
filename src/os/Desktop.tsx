import { useState } from "react";
import { profile } from "../lib/content";
import { useStore, type WindowId } from "../store/useStore";
import { APPS, DESKTOP_ORDER } from "./apps/registry";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";

export function Desktop() {
  const windows = useStore((state) => state.windows);
  const zTop = useStore((state) => state.zTop);
  const openWindow = useStore((state) => state.openWindow);
  const setStage = useStore((state) => state.setStage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<WindowId | null>(null);

  const launch = (id: WindowId) => {
    openWindow(id);
    setMenuOpen(false);
  };

  return (
    <div className="desktop">
      <div
        className="desk-surface"
        onPointerDown={(event) => {
          if (event.target !== event.currentTarget) return;
          setMenuOpen(false);
          setSelected(null);
        }}
      >
        <div className="icons">
          {DESKTOP_ORDER.map((id) => {
            const app = APPS[id];
            return (
              <button
                type="button"
                key={id}
                className={`icon${selected === id ? " selected" : ""}`}
                onClick={() => setSelected(id)}
                onDoubleClick={() => launch(id)}
              >
                {app.icon}
                <span>{app.label}</span>
              </button>
            );
          })}
        </div>

        <div className="wallmark">
          <strong>{profile.name}</strong>
          {profile.role}
        </div>

        {windows.map((window) => {
          const app = APPS[window.id];
          const Body = app.component;
          return (
            <Window
              key={window.id}
              id={window.id}
              title={app.title}
              icon={app.icon}
              x={window.x}
              y={window.y}
              z={window.z}
              width={app.width}
              height={app.height}
              minimized={window.minimized}
              focused={window.z === zTop}
            >
              <Body />
            </Window>
          );
        })}

        {menuOpen && (
          <nav className="start-menu">
            <div className="spine" aria-hidden>
              <span>
                Workbench<b>95</b>
              </span>
            </div>
            <div className="items">
              {DESKTOP_ORDER.map((id) => (
                <button type="button" key={id} onClick={() => launch(id)}>
                  {APPS[id].icon}
                  {APPS[id].label}
                </button>
              ))}
              <div className="sep" />
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setStage("desk");
                }}
              >
                {IconShutdown}
                Step away...
              </button>
            </div>
          </nav>
        )}
      </div>

      <Taskbar
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
      />
    </div>
  );
}

const IconShutdown = (
  <svg viewBox="0 0 32 32" aria-hidden>
    <rect x="4" y="8" width="24" height="17" fill="#c0c0c0" />
    <rect x="4" y="8" width="24" height="1" fill="#ffffff" />
    <rect x="27" y="8" width="1" height="17" fill="#404040" />
    <rect x="4" y="24" width="24" height="1" fill="#404040" />
    <rect x="8" y="12" width="16" height="9" fill="#000080" />
    <rect x="15" y="4" width="2" height="9" fill="#404040" />
    <rect x="14" y="14" width="4" height="5" fill="#ff9d00" />
  </svg>
);
