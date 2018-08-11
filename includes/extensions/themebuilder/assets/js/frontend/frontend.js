(function ($) {
    'use strict';

    $(document).ready(function () {

        var PostsArchiveClassic = require('./handlers/archive-posts-skin-classic'),
            PostsArchiveCards = require('./handlers/archive-posts-skin-cards');

        qazanaFrontend.hooks.addAction('frontend/element_ready/archive-posts.archive_classic', function ($scope) {
            new PostsArchiveClassic({
                $element: $scope
            });
        });

        qazanaFrontend.hooks.addAction('frontend/element_ready/archive-posts.archive_cards', function ($scope) {
            new PostsArchiveCards({
                $element: $scope
            });
        });
    });

    // Go to qazana element - if the URL is something like http://domain.com/any-page?preview=true&theme_template_id=6479
    var match = location.search.match(/theme_template_id=(\d*)/),
        $element = match ? jQuery('.qazana-' + match[1]) : [];
    if ($element.length) {
        jQuery('html, body').animate({
            scrollTop: $element.offset().top - window.innerHeight / 2
        });
    }

})(jQuery);