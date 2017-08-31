(function (win, doc, $) {

  function pageTick() {
    let off = win.pageYOffset || doc.documentElement.scrollTop || doc.body.scrollTop || 0;

    if (off > ($('.header').outerHeight() / 8)) {
      $('#cat-svg').addClass('fadeout');
    } else {
      if ($('#cat-svg').hasClass('fadeout')) {
        $('#cat-svg').removeClass('fadeout');
      }
    }
  }

  $(win).on('scroll', function (e) {
    pageTick();
  });

}(window, document, jQuery));
