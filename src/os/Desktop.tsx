import { useState } from "react";
import { profile } from "../lib/content";
import { click } from "../lib/audio";
import { downloadFile } from "../lib/download";
import { useStore, type WindowId } from "../store/useStore";
import { APPS, DESKTOP_ORDER, DESKTOP_SHORTCUTS } from "./apps/registry";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";

export function Desktop() {
  const windows = useStore((state) => state.windows);
  const zTop = useStore((state) => state.zTop);
  const openWindow = useStore((state) => state.openWindow);
  const [selected, setSelected] = useState<string | null>(null);

  const launch = (id: WindowId) => {
    openWindow(id);
  };

  return (
    <div className="desktop">
      <div
        className="desk-surface"
        onPointerDown={(event) => {
          if (event.target !== event.currentTarget) return;
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
          {DESKTOP_SHORTCUTS.map((shortcut) => (
            <button
              type="button"
              key={shortcut.id}
              className={`icon${selected === shortcut.id ? " selected" : ""}`}
              onClick={() => setSelected(shortcut.id)}
              onDoubleClick={() => {
                click();
                downloadFile(shortcut.url, shortcut.filename);
              }}
            >
              {shortcut.icon}
              <span>{shortcut.label}</span>
            </button>
          ))}
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

      </div>

      <Taskbar />
    </div>
  );
}

