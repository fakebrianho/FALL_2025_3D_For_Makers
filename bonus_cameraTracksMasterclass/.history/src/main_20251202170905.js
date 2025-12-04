import './style.css'
//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'
//IMPORT OUR ADD DEFAULT MESHES FUNCTION FROM OUR EXTERNAL JS FILE
import { addDefaultMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addLight'
import Model from './model'
import { manager } from './manager'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { addTracks } from './addTracks'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VirtualScroll from './VirtualScroll'

const scroll = new VirtualScroll({
	ease: 0.08,
	max: 4000, // virtual "scroll height"
})
gsap.registerPlugin(ScrollTrigger)

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
// const controls = new OrbitControls(camera, renderer.domElement)
const cameraState = { t: 0 }

const clock = new THREE.Clock()
const loadingManager = manager()
const trackPoints = [
	new THREE.Vector3(0, 2, 10),
	new THREE.Vector3(5, 4, 5),
	new THREE.Vector3(10, 3, 0),
	new THREE.Vector3(5, 2, -5),
	new THREE.Vector3(0, 3, -10),
]
const trainGeo = new THREE.SphereGeometry(1.3, 16, 16)
const trainMat = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const train = new THREE.Mesh(trainGeo, trainMat)
scene.add(train)
let camT = 0


ScrollTrigger.scrollerProxy(document.body, {
	scrollTop(value) {
		if (arguments.length) {
			scroll.targetY = value // ScrollTrigger sets scroll
			scroll.y = value // ensure sync
		}
		return scroll.y // ScrollTrigger reads scroll
	},
	getBoundingClientRect() {
		return { top: 0, left: 0, width: innerWidth, height: innerHeight }
	},
})
ScrollTrigger.defaults({
	scroller: document.body,
})
ScrollTrigger.addEventListener('refresh', () => console.log('refreshed'))
ScrollTrigger.refresh()
//CALL OUR INIT FUNCTION, OUR SETUP BASICALLY
init()
function init() {
	const pointGeo = new THREE.BoxGeometry(1, 1, 1)
	const pointMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	trackPoints.forEach((p) => {
		const m = new THREE.Mesh(pointGeo, pointMat)
		m.position.copy(p)
		scene.add(m)
	})
	meshes.track = addTracks(trackPoints)
	//DEFAULT SETTINGS FOR OUR RENDERER, WE WANT TO SET THE SIZE OF OUR RENDERER OUTPUT TO BE THE SAME SIZE AND RATIO AS OUR WINDOW
	//WE ALSO WANT OUR RENDERER TO OUTPUT TO OUR WEBPAGE
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//WE WILL ADD ANY AND ALL 3D MESHES TO OUR GLOBAL MESHES OBJECT HERE

	//Lights
	lights.default = addLight()

	//HERE WE'LL ADD EACH OBJECT TO OUR SCENE AS WELL
	scene.add(meshes.track.curveLine)
	scene.add(lights.default)

	//START OUR ANIMATION LOOP
	instances()
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
	// flower.init()
}

function updateCameraFromCurve(t) {
	const pos = meshes.track.trackCurve.getPoint(t)
	const lookPos = meshes.track.trackCurve.getPoint(Math.min(t + 0.01, 1))

	camera.position.copy(pos)
	camera.lookAt(lookPos)
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

	// debugT += clock.getDelta() // speed factor
	const dt = clock.getDelta()

	camT += 0.001
	if (camT > 1) camT = 0
	// const pos = meshes.track.trackCurve.getPoint(debugT)
	// train.position.copy(pos)
	// const lookT = Math.min(camT + 0.01, 1)
	// const lookPos = meshes.track.trackCurve.getPoint(lookT)
	// camera.lookAt(lookPos)
	// const pos = meshes.track.trackCurve.getPoint(camT)
	// camera.position.copy(pos)
	//RE-START THE LOOP
	// const currentY = virtualScroll.update() // smoothed scroll value

	// normalized 0 → 1 scroll progress
	// const progress = currentY / scroll.max
	scroll.update() // smooth virtual scroll
	ScrollTrigger.update() // tell GSAP “scroll changed”

	updateCameraFromCurve(cameraState.t)

	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	renderer.render(scene, camera)
}
