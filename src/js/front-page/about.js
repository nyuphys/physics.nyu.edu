// 1. Globals

let app       = null;
let oldscroll = 0;

function appAnimate(/*<new>*/ dt /*</new>*/) {
	if (!app.activeScene.haltAnimation) {
		app.activeScene.render();
		window.requestAnimationFrame(appAnimate);
	}
}

// 2. Imports
import AboutApp from './aboutapp.js';
import Config from './config.js';

import {randIntInclusive} from './util.js';

// --- Event handling ---
$(document).ready(function (e) {
	let index = randIntInclusive(0, Config.themes.length - 1);

	$('.about').addClass(Config.themes[index]);
	$('.about').trigger(Config.events.backgroundReady);

	app = new AboutApp(Config.themes[index]);
});

$(window).on('scroll', function (e) {
	let off         = win.pageYOffset || doc.documentElement.scrollTop || doc.body.scrollTop || 0,
		aboutOff    = $('.about').offset().top,
		aboutHeight = $('.about').outerHeight();

	if (off >= (aboutOff / 2) && off > oldScroll) {
		$('.about').trigger(Config.events.fadeIn);
	}

	if (off > (aboutOff + aboutHeight) && off > oldScroll && app.activeScene.animating) {
		app.activeScene.stop();
	}

	if (off <= (aboutOff + aboutHeight) && off < oldScroll && app.activeScene.haltAnimation) {
		app.activeScene.restart();
	}

	// Update current location
	oldScroll = off;
});

$(window).resize(function (e) {
	app.updateEquationClickzones();

	if (!!app.activeScene) {
		doc.getElementById(CANVAS).width = $('.about').outerWidth();
		doc.getElementById(CANVAS).height = $('.about').outerHeight();

		// Animation should redraw the scene; however, the resize event will clear the context if there's no animation
		if (!app.activeScene.animating) {
			app.activeScene.render();
		}
	}
});

$('#nav-about').click(function (e) {
	$('html, body').animate({
		scrollTop: $('#about').offset().top
	}, 1000);
});

MathJax.Hub.Register.StartupHook("End", function () {
	app.generateEquationClickzones();
	app.registerGhostEvents();
});
