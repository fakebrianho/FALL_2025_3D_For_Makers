import './style.css'
//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'
//IMPORT OUR ADD DEFAULT MESHES FUNCTION FROM OUR EXTERNAL JS FILE
import { addDefaultMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addLight'
import Model from './model'
import { manager } from './manager'

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
const objectDistance = 50
const sectionMeshes = []
const listener = new THREE.AudioListener()
camera.add(listener)
const sound1 = new THREE.PositionalAudio(listener)
const sound2 = new THREE.PositionalAudio(listener)
const sound3 = new THREE.PositionalAudio(listener)
const audioLoader = new THREE.AudioLoader()
audioLoader.load('/1.mp3', function (buffer) {
	sound1.setBuffer(buffer)
	sound1.setRefDistance(10)
	sound1.setRolloffFactor(5)
	sound1.setMaxDistance(200)
	sound1.setDistanceModel('exponential')
	// sound1.play()
})
audioLoader.load('/2.mp3', function (buffer) {
	sound2.setBuffer(buffer)
	sound2.setRefDistance(10)
	sound2.setRolloffFactor(5)
	sound2.setMaxDistance(200)
	sound2.setDistanceModel('exponential')
	// sound2.play()
})
audioLoader.load('/3.mp3', function (buffer) {
	sound3.setBuffer(buffer)
	sound3.setRefDistance(10)
	sound3.setRolloffFactor(5)
	sound3.setMaxDistance(200)
	sound3.setDistanceModel('exponential')
	// sound3.play()
})
let scrollY = 0
let currentSection = 0

const clock = new THREE.Clock()
const loadingManager = manager()

//CALL OUR INIT FUNCTION, OUR SETUP BASICALLY
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.standard = addStandardMesh()
	meshes.standard2 = addStandardMesh({ yPos: -objectDistance })
	meshes.standard3 = addStandardMesh({ yPos: -objectDistance * 2 })
	meshes.standard.add(sound1)
	meshes.standard2.add(sound2)
	meshes.standard3.add(sound3)
	sectionMeshes.push(meshes.standard)
	sectionMeshes.push(meshes.standard2)
	sectionMeshes.push(meshes.standard3)


	//HERE WE'LL ADD EACH OBJECT TO OUR SCENE AS WELL

	scene.add(meshes.standard)
	scene.add(meshes.standard2)
	scene.add(meshes.standard3)
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

	//RE-START THE LOOP
	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	renderer.render(scene, camera)
}
