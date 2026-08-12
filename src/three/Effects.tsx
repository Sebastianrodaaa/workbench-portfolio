import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function Effects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.72}
        luminanceThreshold={0.28}
        luminanceSmoothing={0.35}
        mipmapBlur
        radius={0.72}
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.12} />
      <Vignette offset={0.28} darkness={0.62} eskil={false} />
    </EffectComposer>
  );
}
