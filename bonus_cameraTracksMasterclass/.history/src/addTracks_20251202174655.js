import * as THREE from 'three'

export const addTracks = (trackPoints) => {
	const trackCurve = new THREE.CatmullRomCurve3(
		trackPoints,
		false,
		'centripetal'
	)
	const curvePoints = trackCurve.getPoints(20)
	const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
	const curveMaterial = new THREE.LineBasicMaterial({ linewidth: 2 })

	const curveLine = new THREE.Line(curveGeometry, curveMaterial)
	return { curveLine, trackCurve }
}
