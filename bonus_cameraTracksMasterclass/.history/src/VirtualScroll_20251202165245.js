export default class VirtualScroll {
	constructor() {
		this.y = 0 // current scroll
		this.targetY = 0 // desired scroll
		this.easing = 0.1 // smoothing factor
		this.max = 3000 // virtual scroll height
		this.min = 0 // lower bound

		this._bind()
		this._listen()
	}

	_bind() {
		this.onWheel = this.onWheel.bind(this)
		this.update = this.update.bind(this)
	}

	_listen() {
		window.addEventListener('wheel', this.onWheel, { passive: false })
	}

	onWheel(e) {
		e.preventDefault()
		this.targetY += e.deltaY
		this.targetY = Math.max(this.min, Math.min(this.max, this.targetY))
	}

	update() {
		this.y += (this.targetY - this.y) * this.easing
		return this.y
	}
}
