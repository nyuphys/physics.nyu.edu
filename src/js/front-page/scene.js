import Actor from './actor.js';

export default class Scene {
	constructor(context, opts = {}) {
		this.ctx           = context;
		this.actors        = [];
		this.animating     = false;
		this.haltAnimation = false;
		this.oldTick       = 0;
		this.firstTick     = 0;
		this.options       = opts;
	}

	// Setup and pass 'render' to requestAnimationFrame
	start() {
		console.log('Not implemented');
	}

	begin() {
		this.animating = true;
		this.setupTimes();
		this.render();

		// Using global function to preserve the app's context
		window.requestAnimationFrame(appAnimate);
	}

	restart() {
		this.haltAnimation = false;

		this.render();
		window.requestAnimationFrame(appAnimate);
	}

	stop() {
		this.haltAnimation = true;
	}

	setupTimes() {
		this.firstTick = Date.now();
		this.oldTick   = Date.now();
	}

	render() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		let activeTick = Date.now(),
			// Time since last frame draw
			dt = activeTick - this.oldTick,
			// Time since start of drawing
			Dt = activeTick - this.firstTick;

		// Call each actor to render itself given the active context
		for (let i = 0; i < this.actors.length; ++i) {
			this.actors[i].draw(this.ctx, {active: activeTick, dt: dt, Dt: Dt});
		}

		this.oldTick = activeTick;
	}

	hasActor(actor) {
		for (let a in this.actors) {
			if (a.uuid === actor.uuid) {
				return true;
			}
		}

		return false;
	}

	attachActor(actor) {
		if (!(actor instanceof Actor)) {
			return false;
		}

		if (!this.hasActor(actor)) {
			this.actors.push(actor);
			return true;
		} else {
			return false;
		}
	}

	removeActor(actor) {
		if (typeof actor === 'string') {
			for (let i = 0; i < this.actors.length; ++i) {
				if (this.actors[i].uuid === actor) {
					this.actors.splice(i);
					return true;
				}
			}

			return false;
		} else {
			for (let i = 0; i < this.actors.length; ++i) {
				if (this.actors[i].uuid === actor.uuid) {
					this.actors.splice(i);
					return true;
				}
			}

			return false;
		}
	}
}
