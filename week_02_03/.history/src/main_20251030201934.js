import * as THREE from 'three'
import { addDefaultMeshes } from './addDefaultMeshes'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
camera.position.set(0, 0, 5)
const renderer = new THREE.WebGLRenderer({ antialias: true })

const meshes = {}

const clock = new THREE.Clock()

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
	// meshes.default.scale.z -= 0.1
	requestAnimationFrame(animate)
	renderer.render(scene, camera)
}
