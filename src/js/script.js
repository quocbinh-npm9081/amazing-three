import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // module cho phép camera quay quanh vật thể trong khoản cách nhất định
import * as datGUI from "dat.gui"; //giao diện đồ học đơn giản
import wp4247401 from "../images/wp4247401.jpg";
import wp4575206 from "../images/wp4575206.jpg";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.setClearColor(0xffea00); // config màu cho phông xanh
renderer.shadowMap.enabled = true; // cho phép đổ bóng
document.body.appendChild(renderer.domElement);

// tạo camera
const scene = new THREE.Scene();
//Trường hợp muốn sử dụng ảnh(backgroundf1) làm nền cho background thì ta phải thông qua qua đối tượng Loader để tải ảnh
const textureLoader = new THREE.TextureLoader();
//scene.background = textureLoader.load(wp4247401); //thêm kết cấu cho cảnh
const cubeTextureLoader = new THREE.CubeTextureLoader(); // tạo 1 cái hộp 6 mặt bao chùm lấy toàn cảnh
scene.background = cubeTextureLoader.load([
  //chỉ nhận các ảnh có kích thước bằng nhau (tùy vào cấu hình của máy tính mà threejs sẽ giới hạn chất lượng, bạn không thể đưa ảnh 4k cho máy tính có độ phân giải thấp, hãy tìm cách tối ưu khác )
  wp4247401,
  wp4575206,
  wp4247401,
  wp4247401,
  wp4575206,
  wp4575206,
]);
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
  angle: 0.1, // góc tới của anh sáng
  penumbra: 0.01,
  intensity: 1, // cường độ ánh sáng
};

gui.addColor(options, "sphereColor").onChange(function (e) {
  sphere.material.color.set(e);
});
gui.add(options, "wireframe").onChange(function (e) {
  sphere.material.wireframe = e;
});
gui.add(options, "speed", 0, 0.1);
gui.add(options, "angle", 0, 0.3);
gui.add(options, "penumbra", 0, 0.3);
gui.add(options, "intensity", 0, 0.3);

//Tạo 1 BOX  (vật thể hình hộp)
const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const BoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Đặt vật liệu cho BOX
const cube = new THREE.Mesh(BoxGeometry, BoxMaterial);
scene.add(cube);

//Tạo 1 Box làm có bối cảnh các mặt là cách hình nền,có 6 mặt hình anh khác nhau
const Box2MultiMaterial = [
  //tao 6 vật liệu khách nhau cho 6 mặt của hộp
  new THREE.MeshBasicMaterial({ map: textureLoader.load(wp4247401) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(wp4247401) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(wp4247401) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(wp4575206) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(wp4575206) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(wp4575206) }),
];
const Box2Geometry = new THREE.BoxGeometry(4, 5, 4);
//const Box2Material = new THREE.MeshBasicMaterial({ trường hợp muốn 6 mặt có chung 1 vật liệu
// color: 0x00ff00,
//map: textureLoader.load([wp4247401]), // hình hộp có background là wp4247401.jpg
//}); // Đặt vật liệu cho BOX
const cubeTexture = new THREE.Mesh(Box2Geometry, Box2MultiMaterial);
cubeTexture.castShadow = true;
//cubeTexture.material.map = textureLoader.load([wp4247401]); // hình hộp có background là wp4247401.jpg đây là 1 cách không mà không cần thông qua constructor
cubeTexture.position.set(0, 10, 10);
cubeTexture.name = "theBox"; //đặt tên cho cude
scene.add(cubeTexture);

//Tạo 1 quả cầu
const sphereGeometry = new THREE.SphereGeometry(4, 64, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "#049ef4",
  wireframe: true, //wireframe là hiện khung xương, ta sẽ thấy các vật thể bên trong
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
const sphereID = sphere.id;
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
// const ambientLight = new THREE.AmbientLight(0x333333);
// scene.add(ambientLight);
// //Xác định hướng màu và độ tương phản của ánh sáng
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// directionalLight.position.set(-30, 40, 0);
// directionalLight.castShadow = true; //nguồn sáng chiếu xuống sphere, sphere đổ bóng xuống mặt phẳng
// directionalLight.shadow.camera.top = 12; //băng kích thước vùng đổ bóng của máy ảnh
// scene.add(directionalLight);
// //Khởi tạo đối tượng nguồn sáng, ta có thể duy chuyển nguồn sáng để tạo bóng, phải có đối tương Helper mới có thể điều chỉnh vị trí nguồn sáng được(directionalLight.position.set(-30, 40, 0);)
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   5
// );
// scene.add(directionalLightHelper);
//Camera hỗ trợ đỗ bóng, helper naỳ bẽ cho ta các đường sáng , giúp điều chỉnh ánh sáng trực quang hơn
// const directionalLightCameraShadow = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalLightCameraShadow);

//Tạo nguồn ánh sách định hướng, nó giống như ánh sáng của đèn pin( tỏa ra hình non, diện tích sẽ nhở lại khi đưa lại gần và tỏa rộng ra khi đưa ra xa)
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = options.angle; // thu hẹp goc của nguồn sáng
scene.add(spotLight);
//Camera hỗ trợ đỗ bóng, helper naỳ bẽ cho ta các đường sáng , giúp điều chỉnh ánh sáng trực quang hơn
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

//Tạo hiệu ứng sương mù( di chuyển camera đi xa khung hình sẽ làm khung hình mờ dần đi)
//scene.fog = new THREE.Fog(0xcccccc, 1, 100);
scene.fog = new THREE.FogExp2(0xcccccc, 0.01); // hiệu ứng này giông thật hơn hiệu ứng bên trên

//bắt sự kiện khi di chuột lên phần tử
const raycaster = new THREE.Raycaster();
const mousePointer = new THREE.Vector2();
window.addEventListener("mousemove", function (event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  //lấy tọa độ chuột trong không gian màn hình và chuyển đổi thành tọa độ chuẩn hóa trong khoảng từ -1 đến 1.
  mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

//tạo hành động nhảy lên cho sphere(khối cầu)
let step = 0;
//Tạo 1 hàm xoay theo thời gian
function animation(time) {
  cube.rotation.x = time / 1000; // xoay theo thời gian
  cube.rotation.y = time / 1000;
  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step)); //Math.abs() lấy giá trị tuyệt đối - Math.sin()// [-1,1]

  //cập nhập khi điều chỉnh nguồn sáng trong dat.gui
  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  spotLightHelper.update();
  raycaster.setFromCamera(mousePointer, camera); //Đây là cách để thiết lập tia (ray) từ tọa độ chuẩn hóa của con trỏ chuột (pointer) đến camera
  const intersects = raycaster.intersectObjects(scene.children); //Đây là cách để kiểm tra va chạm giữa tia và các đối tượng trong scene.
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.id === sphereID)
      intersects[i].object.material.color.set(0xff0000);
    if (intersects[i].object.name === "theBox") {
      console.log("intersects: ", intersects[i]);

      intersects[i].object.rotation.x = time / 1000;
      intersects[i].object.rotation.y = time / 1000;
    }
  }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animation);
