import { LoadingManager } from 'three'

export function manager() {
	const loadingManager = new LoadingManager()
	loadingManager.onLoad = function () {
		console.log('loaded!')
	}
	//RETURN A SHARED MANAGER SO ALL LOADERS CAN REPORT STATUS AND WE CAN HOOK LOGGING/PROGRESS IN ONE PLACE
	return loadingManager
}
