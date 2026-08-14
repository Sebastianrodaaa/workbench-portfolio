import { cloneElement, useEffect, useRef, useState } from "react";
import { profile } from "../lib/content";
import {
  MAXIMIZED_WINDOW_HEIGHT,
  UI_WIDTH,
} from "../lib/scene-config";
import { isCompactUi } from "../lib/device";
import { click } from "../lib/audio";
import { downloadFile } from "../lib/download";
import { useStore, type WindowId } from "../store/useStore";
import { APPS, DESKTOP_ORDER, DESKTOP_SHORTCUTS } from "./apps/registry";
import { Taskbar } from "./Taskbar";
import { OsWindow } from "./chrome/OsWindow";

export function Desktop() {
  const windows = useStore((state) => state.windows);
  const zTop = useStore((state) => state.zTop);
  const booted = useStore((state) => state.booted);
  const openWindow = useStore((state) => state.openWindow);
  const [selected, setSelected] = useState<string | null>(null);
  const openedAboutOnBoot = useRef(false);

  useEffect(() => {
    if (!booted || openedAboutOnBoot.current) return;
    openedAboutOnBoot.current = true;
    openWindow("about");
  }, [booted, openWindow]);

  const launch = (id: WindowId) => {
    openWindow(id);
  };

  const tapOpens = isCompactUi();

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
                onClick={() => {
                  if (tapOpens) launch(id);
                  else setSelected(id);
                }}
                onDoubleClick={() => launch(id)}
              >
                {app.icon32}
                <span>{app.label}</span>
              </button>
            );
          })}
          {DESKTOP_SHORTCUTS.map((shortcut) => (
            <button
              type="button"
              key={shortcut.id}
              className={`icon${selected === shortcut.id ? " selected" : ""}`}
              onClick={() => {
                if (tapOpens) {
                  click();
                  downloadFile(shortcut.url, shortcut.filename);
                } else setSelected(shortcut.id);
              }}
              onDoubleClick={() => {
                click();
                downloadFile(shortcut.url, shortcut.filename);
              }}
            >
              {shortcut.icon32}
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
          const width = window.maximized ? UI_WIDTH : app.width;
          const height = window.maximized ? MAXIMIZED_WINDOW_HEIGHT : app.height;
          return (
            <OsWindow
              key={window.id}
              id={window.id}
              title={app.title}
              icon={cloneElement(app.icon16)}
              x={window.x}
              y={window.y}
              z={window.z}
              width={width}
              height={height}
              minimized={window.minimized}
              maximized={window.maximized}
              focused={window.z === zTop}
            >
              <Body />
            </OsWindow>
          );
        })}

      </div>

      {booted && <Taskbar />}
    </div>
  );
}
