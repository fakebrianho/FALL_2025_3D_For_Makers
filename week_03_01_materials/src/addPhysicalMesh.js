import * as THREE from 'three'

export const addPhysicalMesh = ({ xPos = 0, yPos = 0, zPos = 0 } = {}) => {
	const geometry = new THREE.TorusKnotGeometry(0.5, 0.1, 256, 64)
	const material = new THREE.MeshPhysicalMaterial({
		color: 0x66aaff,
		metalness: 0.0,
		roughness: 0.05,
		clearcoat: 1.0,
		clearcoatRoughness: 0.06,
		transmission: 1.0,
		ior: 1.5,
		thickness: 1.0,
		attenuationColor: 0x88ddff,
		attenuationDistance: 2.5,
		sheen: 1.0,
		sheenColor: new THREE.Color(0xff66ff),
		sheenRoughness: 0.6,
		iridescence: 1.0,
		iridescenceIOR: 1.3,
		iridescenceThicknessRange: [100, 400],
	})
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set(xPos, yPos, zPos)
	return mesh
}
