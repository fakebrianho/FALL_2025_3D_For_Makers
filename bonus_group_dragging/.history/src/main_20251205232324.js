import './style.css'
//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'
//IMPORT OUR ADD DEFAULT MESHES FUNCTION FROM OUR EXTERNAL JS FILE
import { addDefaultMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addLight'
import Model from './model'
import { manager } from './manager'
import { addIsland } from './addIsland'
import { addIsland2 } from './addIsland2'

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
const pointer = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
//CALL OUR INIT FUNCTION, OUR SETUP BASICALLY
init()
function init() {
	//DEFAULT SETTINGS FOR OUR RENDERER, WE WANT TO SET THE SIZE OF OUR RENDERER OUTPUT TO BE THE SAME SIZE AND RATIO AS OUR WINDOW
	//WE ALSO WANT OUR RENDERER TO OUTPUT TO OUR WEBPAGE
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//WE WILL ADD ANY AND ALL 3D MESHES TO OUR GLOBAL MESHES OBJECT HERE
	meshes.default = addDefaultMeshes({ xPos: -2 })
	meshes.island = addIsland()
	meshes.standard = addStandardMesh({ xPos: 2 })

	meshes.island = addIsland()
	meshes.island2 = addIsland2()
	meshes.island2.position.set(0, 0, 0)
	//Lights
	lights.default = addLight()

	//HERE WE'LL ADD EACH OBJECT TO OUR SCENE AS WELL
	scene.add(meshes.island)
	scene.add(lights.default)

	//START OUR ANIMATION LOOP
	window.addEventListener('pointermove', onPointerMove)
	animate()
}
function onPointerMove(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(pointer, camera)

	const intersects = raycaster.intersectObjects(scene.children)

	if (intersects.length > 0) {
		const object = intersects[0].object
		if (
			object.userData.name === 'island' ||
			object.userData.name === 'text'
		) {
			object.material.color.set(0x00ff00)
		}
	}
}
function animate() {
	//EVERY FRAME WE UPDATE THE POSITION OF OUR meshes.default, meshes.copy, meshes.copy2
	const delta = clock.getDelta()
	for (const mixer of mixers) {
		mixer.update(delta)
	}

	//RE-START THE LOOP
	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	renderer.render(scene, camera)
}
