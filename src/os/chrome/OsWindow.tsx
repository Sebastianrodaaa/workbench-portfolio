import { useRef, type PointerEvent, type ReactElement, type ReactNode } from "react";
import {
  TASKBAR_HEIGHT,
  UI_HEIGHT,
  UI_WIDTH,
} from "../../lib/scene-config";
import { useStore, type WindowId } from "../../store/useStore";
import { OsButton } from "./OsButton";

type Props = {
  id: WindowId;
  title: string;
  icon: ReactElement;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  focused: boolean;
  children: ReactNode;
};

export function OsWindow({
  id,
  title,
  icon,
  x,
  y,
  z,
  width,
  height,
  minimized,
  maximized,
  focused,
  children,
}: Props) {
  const moveWindow = useStore((state) => state.moveWindow);
  const focusWindow = useStore((state) => state.focusWindow);
  const closeWindow = useStore((state) => state.closeWindow);
  const minimizeWindow = useStore((state) => state.minimizeWindow);
  const toggleMaximizeWindow = useStore((state) => state.toggleMaximizeWindow);

  const drag = useRef<{
    pointerX: number;
    pointerY: number;
    originX: number;
    originY: number;
    scale: number;
  } | null>(null);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || maximized) return;
    if ((event.target as HTMLElement).closest("button")) return;
    focusWindow(id);
    const panel = event.currentTarget.closest(".screen-root");
    const rendered = panel?.getBoundingClientRect().width ?? UI_WIDTH;
    drag.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      originX: x,
      originY: y,
      scale: rendered > 0 ? rendered / UI_WIDTH : 1,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onDrag = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) return;
    moveWindow(
      id,
      clamp(
        state.originX + (event.clientX - state.pointerX) / state.scale,
        8,
        UI_WIDTH - width - 8,
      ),
      clamp(
        state.originY + (event.clientY - state.pointerY) / state.scale,
        8,
        UI_HEIGHT - TASKBAR_HEIGHT - 40,
      ),
    );
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  if (minimized) return null;

  return (
    <div
      className={`os-window${focused ? " os-window--focused" : ""}${
        maximized ? " os-window--maximized" : ""
      }`}
      style={{
        left: maximized ? 0 : x,
        top: maximized ? 0 : y,
        width: maximized ? "100%" : width,
        height,
        zIndex: z,
      }}
      onPointerDown={() => focusWindow(id)}
      aria-label={title}
    >
      <div className="os-window__outer">
        <div className="os-window__inner">
          <div
            className="os-window__titlebar"
            onPointerDown={startDrag}
            onPointerMove={onDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <span className="os-window__icon">{icon}</span>
            <span className="os-window__title">{title}</span>
            <div className="os-window__controls">
              <OsButton
                compact
                title="Minimize"
                aria-label="Minimize"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  minimizeWindow(id);
                }}
              >
                _
              </OsButton>
              <OsButton
                compact
                title={maximized ? "Restore" : "Maximize"}
                aria-label={maximized ? "Restore" : "Maximize"}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleMaximizeWindow(id);
                }}
              >
                {maximized ? "❐" : "□"}
              </OsButton>
              <OsButton
                compact
                title="Close"
                aria-label="Close"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  closeWindow(id);
                }}
              >
                ×
              </OsButton>
            </div>
          </div>
          <div className="os-window__content-outer">
            <div className="os-window__content-inner">
              <div className="os-window__content">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}
