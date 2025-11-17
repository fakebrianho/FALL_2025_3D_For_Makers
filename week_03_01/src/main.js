import './style.css'
//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'
//IMPORT OUR ADD DEFAULT MESHES FUNCTION FROM OUR EXTERNAL JS FILE

import { addBasicMesh } from './addBasicMesh.js'
import { addStandardMesh } from './addStandardMesh.js'
import { addLambertMesh } from './addLambertMesh.js'
import { addPhongMesh } from './addPhongMesh.js'
import { addPhysicalMesh } from './addPhysicalMesh.js'
import { addLight, addKeyLight, addRimLight } from './addLight.js'

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

const clock = new THREE.Clock()

//CALL OUR INIT FUNCTION, OUR SETUP BASICALLY
init()
function init() {
	//DEFAULT SETTINGS FOR OUR RENDERER, WE WANT TO SET THE SIZE OF OUR RENDERER OUTPUT TO BE THE SAME SIZE AND RATIO AS OUR WINDOW
	//WE ALSO WANT OUR RENDERER TO OUTPUT TO OUR WEBPAGE
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//WE WILL ADD ANY AND ALL 3D MESHES TO OUR GLOBAL MESHES OBJECT HERE
	meshes.basic = addBasicMesh()
	meshes.standard = addStandardMesh({ xPos: 2 })
	meshes.phong = addPhongMesh({ xPos: 4 })
	meshes.lambert = addLambertMesh({ xPos: -2 })
	meshes.physical = addPhysicalMesh({ xPos: -4 })

	//Lights
	lights.default = addLight()
	lights.key = addKeyLight()
	lights.rim = addRimLight()

	//HERE WE'LL ADD EACH OBJECT TO OUR SCENE AS WELL
	scene.add(meshes.physical)
	scene.add(meshes.basic)
	scene.add(meshes.standard)
	scene.add(meshes.phong)
	scene.add(meshes.lambert)
	scene.add(lights.default)
	scene.add(lights.key)
	scene.add(lights.rim)

	//START OUR ANIMATION LOOP
	animate()
}

function animate() {
	//EVERY FRAME WE UPDATE THE POSITION OF OUR meshes.default, meshes.copy, meshes.copy2
	Object.values(meshes).forEach((mesh) => {
		mesh.rotation.y += 0.01
	})

	//RE-START THE LOOP
	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	renderer.render(scene, camera)
}
