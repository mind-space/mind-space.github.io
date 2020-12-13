// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let refractorySkybox;
let PointerLockControls;
let HTMLDOMElement;

const mixers = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function getUrl(intersect) {
  try {
    return intersect.object.userData.URL;
  } catch(err) {
    return false;
  }
}

function doStuffwithRaycaster() {
   raycaster.setFromCamera( mouse, camera );
   var intersects = raycaster.intersectObjects( scene.children, true );

   if (intersects.length > 0) {
     const url = getUrl(intersects[0]);
     if(url) {
       window.open(url);
    }
   }
}

function onMouseMove( event ) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // console.log(mouse);
}

window.addEventListener('mousemove', onMouseMove, false );
window.addEventListener( 'click', onDocumentMouseDown, false );

function onDocumentMouseDown( event ) {
  event.preventDefault();
  doStuffwithRaycaster();
}

function init() {

  container = document.querySelector('#scene-container');
  scene = new THREE.Scene();

  createCamera();
  createControls();
  createLights();
  createSkybox();
  loadGallery();
  createGrass();

  createChrisDoor();
  createJayDoor();
  createJessicaDoor();
  createSoumyaDoor();
  createNancyDoor();
  createMeganDoor();
  createJonathanDoor();
  //createYukiDoor();
  createLianaDoor();
  createNikitaDoor();
  //createOwenDoor();
  createLuisDoor();
  createFengpingDoor();
  // createLynnDoor();
  createNicholasDoor();
  createCharmiDoor();
  createConnorDoor();
  createTerranceDoor();
  //createClaireDoor();
  createDanDoor();

  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
  controls = new THREE.PointerLockControls( camera, document.body, HTMLDOMElement );

				const blocker = document.getElementById( 'blocker' );
				const instructions = document.getElementById( 'instructions' );

				// instructions.addEventListener( 'click', function () {
        //
				// 	controls.lock();
        //
				// }, false );

				controls.addEventListener( 'lock', function () {

					instructions.style.display = 'none';
					blocker.style.display = 'none';

				} );

				controls.addEventListener( 'unlock', function () {

					blocker.style.display = 'block';
					instructions.style.display = '';

				} );

				scene.add( controls.getObject() );

				const onKeyDown = function ( event ) {

					switch ( event.keyCode ) {

						case 38: // up
						case 87: // w
							moveForward = true;
							break;

						case 37: // left
						case 65: // a
							moveLeft = true;
							break;

						case 40: // down
						case 83: // s
							moveBackward = true;
							break;

						case 39: // right
						case 68: // d
							moveRight = true;
							break;

						case 32: // space
							if ( canJump === true ) velocity.y += 350;
							canJump = false;
							break;

					}

				};

				const onKeyUp = function ( event ) {

					switch ( event.keyCode ) {

						case 38: // up
						case 87: // w
							moveForward = false;
							break;

						case 37: // left
						case 65: // a
							moveLeft = false;
							break;

						case 40: // down
						case 83: // s
							moveBackward = false;
							break;

						case 39: // right
						case 68: // d
							moveRight = false;
							break;

					}

				};

				document.addEventListener( 'keydown', onKeyDown, false );
				document.addEventListener( 'keyup', onKeyUp, false );

}


function createSkybox() {
  const skyboxTexture = new THREE.CubeTextureLoader()
      .setPath("gallery/js/three.js-master/examples/textures/cube/MilkyWay/")
      .load(['dark-s_px.jpg', 'dark-s_nx.jpg', 'dark-s_py.jpg', 'dark-s_ny.jpg', 'dark-s_pz.jpg', 'dark-s_nz.jpg']);
      // .setPath("js/three.js-master/examples/textures/cube/skyboxsun25deg")
      // .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

  refractorySkybox = new THREE.MeshPhongMaterial({
    envMap: skyboxTexture,
    reflectivity: 0.8,
    color: "white",
    skinning: true
  })

  skyboxTexture.mapping = THREE.CuberRefractionMapping;

  scene.background = skyboxTexture;
}

function createCamera() {
  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(-9, 13, 40);
  //camera.position.set(-0.19, 215, 1.65);

}

function createControls() {
  controls = new THREE.OrbitControls(camera, container);
  controls.target.set(0, 10, 0);
}

function createLights() {
  // const mainLight = new THREE.DirectionalLight(0xaca3bf, -3); f0d8a1   0xe1ddeb
  const mainLight = new THREE.DirectionalLight(0xaca3bf, -3);
  mainLight.position.set(50, 100, 100);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 50;
  mainLight.shadow.mapSize.height = 50;

  // const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 12);0xd1c7d4, 0xdcd3e0,  0xedf5fc, 0xa3998e,
  // const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 12);
  // scene.add(ambientLight);

  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 14);
  scene.add(ambientLight);
}

