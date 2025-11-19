import { LoadingManager } from 'three'

export function manager() {
	const loadingManager = new LoadingManager()
	loadingManager.onLoad = function () {
		console.log('loaded!')
		document.querySelector('.loader').style.opacity = 0
		document.querySelector('.loader').style.pointerEvents = 'none'
	}
	return loadingManager
}
