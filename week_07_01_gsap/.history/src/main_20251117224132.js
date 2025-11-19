import './style.css'
//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'
//IMPORT OUR ADD DEFAULT MESHES FUNCTION FROM OUR EXTERNAL JS FILE
import Model from './model'
import { manager } from './manager'
import { HDRI } from './environment'
import { postprocessing } from './postprocessing'
import gsap from 'gsap'

//SET UP OUR ESSENTIALS SCENE, CAMERA, RENDERER
const scene = new THREE.Scene()

//THE FOUR PARAMETERS TO OUR PERSPECTIVE CAMERA ARE: (FOV, ASPECT RATIO, NEAR FRUSTUM, FAR FRUSTUM)
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
const renderer = new THREE.WebGLRenderer({ antialias: false })

//SET THE CAMERA Z POSITION TO 5 SO THAT WE'RE NOT ON TOP OF ALL OUR MESHES BY DEFAULT
// Start at car3 position (x=30)
camera.position.set(0, 0.35, 4.5)

//CREATE A GLOBALLY ACCESSIBLE OBJECT TO HOLD ONTO ALL OF OUR MESHES
const meshes = {}
const mixers = []
// const controls = new OrbitControls(camera, renderer.domElement)

const clock = new THREE.Clock()
const loadingManager = manager()
const currentMesh = {}
// Car positions in order: car3, car2, car1, car5, car4 (starting from car3)
const carPositions = [0, 15, 30, 45, 60]
let currentIndex = 0 // Start at car3 (index 0 = x=30)
let buttonsSetup = false
let composer = null

scene.background = HDRI(loadingManager)
scene.environment = HDRI(loadingManager)
scene.backgroundIntensity = 0.45

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
	composer = postprocessing(scene, camera, renderer)

	//START OUR ANIMATION LOOP
	instances()
	resize()
	animate()
}

function updateActiveState() {
	const leftButton = document.querySelector('.left')
	const rightButton = document.querySelector('.right')

	// Remove active class from both buttons first
	leftButton.classList.remove('active')
	rightButton.classList.remove('active')

	// Add active class based on current position
	// At first position (index 0): only right button is active (can go right)
	// At last position: only left button is active (can go left)
	// In middle positions: both buttons are active (can go either direction)
	if (currentIndex === 0) {
		rightButton.classList.add('active')
	} else if (currentIndex === carPositions.length - 1) {
		leftButton.classList.add('active')
	} else {
		// Middle positions - both buttons active
		leftButton.classList.add('active')
		rightButton.classList.add('active')
	}
}

function setupButtons() {
	const leftButton = document.querySelector('.left')
	const rightButton = document.querySelector('.right')

	leftButton.addEventListener('click', () => {
		// Move left (decrease index, wrap around)
		currentIndex--
		if (currentIndex < 0) {
			currentIndex = carPositions.length - 1
		}
		const resetTL = gsap.timeline()
		resetTL.to(camera.position, {
			x: carPositions[currentIndex],
			duration: 3,
		})
		updateActiveState()
	})

	rightButton.addEventListener('click', () => {
		// Move right (increase index, wrap around)
		currentIndex++
		if (currentIndex >= carPositions.length) {
			currentIndex = 0
		}
		const resetTL = gsap.timeline()
		resetTL.to(camera.position, {
			x: carPositions[currentIndex],
			duration: 3,
		})
		updateActiveState()
	})

	// Set initial active state
	updateActiveState()
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
		position: new THREE.Vector3(15, -0.15, 0),
	})
	car2.init()
	const car3 = new Model({
		name: 'car3',
		url: 'car3.glb',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(80, 80, 80),
		position: new THREE.Vector3(30, -0.3, 0),
	})
	car3.init()
	const car4 = new Model({
		name: 'car4',
		url: 'car4.glb',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(0.38, 0.38, 0.38),
		position: new THREE.Vector3(45, 0.065, -0.2),
		// rotation: new THREE.Vector3(0, Math.PI / 2, 0),
	})
	car4.init()
	const car5 = new Model({
		name: 'car5',
		url: 'car5.glb',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(0.0053, 0.0053, 0.0053),
		position: new THREE.Vector3(60, -0.4, -0.45),
	})
	car5.init()
}
function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		if (composer) {
			composer.composer.setSize(window.innerWidth, window.innerHeight)
			if (composer.smaa) {
				composer.smaa.setSize(window.innerWidth, window.innerHeight)
			}
		}
	})
}
function animate() {
	//EVERY FRAME WE UPDATE THE POSITION OF OUR meshes.default, meshes.copy, meshes.copy2
	const delta = clock.getDelta()
	for (const mixer of mixers) {
		mixer.update(delta)
	}

	Object.values(meshes).forEach((mesh) => {
		mesh.rotation.y += 0.005
	})

	if (meshes.car4) {
		// meshes.car4.rotation.y += 0.005
	}
	if (meshes.car1) {
		// Map current index to car name
		const carNames = ['car3', 'car2', 'car1', 'car5', 'car4']
		const meshKey = carNames[currentIndex]
		if (meshes[meshKey]) {
			currentMesh.current = meshes[meshKey]
		}

		if (!buttonsSetup) {
			setupButtons()
			buttonsSetup = true
		}
	}

	//RE-START THE LOOP
	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	composer.composer.render()
}
