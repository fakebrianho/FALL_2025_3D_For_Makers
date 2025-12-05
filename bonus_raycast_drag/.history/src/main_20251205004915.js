import './style.css'
//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'
//IMPORT OUR ADD DEFAULT MESHES FUNCTION FROM OUR EXTERNAL JS FILE
import { addDefaultMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addLight'
import Model from './model'
import { addFloor } from './addFloor'
import { manager } from './manager'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { InteractionManager } from 'three.interactive'

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
camera.position.set(3, 5, 10)
camera.lookAt(0, 0, 0)

//CREATE A GLOBALLY ACCESSIBLE OBJECT TO HOLD ONTO ALL OF OUR MESHES
const meshes = {}
const lights = {}
const mixers = []

const clock = new THREE.Clock()
const loadingManager = manager()
const pointer = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
const interactionManager = new InteractionManager(
	renderer,
	camera,
	renderer.domElement
)
let draggedObject = null
let dragOffset = new THREE.Vector3()
// const controls = new OrbitControls(camera, renderer.domElement)
//CALL OUR INIT FUNCTION, OUR SETUP BASICALLY
init()
function init() {
	//DEFAULT SETTINGS FOR OUR RENDERER, WE WANT TO SET THE SIZE OF OUR RENDERER OUTPUT TO BE THE SAME SIZE AND RATIO AS OUR WINDOW
	//WE ALSO WANT OUR RENDERER TO OUTPUT TO OUR WEBPAGE
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//WE WILL ADD ANY AND ALL 3D MESHES TO OUR GLOBAL MESHES OBJECT HERE
	meshes.default = addDefaultMeshes({ xPos: -2 })
	meshes.floor = addFloor()
	meshes.standard = addStandardMesh({ xPos: 2 })

	//Lights
	lights.default = addLight()

	//HERE WE'LL ADD EACH OBJECT TO OUR SCENE AS WELL
	scene.add(meshes.default)
	scene.add(meshes.floor)
	scene.add(meshes.standard)
	scene.add(lights.default)

	//START OUR ANIMATION LOOP
	window.addEventListener('pointerdown', onPointerDown)
	window.addEventListener('pointermove', onPointerMove)
	window.addEventListener('pointerup', onPointerUp)
	// raycast()
	animate()
}

function raycast() {
	window.addEventListener('mousemove', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(scene.children)
		for (let i = 0; i < intersects.length; i++) {
			let object = intersects[i].object
			while (object) {
				if (object.userData.groupName == 'basic') {
					break
				} else if (object.userData.groupName == 'standard') {
					gsap.to(meshes.standard.scale, {
						x: meshes.standard.scale.x * 2,
						y: meshes.standard.scale.y * 2,
						z: meshes.standard.scale.z * 2,
						duration: 2,
					})
					break
				} else if (object.userData.groupName == 'flower') {
					gsap.to(meshes.flower.rotation, {
						x: Math.PI * 2 * Math.random(),
						y: Math.PI * 2 * Math.random(),
						z: Math.PI * 2 * Math.random(),
						duration: 3.5,
					})
					break
				}
				object = object.parent
			}
		}
	})
}

function onPointerDown(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(pointer, camera)

	const intersects = raycaster.intersectObjects(scene.children, true)
	if (intersects.length > 0) {
		draggedObject = intersects[0].object
		if (draggedObject.userData.groupName == 'floor') return
		// Compute offset
		const intersectionPoint = intersects[0].point.clone()
		dragOffset.copy(intersectionPoint).sub(draggedObject.position)
	}
}

function onPointerMove(event) {
	if (!draggedObject) return

	pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(pointer, camera)

	const planeY = new THREE.Plane(
		new THREE.Vector3(0, 1, 0),
		-draggedObject.position.y
	)
	const intersection = new THREE.Vector3()
	raycaster.ray.intersectPlane(planeY, intersection)

	if (intersection) {
		intersection.sub(dragOffset)
		intersection.y = draggedObject.position.y // lock Y
		draggedObject.position.copy(intersection)
	}
}

function onPointerUp() {
	draggedObject = null
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

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.y += 0.01
	meshes.default.rotation.x -= 0.01
	meshes.default.rotation.y -= 0.02
	//RE-START THE LOOP
	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	renderer.render(scene, camera)
}
