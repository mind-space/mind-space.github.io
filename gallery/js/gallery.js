// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let refractorySkybox;
const mixers = [];
let PointerLockControls;
let HTMLDOMElement;

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
  createSoumyaDoor();
  createSoumyaDoor2();
  createSoumyaDoor3();
  createNikitaDoor();
  createFengpingDoor();
  createFengpingDoor2();
  createFengpingDoor3()

  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
  controls = new THREE.PointerLockControls( camera, document.body, HTMLDOMElement );

				const blocker = document.getElementById( 'blocker' );
				const instructions = document.getElementById( 'instructions' );

				instructions.addEventListener( 'click', function () {

					controls.lock();

				}, false );

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
    .setPath("js/three.js-master/examples/textures/cube/MilkyWay/")
    .load(['dark-s_nx.jpg', 'dark-s_nx.jpg', 'dark-s_ny.jpg', 'dark-s_ny.jpg', 'dark-s_nz.jpg', 'dark-s_nz.jpg']);

  refractorySkybox = new THREE.MeshPhongMaterial({
    envMap: skyboxTexture,
    reflectivity: 0.5,
    color: "white",
    skinning: true
  })

  skyboxTexture.mapping = THREE.CuberRefractionMapping;

  scene.background = skyboxTexture;
}



function createCamera() {
  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 500);
  // camera.position.set(-9, 13, 40);
  camera.position.set(81, 163, -121);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, container);
  controls.target.set(0, 10, 0);
}

function createLights() {
  const mainLight = new THREE.DirectionalLight(0xaca3bf, -3);
  mainLight.position.set(50, 100, 100);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 50;
  mainLight.shadow.mapSize.height = 50;

  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 6);
  scene.add(ambientLight, mainLight);
}

