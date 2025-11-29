import * as THREE from 'three'
export const addDefaultTexture = () => {
	const video = document.getElementById('video')
	const texture = new THREE.VideoTexture(video)
	return texture
}
