import AboutApp from './aboutapp.js';
import {randString} from './util.js';

export default class Actor {
    constructor(graphics) {
        this.uuid = randString(); // Unique ID
        this.gfx  = graphics;   // The PIXI object to use
    }

    draw(scene, state) {
        console.log('Not implemented');
    }

    // Help with drawing
    translateX(floatX) {
        return floatX * AboutApp.currentApp().pixApp.renderer.width;
    }

    translateY(floatY) {
        return floatY * AboutApp.currentApp().pixApp.renderer.height;
    }
}
