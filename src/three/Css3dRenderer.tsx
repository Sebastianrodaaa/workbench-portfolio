import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import * as THREE from "three";

const Css3dContext = createContext<THREE.Scene | null>(null);

export function useCss3dScene() {
  const scene = useContext(Css3dContext);
  if (!scene) {
    throw new Error("useCss3dScene must be used inside Css3dBridge");
  }
  return scene;
}

export function Css3dBridge({ children }: { children: ReactNode }) {
  const cssScene = useMemo(() => new THREE.Scene(), []);
  return (
    <Css3dContext.Provider value={cssScene}>{children}</Css3dContext.Provider>
  );
}

/** Renders the CSS3D layer on top of the WebGL canvas, synced to the R3F camera. */
export function Css3dSync() {
  const cssScene = useCss3dScene();
  const { camera, gl, size } = useThree();
  const renderer = useMemo(() => new CSS3DRenderer(), []);

  useEffect(() => {
    const element = renderer.domElement;
    element.style.position = "absolute";
    element.style.inset = "0";
    element.style.pointerEvents = "none";
    gl.domElement.parentElement?.appendChild(element);
    return () => {
      element.remove();
    };
  }, [gl, renderer]);

  useFrame(() => {
    renderer.setSize(size.width, size.height);
    cssScene.updateMatrixWorld(true);
    renderer.render(cssScene, camera);
  });

  return null;
}
