(function (win, doc, $) {
  var old_scroll = 0,
      STATES    = {
        active: 'active',
        shrink: 'shrink'
      };

  $('#menu-control').click(function (e) {
    if (!$('.nav').hasClass(STATES.active)) {
      if ($('.nav').hasClass(STATES.shrink)) {
        $('.nav').removeClass(STATES.shrink);
      }

      $('.nav').addClass(STATES.active);
    } else {
      $('.nav').removeClass(STATES.active);
    }

    return false;
  });

  $('body').click(function (e) {
    if (e.target.id !== 'nav' && $('#nav').children(e.target.nodeName).size() === 0) {
      if ($('.nav').hasClass(STATES.active)) {
        $('.nav').removeClass(STATES.active);
      }
    }
  });

  $(win).on('scroll', function (e) {
    let off = win.pageYOffset || doc.documentElement.scrollTop || doc.body.scrollTop || 0;

    if (off - old_scroll > 0) {
      if (!$('.nav').hasClass(STATES.shrink) && !$('.nav').hasClass(STATES.active)) {
        $('.nav').addClass(STATES.shrink);
      }
    } else {
      if ($('.nav').hasClass(STATES.shrink)) {
        $('.nav').removeClass(STATES.shrink);
      }
    }

    old_scroll = off;
  });

  // Contact scroll
  $('#nav-contact').click(function (e) {
    $('html, body').animate({
      scrollTop: $('#footer').offset().top
    }, 1000);
  });
}(window, document, jQuery));
