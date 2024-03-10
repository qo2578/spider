import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import init from "./init";

import "./index.css";

const { sizes, camera, scene, canvas, controls, renderer } = init();

camera.position.set(3, 4, 2);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0.2,
    roughness: 0.5,
  })
);

floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.11);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-18, 32, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
scene.add(dirLight);

const loader = new GLTFLoader();

loader.load("/models/spider/spider.glb", (gltf) => {
  console.log("success");
  console.log(gltf);
  const model = gltf.scene.children[0];
  model.scale.set(0.7, 0.7, 0.7); 


const normalMapTexture = new THREE.TextureLoader().load('/models/spider/NormalMap.png');
  

const material = new THREE.MeshStandardMaterial({
  metalness: 0.9, 
  roughness: 0.1, 
  color: 0xffffff,
  normalMap: normalMapTexture,
});
 
  model.traverse((child) => {
    if (child.isMesh) {
      child.material = material;
    }
  });

  scene.add(model);
  
});

const redLight = new THREE.PointLight(0xff0000, 100, 100);
redLight.position.set(30, 30, 0);
redLight.intensity = 9.0;
scene.add(redLight);

const blueLight = new THREE.PointLight(0x0000ff, 100, 100);
blueLight.position.set(-30, 30, 0); 
scene.add(blueLight);

const whiteLight = new THREE.PointLight(0xfffff, 1, 100);
whiteLight.position.set(0, -10, 0);
scene.add(whiteLight);


const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

window.addEventListener("resize", () => {

  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Обновляем соотношение сторон камеры
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Обновляем renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
