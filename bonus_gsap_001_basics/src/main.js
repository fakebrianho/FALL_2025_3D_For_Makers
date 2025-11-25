import './style.css'
//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'
//IMPORT OUR ADD DEFAULT MESHES FUNCTION FROM OUR EXTERNAL JS FILE
import { addDefaultMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addLight'
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
camera.position.set(0, 0, 5)

//CREATE A GLOBALLY ACCESSIBLE OBJECT TO HOLD ONTO ALL OF OUR MESHES
const meshes = {}
const lights = {}

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

	//Lights
	lights.default = addLight()

	//HERE WE'LL ADD EACH OBJECT TO OUR SCENE AS WELL
	scene.add(meshes.default)

	scene.add(meshes.standard)
	scene.add(lights.default)

	//START OUR ANIMATION LOOP
	gsapStuff()
	animate()
}

function gsapStuff() {
	// Get a reference to the button element from the HTML document
	const button = document.getElementById('button')

	// Add an event listener to the button that triggers when it's clicked
	button.addEventListener('click', () => {
		// GSAP ANIMATION 1: Animate the standard mesh scale
		// gsap.to() animates properties of a target object (meshes.standard.scale)
		gsap.to(meshes.standard.scale, {
			// Target value: multiply the current x-scale by 2 (double the width)
			x: meshes.standard.scale.x * 2,
			// Animation duration in seconds (0.5 = half a second)
			duration: 0.5,
			// Easing function: 'power2.inOut' creates smooth acceleration and deceleration
			// This gives a more natural, organic feeling animation rather than linear
			ease: 'power2.inOut',
		})

		// GSAP ANIMATION 2: Animate the default mesh scale simultaneously
		// This animation runs at the same time as the first one (not chained)
		gsap.to(meshes.default.scale, {
			// Target value: multiply the current x-scale by 0.5 (half the width)
			x: meshes.default.scale.x * 0.5,
			// Same duration as the first animation (0.5 seconds)
			duration: 0.5,
			// Same easing for consistent animation feel
			ease: 'power2.inOut',
		})
		// Both animations run simultaneously when the button is clicked
		// The standard mesh expands (2x) while the default mesh shrinks (0.5x)
	})
}

function animate() {
	//EVERY FRAME WE UPDATE THE POSITION OF OUR meshes.default, meshes.copy, meshes.copy2

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.y += 0.01
	meshes.default.rotation.x -= 0.01
	meshes.default.rotation.y -= 0.02
	//RE-START THE LOOP
	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	renderer.render(scene, camera)
}
