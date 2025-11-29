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

	//Lights
	lights.default = addLight()

	//HERE WE'LL ADD EACH OBJECT TO OUR SCENE AS WELL
	scene.add(meshes.default)

	scene.add(meshes.standard)
	scene.add(lights.default)

	//START OUR ANIMATION LOOP
	instances()
	// initTimeline()
	animate()
}

function initTimeline() {
	timeline.to(
		meshes.flower.scale,
		{ x: 5, y: 5, z: 5, duration: totalDuration * 0.3 },
		0.1 * totalDuration
	)
	timeline.to(
		meshes.default.position,
		{ duration: totalDuration * 0.3, x: -2 },
		0.3 * totalDuration
	)
	timeline.to(
		'#animation1',
		{ duration: totalDuration * 0.08, opacity: 1 },
		0.3 * totalDuration
	)
	timeline.to(
		'#animation1',
		{ duration: totalDuration * 0.08, opacity: 0 },
		0.52 * totalDuration
	)
	timeline.to(
		'#animation2',
		{ duration: totalDuration * 0.08, opacity: 1 },
		0.7 * totalDuration
	)
	timeline.to(
		meshes.standard.position,
		{ duration: totalDuration * 0.3, x: 2 },
		0.7 * totalDuration
	)
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
function handleScroll(event) {
	window.addEventListener('wheel', (event) => {
		const scrollDelta = event.deltaY || event.wheelDelta
		virtualScrollPosition += scrollDelta * 0.01 // Adjust the scroll speed as needed
		virtualScrollPosition = Math.max(
			0,
			Math.min(virtualScrollPosition, maxScrollPosition)
		)

		const progress = virtualScrollPosition / maxScrollPosition
		const time = progress * totalDuration
		timeline.seek(time)
		debug.innerHTML = progress
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

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	renderer.render(scene, camera)
}
