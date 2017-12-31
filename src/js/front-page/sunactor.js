import Actor from './actor.js';

export default class SunActor extends Actor {
	constructor(x, y, r, color = 'yellow', strokeColor = 'orange', fill = true, stroke = true) {
		super();
		this.x = x;
		this.y = y;
		this.r = r;
		this.color = color;
		this.strokeColor = strokeColor;
		this.fill = fill;
		this.stroke = stroke;
	}

	draw(context, options) {
		if (this.fill) {
			context.fillStyle = this.color;
			context.strokeStyle = this.strokeColor;
		} else {
			context.strokeStyle = this.color;
		}

		let srad = 0,
			rad = 0;

		if (this.r < 1 && this.r > 0) { // Use width as reference pixel size
			rad  = this.translateX(this.r, context);
			srad = (rad / 8) * (Math.sin((Math.PI / 8) * (options.Dt / 1000)) * Math.sin((Math.PI / 8) * (options.Dt / 1000)));
		} else {
			rad  = this.r;
			srad = (rad / 8) * (Math.sin((Math.PI / 8) * (options.Dt / 1000)) * Math.sin((Math.PI / 8) * (options.Dt / 1000)));
		}

		context.beginPath();
		context.arc(this.translateX(this.x, context), this.translateY(this.y, context), rad, 0, 2 * Math.PI);

		if (this.fill) {
			context.fill();

			if (this.stroke) {
				context.lineWidth = srad;
				context.stroke();
			}
		} else {
			context.stroke();
		}
	}
}
