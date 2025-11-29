import './style.css'
//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'
//IMPORT OUR ADD DEFAULT MESHES FUNCTION FROM OUR EXTERNAL JS FILE
import { addDefaultMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addLight'
import Model from './model'
import { manager } from './manager'
import gsap from 'gsap'
import { addTrack } from './addTrack'

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
camera.position.set(0, 0, 5)

//CREATE A GLOBALLY ACCESSIBLE OBJECT TO HOLD ONTO ALL OF OUR MESHES
const meshes = {}
const lights = {}
const mixers = []

let scrollProgress = 0 // Current position (0-1) along the track
let targetProgress = 0 // Target position to smooth towards
let scrollVelocity = 0 // Current scroll speed
const friction = 0.95 // Reduces velocity over time (must be < 1)
const acceleration = 0.000007 // How quickly scroll affects velocity
const maxVelocity = 0.05 // Maximum scroll speed
const debug = document.querySelector('.scrollProgress') // Debug display element

const clock = new THREE.Clock()
const loadingManager = manager()

//CALL OUR INIT FUNCTION, OUR SETUP BASICALLY
init()
function init() {
	//DEFAULT SETTINGS FOR OUR RENDERER, WE WANT TO SET THE SIZE OF OUR RENDERER OUTPUT TO BE THE SAME SIZE AND RATIO AS OUR WINDOW
	//WE ALSO WANT OUR RENDERER TO OUTPUT TO OUR WEBPAGE
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//WE WILL ADD ANY AND ALL 3D MESHES TO OUR GLOBAL MESHES OBJECT HERE
	meshes.default = addDefaultMeshes({ xPos: -2 })
	meshes.standard = addStandardMesh({ xPos: 2 })
	meshes.track = addTrack().track
	meshes.debug = addTrack().debug
	scene.add(meshes.track)

	//Lights
	lights.default = addLight()

	//HERE WE'LL ADD EACH OBJECT TO OUR SCENE AS WELL
	scene.add(meshes.default)

	scene.add(meshes.standard)
	scene.add(lights.default)

	//START OUR ANIMATION LOOP
	instances()
	// initTimeline()
	handleScroll()

	animate()
}

function handleScroll() {
	// Convert wheel events into camera movement
	window.addEventListener('wheel', (event) => {
		const scrollDelta = event.deltaY
		scrollVelocity += scrollDelta * acceleration
		// Clamp velocity to maximum speed
		scrollVelocity = Math.max(
			Math.min(scrollVelocity, maxVelocity),
			-maxVelocity
		)
	})
}
function updateCamera(scrollProgress) {
	// Get current position on the track
	const position =
		meshes.track.geometry.parameters.path.getPointAt(scrollProgress)

	// Look slightly ahead on the track
	const lookAtPosition = meshes.track.geometry.parameters.path.getPointAt(
		Math.min(scrollProgress + 0.01, 1)
	)
	camera.position.copy(position)
	camera.lookAt(lookAtPosition)

	// Update debug display if available
	if (debug) {
		debug.innerHTML = `Progress: ${scrollProgress.toFixed(
			3
		)} || Velocity: ${scrollVelocity.toFixed(5)}`
	}
}

function instances() {
	const flower = new Model({
		name: 'flower',
		url: 'flowers.glb',
		scene: scene,
		meshes: meshes,
		animationState: true,
		mixers: mixers,
		scale: new THREE.Vector3(2, 2, 2),
		position: new THREE.Vector3(0, -0.8, 3),
		replace: true,
		replaceURL: 'gold.png',
		manager: loadingManager,
	})
	flower.init()
}
function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	//EVERY FRAME WE UPDATE THE POSITION OF OUR meshes.default, meshes.copy, meshes.copy2
	const delta = clock.getDelta()
	for (const mixer of mixers) {
		mixer.update(delta)
	}

	if (meshes.flower) {
		meshes.flower.rotation.y -= 0.01
	}

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.y += 0.01
	meshes.default.rotation.x -= 0.01
	meshes.default.rotation.y -= 0.02
	//RE-START THE LOOP
	requestAnimationFrame(animate)
	targetProgress += scrollVelocity
	scrollVelocity *= friction // Apply friction to slow movement
	if (Math.abs(scrollVelocity < 0.0001)) {
		scrollVelocity = 0 // Stop completely at very low speeds
	}

	// Clamp progress to valid range
	targetProgress = Math.max(0, Math.min(targetProgress, 1))

	// Smoothly move toward target position
	scrollProgress += (targetProgress - scrollProgress) * 0.1
	updateCamera(scrollProgress)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	renderer.render(scene, camera)
}
