import Scene from './scene.js';

class DayScene extends Scene {
	constructor(context, opts = {}) {
		super(context, opts);
	}

	start() {
		let sun = new SunActor(0.95, 0.05, 0.13, '#FFDC00', '#FF851B');

		this.attachActor(sun);

		// Sets up the general structure and begins the loop
		this.begin();	
	}
}
