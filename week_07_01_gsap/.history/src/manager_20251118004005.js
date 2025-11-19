import { LoadingManager } from 'three'
import gsap from 'gsap'

export function manager() {
	const loadingManager = new LoadingManager()
	loadingManager.onLoad = function () {
		gsap.to('.loader', {
			opacity: 0,
			duration: 1,
		})
		document.querySelector('.loader').style.opacity = 0
		document.querySelector('.loader').style.pointerEvents = 'none'
	}
	return loadingManager
}
