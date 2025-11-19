import './style.css'
//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'
//IMPORT OUR ADD DEFAULT MESHES FUNCTION FROM OUR EXTERNAL JS FILE
import { addDefaultMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addLight'
import Model from './model'
import { manager } from './manager'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { HDRI } from './environment'
// import { interaction } from './interaction'
import gsap from 'gsap'

//SET UP OUR ESSENTIALS SCENE, CAMERA, RENDERER
const scene = new THREE.Scene()

//THE FOUR PARAMETERS TO OUR PERSPECTIVE CAMERA ARE: (FOV, ASPECT RATIO, NEAR FRUSTUM, FAR FRUSTUM)
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
const renderer = new THREE.WebGLRenderer({ antialias: true })

//SET THE CAMERA Z POSITION TO 5 SO THAT WE'RE NOT ON TOP OF ALL OUR MESHES BY DEFAULT
camera.position.set(-2.5, 1, 3)

//CREATE A GLOBALLY ACCESSIBLE OBJECT TO HOLD ONTO ALL OF OUR MESHES
const meshes = {}
const lights = {}
const mixers = []
const controls = new OrbitControls(camera, renderer.domElement)

const clock = new THREE.Clock()
const loadingManager = manager()
const currentMesh = {}
scene.background = HDRI(loadingManager)
scene.environment = HDRI(loadingManager)

//CALL OUR INIT FUNCTION, OUR SETUP BASICALLY
init()
function init() {
	//DEFAULT SETTINGS FOR OUR RENDERER, WE WANT TO SET THE SIZE OF OUR RENDERER OUTPUT TO BE THE SAME SIZE AND RATIO AS OUR WINDOW
	//WE ALSO WANT OUR RENDERER TO OUTPUT TO OUR WEBPAGE
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//WE WILL ADD ANY AND ALL 3D MESHES TO OUR GLOBAL MESHES OBJECT HERE

	//Lights
	// lights.default = addLight()

	//HERE WE'LL ADD EACH OBJECT TO OUR SCENE AS WELL

	// scene.add(lights.default)

	//START OUR ANIMATION LOOP
	setupButtons()
	instances()
	animate()
}

function setupButtons() {
	const leftButton = document.querySelector('.left')
	const rightButton = document.querySelector('.right')
	leftButton.addEventListener('click', () => {
		console.log('started')
		gsap.to(meshes.car1.rotation, {
			y: 0,
			duration: 3,
			ease: 'power3.inOut',
			onUpdate: () => {
				console.log('animating')
			},
		})
	})
}

function instances() {
	const car1 = new Model({
		name: 'car1',
		url: 'car1.glb',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(80, 80, 80),
		position: new THREE.Vector3(0, -0.35, 0),
	})
	car1.init()

	const car2 = new Model({
		name: 'car2',
		url: 'car2.glb',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(0.5, 0.5, 0.5),
	})
	// car2.init()
}

function animate() {
	//EVERY FRAME WE UPDATE THE POSITION OF OUR meshes.default, meshes.copy, meshes.copy2
	const delta = clock.getDelta()
	for (const mixer of mixers) {
		mixer.update(delta)
	}

	if (meshes.car1) {
		meshes.car1.rotation.y -= 0.005
		currentMesh.current = meshes.car1
	}

	//RE-START THE LOOP
	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	renderer.render(scene, camera)
}
