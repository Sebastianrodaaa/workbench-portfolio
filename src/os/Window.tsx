import { useRef, type PointerEvent, type ReactNode } from "react";
import { UI_HEIGHT, UI_WIDTH, TASKBAR_HEIGHT } from "../lib/scene-config";
import { useStore, type WindowId } from "../store/useStore";

type Props = {
  id: WindowId;
  title: string;
  icon: ReactNode;
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

const GlyphMinimise = (
  <svg viewBox="0 0 8 8" aria-hidden>
    <rect x="1" y="5" width="6" height="2" fill="currentColor" />
  </svg>
);

const GlyphRestore = (
  <svg viewBox="0 0 8 8" aria-hidden>
    <rect x="0" y="2" width="6" height="6" fill="currentColor" />
    <rect x="2" y="0" width="6" height="6" fill="#c0c0c0" />
    <rect x="2" y="0" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const GlyphMaximise = (
  <svg viewBox="0 0 8 8" aria-hidden>
    <rect x="0" y="0" width="8" height="7" fill="currentColor" />
    <rect x="1" y="2" width="6" height="4" fill="#c0c0c0" />
  </svg>
);

const GlyphClose = (
  <svg viewBox="0 0 8 8" aria-hidden>
    <path
      d="M1 0h2v1h2V0h2v1H6v1H5v1h1v1h1v1H6v1H5V5H3v1H2v1H0V6h1V5h1V4h1V3H2V2H1z"
      fill="currentColor"
    />
  </svg>
);

export function Window({
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
    // Title-bar drag captures the pointer; if we start on a control button the
    // subsequent pointerup never reaches it and click never fires.
    if ((event.target as HTMLElement).closest(".win-button")) return;
    focusWindow(id);
    // The desktop lives inside a CSS3D-transformed element, so pointer deltas
    // arrive in viewport pixels. Convert them with the rendered panel width.
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
    const nextX = state.originX + (event.clientX - state.pointerX) / state.scale;
    const nextY = state.originY + (event.clientY - state.pointerY) / state.scale;
    moveWindow(
      id,
      clamp(nextX, 8, UI_WIDTH - width - 8),
      clamp(nextY, 8, UI_HEIGHT - TASKBAR_HEIGHT - 34),
    );
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section
      className={`window${focused ? " focused" : ""}${
        minimized ? " minimized" : ""
      }${maximized ? " maximized" : ""}`}
      style={{ left: x, top: y, width, height, zIndex: z }}
      onPointerDown={() => focusWindow(id)}
      aria-label={title}
    >
      <div
        className="title-bar"
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {icon}
        <h2>{title}</h2>
        <button
          type="button"
          className="win-button"
          title="Minimize"
          aria-label="Minimize"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            minimizeWindow(id);
          }}
        >
          {GlyphMinimise}
        </button>
        <button
          type="button"
          className="win-button"
          title={maximized ? "Restore" : "Maximize"}
          aria-label={maximized ? "Restore" : "Maximize"}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            toggleMaximizeWindow(id);
          }}
        >
          {maximized ? GlyphRestore : GlyphMaximise}
        </button>
        <button
          type="button"
          className="win-button close"
          title="Close"
          aria-label="Close"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            closeWindow(id);
          }}
        >
          {GlyphClose}
        </button>
      </div>
      <div className="window-body">{children}</div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}
