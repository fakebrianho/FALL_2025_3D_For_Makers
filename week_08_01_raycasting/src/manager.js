import { LoadingManager } from 'three'

export function manager() {
	const loadingManager = new LoadingManager()
	loadingManager.onLoad = function () {
		console.log('loaded!')
	}
	return loadingManager
}
