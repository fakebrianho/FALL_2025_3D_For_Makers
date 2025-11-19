import { LoadingManager } from 'three'
import gsap from 'gsap'

export function manager() {
	const loadingManager = new LoadingManager()
	loadingManager.onLoad = function () {
		gsap.to('.loader', {
			opacity: 0,
			duration: 2.5,
			ease: 'power2.inOut',
			onComplete: () => {
				document.querySelector('.loader').style.pointerEvents = 'none'
			},
		})
	}
	return loadingManager
}
