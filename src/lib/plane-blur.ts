import * as THREE from "three";

export interface BlurUniforms {
  uBlur: { value: number };
  uRatio: { value: number };
}

const TAPS = 12;

/**
 * Golden-angle disc sampling — 12 taps read as a smooth defocus at these
 * radii, and cost far less than a separable two-pass blur would.
 * `uRatio` keeps the disc circular in world space on a non-square plane.
 */
const BLUR_FN = /* glsl */ `
uniform float uBlur;
uniform float uRatio;

vec4 sampleDefocused( sampler2D tex, vec2 uv ) {
  if ( uBlur < 0.0005 ) return texture2D( tex, uv );

  vec4 sum = texture2D( tex, uv );
  for ( int i = 0; i < ${TAPS}; i++ ) {
    float a = float( i ) * 2.3999632;
    float d = sqrt( ( float( i ) + 0.5 ) / float( ${TAPS} ) ) * uBlur;
    vec2 off = vec2( cos( a ), sin( a ) * uRatio ) * d;
    sum += texture2D( tex, uv + off );
  }
  return sum / float( ${TAPS} + 1 );
}
`;

/**
 * A MeshBasicMaterial whose map is sampled through a defocus disc. Patching
 * the stock material rather than writing a ShaderMaterial keeps fog, tone
 * mapping and transparency behaving exactly as they do everywhere else.
 */
export function createDefocusMaterial(ratio: number) {
  const uniforms: BlurUniforms = {
    uBlur: { value: 0 },
    uRatio: { value: ratio },
  };

  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    toneMapped: false,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uBlur = uniforms.uBlur;
    shader.uniforms.uRatio = uniforms.uRatio;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${BLUR_FN}`)
      .replace(
        "vec4 sampledDiffuseColor = texture2D( map, vMapUv );",
        "vec4 sampledDiffuseColor = sampleDefocused( map, vMapUv );"
      );
  };

  // Every plane compiles to the same program; only the uniform values differ.
  material.customProgramCacheKey = () => "defocus-plane";

  return { material, uniforms };
}
