import { Color, MeshStandardMaterial } from "three";

export default function setUpMaterials() {
  const metalMaterial = new MeshStandardMaterial({
    color: new Color(0x8c8c8c),
    metalness: 1.0,
    roughness: 0.2,
    envMapIntensity: 2.0,
  });

  return { metalMaterial };
}
