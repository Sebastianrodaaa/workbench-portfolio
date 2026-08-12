import * as THREE from "three";

export type QuadInfo = {
  mesh: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  triangles: number;
};

const round = (n: number) => +n.toFixed(4);

/**
 * Given a raycast hit, grow the hit triangle into the full coplanar patch it
 * belongs to and describe that patch as an oriented rectangle in world space:
 * local +X is right, +Y is up, +Z is the surface normal.
 *
 * The workbench GLB is one baked lump with meaningless node names, so this is
 * how we find a surface (the CRT glass) precise enough to mount our own screen
 * on. Everything runs in world space because the model root carries a rotation.
 */
export function pickCoplanarQuad(hit: THREE.Intersection): QuadInfo | null {
  const mesh = hit.object as THREE.Mesh;
  const geometry = mesh.geometry as THREE.BufferGeometry | undefined;
  if (!geometry || !hit.face || hit.faceIndex == null) return null;

  const position = geometry.getAttribute("position");
  if (!position) return null;

  const index = geometry.getIndex();
  const triCount = index ? index.count / 3 : position.count / 3;
  const worldVertex = (i: number, target: THREE.Vector3) =>
    target
      .fromBufferAttribute(position, index ? index.getX(i) : i)
      .applyMatrix4(mesh.matrixWorld);

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();

  const refNormal = hit.face.normal
    .clone()
    .applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld))
    .normalize();
  worldVertex(hit.faceIndex * 3, a);
  const refOffset = refNormal.dot(a);

  const ANGLE_EPS = 0.999;
  const PLANE_EPS = 1e-3;

  const collected: THREE.Vector3[] = [];
  let triangles = 0;
  const triNormal = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();

  for (let t = 0; t < triCount; t++) {
    worldVertex(t * 3, a);
    worldVertex(t * 3 + 1, b);
    worldVertex(t * 3 + 2, c);
    triNormal.copy(ab.subVectors(b, a)).cross(ac.subVectors(c, a)).normalize();
    if (triNormal.dot(refNormal) < ANGLE_EPS) continue;
    if (
      Math.abs(refNormal.dot(a) - refOffset) > PLANE_EPS ||
      Math.abs(refNormal.dot(b) - refOffset) > PLANE_EPS ||
      Math.abs(refNormal.dot(c) - refOffset) > PLANE_EPS
    )
      continue;
    triangles++;
    collected.push(a.clone(), b.clone(), c.clone());
  }

  if (!collected.length) return null;

  const worldUp = new THREE.Vector3(0, 1, 0);
  const axisY = worldUp
    .clone()
    .sub(refNormal.clone().multiplyScalar(worldUp.dot(refNormal)));
  if (axisY.lengthSq() < 1e-6) axisY.set(0, 0, 1);
  axisY.normalize();
  const axisX = new THREE.Vector3().crossVectors(axisY, refNormal).normalize();

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const v of collected) {
    const x = v.dot(axisX);
    const y = v.dot(axisY);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const center = new THREE.Vector3()
    .addScaledVector(axisX, (minX + maxX) / 2)
    .addScaledVector(axisY, (minY + maxY) / 2)
    .addScaledVector(refNormal, refOffset);

  const euler = new THREE.Euler().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(axisX, axisY, refNormal),
  );

  return {
    mesh: mesh.name || "(unnamed)",
    position: center.toArray().map(round) as [number, number, number],
    rotation: [euler.x, euler.y, euler.z].map(round) as [
      number,
      number,
      number,
    ],
    width: round(maxX - minX),
    height: round(maxY - minY),
    triangles,
  };
}
