import * as THREE from 'three'

export const addLight = () => {
	const light = new THREE.PointLight({ intensity: 1 })
	light.position.set(2, 2, 2)
	return light
}

export const addKeyLight = () => {
	const light = new THREE.DirectionalLight(0xffffff, 2)
	light.position.set(5, 5, 5)
	return light
}

export const addRimLight = () => {
	const light = new THREE.PointLight(0xff77ff, 5, 20)
	light.position.set(-3, 2, 7)
	return light
}
