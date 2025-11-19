import { LoadingManager } from 'three'

export function manager() {
	const loadingManager = new LoadingManager()
	loadingManager.onLoad = function () {
		document.querySelector('.loader').style.opacity = 0
	}
	return loadingManager
}
