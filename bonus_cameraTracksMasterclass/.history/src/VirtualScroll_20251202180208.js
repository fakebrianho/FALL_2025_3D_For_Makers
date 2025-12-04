export default class VirtualScroll {
	constructor({ ease = 0.1, max = 3000 } = {}) {
		this.y = 0 // smoothed value
		this.targetY = 0 // actual wheel-driven value
		this.ease = ease
		this.max = max

		this._onWheel = this._onWheel.bind(this)

		window.addEventListener('wheel', this._onWheel, { passive: false })
	}

	_onWheel(e) {
		e.preventDefault()
		this.targetY += e.deltaY
		this.targetY = Math.max(0, Math.min(this.max, this.targetY))
	}

	update() {
		this.y += (this.targetY - this.y) * this.ease
		console.log(this.y)
		return this.y
	}
}
