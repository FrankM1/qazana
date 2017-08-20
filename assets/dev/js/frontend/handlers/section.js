var BackgroundVideo = require( 'qazana-frontend/handlers/background-video' );

var HandlerModule = require( 'qazana-frontend/handler-module' );

var StretchedSection = HandlerModule.extend( {

	bindEvents: function() {
		qazanaFrontend.addListenerOnce( this.$element.data( 'model-cid' ), 'resize', this.stretchSection );
	},

	stretchSection: function() {
		// Clear any previously existing css associated with this script
		var direction = qazanaFrontend.config.is_rtl ? 'right' : 'left',
			resetCss = {},
			isStretched = this.$element.hasClass( 'qazana-section-stretched' );

		if ( qazanaFrontend.isEditMode() || isStretched ) {
			resetCss.width = 'auto';

			resetCss[ direction ] = 0;

			this.$element.css( resetCss );
		}

		if ( ! isStretched ) {
			return;
		}

		var $sectionContainer,
			hasSpecialContainer = false;

		try {
			$sectionContainer = jQuery( qazanaFrontend.getGeneralSettings( 'qazana_stretched_section_container' ) );

			if ( $sectionContainer.length ) {
				hasSpecialContainer = true;
			}
		} catch ( e ) {}

		if ( ! hasSpecialContainer ) {
			$sectionContainer = qazanaFrontend.getElements( '$window' );
		}

		var containerWidth = $sectionContainer.outerWidth(),
			sectionWidth = this.$element.outerWidth(),
			sectionOffset = this.$element.offset().left,
			correctOffset = sectionOffset;

		if ( hasSpecialContainer ) {
			var containerOffset = $sectionContainer.offset().left;

			if ( sectionOffset > containerOffset ) {
				correctOffset = sectionOffset - containerOffset;
			} else {
				correctOffset = 0;
			}
		}

		if ( qazanaFrontend.config.is_rtl ) {
			correctOffset = containerWidth - ( sectionWidth + correctOffset );
		}

		resetCss.width = containerWidth + 'px';

		resetCss[ direction ] = -correctOffset + 'px';

		this.$element.css( resetCss );
	},

	onInit: function() {
		HandlerModule.prototype.onInit.apply( this, arguments );

		this.stretchSection();
	},

	onGeneralSettingsChange: function( changed ) {
		if ( 'qazana_stretched_section_container' in changed ) {
			this.stretchSection();
		}
	}
} );

module.exports = function( $scope, $ ) {

	if ( qazanaFrontend.isEditMode() || $scope.hasClass( 'qazana-section-stretched' ) ) {
		new StretchedSection( { $element: $scope } );
	}
	new BackgroundVideo( $scope, $ );

};
