import {
  Color,
  DoubleSide,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

export default function setUpMaterials(renderer, scene, camera) {
  const metalMaterial = new MeshStandardMaterial({
    color: new Color(0x707070),
    metalness: 1.0,
    roughness: 0.2,
    envMapIntensity: 2.0,
  });

  const glassMaterial = new MeshPhysicalMaterial({
    color: new Color(0xffffff),
    metalness: 0.0,
    roughness: 0.05,
    transmission: 0.95, // High transmission for transparency
    transparent: true,
    thickness: 0.5, // Glass thickness
    envMapIntensity: 2.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    ior: 1.5, // Index of refraction for glass
    opacity: 0.4,
    reflectivity: 0.5,
    side: DoubleSide, // Render both sides for glass
    attenuationColor: new Color(0xffffff), // Slight blue tint for thickness
    attenuationDistance: 0.5,
  });

  const plasticMaterial = new MeshStandardMaterial({
    color: new Color(0x202020),
    metalness: 0.0,
    roughness: 0.4,
    envMapIntensity: 0.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
  });

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const chromaticAberrationShader = {
    uniforms: {
      tDiffuse: { value: null },
      distortion: { value: 0.02 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float distortion;
    varying vec2 vUv;
    void main() {
      vec2 offset = distortion * (vec2(0.5) - vUv);
      vec4 cr = texture2D(tDiffuse, vUv + offset);
      vec4 cg = texture2D(tDiffuse, vUv);
      vec4 cb = texture2D(tDiffuse, vUv - offset);

      // If the pixel is fully transparent, keep it transparent
      if (cg.a == 0.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      } else {
        gl_FragColor = vec4(cr.r, cg.g, cb.b, cg.a);
      }
    }
  `,
  };

  const chromaticAberrationPass = new ShaderPass(chromaticAberrationShader);
  composer.addPass(chromaticAberrationPass);

  return { composer, glassMaterial, metalMaterial, plasticMaterial };
}
