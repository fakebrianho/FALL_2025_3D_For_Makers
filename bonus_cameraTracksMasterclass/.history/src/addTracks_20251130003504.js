import * as THREE from 'three'
const trackPoints = [
	new THREE.Vector3(0, 2, 10),
	new THREE.Vector3(5, 4, 5),
	new THREE.Vector3(10, 3, 0),
	new THREE.Vector3(5, 2, -5),
	new THREE.Vector3(0, 3, -10),
]
export const addTracks = (trackPoints) => {
	const trackCurve = new THREE.CatmullRomCurve3(
		trackPoints,
		false,
		'centripetal'
	)

	const track = new THREE.Line(
		new THREE.BufferGeometry().setFromPoints(trackPoints),
		new THREE.LineBasicMaterial({ color: 0x0000ff })
	)
	const curvePoints = trackCurve.getPoints(200) // 200 samples along the track
	const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
	const curveMaterial = new THREE.LineBasicMaterial({ linewidth: 2 })

	const curveLine = new THREE.Line(curveGeometry, curveMaterial)
	return curveLine
}
