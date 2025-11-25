import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { Vector2 } from 'three'

export function postprocessing(scene, camera, renderer, mesh) {
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	composer.setSize(window.innerWidth, window.innerHeight)
	//CAP PIXEL RATIO SO BLOOM/GLITCH SHADERS STAY PERFORMANT ON HI-DPI DISPLAYS

	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)
	//BASE PASS DRAWS THE SCENE BEFORE WE STACK EFFECTS ON TOP

	const pixelPass = new RenderPixelatedPass(2, scene, camera)
	composer.addPass(pixelPass)
	//PIXELATION PASS GIVES US A RETRO LOOK WE CAN ANIMATE FROM MAIN.JS

	const glitchPass = new GlitchPass()
	glitchPass.enabled = true
	// composer.addPass(glitchPass)

	const bloomPass = new UnrealBloomPass()
	bloomPass.strength = 0.3
	composer.addPass(bloomPass)
	//SUBTLE BLOOM TO GIVE THE HIGHLIGHTS A SOFT GLOW WITHOUT BLOWING OUT THE IMAGE

	const afterPass = new AfterimagePass()
	afterPass.uniforms.damp.value = 0.96
	composer.addPass(afterPass)

	return { composer: composer, pixel: pixelPass, afterPass: afterPass }
}
