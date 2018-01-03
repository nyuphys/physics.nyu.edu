// 0. Load checks

// Verify PIXI is loaded
if (typeof PIXI === 'undefined') {
	throw new Error('PIXI not loaded');
}

// 1. Imports
import AboutApp from './aboutapp.js';
import Config from './config.js';

import {randIntInclusive} from './util.js';

// 2. Globals
let oldScroll = 0;

function appAnimate() {
	if (!AboutApp.currentApp().activeScene.haltAnimation) {
		AboutApp.currentApp().activeScene.render();
		window.requestAnimationFrame(appAnimate);
	}
}

function pageTick() {
	let off = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

	if (off > ($('.header').outerHeight() / 8)) {
		$('#cat-svg').addClass('fadeout');
	} else {
		if ($('#cat-svg').hasClass('fadeout')) {
			$('#cat-svg').removeClass('fadeout');
		}
	}
}

// 3. Events for UI 
$(document).ready(function (e) {
	let index = randIntInclusive(0, Config.themes.length - 1);

	$('.about').addClass(Config.themes[index]);
	$('.about').trigger(Config.events.backgroundReady);

});

$(window).on('scroll', function (e) {
	let off         = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
		aboutOff    = $('.about').offset().top,
		aboutHeight = $('.about').outerHeight();

	pageTick();

	if (off >= (aboutOff / 2) && off > oldScroll) {
		$('.about').trigger(Config.events.fadeIn);
	}

	if (off > (aboutOff + aboutHeight) && off > oldScroll && AboutApp.currentApp().activeScene.animating) {
		AboutApp.currentApp().activeScene.stop();
	}

	if (off <= (aboutOff + aboutHeight) && off < oldScroll && AboutApp.currentApp().activeScene.haltAnimation) {
		AboutApp.currentApp().activeScene.restart();
	}

	// Update current location
	oldScroll = off;
});

$(window).resize(function (e) {
	AboutApp.currentApp().updateEquationClickzones();

	if (!!AboutApp.currentApp().activeScene) {
		AboutApp.currentApp().pixApp.renderer.resize($('.about').outerWidth(), $('.about').outerHeight());
		//doc.getElementById(CANVAS).width = $('.about').outerWidth();
		//doc.getElementById(CANVAS).height = $('.about').outerHeight();

		// Animation should redraw the scene; however, the resize event will clear the context if there's no animation
		if (!AboutApp.currentApp().activeScene.animating) {
			AboutApp.currentApp().activeScene.render();
		}
	}
});

$('#nav-about').click(function (e) {
	$('html, body').animate({
		scrollTop: $('#about').offset().top
	}, 1000);
});

MathJax.Hub.Register.StartupHook("End", function () {
	AboutApp.currentApp().generateEquationClickzones();
	AboutApp.currentApp().registerGhostEvents();
});
