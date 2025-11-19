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
camera.position.set(0, 0.5, 4)

//CREATE A GLOBALLY ACCESSIBLE OBJECT TO HOLD ONTO ALL OF OUR MESHES
const meshes = {}
const lights = {}
const mixers = []
const controls = new OrbitControls(camera, renderer.domElement)

const clock = new THREE.Clock()
const loadingManager = manager()
const currentMesh = {}
let count = 0
let buttonsSetup = false
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
	instances()
	animate()
}

function setupButtons() {
	const leftButton = document.querySelector('.left')
	const rightButton = document.querySelector('.right')

	rightButton.addEventListener('click', () => {
		count++
		console.log(count)

		// Get the current mesh dynamically
		const meshKey = `car${count}`
		if (meshes[meshKey]) {
			currentMesh.current = meshes[meshKey]

			// Create a fresh timeline each time with current values
			const resetTL = gsap.timeline()
			resetTL
				// .to(currentMesh.current.rotation, {
				// 	y: -Math.PI / 5,
				// 	duration: 1,
				// })
				.to(camera.position, {
					x: 15 * count,
					duration: 3,
				})
		}
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
	// car1.init()

	const car2 = new Model({
		name: 'car2',
		url: 'car2.glb',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(0.5, 0.5, 0.5),
		// position: new THREE.Vector3(15, -0.35, 0),
	})
	car2.init()
	const car3 = new Model({
		name: 'car3',
		url: 'car3.glb',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(75, 75, 75),
		// position: new THREE.Vector3(30, -0.35, 0),
	})
	car3.init()
	// const car4 = new Model({
	// 	name: 'car4',
	// 	url: 'car4.glb',
	// 	meshes: meshes,
	// 	scene: scene,
	// 	scale: new THREE.Vector3(0.5, 0.5, 0.5),
	// 	position: new THREE.Vector3(45, -0.35, 0),
	// })
	// car4.init()
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

	if (meshes.car1) {
		// Fix: Use bracket notation to get the actual object, not a string
		const meshKey = `car${count}`
		if (meshes[meshKey]) {
			currentMesh.current = meshes[meshKey]
		} else {
			// Fallback to car0 if the count doesn't match any mesh
			currentMesh.current = meshes.car0
		}

		if (!buttonsSetup) {
			setupButtons()
			buttonsSetup = true
		}
	}

	//RE-START THE LOOP
	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	renderer.render(scene, camera)
}
