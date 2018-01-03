import Actor from './actor.js';
import AboutApp from './aboutapp.js';

let Container = PIXI.Container;

export default class Scene {
    constructor(opts = {}) {
        this.actors        = [];              // Array of all actors in Scene
        this.container     = new Container(); // PIXI reference for the Scene
        this.animating     = false;           // Toggle for run loop
        this.haltAnimation = false;           // Flag to halt the run loop
        this.oldTick       = 0;               // Previous tick date
        this.firstTick     = 0;               // First tick data
        this.options       = opts;            // Any other options

        this.container.visible = false; // Defaulting the visibility of the scene to... not.
    }

    // Setup and pass 'render' to requestAnimationFrame
    start() {
        console.log('Not implemented');
    }

    // Any scene drawing logic MUST be in this!
    update(state) {
        console.log('Not implemented');
    }

    begin() {
        this.animating         = true;
        this.container.visible = true;
        this.setupTimes();

        this.render();

        // Using global function to preserve the app's context
        window.requestAnimationFrame(AboutApp.appAnimate);
    }

    restart() {
        this.haltAnimation = false;

        this.render();
        window.requestAnimationFrame(AboutApp.appAnimate);
    }

    stop() {
        this.haltAnimation = true;
    }

    setupTimes() {
        this.firstTick = Date.now();
        this.oldTick   = Date.now();
    }

    render() {
        let activeTick = Date.now(),
            // Time since last frame draw (seconds)
            dt = (activeTick - this.oldTick) * 0.001,
            // Time since start of drawing (seconds)
            Dt = (activeTick - this.firstTick) * 0.001;

        // Scene-specific drawing code is here
        this.update({active: activeTick, dt: dt, Dt: Dt});

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
            this.container.addChild(actor.gfx);
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
                    this.container.removeChild(this.actors[i].gfx);
                    return true;
                }
            }

            return false;
        } else {
            for (let i = 0; i < this.actors.length; ++i) {
                if (this.actors[i].uuid === actor.uuid) {
                    this.actors.splice(i);
                    this.container.removeChild(this.actors[i].gfx);
                    return true;
                }
            }

            return false;
        }
    }
}
