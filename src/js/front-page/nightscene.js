import Actor from './actor.js';
import {randIntInclusive} from './util.js';

let Graphics = PIXI.Graphics;

const STAR_COLORS = [0xC1E1FF, 0xf1f9e3, 0xFFD1CA, 0xFAFCFF, 0xFFE5CA];
const SIZE_MAX    = 3;
const SIZE_MIN    = 1;

class StarActor extends Actor {
	constructor(x, y, r, color) {
		super(new Graphics());
		
		this.x = x;
		this.y = y;
		this.r = r;
		this.color = color;

		this.gfx.x = this.x;
		this.gfx.y = this.y;
	}

	draw(scene, state) {
		let i = randIntInclusive(-1, 1);

		if (this.r === SIZE_MIN && i < 0) {
			// Don't do nuthin
		} else if (this.r === SIZE_MAX && i > 0) {
			// Don't do nuthin
		} else {
			this.r += i;
		}
		
		this.gfx.clear();
		this.gfx.beginFill(this.color);
		this.gfx.drawCircle(0, 0, this.r);
		this.gfx.endFill();
	}
}

export default class NightScene extends Scene {
	constructor(opts = {}) {
		super(opts);

		this.numStars = this.options.numStars || 10;	
	}

	start() {
		for (let i = 0; i < this.numStars; ++i) {
			let s = new StarActor(Math.random(), Math.random(), randIntInclusive(SIZE_MIN, SIZE_MAX), STAR_COLORS[randIntInclusive(0, STAR_COLORS.length - 1)]);

			this.attachActor(s);
		}

		// Sets up the general structure and begins the loop
		this.begin();
	}
}
