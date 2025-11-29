import * as THREE from 'three'
import { addDefaultMeshes } from './addDefaultMeshes'

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

const clock = new THREE.Clock()

//CALL OUR INIT FUNCTION, OUR SETUP BASICALLY
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//add our meshes into our container then add to scene
	meshes.default = addDefaultMeshes()
	meshes.copy = addDefaultMeshes()
	meshes.copy2 = addDefaultMeshes()

	meshes.copy.position.x = 2
	meshes.copy2.position.x = -2
	//add to scene
	scene.add(meshes.default)
	scene.add(meshes.copy)
	scene.add(meshes.copy2)

	animate()
}

function animate() {
	meshes.default.position.x = Math.sin(clock.getElapsedTime())
	meshes.default.position.y = Math.cos(clock.getElapsedTime())

	meshes.copy.position.x = Math.sin(clock.getElapsedTime()) * 4
	meshes.copy.position.y = Math.cos(clock.getElapsedTime()) * 4

	meshes.copy2.position.x = Math.sin(clock.getElapsedTime() * 2) * 2.5
	meshes.copy2.position.y = Math.cos(clock.getElapsedTime() * 2) * 2.5

	// meshes.default.scale.z -= 0.1
	requestAnimationFrame(animate)
	renderer.render(scene, camera)
}
