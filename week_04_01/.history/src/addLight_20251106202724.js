import * as THREE from 'three'

export const addLight = () => {
	const light = new THREE.DirectionalLight(0xffffff, 2)
	light.position.set(5, 5, 5)
}
