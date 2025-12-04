import * as THREE from 'three'
import gsap from 'gsap'
import VirtualScroll from './VirtualScroll'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const scroll = new VirtualScroll({
	ease: 0.08,
	max: 4000, // virtual "scroll height"
})

export const addTracks = (trackPoints) => {
	const trackCurve = new THREE.CatmullRomCurve3(
		trackPoints,
		false,
		'centripetal'
	)
	const curvePoints = trackCurve.getPoints(200)
	const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
	const curveMaterial = new THREE.LineBasicMaterial({ linewidth: 2 })

	const curveLine = new THREE.Line(curveGeometry, curveMaterial)
	return { curveLine, trackCurve }
}

export const scrollManager = () => {

}