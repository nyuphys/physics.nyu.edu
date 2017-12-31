import Actor from './staractor.js';

export default class StarActor extends Actor {
	constructor(x, y, r, color = 'yellow') {
		super();
		this.x = x;
		this.y = y;
		this.r = r;
		this.color = color;
	}

	draw(context, options) {
		context.fillStyle = this.color;

		let i = randIntInclusive(-1, 1);

		// Restrict between 1 and 10 pixels
		if (this.r === StarActor.SIZE_MIN && i < 0) {
			// Don't do nuthin
		} else if (this.r === StarActor.SIZE_MAX && i > 0) {
			// Don't do nuthin
		} else {
			this.r += i;
		}

		context.beginPath();
		context.arc(this.translateX(this.x, context), this.translateY(this.y, context), this.r, 0, 2 * Math.PI);

		context.fill();
	}

	static get SIZE_MAX() {
		return 3;
	}

	static get SIZE_MIN() {
		return 1;
	}
}
