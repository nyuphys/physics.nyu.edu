import Scene from './scene.js';
import Actor from './actor.js';
import AboutApp from './aboutapp.js';

let Graphics = PIXI.Graphics;

class SunActor extends Actor {
    constructor(x, y, r, color, strokeColor) {
        super(new Graphics());

        this.x = x;	
        this.y = y;
        this.r = r;
        this.color = color;
        this.strokeColor = strokeColor;
    }

    draw(scene, state) {
        let srad = 0,
            rad  = 0;

        if (this.r < 1 && this.r > 0) { // Use width as reference pixel size
            rad  = this.translateX(this.r);
        } else {
            rad  = this.r;
        }

        srad = (rad / 8) * (Math.sin((Math.PI / 8) * (state.Dt)) * Math.sin((Math.PI / 8) * (state.Dt)));

        this.gfx.clear();

        this.gfx.beginFill(this.color);
        this.gfx.lineStyle(srad, this.strokeColor, 1).drawCircle(0, 0, rad);
        this.gfx.endFill();

        this.gfx.x = this.translateX(this.x);
        this.gfx.y = this.translateY(this.y);
    }
}

export default class DayScene extends Scene {
    constructor(opts = {}) {
        super(opts);
    }

    start() {
        let sun = new SunActor(0.95, 0.05, 0.13, 0xFFDC00, 0xFF851B);

        this.attachActor(sun);

        // Sets up the general structure and begins the loop
        this.begin();	
    }

    update(state) {
        for (let i = 0; i < this.actors.length; i++) {
            this.actors[i].draw(this, state);
        }
    }
}
