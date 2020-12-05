// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let refractorySkybox;
const mixers = [];

function init() {

  container = document.querySelector('#scene-container');
  scene = new THREE.Scene();

  createCamera();
  createControls();
  createLights();
  createSkybox();
  loadGallery();
  createGrass();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
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
  camera.position.set(-9, 13, 40);
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

  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 5);
  scene.add(ambientLight, mainLight);
}

function loadGallery() {

  const loader = new THREE.GLTFLoader();

  const onLoad = (gltf, position, material) => {

    const model = gltf.scene.children[0];
    model.position.copy(position);

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
  mesh.rotation.x = - Math.PI / 2.2;
  mesh.position.y = 0;
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
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix(); // update the camera's frustum
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);

init();
