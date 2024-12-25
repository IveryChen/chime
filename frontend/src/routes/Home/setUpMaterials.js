import {
  Color,
  DoubleSide,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from "three";

export default function setUpMaterials() {
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
    reflectivity: 0.5,
    side: DoubleSide, // Render both sides for glass
    attenuationColor: new Color(0xffffff), // Slight blue tint for thickness
    attenuationDistance: 0.5,
  });

  return { metalMaterial, glassMaterial };
}
