import Actor from './actor.js';
import {randIntInclusive} from './util.js';

class NightScene extends Scene {
	constructor(context, opts = {}) {
		super(context, opts);

		if (!!this.options.numStars) {
			this.numStars = numStars;
		}
	}

	start() {
		let starColors = ['#C1E1FF', '#f1f9e3', '#FFD1CA', '#FAFCFF', '#FFE5CA'];

		for (let i = 0; i < this.numStars; ++i) {
			let s = new StarActor(Math.random(), Math.random(), randIntInclusive(StarActor.SIZE_MIN, StarActor.SIZE_MAX), starColors[randIntInclusive(0, starColors.length - 1)]);

			this.attachActor(s);
		}

		// Sets up the general structure and begins the loop
		this.begin();
	}
}
