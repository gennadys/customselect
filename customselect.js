(function($, window, undefined) {
  var defaults = {
    formatOption: function(index) {
      var $select = $(plugin.select.options[index]);

      return $select.data('image') ? ('<img src="' + $select.data('image') + '">' + $select.html()) : $select.html();
    }
  };

  var plugin = {
    init: function(select, options) {
      this.options = $.extend({}, defaults, options);
      this.select = select;
      this.items = [];
      this.$select = $(select).wrap('<div class="customselect"></div>');

      this.$cloneSelect = $('<dl>');
      this.$cloneLabel = $('<dt><a href="#change"><span></span></a></dt>');
      this.$cloneOptions = $('<dd><ul></ul></dd>');

      var $options  = this.$cloneOptions.find('ul'),
          $label    = this.$cloneLabel.find('a');

      for(var i = 0, length = select.options.length; i < length; i++) {
        var html    = this.options.formatOption(i),
            $option = $('<li>');

        if (select.selectedIndex == i) {
          $label.find('span').html(html);
          $option.addClass('selected');
        }

        this.items.push(
          $option
            .html('<a href="#select">' + html + '</a>')
            .appendTo($options)
            .data('index', i)
        );
      }

      this.$cloneSelect
        .append(this.$cloneLabel)
        .append(this.$cloneOptions)
        .insertBefore(select)
        .click(function(){
          plugin.select.focus();
        })
        .find('dd a')
        .click(function(event){
          plugin.changeSelected($(this).parent().data('index'));
          plugin.hide();

          event.preventDefault();
        });

      this.$cloneLabel.css({
        width: this.$cloneOptions.outerWidth() - 2
      });

      this.$select
        .change(function(){
          plugin.changeSelected(this.selectedIndex);
        })
        .focus(function(){
          plugin.addFocus();
        })
        .blur(function(){
          plugin.removeFocus();
        });

      $label
        .click(function(event){
          plugin.toggle();
          plugin.$select.focus();

          event.preventDefault();
        });

      this.$cloneOptions.hide();
    },

    addFocus: function() {
      this.$cloneSelect.addClass('focus');
    },

    removeFocus: function() {
      this.$cloneSelect.removeClass('focus');
    },

    changeSelected: function(index) {
      var $option = this.items[index];

      this.$cloneLabel.find('span').html($option.find('a').html());
      this.select.selectedIndex = index;
      this.$cloneSelect.find('li').removeClass('selected');

      $option.addClass('selected');
    },

    toggle: function() {
      if (this.$cloneOptions.is(':hidden')) {
        this.show();
      } else {
        this.hide();
      }
    },

    show: function() {
      this.$cloneOptions.slideDown();
    },

    hide: function() {
      this.$cloneOptions.slideUp();
    }
  };

  $.fn.customSelect = function(options) {
    this.filter('select').each(function(){
      var $this = $(this);

      if (!$this.data('customselect')) {
        plugin.init(this, options);

        $this.data('customselect', true);
      }
    });

    return this;
  };
})(jQuery, window);
