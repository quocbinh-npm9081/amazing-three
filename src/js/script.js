import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // module cho phép camera quay quanh vật thể trong khoản cách nhất định
import * as datGUI from "dat.gui"; //giao diện đồ học đơn giản
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // cho phép đổ bóng
document.body.appendChild(renderer.domElement);

// tao camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, //fov — Camera frustum vertical field of view.
  window.innerWidth / window.innerHeight, //aspect — Camera frustum aspect ratio.
  0.1, //near — Camera frustum near plane.
  1000 //far — Camera frustum far plane.
);

//Tạo thể hiện của Quỹ đạo Camera
const orbit = new OrbitControls(camera, renderer.domElement);

//Tao hệ trục tọa độ
const axesHelper = new THREE.AxesHelper(5); // 5 đại diện cho chiều dài của hệ trục xyz
scene.add(axesHelper);
orbit.update(); //Cập nhập lại khung hình khi camera thay đổi quỹ đạo

// camera.position.z = 5; // đặt vị trí của camera theo trục Z
// camera.position.y = 2; // đặt vị trí của camera theo trục Y
camera.position.set(-10, 30, 30);

//config GUI
const gui = new datGUI.GUI();
const options = {
  sphereColor: "#ffea00",
  wireframe: true,
  speed: 0.01,
};

gui.addColor(options, "sphereColor").onChange(function (e) {
  sphere.material.color.set(e);
});
gui.add(options, "wireframe").onChange(function (e) {
  sphere.material.wireframe = e;
});
gui.add(options, "speed", 0, 0.1);

//Tạo 1 BOX (vật thể hình hộp)
const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const BoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Đặt vật liệu cho BOX
const cube = new THREE.Mesh(BoxGeometry, BoxMaterial);
scene.add(cube);

//Tạo 1 quả cầu
const sphereGeometry = new THREE.SphereGeometry(4, 64, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "#049ef4",
  wireframe: true, //wireframe là hiện khung xương, ta sẽ thấy các vật thể bên trong
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(3, 10, 0);
sphere.castShadow = true; //Hình cấu là nguồn tạo bóng xuống mặt phẳng
scene.add(sphere);

//Tạo 1 mặt phẳng
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide, //khiến cho mặt phảng được phủ chất liệu ở cả 2 mặt
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI; // đặt mặt phảng nằm ngang đúng vị trí

plane.receiveShadow = true; //Mặt phẳng là nơi nhận bóng(shadow) từ hình cầu
scene.add(plane);

//Taọ lưới hỗ trợ đo đạc
const size = 10;
const divisions = 10;
//const gridHelper = new THREE.GridHelper(size, divisions); //kích thước (10) được chia làm 10 phần
const gridHelper = new THREE.GridHelper(30); //kích thước 30 bằng kích thước của mặt phẳng (planeGeometry)
scene.add(gridHelper);

//xoay cho Box quay
cube.rotation.x = 10;
cube.rotation.y = 6;

//Taọ môi  trường ánh sáng xung quanh( ánh sánh xung quanh tác động đến các đối tượng là như nhau và không thể tạo bóng vì nó không có hướng)
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
//Xác định hướng màu và độ tương phản của ánh sáng
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-30, 40, 0);
directionalLight.castShadow = true; //nguồn sáng chiếu xuống sphere, sphere đổ bóng xuống mặt phẳng
directionalLight.shadow.camera.top = 12; //băng kích thước vùng đổ bóng của máy ảnh
scene.add(directionalLight);
//Khởi tạo đối tượng nguồn sáng, ta có thể duy chuyển nguồn sáng để tạo bóng, phải có đối tương Helper mới có thể điều chỉnh vị trí nguồn sáng được(directionalLight.position.set(-30, 40, 0);)
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  5
);
scene.add(directionalLightHelper);

//Camera hỗ trợ đỗ bóng, helper naỳ bẽ cho ta các đường sáng , giúp điều chỉnh ánh sáng trực quang hơn
const directionalLightCameraShadow = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightCameraShadow);

//tạo hành động nhảy lên cho sphere(khối cầu)
let step = 0;
//Tạo 1 hàm xoay theo thời gian
function animation(time) {
  cube.rotation.x = time / 1000; // xoay theo thời gian
  cube.rotation.y = time / 1000;
  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step)); //Math.abs() lấy giá trị tuyệt đối - Math.sin()// [-1,1]
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animation);
