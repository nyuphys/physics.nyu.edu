import Config from './config.js';

let instance = null;

export default class AboutApp {
	constructor(theme) {
		// Variable initialization
		this.activeTheme = theme;
		this.activeScene = null;
		this._canvas     = null;

		this.initEvents();
		this.initPositions();
		this.initScene();

		// Persist singleton reference
		instance = this;
	}

	static currentApp() {
		if (!instance) {
			return instance;
		} else {
			throw new Error('No current app!');
		}
	}

	initEvents() {
		$('.about').one(Config.events.fadeIn, this.handleAppearAnimation);
	}

	initPositions() {
		for (let key in Config.equationRegistry) {
			let value = Config.equationRegistry[key];

			if (!!value.top) {
				$(`#${key}`).css('top', value.top);
			}

			if (!!value.right) {
				$(`#${key}`).css('right', value.right);
			}

			if (!!value.bottom) {
				$(`#${key}`).css('bottom', value.bottom);
			}

			if (!!value.left) {
				$(`#${key}`).css('left', value.left);
			}
		}
	}

	initScene() {
		// <new>
		// Ensure animation global hook is defined
		if (typeof appAnimate === 'undefined') {
			throw new Error('Global animation method not found');
		}

		// Initialize PIXI instance
		this.pixApp = new PIXI.Application({
			width: $('.about').outerWidth(),
			height: $('.about').outerHeight(),
			antialias: true,
			transparent: true
		});

		// Preserve original resolution
		this.pixApp.renderer.autoResize = true;	

		// Load PIXI canvas to the DOM and add reference in the app
		doc.getElementById(CANVAS_PARENT).appendChild(this.pixApp.view);
		this._canvas = this.pixApp.view;

		// Initialize the active scene
		if (Config.themes.hasOwnProperty(this.activeTheme)) {
			this.activeScene = new Config.themes[this.activeTheme].scene(Config.themes[this.activeTheme].options);
		} else {
			throw new Error('No known theme registered.');
		}

		// Allow scene to initialize
		if (!!this.activeScene) {
			this.pixApp.stage.addChild(this.activeScene.container);
			this.activeScene.start();
		} else {
			throw new Error ('Scene not loaded for some reason');
		}

		// </new>
		this._canvas = doc.getElementById(CANVAS);
		this._canvas.width  = $('.about').outerWidth();
		this._canvas.height = $('.about').outerHeight();

		if (!!this._canvas.getContext) {
			let ctx = this._canvas.getContext('2d');

			switch (this.activeTheme) {
				case 'clear-skies':
					this.activeScene = new DayScene(ctx);
					break;
				case 'night':
					this.activeScene = new NightScene(ctx, 60);
					break;
				default:
					throw new Error('No scene found');
			}

			if (!!this.activeScene) {
				this.activeScene.start();
			}
		} else {
			throw new Error('No context function defined');
		}
	}

	generateEquationClickzones() {
		for (let k in Config.equationRegistry) {
			if (this.activeTheme !== Config.equationRegistry[k].theme) {
				continue;
			}

			let top    = $(`#${k} .MathJax_CHTML`).offset().top,
				left   = $(`#${k} .MathJax_CHTML`).offset().left,
				width  = $(`#${k} .MathJax_CHTML`).outerWidth(),
				height = $(`#${k} .MathJax_CHTML`).outerHeight(),
				name   = `${k}Ghost`;

			if ($('.about').has(`#${name}`).length === 0) {
				let topString    = `top:${top}px;`,
					leftString   = `left:${left}px;`;

				$('.about').append(`<div id="${name}" style="position:absolute;width:${width}px;height:${height}px;${topString}${leftString}z-index:999">`);
			}
		}
	}

	updateEquationClickzones() {
		for (let k in Config.equationRegistry) {
			if (this.activeTheme !== Config.equationRegistry[k].theme) {
				continue;
			}

			let top    = $(`#${k} .MathJax_CHTML`).offset().top,
				left   = $(`#${k} .MathJax_CHTML`).offset().left,
				width  = $(`#${k} .MathJax_CHTML`).outerWidth(),
				height = $(`#${k} .MathJax_CHTML`).outerHeight(),
				name   = `${k}Ghost`;

			if ($(`#${name}`)) {
				$(`#${name}`).css('top', `${top}px`);
				$(`#${name}`).css('left', `${left}px`);
				$(`#${name}`).css('width', `${width}px`);
				$(`#${name}`).css('height', `${height}px`);
			}
		}
	}

	registerGhostEvents() {
		for (let k in Config.equationRegistry) {
			if (this.activeTheme !== Config.equationRegistry[k].theme) {
				continue;
			}

			$(`#${k}Ghost`).on('mouseover', AboutApp.currentApp().handleClickAnimation);
		}
	}

	handleAppearAnimation(e) {
		$.each($('.about-equations .equation'), function (i, val) {
			if (!!$(val).attr('id')) {
				let id = $(val).attr('id');

				if ($('.about').hasClass(Config.equationRegistry[id].theme)) {
					$(val).addClass(`${Config.equationRegistry[id].appear} animated visible`).one(Config.events.animationEnd, function (e) {
						AboutApp.currentApp().updateEquationClickzones();
						$(this).removeClass('animated');
					});
				}
			}
		});
	}

	handleClickAnimation(e) {
		e.preventDefault();
		let id = $(e.target).attr('id').replace(/Ghost/g, '');

		if (!$(`#${id} .MathJax_CHTML`).hasClass(Config.equationRegistry[id].click)) {
			$(`#${id} .MathJax_CHTML`).addClass(`${Config.equationRegistry[id].click} animated`).one(Config.events.animationEnd, function (e) {
				$(`#${id} .MathJax_CHTML`).removeClass(`${Config.equationRegistry[id].click} animated`);
			});
		}
	}	
}
