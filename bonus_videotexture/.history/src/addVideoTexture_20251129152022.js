import * as THREE from 'three'
export const addVideoTexture = () => {
	const video = document.getElementById('video')
	const texture = new THREE.VideoTexture(video)
	const geometry = new THREE.PlaneGeometry(3, 2, 1, 1)
	const material = new THREE.MeshBasicMaterial({ map: texture })
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}
