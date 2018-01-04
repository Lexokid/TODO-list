!(function ($, window, document) {
  var pluginName = 'jqueryAccordionMenu'

  var defaults = {
    speed: 200,
    singleOpen: true,
    clickEffect: true,
    effectSize: null //auto
  }

  function Plugin(element, options) {
    this.$element = $(element)
    this.settings = $.extend({}, defaults, options)
    this._name = pluginName
    this.init()
  }

  $.extend(Plugin.prototype, {
    init: function () {
      this.openSubmenu()
      this.submenuIndicators()
      if (this.settings.clickEffect) {
        this.addClickEffect()
      }
    },
    openSubmenu: function () {
      var _settings = this.settings;
      this.$element.children('ul').on('click touchstart', 'li',
        function (e) {
          var $this = $(this);
          var $child = $this.children('.submenu')
          var $sibChild = $this.siblings().children('.submenu')

          if ($child.length > 0) {
            if ($child.css('display') === 'none') {
              $child.slideDown(_settings.speed)
              $child.siblings('a').addClass('submenu-indicator-minus')
              if (_settings.singleOpen) {
                $sibChild.slideUp(_settings.speed)
                $sibChild.siblings('a').removeClass('submenu-indicator-minus')
              }
            } else {
              $child.slideUp(_settings.speed)
              $child.siblings('a').removeClass('submenu-indicator-minus')
            }
          }

          return false
        })
    },
    submenuIndicators: function () {
      if (this.$element.find('.submenu').length > 0) {
        this.$element.find('.submenu').siblings('a').append('<span class="submenu-indicator">+</span>')
      }
    },
    addClickEffect: function () {
      var ink, x, y;
      var d = this.settings.effectSize;
      this.$element.find('a').on('click touchstart',
        function (e) {
          var $this = $(this)
          $('.ink').remove();
          $this.prepend('<span class="ink"></span>')
          ink = $this.children('.ink');
          ink.removeClass('animate-ink');
          d = d || Math.max($this.outerWidth(), $this.outerHeight());
          ink.css({
            height: d,
            width: d
          })
          x = e.pageX - $this.offset().left - ink.width() / 2;
          y = e.pageY - $this.offset().top - ink.height() / 2;
          ink.css({
            top: y + 'px',
            left: x + 'px'
          }).addClass('animate-ink')
        })
    }
  });

  $.fn[pluginName] = function (options) {
    this.each(function () {
      if (!$(this).data('plugin_' + pluginName)) {
        $(this).data('plugin_' + pluginName, new Plugin(this, options))
      }
    });
    return this
  }
})(jQuery, window, document);
