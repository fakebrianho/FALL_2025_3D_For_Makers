import * as THREE from 'three'

export const addStandardMesh = ({ xPos = 0, yPos = 0, zPos = 0 } = {}) => {
	const geometry = new THREE.TorusKnotGeometry(0.5, 0.1, 256, 64)
	const material = new THREE.MeshStandardMaterial({
		color: 0xb87333,
		metalness: 1.0,
		roughness: 0.35,
		emissive: 0x0a0a0a,
		emissiveIntensity: 0.2,
		clearCoat: 1.0,
		clearcoatRoughness: 0.1,
	})
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set(xPos, yPos, zPos)
	return mesh
}