function loadGallery() {

  const loader = new THREE.GLTFLoader();

  const onLoad = (gltf, position, material) => {

    const model = gltf.scene.children[0];
    model.position.copy(position);

    // model.rotation.y = (45);

    const mixer = new THREE.AnimationMixer(model);
    mixers.push(mixer);

    const clips = gltf.animations;
    clips.forEach((clip) => {
      mixer.clipAction(clip).play();
    });

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
  loader.load('models/gallerystructure.glb', gltf => onLoad(gltf, position, refractorySkybox), onProgress, onError);
}

function createGrass() {
  const geometry = new THREE.PlaneBufferGeometry(500, 500, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/grasslight-big.jpg', function (texture) {
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
  const geometry = new THREE.PlaneBufferGeometry(16, 49, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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

  //change these values to get the door to appear in the correct space
  mesh.rotation.y =  160;
  mesh.position.x = -66;
  mesh.position.y = 9;
  mesh.position.z = 86;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createChrisDoor2() {
  const geometry = new THREE.PlaneBufferGeometry(16, 49, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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

  //change these values to get the door to appear in the correct space
  mesh.rotation.y =  160;
  mesh.position.x = -66;
  mesh.position.y = 9;
  mesh.position.z = 86;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}


function createChrisDoor3() {
  const geometry = new THREE.PlaneBufferGeometry(16, 49, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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

  //change these values to get the door to appear in the correct space
  mesh.rotation.y =  160;
  mesh.position.x = -66;
  mesh.position.y = 9;
  mesh.position.z = 86;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createSoumyaDoor() {
  const geometry = new THREE.PlaneBufferGeometry(27, 30, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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

  //change these values to get the door to appear in the correct space
  mesh.rotation.y =  90;
  mesh.position.x = -110;
  mesh.position.y = 20;
  mesh.position.z = -20;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createSoumyaDoor2() {
  const geometry = new THREE.PlaneBufferGeometry(27, 30, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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

  //change these values to get the door to appear in the correct space
  mesh.rotation.y =  120;
  mesh.position.x = -100;
  mesh.position.y = 20;
  mesh.position.z = -57;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createSoumyaDoor3() {
  const geometry = new THREE.PlaneBufferGeometry(27, 30, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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

  //change these values to get the door to appear in the correct space
  mesh.rotation.y =  221;
  mesh.position.x = -76;
  mesh.position.y = 20;
  mesh.position.z = -86;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createJonathanDoor() {
  const geometry = new THREE.PlaneBufferGeometry(16, 49, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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

  //change these values to get the door to appear in the correct space
  mesh.rotation.y =  160;
  mesh.position.x = -66;
  mesh.position.y = 9;
  mesh.position.z = 86;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createJonathanDoor2() {
  const geometry = new THREE.PlaneBufferGeometry(16, 49, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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

  //change these values to get the door to appear in the correct space
  mesh.rotation.y =  160;
  mesh.position.x = -66;
  mesh.position.y = 9;
  mesh.position.z = 86;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createJonathanDoor3() {
  const geometry = new THREE.PlaneBufferGeometry(16, 49, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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

  //change these values to get the door to appear in the correct space
  mesh.rotation.y =  160;
  mesh.position.x = -66;
  mesh.position.y = 9;
  mesh.position.z = 86;
  //don't change anything else!

  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createNikitaDoor() {
  const geometry = new THREE.PlaneBufferGeometry(16, 28, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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
  mesh.rotation.y =  160;

  mesh.position.x = -56;
  mesh.position.y = 9;
  mesh.position.z = 86;
  mesh.receiveShadow = true;
  scene.add(mesh);
}
function createNikitaDoor2() {
  const geometry = new THREE.PlaneBufferGeometry(16, 28, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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
  mesh.rotation.y =  160;

  mesh.position.x = -56;
  mesh.position.y = 9;
  mesh.position.z = 86;
  mesh.receiveShadow = true;
  scene.add(mesh);
}
function createNikitaDoor3() {
  const geometry = new THREE.PlaneBufferGeometry(16, 28, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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
  mesh.rotation.y =  160;

  mesh.position.x = -56;
  mesh.position.y = 9;
  mesh.position.z = 86;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createFengpingDoor() {
  const geometry = new THREE.PlaneBufferGeometry(20, 50, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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
  mesh.rotation.y =  180;

  mesh.position.x = 127;
  mesh.position.y = 12;
  mesh.position.z = 37;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createFengpingDoor2() {
  const geometry = new THREE.PlaneBufferGeometry(25, 40, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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
  mesh.rotation.y = -1.23;

  mesh.position.x = 135;
  mesh.position.y = 20;
  mesh.position.z = 6;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createFengpingDoor3() {
  const geometry = new THREE.PlaneBufferGeometry(25, 40, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.y =  -0.5;

  mesh.position.x = 105;
  mesh.position.y = 20;
  mesh.position.z = -20;
  mesh.receiveShadow = true;
  scene.add(mesh);
}


function createCharmiDoor() {
  const geometry = new THREE.PlaneBufferGeometry(16, 28, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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
  mesh.rotation.y =  160;

  mesh.position.x = -56;
  mesh.position.y = 9;
  mesh.position.z = 86;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createCharmiDoor2() {
  const geometry = new THREE.PlaneBufferGeometry(16, 28, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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
  mesh.rotation.y =  160;

  mesh.position.x = -56;
  mesh.position.y = 9;
  mesh.position.z = 86;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createCharmiDoor3() {
  const geometry = new THREE.PlaneBufferGeometry(16, 28, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/ChrisTexture.png', function (texture) {
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
  mesh.rotation.y =  160;

  mesh.position.x = -56;
  mesh.position.y = 9;
  mesh.position.z = 86;
  mesh.receiveShadow = true;
  scene.add(mesh);
}


// function addDoors() {
//   const geometry = new THREE.PlaneGeometry( 5, 20, 32 );
//   const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
//   const plane = new THREE.Mesh( geometry, material );
//   scene.add( plane );
// }

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

  console.log(camera.position);
  // console.log(camera.rotation);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix(); // update the camera's frustum
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);

init();
