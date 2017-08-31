(function (win, doc, $, MJ) {
  const THEMES = ['clear-skies', 'night'],
        EVENTS = {
          animationEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
          fadeIn: 'app:fade-in',
          sceneStart: 'app:scene-start'
        },
        CANVAS = 'aboutCanvas';

  let app = null;

  class AboutApp {
    constructor(theme) {
      // Variable initialization
      this.activeTheme = theme;
      this.activeScene = null;
      this._canvas     = null;

      this.equationRegistry = {
        keplerEq: {
          animation: 'fadeInLeft',
          theme: 'night',
          top: '10%',
          left: '20%'
        },

        einGravEq: {
          animation: 'fadeInRight',
          theme: 'night',
          right: '30%',
          top: '20%'
        },

        stefanBoltzmannEq: {
          animation: 'fadeInDown',
          theme: 'clear-skies',
          right: '20%',
          top: '10%'
        }
      };

      this.initEvents();
      this.initPositions();
      this.initScene();
    }

    initEvents() {
      $('.about').one(EVENTS.fadeIn, this.handleAnimation);
    }

    initPositions() {
      for (let key in this.equationRegistry) {
        let value = this.equationRegistry[key];

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

    handleAnimation(e) {
      $.each($('.about-equations .equation'), function (i, val) {
        if (!!$(val).attr('id')) {
          let id = $(val).attr('id');

          if ($('.about').hasClass(app.equationRegistry[id].theme)) {
            $(val).addClass(`${app.equationRegistry[id].animation} animated visible`).one(EVENTS.animationEnd, function (e) {
              $(this).removeClass('animated');
            });
          }
        }
      });
    }
  }

  // Utility Classes
  class Actor {
    constructor() {
      this.uuid = uuidv4();
    }

    draw(context, options) {
      console.log('Not implemented');
    }

    // Help with drawing
    translateX(floatX, context) {
      return floatX * context.canvas.width;
    }

    translateY(floatY, context) {
      return floatY * context.canvas.height;
    }
  }

  class SunActor extends Actor {
    constructor(x, y, r, color = 'yellow', strokeColor = 'orange', fill = true, stroke = true) {
      super();
      this.x = x;
      this.y = y;
      this.r = r;
      this.color = color;
      this.strokeColor = strokeColor;
      this.fill = fill;
      this.stroke = stroke;
    }

    draw(context, options) {
      if (this.fill) {
        context.fillStyle = this.color;
        context.strokeStyle = this.strokeColor;
      } else {
        context.strokeStyle = this.color;
      }

      let rad = (this.r / 8) * (Math.sin((Math.PI / 8) * (options.Dt / 1000)) * Math.sin((Math.PI / 8) * (options.Dt / 1000)));

      context.beginPath();
      context.arc(this.translateX(this.x, context), this.translateY(this.y, context), this.r, 0, 2 * Math.PI);

      if (this.fill) {
        context.fill();

        if (this.stroke) {
          context.lineWidth = rad;
          context.stroke();
        }
      } else {
        context.stroke();
      }
    }
  }

  class StarActor extends Actor {
    constructor(x, y, r, color = 'yellow') {
      super();
      this.x = x;
      this.y = y;
      this.r = r;
      this.color = color;
    }

    draw(context, options) {
      context.fillStyle = this.color;

      let i = randIntInclusive(-1, 1);

      // Restrict between 1 and 10 pixels
      if (this.r === StarActor.SIZE_MIN && i < 0) {
        // Don't do nuthin
      } else if (this.r === StarActor.SIZE_MAX && i > 0) {
        // Don't do nuthin
      } else {
        this.r += i;
      }

      context.beginPath();
      context.arc(this.translateX(this.x, context), this.translateY(this.y, context), this.r, 0, 2 * Math.PI);

      context.fill();
    }

    static get SIZE_MAX() {
      return 3;
    }

    static get SIZE_MIN() {
      return 1;
    }
  }

  class Scene {
    constructor(context) {
      this.ctx = context;
      this.actors = [];
      this.animating = false;
      this.oldTick   = 0;
      this.firstTick = 0;
    }

    // Setup and pass 'render' to requestAnimationFrame
    start() {
      console.log('Not implemented');
    }

    setupTimes() {
      this.firstTick = Date.now();
      this.oldTick = Date.now();
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

  class DayScene extends Scene {
    constructor(context) {
      super(context);
    }

    start() {
      let sun = new SunActor(0.95, 0.05, 150, '#FFDC00', '#FF851B');

      this.attachActor(sun);

      this.animating = true;
      this.setupTimes();
      this.render();

      // Using global function to preserve the app's context
      win.requestAnimationFrame(appAnimate);
    }
  }

  class NightScene extends Scene {
    constructor(context, numStars) {
      super(context);

      this.numStars = numStars;
    }

    start() {
      let starColors = ['#C1E1FF', '#E8FFD8', '#FFD1CA', '#FAFCFF', '#FFE5CA'];

      for (let i = 0; i < this.numStars; ++i) {
        let s = new StarActor(Math.random(), Math.random(), randIntInclusive(StarActor.SIZE_MIN, StarActor.SIZE_MAX), starColors[randIntInclusive(0, starColors.length - 1)]);

        this.attachActor(s);
      }

      this.animating = true;
      this.setupTimes();
      this.render();

      // Using global function to preserve the app's context
      win.requestAnimationFrame(appAnimate);
    }
  }

  // Runtime
  function randIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function appAnimate() {
    app.activeScene.render();

    win.requestAnimationFrame(appAnimate);
  }

  let oldScroll = 0;

  // --- Event handling ---
  $(doc).ready(function (e) {
    let index = randIntInclusive(0, THEMES.length - 1);

    $('.about').addClass(THEMES[index]);

    app = new AboutApp(THEMES[index]);
  });

  $(win).on('scroll', function (e) {
    let off         = win.pageYOffset || doc.documentElement.scrollTop || doc.body.scrollTop || 0,
        aboutOff    = $('.about').offset().top,
        aboutHeight = $('.about').outerHeight();

    if (off >= (aboutOff / 2) && off > oldScroll) {
      $('.about').trigger(EVENTS.fadeIn);
    }

    // Update current location
    oldScroll = off;
  });

  $(win).resize(function (e) {
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
}(window, document, jQuery, MathJax));
