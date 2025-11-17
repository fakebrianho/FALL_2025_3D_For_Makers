import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
camera.position.set(0, 0, 5)
const renderer = new THREE.WebGLRenderer({ antialias: true })
let mesh
init()
function init() {
	//
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	const geometry = new THREE.BoxGeometry(1, 1, 1)
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	mesh = new THREE.Mesh(geometry, material)
	// mesh.position.x = -1.5

	scene.add(mesh)

	animate()
}

function animate() {
	mesh.position.x += 0.1
	requestAnimationFrame(animate)
	renderer.render(scene, camera)
}
