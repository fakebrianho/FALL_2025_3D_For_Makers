import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/examples/jsm/Addons.js'
export const addIsland2 = () => {
	const fontLoader = new FontLoader()
	const group = new THREE.Group()
	fontLoader.load('/font.json', (font) => {
		const textGeometry = new TextGeometry('Name', {
			font: font,
			size: 0.35,
			height: 0.2,
			depth: 0.2,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.03,
			bevelSize: 0.02,
			bevelOffset: 0,
			bevelSegments: 5,
		})

		const box = new THREE.Box3().setFromObject(myGroup)
		const size = new THREE.Vector3()
		box.getSize(size)
		const center = new THREE.Vector3()
		box.getCenter(center)

		const hitbox = new THREE.Mesh(
			new THREE.BoxGeometry(size.x, size.y, size.z),
			new THREE.MeshBasicMaterial({ visible: false })
		)
		hitbox.position.copy(center)
		const mat = new THREE.TextureLoader().load('/mat.png')
		const matcap = new THREE.MeshMatcapMaterial({ matcap: mat })
		const textMesh = new THREE.Mesh(textGeometry, matcap)
		textMesh.position.set(-0.7, 0, 0)
		textMesh.userData.name = 'text'
		group.add(textMesh)
	})

	const geometry = new THREE.CircleGeometry(1, 6, 6)
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set(0.12, -1.35, 0)
	mesh.userData.name = 'island'
	group.add(mesh)
	// mesh.position.set(xPos, yPos, zPos)
	return group
}
