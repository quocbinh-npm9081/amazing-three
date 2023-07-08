import * as THREE from "three";
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// tao camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, //fov — Camera frustum vertical field of view.
  window.innerWidth / window.innerHeight, //aspect — Camera frustum aspect ratio.
  0.1, //near — Camera frustum near plane.
  1000 //far — Camera frustum far plane.
);

//Tao hệ trục tọa độ
const axesHelper = new THREE.AxesHelper(5); // 5 đại diện cho chiều dài của hệ trục xyz
scene.add(axesHelper);

// camera.position.z = 5; // đặt vị trí của camera theo trục Z
// camera.position.y = 2; // đặt vị trí của camera theo trục Y
camera.position.set(1, 2, 5);

//Tạo 1 BOX (vật thể 3D)
const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const BoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Đặt vật liệu cho BOX
const cube = new THREE.Mesh(BoxGeometry, BoxMaterial);
scene.add(cube);

//xoay cho Box quay
cube.rotation.x = 10;
cube.rotation.y = 6;

//Tạo 1 hàm xoay theo thời gian
function animation(time) {
  cube.rotation.x = time / 1000; // xoay theo thời gian
  cube.rotation.y = time / 1000;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animation);
