import './style.css'
import * as THREE from 'three'
import { addLight } from './addLight'
import { addTracks, scrollManager, scroll } from './addTracks'
import gsap from 'gsap'
const sc = scrollManager()

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
// const controls = new OrbitControls(camera, renderer.domElement)
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
	meshes.track = addTracks(trackPoints)
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	lights.default = addLight()

	scene.add(meshes.track.curveLine)
	scene.add(lights.default)

	animate()
}

function debug() {
	const pointGeo = new THREE.SphereGeometry(1, 1, 1)
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
	scroll.update() // smooth virtual scroll
	sc.update() // tell GSAP "scroll changed" (using ScrollTrigger instance from scrollManager)

	updateCameraFromCurve(cameraState.t)

	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	renderer.render(scene, camera)
}
