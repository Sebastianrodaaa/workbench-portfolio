# Workbench portfolio

An interactive 3D workshop: a glTF diorama with a CRT monitor on the desk, and a
working Windows 95-style desktop rendered as real DOM inside the glass — the
same iframe + CSS3D pattern used on [Henry Heffernan's portfolio](https://henryheffernan.com/).
Click the monitor to sit down, drag the windows, poke around the MS-DOS prompt.

Built with React Three Fiber, Three.js CSS3DRenderer, and zustand. The in-monitor
UI follows [Henry Heffernan](https://henryheffernan.com/)'s portfolio OS design:
MSSerif/Millennium fonts, 18px body text, white window surfaces, and no in-DOM
CRT overlay (glass effects stay on the WebGL monitor layers).

## Running it

```bash
npm install
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

## Editing the content

Everything you would want to change is in one file: `src/lib/content.ts`.

| Export                    | Where it appears                                  |
| ------------------------- | ------------------------------------------------- |
| `profile`                 | HUD, wallpaper mark, Contact window, POST screen  |
| `about`                   | Properties window, General tab                    |
| `experience`              | Experience window (Explorer-style list)           |
| `education`, `skills`     | Properties window, Education and Skills tabs      |
| `readme`                  | README.TXT in Notepad                             |
| `credits`                 | Colophon window                                   |
| `biosLines`, `biosDevices`| First-load power-on self test                     |
| `bootLines`               | DOS lines on the monitor before the startup splash|

Window titles, desktop captions, sizes, and icons live in
`src/os/apps/registry.tsx`. Adding a window means adding an id to `WindowId` in
`src/store/useStore.ts`, a component under `src/os/apps/`, and an entry in the
registry.

## How it fits together

```
src/
  lib/
    content.ts        all copy, in one place
    scene-config.ts   camera shots, screen transforms, UI panel size
    monitor-bridge.ts postMessage between the 3D shell and os.html
    screen-textures.ts procedural smudge, shadow, and static overlays
    audio.ts          synthesised blips, POST beep, startup chime, CRT hum
    pick-quad.ts      finds the flat screen faces inside the single-mesh GLB
  store/useStore.ts   stage machine, window manager, lamp and audio flags
  three/
    Experience.tsx    scene graph; postprocessing is lazy-loaded
    Css3dRenderer.tsx CSS3DRenderer synced to the R3F camera
    Workbench.tsx     the glTF diorama
    ScreenSurface.tsx CRT shader, CSS3D iframe, glass overlays, cutout plane
    AuxScreen.tsx     the small green terminal, drawn to a canvas texture
    CameraRig.tsx     eased transitions between loading/intro/desk/monitor
    Hotspot.tsx       clickable props, e.g. the lamp cord
  os/                 the desktop: window manager, taskbar, Start menu, apps
  os-main.tsx         standalone entry mounted by os.html inside the iframe
  ui/                 outer layer: POST screen and HUD
os.html               second Vite entry — the in-monitor operating system
```

The stage machine drives everything. `loading` shows the power-on self test,
`intro` flies the camera in, `desk` gives you orbit-limited controls, and
`monitor` docks the camera to the screen and hands pointer events to the iframe
desktop. The OS runs at `/os.html` and is composited onto the monitor with
Three.js `CSS3DObject`, while WebGL planes in front add smudges, inner shadow,
static, and viewing-angle dimming — the Henry Heffernan monitor stack.

`UI_WIDTH` in `src/lib/scene-config.ts` sets the desktop's pixel resolution. It
is 800 so that one desktop pixel lands on roughly one screen pixel at the
monitor shot, which is what keeps 11px Windows chrome legible.

## The model

`public/models/workbench.glb` is 768 KB, down from an 18.1 MB source: textures
resized to 512px and re-encoded as WebP, geometry Meshopt-compressed with
`gltf-transform`. The model is unlit, so the scene leans on the baked textures
plus a small amount of fill light and bloom.

The GLB is a single mesh with no named nodes, so the monitor and terminal screens
are located at runtime by `pick-quad.ts`, which walks the geometry for coplanar
quads and returns their world transform and size. Run the dev server with
`?debug` to get pick logging and stats.
