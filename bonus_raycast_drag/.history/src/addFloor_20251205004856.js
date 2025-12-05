import * as THREE from 'three'

export const addFloor = () => {
	const geometry = new THREE.PlaneGeometry(10, 10)
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	const mesh = new THREE.Mesh(geometry, material)
	mesh.rotation.x = -Math.PI / 2
	mesh.position.set(0, 0, 0)
    
	return mesh
}
