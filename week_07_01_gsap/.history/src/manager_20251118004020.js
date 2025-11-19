import { LoadingManager } from 'three'
import gsap from 'gsap'

export function manager() {
	const loadingManager = new LoadingManager()
	loadingManager.onLoad = function () {
		gsap.to('.loader', {
			opacity: 0,
			duration: 1.5,
			onComplete: () => {
				document.querySelector('.loader').style.pointerEvents = 'none'
			},
		})
	}
	return loadingManager
}
