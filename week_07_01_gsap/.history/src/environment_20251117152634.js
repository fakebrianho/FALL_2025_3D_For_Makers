import { HDRLoader } from 'three/examples/jsm/Addons.js'
import { EquirectangularReflectionMapping } from 'three'

export function HDRI() {
	const rgbeLoader = new HDRLoader()
	const hdrMap = rgbeLoader.load('hdri3.exr', (envMap) => {
		envMap.mapping = EquirectangularReflectionMapping
		return envMap
	})
	return hdrMap
}
