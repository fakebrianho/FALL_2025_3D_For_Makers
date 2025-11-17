import * as THREE from 'three'

export const addDefaultMeshes = () => {
	//
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}
