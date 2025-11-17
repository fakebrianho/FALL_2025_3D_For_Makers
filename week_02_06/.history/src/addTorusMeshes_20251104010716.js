import * as THREE from 'three'

export const addTorusMeshes = (
	xPos = 0,
	yPos = 0,
	zPos = 0,
	color = 0x0000ff
) => {
	const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100)
	const material = new THREE.MeshBasicMaterial({ color: color })
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set(xPos, yPos, zPos)
	return mesh
}
