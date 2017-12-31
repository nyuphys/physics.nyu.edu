export default class Actor {
	constructor() {
		this.uuid = uuidv4();
	}

	draw(context, options) {
		console.log('Not implemented');
	}

	// Help with drawing
	translateX(floatX, context) {
		return floatX * context.canvas.width;
	}

	translateY(floatY, context) {
		return floatY * context.canvas.height;
	}
}
