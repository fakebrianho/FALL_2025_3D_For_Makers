import './style.css'
//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'
//IMPORT OUR ADD DEFAULT MESHES FUNCTION FROM OUR EXTERNAL JS FILE
import { addDefaultMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addLight'
import Model from './model'
import { manager } from './manager'
import { postprocessing } from './postprocessing'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

//SET UP OUR ESSENTIALS SCENE, CAMERA, RENDERER
const scene = new THREE.Scene()

//THE FOUR PARAMETERS TO OUR PERSPECTIVE CAMERA ARE: (FOV, ASPECT RATIO, NEAR FRUSTUM, FAR FRUSTUM)
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	10000
)
const renderer = new THREE.WebGLRenderer({ antialias: true })

//SET THE CAMERA Z POSITION TO 5 SO THAT WE'RE NOT ON TOP OF ALL OUR MESHES BY DEFAULT
camera.position.set(0, 0, 5)
const controls = new OrbitControls(camera, renderer.domElement)
//ALLOW THE USER TO ORBIT THE CAMERA WITH MOUSE INPUT SO THEY CAN SEE THE SCENE FROM DIFFERENT ANGLES

//CREATE A GLOBALLY ACCESSIBLE OBJECT TO HOLD ONTO ALL OF OUR MESHES
const meshes = {}
const lights = {}
const mixers = []

const clock = new THREE.Clock()
const loadingManager = manager()

let composer

//CALL OUR INIT FUNCTION, OUR SETUP BASICALLY
init()
function init() {
	//DEFAULT SETTINGS FOR OUR RENDERER, WE WANT TO SET THE SIZE OF OUR RENDERER OUTPUT TO BE THE SAME SIZE AND RATIO AS OUR WINDOW
	//WE ALSO WANT OUR RENDERER TO OUTPUT TO OUR WEBPAGE
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	composer = postprocessing(scene, camera, renderer)
	//PIXELATE THE VIEW ON CLICK TO SHOWCASE OUR POST PROCESSING PIPELINE IN ACTION
	window.addEventListener('click', () => {
		gsap.to(composer.pixel, {
			pixelSize: 30,
			duration: 2,
			ease: 'power2.inOut',
			onUpdate: () => {
				composer.pixel.setPixelSize(composer.pixel.pixelSize)
			},
			onComplete: () => {
				gsap.to(composer.pixel, {
					pixelSize: 2,
					duration: 2,
					ease: 'power2.inOut',
					onUpdate: () => {
						composer.pixel.setPixelSize(composer.pixel.pixelSize)
					},
				})
			},
		})
	})
	//WE WILL ADD ANY AND ALL 3D MESHES TO OUR GLOBAL MESHES OBJECT HERE
	meshes.default = addDefaultMeshes({ xPos: -2 })

	meshes.standard = addStandardMesh({ xPos: 2 })
	//SEPARATE DEFAULT/STANDARD MESHES SO WE CAN SHOWCASE DIFFERENT MATERIAL TYPES SIDE BY SIDE

	//Lights
	lights.default = addLight()
	//STASH LIGHTS IN THE SAME WAY AS MESHES SO WE CAN ACCESS THEM ANYWHERE

	//HERE WE'LL ADD EACH OBJECT TO OUR SCENE AS WELL
	scene.add(meshes.default)

	scene.add(meshes.standard)
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
		position: new THREE.Vector3(0, -0.2, 0),
		replace: true,
		replaceURL: 'gold.png',
		manager: loadingManager,
	})
	//INSTANTIATE THE MODEL CLASS AND KICK OFF LOADING SO WE KEEP THE SETUP IN ONE PLACE
	flower.init()
}

function animate() {
	//EVERY FRAME WE UPDATE THE POSITION OF OUR meshes.default, meshes.copy, meshes.copy2
	const delta = clock.getDelta()
	for (const mixer of mixers) {
		mixer.update(delta)
	}

	if (meshes.flower) {
		meshes.flower.rotation.y -= 0.005
	}

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.y += 0.01
	meshes.default.rotation.x -= 0.01
	meshes.default.rotation.y -= 0.02
	//RE-START THE LOOP
	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	// renderer.render(scene, camera)
	composer.composer.render()
}
