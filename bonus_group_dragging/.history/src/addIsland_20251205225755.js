import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/examples/jsm/Addons.js'
export const addIsland = () => {
	const fontLoader = new FontLoader()
    const group = new THREE.Group()
	const f = fontLoader.load('/font.json', (font) => {
		const textGeometry = new TextGeometry('Hello World', {
			font: font,
			size: 0.75,
			height: 0.2,
			depth: 0.2,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.03,
			bevelSize: 0.02,
			bevelOffset: 0,
			bevelSegments: 5,
		})
		// Here we'll also make our lives easier for now and make a matcap material
		// so we don't need to worry about lights, you can use any material you'd
		// like though.
		const mat = new THREE.TextureLoader().load('/mat.png')
		const matcap = new THREE.MeshMatcapMaterial({ matcap: mat })
		const textMesh = new THREE.Mesh(textGeometry, matcap)
		textMesh.position.set(-4, 0, 0)
		const group = new THREE.Group()
		group.add(textMesh)
		return group
		// meshes.text = textMesh
		// scene.add(meshes.text)
	})

	const geometry = new THREE.BoxGeometry(1, 1, 1)
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const mesh = new THREE.Mesh(geometry, material)
	// mesh.position.set(xPos, yPos, zPos)
	console.log(f)
	return f
}
