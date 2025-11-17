import * as THREE from 'three'

export const addTorusMeshes = () => {
	const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100)
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}
