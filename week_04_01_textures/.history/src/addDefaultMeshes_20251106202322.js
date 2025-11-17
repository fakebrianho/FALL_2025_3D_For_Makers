//IMPORT THREE.JS SO WE CAN ACCESS IT
import * as THREE from 'three'

//THIS FUNCTION JUST IS A DEFAULT FUNCTION THAT WE MADE TO CREATE AND RETURN A SIMPLE CUBE MESH
export const addDefaultMeshes = () => {
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}

export const addStandardMesh = () => {
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	const material = new THREE.MeshStandardMaterial({
		color: 0xff00ff,
	})
	const mesh = new THREE.Mesh(geometry, material)
}
