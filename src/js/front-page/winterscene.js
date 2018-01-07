import Scene from './scene.js';
import AboutApp from './aboutapp.js';

let loader       = PIXI.loader,
    Emitter      = PIXI.particles.Emitter,
    Rectangle    = PIXI.Rectangle,
    TextureCache = PIXI.utils.TextureCache;

const SNOW_SPRITE_TEXTURE = 'snowSpriteTextures',
    NUM_SPRITES           = 7; 

export default class WinterScene extends Scene {
    constructor(opts = {}) {
        super(opts);

        this.maxParticles = this.options.maxParticles || 500;
        this.startColor   = this.options.startColor || '#F5F9FF';
        this.endColor     = this.options.endColor || '#C8DEF0';

        this.emitterDim   = {
            x: this.options.emX || 0,
            y: this.options.emY || 0,
            w: this.options.emW || 1,
            h: this.options.emH || 0
        };

        this.emitterLife  = {
            min: this.options.emLifeMin || 7,
            max: this.options.emLifeMax || 20
        };

        this.doneLoading = false;
    }

    translateX(floatx) {
        return floatx * AboutApp.currentApp().pixApp.renderer.width;
    }

    translateY(floaty) {
        return floaty * AboutApp.currentApp().pixApp.renderer.height;
    }

    emitterConfig() {
        return {
            alpha: {
                start: 0.8,
                end: 0.3
            },

            scale: {
                start: 0.3,
                end: 0.07
            },

            color: {
                start: this.startColor,
                end: this.endColor
            },

            pos: {
                x: this.translateX(-0.5),
                y: this.translateY(-0.55) 
            },

            speed: {
                start: 12,
                end: 57
            },

            frequency: 0.05,

            acceleration: {
                x: 0,
                y: 9.81
            },

            startRotation: {
                min: 0,
                max: 360
            },

            noRotation: false,
            rotationSpeed: {
                min: 0,
                max: 0
            },

            lifetime: {
                min: this.emitterLife.min,
                max: this.emitterLife.max
            },
            
            addAtBack: false,
            maxParticles: this.maxParticles,
            blendMode: 'normal',
            emitterLifetime: -1,
            spawnType: 'rect',

            spawnRect: {
                x: this.translateX(this.emitterDim.x),
                y: this.translateY(this.emitterDim.y),
                w: this.translateX(this.emitterDim.w),
                h: this.translateY(this.emitterDim.h)
            }
        };
    }

    start() {
        // Load assets for snow sprites
        loader
            .add({
                name: SNOW_SPRITE_TEXTURE,
                url: 'themes/sps/img/snowsprites.png'
            })
            // Loading script related to textures; also, make canvas visible
            .load(this.completeStart.bind(this)); 
    }

    completeStart() {
        // Load in textures from spritesheet
        let textures = [];
        let height   = 0;

        for (let i = 0; i < NUM_SPRITES; i++) {
            let texture = TextureCache[SNOW_SPRITE_TEXTURE];
            
            if (i > 0 && i % 8 === 0) {
                height += 32;
            }
            
            let rect = new Rectangle(32 * (i % 8), height, 32, 32);

            texture.frame = rect;
            textures.push(texture);

            AboutApp.DEBUG('Texture added');
        }

        AboutApp.DEBUG(textures);
        AboutApp.DEBUG(textures.length);

        this.emitter = new Emitter(
            this.container,
            textures,
            this.emitterConfig()
        );

        // Enable the emitter
        this.emitter.emit = true;
        this.doneLoading  = true;

        this.begin();
    }

    update(state) {
        if (this.doneLoading) {
            this.emitter.update(state.dt);
        }
    }
}
