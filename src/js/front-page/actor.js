export default class Actor {
    constructor(graphics) {
        this.uuid = uuidv4(); // Unique ID
        this.gfx  = graphics; // The PIXI object to use
    }

    draw(scene, state) {
        console.log('Not implemented');
    }

    // Help with drawing
    translateX(floatX, pixi) {
        return floatX * pixi.width;
    }

    translateY(floatY, pixi) {
        return floatY * pixi.height;
    }
}
