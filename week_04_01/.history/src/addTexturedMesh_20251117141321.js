import * as THREE from 'three'

export const addTexturedMesh = () => {
	//
	const tLoader = new THREE.TextureLoader()
	const color = tLoader.load('/t1/color.png')
	const normal = tLoader.load('/t1/normal.png')
	const ao = tLoader.load('/t1/ao.png')
	const displace = tLoader.load('/t1/displace.png')

	const geometry = new THREE.SphereGeometry(1, 256, 256)
	// const geometry = new THREE.BoxGeometry(2, 2, 2, 256, 256)
	const material = new THREE.MeshPhysicalMaterial({
		// color: 0xff0000,
		normalMap: normal,
		displacementMap: displace,
		displacementScale: 0.3,
		aoMap: ao,
		aoMapIntensity: 5,
		map: color,
		emissive: 0x0000ff,
		emissiveIntensity: 0.1,
		metalness: 0.1,
		roughness: 0,
		transmission: 0.5,
		ior: 2.33,
	})
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}
