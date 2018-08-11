(function ($) {
    'use strict';

    var ThemeBuilder = require('./module');

    jQuery(window).on('qazana:init', function () {
        qazana.modules.themeBuilder = new ThemeBuilder();
        qazana.modules.themeBuilder.onQazanaInit();
    });

})(jQuery);