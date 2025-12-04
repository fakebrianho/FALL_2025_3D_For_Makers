import './style.css'
import * as THREE from 'three'
import { addLight } from './addLight'
import { addTracks, scrollManager, scroll } from './addTracks'
import gsap from 'gsap'
const sc = scrollManager()

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
const cameraState = { t: 0 }

const trackPoints = [
	new THREE.Vector3(0, 2, 10),
	new THREE.Vector3(5, 4, 5),
	new THREE.Vector3(10, 3, 0),
	new THREE.Vector3(5, 2, -5),
	new THREE.Vector3(0, 3, -10),
	new THREE.Vector3(0, 2, -13),
	new THREE.Vector3(0, 3, -18),
]

const tl = gsap.timeline({
	scrollTrigger: {
		trigger: document.body,
		start: 0,
		end: scroll.max,
		scrub: true,
	},
})

tl.to(cameraState, { t: 1 })

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	lights.default = addLight()

	meshes.track = addTracks(trackPoints)
	scene.add(meshes.track.curveLine)
	scene.add(lights.default)

	debug()
	animate()
}

function debug() {
	const pointGeo = new THREE.SphereGeometry(1, 32, 32)
	const pointMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	trackPoints.forEach((p) => {
		const m = new THREE.Mesh(pointGeo, pointMat)
		m.position.copy(p)
		scene.add(m)
	})
}

function updateCameraFromCurve(t) {
	const pos = meshes.track.trackCurve.getPoint(t)
	const lookPos = meshes.track.trackCurve.getPoint(Math.min(t + 0.01, 1))
	// console.log(pos, lookPos)
	camera.position.copy(pos)
	camera.lookAt(lookPos)
}

function animate() {
	scroll.update()
	sc.update()

	updateCameraFromCurve(cameraState.t)
	requestAnimationFrame(animate)

	renderer.render(scene, camera)
}
