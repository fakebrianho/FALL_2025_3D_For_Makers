import * as THREE from 'three'
export const addLambertMesh = ({ xPos = 0, yPos = 0, zPos = 0 } = {}) => {
	const geometry = new THREE.TorusKnotGeometry(0.5, 0.1, 256, 64)
	const material = new THREE.MeshLambertMaterial({
		color: 0x77aaff,
		emissive: 0x223355,
		emissiveIntensity: 0.3,
		flatShading: true,
	})
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set(xPos, yPos, zPos)
	return mesh
}
