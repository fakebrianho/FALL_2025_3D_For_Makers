import './style.css'
//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'
//IMPORT OUR ADD DEFAULT MESHES FUNCTION FROM OUR EXTERNAL JS FILE
import { addDefaultMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addLight'
import Model from './model'
import { manager } from './manager'
import { InteractionManager } from 'three.interactive'

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

const clock = new THREE.Clock()
const loadingManager = manager()

const interactionManager = new InteractionManager(
	renderer,
	camera,
	renderer.domElement
)

//CALL OUR INIT FUNCTION, OUR SETUP BASICALLY
init()
function init() {
	//DEFAULT SETTINGS FOR OUR RENDERER, WE WANT TO SET THE SIZE OF OUR RENDERER OUTPUT TO BE THE SAME SIZE AND RATIO AS OUR WINDOW
	//WE ALSO WANT OUR RENDERER TO OUTPUT TO OUR WEBPAGE
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//WE WILL ADD ANY AND ALL 3D MESHES TO OUR GLOBAL MESHES OBJECT HERE
	meshes.button1 = addDefaultMeshes({ xPos: -2 })
	meshes.button2 = addDefaultMeshes({ xPos: 0 })
	meshes.button3 = addDefaultMeshes({ xPos: 2 })
	meshes.button4 = addDefaultMeshes({ xPos: -4 })
	meshes.button5 = addDefaultMeshes({ xPos: 4 })

	//Lights
	lights.default = addLight()

	//HERE WE'LL ADD EACH OBJECT TO OUR SCENE AS WELL
	scene.add(meshes.button1)
	scene.add(meshes.button2)
	scene.add(meshes.button3)
	scene.add(meshes.button4)
	scene.add(meshes.button5)

	scene.add(lights.default)

	//START OUR ANIMATION LOOP
	// instances()
	animate()
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

function interactions() {
	interactionManager.add(meshes.button1)
	interactionManager.add(meshes.button2)
	interactionManager.add(meshes.button3)
	interactionManager.add(meshes.button4)
	interactionManager.add(meshes.button5)
	meshes.button1.addEventListener('mouseover', (event) => {
		document.body.style.cursor = 'pointer'
	})
}

function animate() {
	//EVERY FRAME WE UPDATE THE POSITION OF OUR meshes.default, meshes.copy, meshes.copy2
	interactionManager.update()

	const delta = clock.getDelta()
	for (const mixer of mixers) {
		mixer.update(delta)
	}

	if (meshes.flower) {
		meshes.flower.rotation.y -= 0.01
	}

	//RE-START THE LOOP
	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	renderer.render(scene, camera)
}
