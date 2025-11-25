import './style.css'
//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'
//IMPORT OUR ADD DEFAULT MESHES FUNCTION FROM OUR EXTERNAL JS FILE
import { addDefaultMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addLight'
import Model from './model'
import { manager } from './manager'
import { postprocessing } from './postprocessing'

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

const clock = new THREE.Clock()
const loadingManager = manager()

let analyser
let bufferTime
let dataArray
let averageAmplitude
let averageFreq
let composer

let observedMin = Infinity
let observedMax = -Infinity

//CALL OUR INIT FUNCTION, OUR SETUP BASICALLY
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addDefaultMeshes({ xPos: -2 })

	meshes.standard = addStandardMesh({ xPos: 2 })

	lights.default = addLight()

	scene.add(meshes.default)

	scene.add(meshes.standard)
	scene.add(lights.default)
	composer = postprocessing(scene, camera, renderer)
	window.addEventListener('click', loadAudio)

	instances()
	animate()
}

function loadAudio() {
	const audio = new Audio('audio.mp3')
	audio.play()
	const context = new AudioContext()
	const src = context.createMediaElementSource(audio)
	analyser = context.createAnalyser()
	src.connect(analyser)
	analyser.connect(context.destination)
	analyser.fftSize = 512 // Determines the size of the FFT (Fast Fourier Transform) used for frequency analysis
	const bufferLength = analyser.frequencyBinCount // Half of fftSize, represents the number of data points in the frequency domain
	dataArray = new Uint8Array(bufferLength) // Array to hold frequency data
	bufferTime = new Uint8Array(bufferLength) // Array to hold time domain data
	analyser.getByteTimeDomainData(bufferTime) // Fills bufferTime with time domain data (waveform)
}

function getAverageFrequency(dataArray) {
	// Calculate the average frequency from the frequency data array
	let value = 0
	const data = dataArray

	for (let i = 0; i < data.length; i++) {
		value += data[i]
	}

	return value / data.length
}

function mapAuto(value, outMin, outMax) {
	// update range
	if (value < observedMin) observedMin = value
	if (value > observedMax) observedMax = value

	// avoid divide by zero
	if (observedMax === observedMin) return outMin

	// map based on the evolving range
	return (
		((value - observedMin) * (outMax - outMin)) /
			(observedMax - observedMin) +
		outMin
	)
}

function getRMS(bufferTime) {
	// Calculate the root mean square (RMS) of the time domain data
	let bTime = bufferTime
	var rms = 0
	for (let i = 0; i < bTime.length; i++) {
		rms += bTime[i] * bTime[i]
	}
	rms /= bTime.length
	rms = Math.sqrt(rms)
	return rms
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

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.y += 0.01
	meshes.default.rotation.x -= 0.01
	meshes.default.rotation.y -= 0.02

	if (analyser) {
		analyser.getByteFrequencyData(dataArray) // Fills dataArray with frequency data (amplitude of each frequency)
		analyser.getByteTimeDomainData(bufferTime) // Updates bufferTime with the current waveform data
		averageFreq = getAverageFrequency(dataArray) // Calculate average frequency amplitude
		averageAmplitude = getRMS(bufferTime) // Calculate root mean square of the waveform
		meshes.default.scale.x = averageFreq * 0.03
		meshes.default.scale.y = averageFreq * 0.03
		meshes.default.scale.z = averageFreq * 0.03
		meshes.standard.scale.x = averageAmplitude * 0.03
		meshes.standard.scale.y = averageAmplitude * 0.03
		meshes.standard.scale.z = averageAmplitude * 0.03
		composer.afterPass.uniforms['damp'].value = mapAuto(
			averageAmplitude,
			0.87,
			0.98
		)
		composer.bloomPass.strength = mapAuto(averageAmplitude, 0.25, 0.5)
		composer.pixel.setPixelSize(mapAuto(averageAmplitude, 0, 4))
	}
	//RE-START THE LOOP
	requestAnimationFrame(animate)

	//RENDER OUR SCENE VIA CAMERA VIEW TO SCREEN
	// renderer.render(scene, camera)
	composer.composer.render()
}
