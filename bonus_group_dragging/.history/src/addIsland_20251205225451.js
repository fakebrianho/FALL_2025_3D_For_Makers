import font
export const addIsland = () => {
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set(xPos, yPos, zPos)
	return mesh
}
