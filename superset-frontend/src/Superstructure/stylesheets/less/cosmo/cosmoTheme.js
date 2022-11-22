/* eslint-disable no-undef */
// DODO-changed
(function () {
  $(window).scroll(function () {
    const top = $(document).scrollTop();
    $('.splash').css({
      'background-position': `0px -${(top / 3).toFixed(2)}px`,
    });
    if (top > 50) $('#home > .navbar').removeClass('navbar-transparent');
    else $('#home > .navbar').addClass('navbar-transparent');
  });

  $("a[href='#']").click(function (e) {
    e.preventDefault();
  });

  function cleanSource(html) {
    // eslint-disable-next-line no-param-reassign
    html = html
      .replace(/×/g, '&times;')
      .replace(/«/g, '&laquo;')
      .replace(/»/g, '&raquo;')
      .replace(/←/g, '&larr;')
      .replace(/→/g, '&rarr;');

    let lines = html.split(/\n/);

    lines.shift();
    lines.splice(-1, 1);

    const indentSize = lines[0].length - lines[0].trim().length;
    const re = new RegExp(` {${indentSize}}`);

    lines = lines.map(function (line) {
      if (line.match(re)) {
        // eslint-disable-next-line no-param-reassign
        line = line.substring(indentSize);
      }

      return line;
    });

    lines = lines.join('\n');

    return lines;
  }

  const $button = $(
    "<div id='source-button' class='btn btn-primary btn-xs'>&lt; &gt;</div>",
  ).click(function () {
    let html = $(this).parent().html();
    html = cleanSource(html);
    $('#source-modal pre').text(html);
    $('#source-modal').modal();
  });

  $('.bs-component [data-toggle="popover"]').popover();
  $('.bs-component [data-toggle="tooltip"]').tooltip();

  $('.bs-component').hover(
    function () {
      $(this).append($button);
      $button.show();
    },
    function () {
      $button.hide();
    },
  );
})();