function loadGallery() {

  const loader = new THREE.GLTFLoader();

  const onLoad = (gltf, position, material) => {

    const model = gltf.scene.children[0];
    model.position.copy(position);

    const object = gltf.scene;
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });

    scene.add(object);
  };

  // the loader will report the loading progress to this function
  const onProgress = () => { };

  // the loader will send any error messages to this function, and we'll log them to to console.
  const onError = (errorMessage) => { console.log(errorMessage); };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const position = new THREE.Vector3(-9, 0, -10);
  loader.load('gallery/models/seehalfthepicturegallery.gltf', gltf => onLoad(gltf, position, refractorySkybox), onProgress, onError);
}

function createGrass() {
  const geometry = new THREE.CircleBufferGeometry(240, 240);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/grasslight-big.jpg', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = - Math.PI / 2;
  mesh.position.y = 0;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createChrisDoor() {
  const geometry = new THREE.PlaneBufferGeometry(23, 35, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/ChrisTexture.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://cbastian3.github.io/underarock.github.io'};
  //change these values to get the door to appear in the correct space
  mesh.rotation.y =  -1.45;
  mesh.position.x = 134.025;
  mesh.position.y = 18.823;
  mesh.position.z = 3.3;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createJayDoor() {
  const geometry = new THREE.PlaneBufferGeometry(19, 35, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/Jay.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://taikun649.github.io/Conflict-Liberty/'};
  //change these values to get the door to appear in the correct space
  mesh.rotation.y =  -2.4;
  mesh.position.x = 45;
  mesh.position.y = 20;
  mesh.position.z = 97;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}


function createJessicaDoor() {
  const geometry = new THREE.PlaneBufferGeometry(20, 33, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/Jessica.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://Stranded-at-home.github.io'};
  //change these values to get the door to appear in the correct space
  mesh.rotation.y =  -9.3;
  mesh.position.x = 95.137;
  mesh.position.y = 18.823;
  mesh.position.z = 55;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createSoumyaDoor() {
  const geometry = new THREE.PlaneBufferGeometry(27, 30, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/Soumya.jpg', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://soumya9820.github.io/thevoiceinsideyou.github.io/'};
  //change these values to get the door to appear in the correct space
  // mesh.rotation.x =  180;
  // mesh.rotation.y =  -56.68;
  // mesh.rotation.z =  180;
  // mesh.position.x = 65.291;
  // mesh.position.y = 18.823;
  // mesh.position.z = 66.466;
  //don't change anything else!

  // //change these values to get the door to appear in the correct space
  mesh.rotation.y =  90;
  mesh.position.x = -110;
  mesh.position.y = 20;
  mesh.position.z = -20;
  // //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createNancyDoor() {
  const geometry = new THREE.PlaneBufferGeometry(22, 30, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/Nancy.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://unseen2020.github.io/'};

  // //change these values to get the door to appear in the correct space
  mesh.rotation.y =  120.2;
  mesh.position.x = -105;
  mesh.position.y = 20;
  mesh.position.z = -57;
  // //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createMeganDoor() {
  const geometry = new THREE.PlaneBufferGeometry(27, 30, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/AngerEmpathypic-Magen.PNG', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://AngerEmpathy.github.io'};

  // //change these values to get the door to appear in the correct space
  mesh.rotation.y =  221;
  mesh.position.x = -76;
  mesh.position.y = 20;
  mesh.position.z = -86;
  // //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createJonathanDoor() {
  const geometry = new THREE.PlaneBufferGeometry(22, 35, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/assemble-sjelin-Jonathan.jpg', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://jankyjon.github.io/gallery-project'};
  //change these values to get the door to appear in the correct space
  //mesh.rotation.y =  225;
mesh.rotation.y =  11.2;
//mesh.rotation.y =  225;

  mesh.position.x = 92;
  mesh.position.y = 18.823;
  mesh.position.z = -52;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createYukiDoor() {
  const geometry = new THREE.PlaneBufferGeometry(16, 49, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/ChrisTexture.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  //mesh.userData = {URL:….};
  //change these values to get the door to appear in the correct space
  //mesh.rotation.y =  160;
  mesh.rotation.y =  9.38;
  //mesh.rotation.y =  160;
  mesh.position.x = -70.17;
  mesh.position.y = 20.315;
  mesh.position.z = 78.993;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createLianaDoor() {
  const geometry = new THREE.PlaneBufferGeometry(28, 40, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/Liana.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://lianaluxe.github.io/LearningThreeJS/ocean.html'};
  //change these values to get the door to appear in the correct space
  //mesh.rotation.y =  160;
  mesh.rotation.y =  83.45;
  //mesh.rotation.y =  160;
  mesh.position.x = -96;
  mesh.position.y = 20.315;
  mesh.position.z = 60;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createNikitaDoor() {
  const geometry = new THREE.PlaneBufferGeometry(20, 30, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/Nikita.jpg', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://nikigokhale.github.io/theres-hope-after-all/'};

  mesh.rotation.y =  83.2;
  mesh.position.x = -100;
  mesh.position.y = 20.315;
  mesh.position.z = 18;
  mesh.receiveShadow = true;
  scene.add(mesh);
}
function createOwenDoor() {
  const geometry = new THREE.PlaneBufferGeometry(16, 28, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/ChrisTexture.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  //mesh.userData = {URL:….}

  mesh.rotation.y =  57.24;
  mesh.position.x = -103.598;
  mesh.position.y = 20.315;
  mesh.position.z = -21.073;
  mesh.receiveShadow = true;
  scene.add(mesh);
}
function createLuisDoor() {
  const geometry = new THREE.PlaneBufferGeometry(24, 32, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/luispicture.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://github.com/LuisRam-25/LuisRam-25.io'};

  mesh.rotation.y =  44.1;
  mesh.position.x = -49;
  mesh.position.y = 21;
  mesh.position.z = -105;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createFengpingDoor() {
  const geometry = new THREE.PlaneBufferGeometry(20, 40, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/Fengping.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://fengpingxiong.github.io/dream/'};

  mesh.rotation.y =  180;

  mesh.position.x = 127;
  mesh.position.y = 20;
  mesh.position.z = 37;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

// function createLynnDoor() {
//   const geometry = new THREE.PlaneBufferGeometry(25, 40, 0, 0);
//   const textureLoader = new THREE.TextureLoader();
//   const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
//     texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//   });
//   // texture.repeat.set(5, 5);
//   texture.encoding = THREE.sRGBEncoding;
//   texture.anisotropy = 16;
//   const material = new THREE.MeshStandardMaterial({
//     map: texture,
//     bumpMap: texture,
//     // bumpScale: 5,
//   });
//   const mesh = new THREE.Mesh(geometry, material);
//   // mesh.userData = {URL:….}
//   mesh.rotation.y = -1.23;
//
//   mesh.position.x = 135;
//   mesh.position.y = 20;
//   mesh.position.z = 6;
//   mesh.receiveShadow = true;
//   scene.add(mesh);
// }

function createNicholasDoor() {
  const geometry = new THREE.PlaneBufferGeometry(25, 35, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/Nicholaspicture.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://NCulver20.github.io'};

  mesh.rotation.y =  -0.5;

  mesh.position.x = 110;
  mesh.position.y = 18;
  mesh.position.z = -25;
  mesh.receiveShadow = true;
  scene.add(mesh);
}


function createCharmiDoor() {
  const geometry = new THREE.PlaneBufferGeometry(25, 41, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/data-3js-Charmi.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'Data-Threejs.github.io'};

  mesh.rotation.y = 31.7;
  mesh.position.x = 11.151;
  mesh.position.y = 20.315;
  mesh.position.z = -82;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createConnorDoor() {
  const geometry = new THREE.PlaneBufferGeometry(26, 28, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/ChrisTexture.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://Connor-Final.github.io'};

  mesh.rotation.y =  12.8;
  mesh.position.x = 50;
  mesh.position.y = 21;
  mesh.position.z = -97;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createTerranceDoor() {
  const geometry = new THREE.PlaneBufferGeometry(24, 33, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/Terrancepicture.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://github.com/LabriolaArt-356/LabriolaArt-356.github.io'};

  mesh.rotation.y =  -64;
  mesh.position.x = 88;
  mesh.position.y = 20.315;
  mesh.position.z = -85;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createClaireDoor() {
  const geometry = new THREE.PlaneBufferGeometry(16, 49, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/ChrisTexture.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  //mesh.userData = {URL:….}

  // mesh.rotation.y =  -79.85;
  // mesh.position.x = 86.994;
  // mesh.position.y = 20.315;
  // mesh.position.z = -48;
  mesh.rotation.y =  0;
  mesh.position.x =69;
  mesh.position.y = 16;
  mesh.position.z = 69;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createDanDoor() {
  const geometry = new THREE.PlaneBufferGeometry(25, 30, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('gallery/textures/danfinalss-01.jpeg', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  // texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    // bumpScale: 5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {URL:'https://DrowningInPlastic.github.io'};

  mesh.rotation.y =  -2.2;
  mesh.position.x = 67;
  mesh.position.y = 20;
  mesh.position.z = 69;
  mesh.receiveShadow = true;
  scene.add(mesh);
}


function createRenderer() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.shadowMap.enable = true;

  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}

function update() {
  const clock = new THREE.Clock();
  const delta = clock.getDelta();
  for (const mixer of mixers) {
    mixer.update(delta);
  }
}

function render() {
  renderer.render(scene, camera);

   //console.log(camera.position);
   // console.log(camera.rotation);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix(); // update the camera's frustum
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);

init();
