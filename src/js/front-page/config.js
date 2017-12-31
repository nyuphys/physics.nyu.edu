const Config = {
	equationRegistry: {
		keplerEq: {
			theme: 'night',
			top: '10%',
			left: '8%',
			appear: 'fadeInLeft',
			click: 'bounce'
		},

		einGravEq: {
			theme: 'night',
			right: '15%',
			top: '10%',
			appear: 'fadeInRight',
			click: 'rubberBand'
		},

		stefanBoltzmannEq: {
			theme: 'clear-skies',
			right: '20%',
			top: '10%',
			appear: 'fadeInDown',
			click: 'flash'
		},

		rayleighMolecularEq: {
			theme: 'clear-skies',
			top: '10%',
			left: '8%',
			appear: 'fadeInLeft',
			click: 'bounceIn'
		}
	},

	themes : {
		'clear-skies' : {
			scene: DayScene
		},

		'night' : {
			scene: NightScene,
			options: {
				numStars: 60
			}
		}	
	},

	events : {
		animationEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
		fadeIn: 'app:fade-in',
		sceneStart: 'app:scene-start',
		backgroundReady: 'app:background-ready'
	}
};

export default Config;
