import * as THREE from 'three'
export const addDefaultTexture = () => {
	const video = document.getElementById('video')
	const texture = new THREE.VideoTexture(video)
	const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
	const material = new THREE.MeshBasicMaterial({ map: texture })
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}
