import * as THREE from 'three'
import gsap from 'gsap'
import VirtualScroll from './VirtualScroll'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
	gsap.registerPlugin(ScrollTrigger)
	ScrollTrigger.scrollerProxy(document.body, {
		scrollTop(value) {
			if (arguments.length) {
				scroll.targetY = value // ScrollTrigger sets scroll
				scroll.y = value // ensure sync
			}
			return scroll.y // ScrollTrigger reads scroll
		},
		getBoundingClientRect() {
			return { top: 0, left: 0, width: innerWidth, height: innerHeight }
		},
	})
	ScrollTrigger.defaults({
		scroller: document.body,
	})
	ScrollTrigger.addEventListener('refresh', () => console.log('refreshed'))
	ScrollTrigger.refresh()

	return ScrollTrigger
}
