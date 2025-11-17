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

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//add our meshes into our container then add to scene
	meshes.default = addDefaultMeshes()
	meshes.copy = addDefaultMeshes()

	//add to scene
	scene.add(meshes.default)

	animate()
}

function animate() {
	// meshes.default.scale.x -= 0.1
	// meshes.default.scale.z -= 0.1
	requestAnimationFrame(animate)
	renderer.render(scene, camera)
}
