import './style.css'
import * as THREE from 'three'
import { addDefaultMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addLight'
import Model from './model'
import { manager } from './manager'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
const renderer = new THREE.WebGLRenderer({ antialias: true })

camera.position.set(0, 0, 5)

const meshes = {}
const lights = {}
const mixers = []
const pointer = new THREE.Vector2()
const raycaster = new THREE.Raycaster()

const clock = new THREE.Clock()
const loadingManager = manager()

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
	raycast()
	instances()
	animate()
}

function raycast() {
	window.addEventListener('click', (event) => {
		pointer.x = (event.clientX / window.innerHeight) * 2 - 1
		pointer.y = -(event.clientX / window.innerHeight) * 2 + 1
		// console.log(pointer)
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(scene.children)
		console.log(intersects)
		for (let i = 0; i < intersects.length; i++) {
			//
			let object = intersects[i].object
			console.log(object)
		}
	})
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
