import * as THREE from 'three'

export const addSphereMeshes = (xPos = 0, yPos = 0, zPos = 0) => {
	const geometry = new THREE.SphereGeometry(0.5, 32, 32)
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set(xPos, yPos, zPos)
	return mesh
}
