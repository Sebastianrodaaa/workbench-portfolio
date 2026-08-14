import * as THREE from "three";

function canvasTexture(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d")!;
  draw(context, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/** Dark idle face — flat panel off, no scanlines or static. */
export function createIdleScreenTexture() {
  return canvasTexture((ctx, w, h) => {
    const gradient = ctx.createRadialGradient(
      w * 0.5,
      h * 0.44,
      w * 0.08,
      w * 0.5,
      h * 0.5,
      w * 0.78,
    );
    gradient.addColorStop(0, "#1c2433");
    gradient.addColorStop(0.72, "#101620");
    gradient.addColorStop(1, "#06080e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    const glare = ctx.createLinearGradient(0, h * 0.06, 0, h * 0.22);
    glare.addColorStop(0, "rgba(255, 255, 255, 0)");
    glare.addColorStop(0.45, "rgba(210, 225, 245, 0.045)");
    glare.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = glare;
    ctx.fillRect(0, 0, w, h);
  });
}

/** Fingerprints and glass grime, similar to Henry's smudge layer. */
export function createSmudgeTexture() {
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = "rgba(12, 18, 22, 0.08)";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 2400; i += 1) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const radius = Math.random() * 2.4 + 0.4;
      ctx.fillStyle = `rgba(210, 230, 240, ${Math.random() * 0.05})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/** Bezel vignette / inner shadow around the tube face. */
export function createShadowTexture() {
  return canvasTexture((ctx, w, h) => {
    const gradient = ctx.createRadialGradient(
      w * 0.5,
      h * 0.48,
      w * 0.18,
      w * 0.5,
      h * 0.5,
      w * 0.72,
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.72, "rgba(0, 0, 0, 0.35)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.82)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  });
}

export function createStaticTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return { canvas, context, texture };
}

export function drawStaticFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
) {
  const image = ctx.createImageData(width, height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = Math.random();
    const band = 0.5 + 0.5 * Math.sin(time * 18 + (i % width) * 0.08);
    const v = Math.floor(n * band * 255);
    data[i] = v;
    data[i + 1] = v + 8;
    data[i + 2] = v + 18;
    data[i + 3] = 28 + Math.floor(n * 40);
  }
  ctx.putImageData(image, 0, 0);
}
