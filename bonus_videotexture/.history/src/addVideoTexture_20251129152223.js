import * as THREE from 'three'
export const addVideoTexture = () => {
	const video = document.getElementById('video')
	video.play()
	const texture = new THREE.VideoTexture(video)
	const geometry = new THREE.PlaneGeometry(5, 3, 1, 1)
	const material = new THREE.MeshBasicMaterial({
		map: texture,
		side: THREE.DoubleSide,
	})
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}
