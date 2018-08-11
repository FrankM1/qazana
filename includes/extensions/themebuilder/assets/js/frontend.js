(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./handlers/archive-posts-skin-cards":2,"./handlers/archive-posts-skin-classic":3}],2:[function(require,module,exports){
var PostsCardHandler = require( './cards' );

module.exports = PostsCardHandler.extend( {

	getElementName: function() {
		return 'archive-posts';
	},

	getSkinPrefix: function() {
		return 'archive_cards_';
	}
} );
},{"./cards":4}],3:[function(require,module,exports){
var PostsClassicHandler = require( './posts' );

module.exports = PostsClassicHandler.extend( {

	getElementName: function() {
		return 'archive-posts';
	},

	getSkinPrefix: function() {
		return 'archive_classic_';
	}
} );
},{"./posts":5}],4:[function(require,module,exports){
var PostsHandler = require( './posts' );

module.exports = PostsHandler.extend( {
	getSkinPrefix: function() {
		return 'cards_';
	}
} );
},{"./posts":5}],5:[function(require,module,exports){
module.exports = qazanaFrontend.Module.extend( {

	getElementName: function() {
		return 'posts';
	},

	getSkinPrefix: function() {
		return 'classic_';
	},

	bindEvents: function() {
		var cid = this.getModelCID();

		qazanaFrontend.addListenerOnce( cid, 'resize', this.onWindowResize );
	},

	getClosureMethodsNames: function() {
		return qazanaFrontend.Module.prototype.getClosureMethodsNames.apply( this, arguments ).concat( [ 'fitImages', 'onWindowResize', 'runMasonry' ] );
	},

	getDefaultSettings: function() {
		return {
			classes: {
				fitHeight: 'qazana-fit-height',
				hasItemRatio: 'qazana-has-item-ratio'
			},
			selectors: {
				postsContainer: '.qazana-posts-container',
				post: '.qazana-post',
				postThumbnail: '.qazana-post__thumbnail',
				postThumbnailImage: '.qazana-post__thumbnail img'
			}
		};
	},

	getDefaultElements: function() {
		var selectors = this.getSettings( 'selectors' );

		return {
			$postsContainer: this.$element.find( selectors.postsContainer ),
			$posts: this.$element.find( selectors.post )
		};
	},

	fitImage: function( $post ) {
		var settings = this.getSettings(),
			$imageParent = $post.find( settings.selectors.postThumbnail ),
			$image = $imageParent.find( 'img' ),
			image = $image[0];

		if ( ! image ) {
			return;
		}

		var imageParentRatio = $imageParent.outerHeight() / $imageParent.outerWidth(),
			imageRatio = image.naturalHeight / image.naturalWidth;

		$imageParent.toggleClass( settings.classes.fitHeight, imageRatio < imageParentRatio );
	},

	fitImages: function() {
		var $ = jQuery,
			self = this,
			itemRatio = getComputedStyle( this.$element[0], ':after' ).content,
			settings = this.getSettings();

		this.elements.$postsContainer.toggleClass( settings.classes.hasItemRatio, !! itemRatio.match( /\d/ ) );

		if ( self.isMasonryEnabled() ) {
			return;
		}

		this.elements.$posts.each( function() {
			var $post = $( this ),
				$image = $post.find( settings.selectors.postThumbnailImage );

			self.fitImage( $post );

			$image.on( 'load', function() {
				self.fitImage( $post );
			} );
		} );
	},

	setColsCountSettings: function() {
		var currentDeviceMode = qazanaFrontend.getCurrentDeviceMode(),
			settings = this.getElementSettings(),
			skinPrefix = this.getSkinPrefix(),
			colsCount;

		switch ( currentDeviceMode ) {
			case 'mobile':
				colsCount = settings[ skinPrefix + 'columns_mobile' ];
				break;
			case 'tablet':
				colsCount = settings[ skinPrefix + 'columns_tablet' ];
				break;
			default:
				colsCount = settings[ skinPrefix + 'columns' ];
		}

		this.setSettings( 'colsCount', colsCount );
	},

	isMasonryEnabled: function() {
		return !! this.getElementSettings( this.getSkinPrefix() + 'masonry' );
	},

	initMasonry: function() {
		imagesLoaded( this.elements.$posts, this.runMasonry );
	},

	runMasonry: function() {
		var $ = jQuery,
			elements = this.elements;

		elements.$posts.css( {
			marginTop: '',
			transitionDuration: ''
		} );

		this.setColsCountSettings();

		var colsCount = this.getSettings( 'colsCount' ),
			hasMasonry = this.isMasonryEnabled() && colsCount >= 2;

		elements.$postsContainer.toggleClass( 'qazana-posts-masonry', hasMasonry );

		if ( ! hasMasonry ) {
			elements.$postsContainer.height( '' );

			return;
		}

		var masonry = new qazanaFrontend.modules.Masonry( {
			container: elements.$postsContainer,
			items: elements.$posts.filter( ':visible' ),
			columnsCount: this.getSettings( 'colsCount' ),
			verticalSpaceBetween: 0
		} );

		masonry.run();
	},

	run: function() {
		// For slow browsers
		setTimeout( this.fitImages, 0 );

		this.initMasonry();
	},

	onInit: function() {
		qazanaFrontend.Module.prototype.onInit.apply( this, arguments );

		this.bindEvents();

		this.run();
	},

	onWindowResize: function() {
		this.fitImages();

		this.runMasonry();
	},

	onElementChange: function() {
		this.fitImages();

		setTimeout( this.runMasonry );
	}
} );
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmNsdWRlcy9leHRlbnNpb25zL3RoZW1lYnVpbGRlci9hc3NldHMvanMvZnJvbnRlbmQvZnJvbnRlbmQuanMiLCJpbmNsdWRlcy9leHRlbnNpb25zL3RoZW1lYnVpbGRlci9hc3NldHMvanMvZnJvbnRlbmQvaGFuZGxlcnMvYXJjaGl2ZS1wb3N0cy1za2luLWNhcmRzLmpzIiwiaW5jbHVkZXMvZXh0ZW5zaW9ucy90aGVtZWJ1aWxkZXIvYXNzZXRzL2pzL2Zyb250ZW5kL2hhbmRsZXJzL2FyY2hpdmUtcG9zdHMtc2tpbi1jbGFzc2ljLmpzIiwiaW5jbHVkZXMvZXh0ZW5zaW9ucy90aGVtZWJ1aWxkZXIvYXNzZXRzL2pzL2Zyb250ZW5kL2hhbmRsZXJzL2NhcmRzLmpzIiwiaW5jbHVkZXMvZXh0ZW5zaW9ucy90aGVtZWJ1aWxkZXIvYXNzZXRzL2pzL2Zyb250ZW5kL2hhbmRsZXJzL3Bvc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgUG9zdHNBcmNoaXZlQ2xhc3NpYyA9IHJlcXVpcmUoJy4vaGFuZGxlcnMvYXJjaGl2ZS1wb3N0cy1za2luLWNsYXNzaWMnKSxcbiAgICAgICAgICAgIFBvc3RzQXJjaGl2ZUNhcmRzID0gcmVxdWlyZSgnLi9oYW5kbGVycy9hcmNoaXZlLXBvc3RzLXNraW4tY2FyZHMnKTtcblxuICAgICAgICBxYXphbmFGcm9udGVuZC5ob29rcy5hZGRBY3Rpb24oJ2Zyb250ZW5kL2VsZW1lbnRfcmVhZHkvYXJjaGl2ZS1wb3N0cy5hcmNoaXZlX2NsYXNzaWMnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gICAgICAgICAgICBuZXcgUG9zdHNBcmNoaXZlQ2xhc3NpYyh7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQ6ICRzY29wZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHFhemFuYUZyb250ZW5kLmhvb2tzLmFkZEFjdGlvbignZnJvbnRlbmQvZWxlbWVudF9yZWFkeS9hcmNoaXZlLXBvc3RzLmFyY2hpdmVfY2FyZHMnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gICAgICAgICAgICBuZXcgUG9zdHNBcmNoaXZlQ2FyZHMoe1xuICAgICAgICAgICAgICAgICRlbGVtZW50OiAkc2NvcGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIEdvIHRvIHFhemFuYSBlbGVtZW50IC0gaWYgdGhlIFVSTCBpcyBzb21ldGhpbmcgbGlrZSBodHRwOi8vZG9tYWluLmNvbS9hbnktcGFnZT9wcmV2aWV3PXRydWUmdGhlbWVfdGVtcGxhdGVfaWQ9NjQ3OVxuICAgIHZhciBtYXRjaCA9IGxvY2F0aW9uLnNlYXJjaC5tYXRjaCgvdGhlbWVfdGVtcGxhdGVfaWQ9KFxcZCopLyksXG4gICAgICAgICRlbGVtZW50ID0gbWF0Y2ggPyBqUXVlcnkoJy5xYXphbmEtJyArIG1hdGNoWzFdKSA6IFtdO1xuICAgIGlmICgkZWxlbWVudC5sZW5ndGgpIHtcbiAgICAgICAgalF1ZXJ5KCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6ICRlbGVtZW50Lm9mZnNldCgpLnRvcCAtIHdpbmRvdy5pbm5lckhlaWdodCAvIDJcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KShqUXVlcnkpOyIsInZhciBQb3N0c0NhcmRIYW5kbGVyID0gcmVxdWlyZSggJy4vY2FyZHMnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gUG9zdHNDYXJkSGFuZGxlci5leHRlbmQoIHtcblxuXHRnZXRFbGVtZW50TmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICdhcmNoaXZlLXBvc3RzJztcblx0fSxcblxuXHRnZXRTa2luUHJlZml4OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJ2FyY2hpdmVfY2FyZHNfJztcblx0fVxufSApOyIsInZhciBQb3N0c0NsYXNzaWNIYW5kbGVyID0gcmVxdWlyZSggJy4vcG9zdHMnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gUG9zdHNDbGFzc2ljSGFuZGxlci5leHRlbmQoIHtcblxuXHRnZXRFbGVtZW50TmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICdhcmNoaXZlLXBvc3RzJztcblx0fSxcblxuXHRnZXRTa2luUHJlZml4OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJ2FyY2hpdmVfY2xhc3NpY18nO1xuXHR9XG59ICk7IiwidmFyIFBvc3RzSGFuZGxlciA9IHJlcXVpcmUoICcuL3Bvc3RzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc3RzSGFuZGxlci5leHRlbmQoIHtcblx0Z2V0U2tpblByZWZpeDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICdjYXJkc18nO1xuXHR9XG59ICk7IiwibW9kdWxlLmV4cG9ydHMgPSBxYXphbmFGcm9udGVuZC5Nb2R1bGUuZXh0ZW5kKCB7XG5cblx0Z2V0RWxlbWVudE5hbWU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAncG9zdHMnO1xuXHR9LFxuXG5cdGdldFNraW5QcmVmaXg6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAnY2xhc3NpY18nO1xuXHR9LFxuXG5cdGJpbmRFdmVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjaWQgPSB0aGlzLmdldE1vZGVsQ0lEKCk7XG5cblx0XHRxYXphbmFGcm9udGVuZC5hZGRMaXN0ZW5lck9uY2UoIGNpZCwgJ3Jlc2l6ZScsIHRoaXMub25XaW5kb3dSZXNpemUgKTtcblx0fSxcblxuXHRnZXRDbG9zdXJlTWV0aG9kc05hbWVzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gcWF6YW5hRnJvbnRlbmQuTW9kdWxlLnByb3RvdHlwZS5nZXRDbG9zdXJlTWV0aG9kc05hbWVzLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKS5jb25jYXQoIFsgJ2ZpdEltYWdlcycsICdvbldpbmRvd1Jlc2l6ZScsICdydW5NYXNvbnJ5JyBdICk7XG5cdH0sXG5cblx0Z2V0RGVmYXVsdFNldHRpbmdzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2xhc3Nlczoge1xuXHRcdFx0XHRmaXRIZWlnaHQ6ICdxYXphbmEtZml0LWhlaWdodCcsXG5cdFx0XHRcdGhhc0l0ZW1SYXRpbzogJ3FhemFuYS1oYXMtaXRlbS1yYXRpbydcblx0XHRcdH0sXG5cdFx0XHRzZWxlY3RvcnM6IHtcblx0XHRcdFx0cG9zdHNDb250YWluZXI6ICcucWF6YW5hLXBvc3RzLWNvbnRhaW5lcicsXG5cdFx0XHRcdHBvc3Q6ICcucWF6YW5hLXBvc3QnLFxuXHRcdFx0XHRwb3N0VGh1bWJuYWlsOiAnLnFhemFuYS1wb3N0X190aHVtYm5haWwnLFxuXHRcdFx0XHRwb3N0VGh1bWJuYWlsSW1hZ2U6ICcucWF6YW5hLXBvc3RfX3RodW1ibmFpbCBpbWcnXG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblxuXHRnZXREZWZhdWx0RWxlbWVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWxlY3RvcnMgPSB0aGlzLmdldFNldHRpbmdzKCAnc2VsZWN0b3JzJyApO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdCRwb3N0c0NvbnRhaW5lcjogdGhpcy4kZWxlbWVudC5maW5kKCBzZWxlY3RvcnMucG9zdHNDb250YWluZXIgKSxcblx0XHRcdCRwb3N0czogdGhpcy4kZWxlbWVudC5maW5kKCBzZWxlY3RvcnMucG9zdCApXG5cdFx0fTtcblx0fSxcblxuXHRmaXRJbWFnZTogZnVuY3Rpb24oICRwb3N0ICkge1xuXHRcdHZhciBzZXR0aW5ncyA9IHRoaXMuZ2V0U2V0dGluZ3MoKSxcblx0XHRcdCRpbWFnZVBhcmVudCA9ICRwb3N0LmZpbmQoIHNldHRpbmdzLnNlbGVjdG9ycy5wb3N0VGh1bWJuYWlsICksXG5cdFx0XHQkaW1hZ2UgPSAkaW1hZ2VQYXJlbnQuZmluZCggJ2ltZycgKSxcblx0XHRcdGltYWdlID0gJGltYWdlWzBdO1xuXG5cdFx0aWYgKCAhIGltYWdlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBpbWFnZVBhcmVudFJhdGlvID0gJGltYWdlUGFyZW50Lm91dGVySGVpZ2h0KCkgLyAkaW1hZ2VQYXJlbnQub3V0ZXJXaWR0aCgpLFxuXHRcdFx0aW1hZ2VSYXRpbyA9IGltYWdlLm5hdHVyYWxIZWlnaHQgLyBpbWFnZS5uYXR1cmFsV2lkdGg7XG5cblx0XHQkaW1hZ2VQYXJlbnQudG9nZ2xlQ2xhc3MoIHNldHRpbmdzLmNsYXNzZXMuZml0SGVpZ2h0LCBpbWFnZVJhdGlvIDwgaW1hZ2VQYXJlbnRSYXRpbyApO1xuXHR9LFxuXG5cdGZpdEltYWdlczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyICQgPSBqUXVlcnksXG5cdFx0XHRzZWxmID0gdGhpcyxcblx0XHRcdGl0ZW1SYXRpbyA9IGdldENvbXB1dGVkU3R5bGUoIHRoaXMuJGVsZW1lbnRbMF0sICc6YWZ0ZXInICkuY29udGVudCxcblx0XHRcdHNldHRpbmdzID0gdGhpcy5nZXRTZXR0aW5ncygpO1xuXG5cdFx0dGhpcy5lbGVtZW50cy4kcG9zdHNDb250YWluZXIudG9nZ2xlQ2xhc3MoIHNldHRpbmdzLmNsYXNzZXMuaGFzSXRlbVJhdGlvLCAhISBpdGVtUmF0aW8ubWF0Y2goIC9cXGQvICkgKTtcblxuXHRcdGlmICggc2VsZi5pc01hc29ucnlFbmFibGVkKCkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5lbGVtZW50cy4kcG9zdHMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHBvc3QgPSAkKCB0aGlzICksXG5cdFx0XHRcdCRpbWFnZSA9ICRwb3N0LmZpbmQoIHNldHRpbmdzLnNlbGVjdG9ycy5wb3N0VGh1bWJuYWlsSW1hZ2UgKTtcblxuXHRcdFx0c2VsZi5maXRJbWFnZSggJHBvc3QgKTtcblxuXHRcdFx0JGltYWdlLm9uKCAnbG9hZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxmLmZpdEltYWdlKCAkcG9zdCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fSxcblxuXHRzZXRDb2xzQ291bnRTZXR0aW5nczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGN1cnJlbnREZXZpY2VNb2RlID0gcWF6YW5hRnJvbnRlbmQuZ2V0Q3VycmVudERldmljZU1vZGUoKSxcblx0XHRcdHNldHRpbmdzID0gdGhpcy5nZXRFbGVtZW50U2V0dGluZ3MoKSxcblx0XHRcdHNraW5QcmVmaXggPSB0aGlzLmdldFNraW5QcmVmaXgoKSxcblx0XHRcdGNvbHNDb3VudDtcblxuXHRcdHN3aXRjaCAoIGN1cnJlbnREZXZpY2VNb2RlICkge1xuXHRcdFx0Y2FzZSAnbW9iaWxlJzpcblx0XHRcdFx0Y29sc0NvdW50ID0gc2V0dGluZ3NbIHNraW5QcmVmaXggKyAnY29sdW1uc19tb2JpbGUnIF07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAndGFibGV0Jzpcblx0XHRcdFx0Y29sc0NvdW50ID0gc2V0dGluZ3NbIHNraW5QcmVmaXggKyAnY29sdW1uc190YWJsZXQnIF07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29sc0NvdW50ID0gc2V0dGluZ3NbIHNraW5QcmVmaXggKyAnY29sdW1ucycgXTtcblx0XHR9XG5cblx0XHR0aGlzLnNldFNldHRpbmdzKCAnY29sc0NvdW50JywgY29sc0NvdW50ICk7XG5cdH0sXG5cblx0aXNNYXNvbnJ5RW5hYmxlZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICEhIHRoaXMuZ2V0RWxlbWVudFNldHRpbmdzKCB0aGlzLmdldFNraW5QcmVmaXgoKSArICdtYXNvbnJ5JyApO1xuXHR9LFxuXG5cdGluaXRNYXNvbnJ5OiBmdW5jdGlvbigpIHtcblx0XHRpbWFnZXNMb2FkZWQoIHRoaXMuZWxlbWVudHMuJHBvc3RzLCB0aGlzLnJ1bk1hc29ucnkgKTtcblx0fSxcblxuXHRydW5NYXNvbnJ5OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgJCA9IGpRdWVyeSxcblx0XHRcdGVsZW1lbnRzID0gdGhpcy5lbGVtZW50cztcblxuXHRcdGVsZW1lbnRzLiRwb3N0cy5jc3MoIHtcblx0XHRcdG1hcmdpblRvcDogJycsXG5cdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246ICcnXG5cdFx0fSApO1xuXG5cdFx0dGhpcy5zZXRDb2xzQ291bnRTZXR0aW5ncygpO1xuXG5cdFx0dmFyIGNvbHNDb3VudCA9IHRoaXMuZ2V0U2V0dGluZ3MoICdjb2xzQ291bnQnICksXG5cdFx0XHRoYXNNYXNvbnJ5ID0gdGhpcy5pc01hc29ucnlFbmFibGVkKCkgJiYgY29sc0NvdW50ID49IDI7XG5cblx0XHRlbGVtZW50cy4kcG9zdHNDb250YWluZXIudG9nZ2xlQ2xhc3MoICdxYXphbmEtcG9zdHMtbWFzb25yeScsIGhhc01hc29ucnkgKTtcblxuXHRcdGlmICggISBoYXNNYXNvbnJ5ICkge1xuXHRcdFx0ZWxlbWVudHMuJHBvc3RzQ29udGFpbmVyLmhlaWdodCggJycgKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBtYXNvbnJ5ID0gbmV3IHFhemFuYUZyb250ZW5kLm1vZHVsZXMuTWFzb25yeSgge1xuXHRcdFx0Y29udGFpbmVyOiBlbGVtZW50cy4kcG9zdHNDb250YWluZXIsXG5cdFx0XHRpdGVtczogZWxlbWVudHMuJHBvc3RzLmZpbHRlciggJzp2aXNpYmxlJyApLFxuXHRcdFx0Y29sdW1uc0NvdW50OiB0aGlzLmdldFNldHRpbmdzKCAnY29sc0NvdW50JyApLFxuXHRcdFx0dmVydGljYWxTcGFjZUJldHdlZW46IDBcblx0XHR9ICk7XG5cblx0XHRtYXNvbnJ5LnJ1bigpO1xuXHR9LFxuXG5cdHJ1bjogZnVuY3Rpb24oKSB7XG5cdFx0Ly8gRm9yIHNsb3cgYnJvd3NlcnNcblx0XHRzZXRUaW1lb3V0KCB0aGlzLmZpdEltYWdlcywgMCApO1xuXG5cdFx0dGhpcy5pbml0TWFzb25yeSgpO1xuXHR9LFxuXG5cdG9uSW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0cWF6YW5hRnJvbnRlbmQuTW9kdWxlLnByb3RvdHlwZS5vbkluaXQuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG5cdFx0dGhpcy5iaW5kRXZlbnRzKCk7XG5cblx0XHR0aGlzLnJ1bigpO1xuXHR9LFxuXG5cdG9uV2luZG93UmVzaXplOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmZpdEltYWdlcygpO1xuXG5cdFx0dGhpcy5ydW5NYXNvbnJ5KCk7XG5cdH0sXG5cblx0b25FbGVtZW50Q2hhbmdlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmZpdEltYWdlcygpO1xuXG5cdFx0c2V0VGltZW91dCggdGhpcy5ydW5NYXNvbnJ5ICk7XG5cdH1cbn0gKTsiXX0=
