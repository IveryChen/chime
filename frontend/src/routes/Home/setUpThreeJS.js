import {
  AmbientLight,
  Box3,
  DirectionalLight,
  EquirectangularReflectionMapping,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import { HDRI, modelURL } from "./constants";
import setUpMaterials from "./setUpMaterials";

export const initThreeJS = (canvas) => {
  const { clientHeight, clientWidth } = canvas;

  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
  });
  renderer.setSize(clientWidth, clientHeight, false);

  const camera = new PerspectiveCamera(
    90,
    clientWidth / clientHeight,
    1 / 8,
    1000
  );
  camera.position.z = 2;
  camera.position.y = 1;

  // Set up scene and lights
  const scene = new Scene();
  const mainLight = new DirectionalLight(0xffffff, 4);
  mainLight.position.set(1, 1, 1);
  mainLight.castShadow = true;

  const fillLight = new DirectionalLight(0xffffff, 1);
  fillLight.position.set(-1, 0.5, -1);

  const ambientLight = new AmbientLight(0xffffff, 0.5);

  scene.add(mainLight);
  scene.add(fillLight);
  scene.add(ambientLight);

  const rgbeLoader = new RGBELoader();
  rgbeLoader.load(HDRI, function (envMap) {
    envMap.mapping = EquirectangularReflectionMapping;
    scene.environment = envMap;
  });

  const materials = setUpMaterials();

  const loader = new FBXLoader();
  loader.load(
    modelURL,
    (object) => {
      const box = new Box3().setFromObject(object);
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());
      object.position.sub(center);

      object.traverse((child) => {
        if (child.isMesh) {
          console.log("Found MESH:", child.name);
          const name = child.name.toLowerCase();

          if (name.includes("metal")) {
            child.material = materials.metalMaterial;
            child.castShadow = true;
            child.receiveShadow = true;
          } else if (name.includes("glass")) {
            child.material = materials.glassMaterial;
            child.castShadow = false;
            child.receiveShadow = true;
          } else if (name.includes("plastic")) {
            child.material = materials.plasticMaterial;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        }
      });

      // Calculate camera and object positioning
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      const cameraZ = Math.abs(maxDim / Math.tan(fov / 2) / 2);
      camera.position.z = cameraZ * 1.5;

      const distance = camera.position.z - object.position.z;
      const heightAtDistance = 2 * Math.tan(fov / 2) * distance;
      const scale = heightAtDistance / maxDim;
      object.scale.setScalar(scale * 1.0);

      scene.add(object);
    },
    undefined,
    (error) => {
      console.error("An error occurred loading the model:", error);
    }
  );

  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;

  const render = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();
};