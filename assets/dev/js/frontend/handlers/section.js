var BackgroundVideo = require( 'qazana-frontend/handlers/background-video' );

var StretchedSection = function( $section, $ ) {
	var elements = {},
		settings = {};

	var stretchSection = function() {
		// Clear any previously existing css associated with this script
		var direction = settings.is_rtl ? 'right' : 'left',
			resetCss = {
				width: 'auto'
			};

		resetCss[ direction ] = 0;

		$section.css( resetCss );

		if ( ! $section.hasClass( 'qazana-section-stretched' ) ) {
			return;
		}

		var containerWidth = elements.$scopeWindow.outerWidth(),
			sectionWidth = $section.outerWidth(),
			sectionOffset = $section.offset().left,
			correctOffset = sectionOffset;

        if ( elements.$sectionContainer.length ) {
			var containerOffset = elements.$sectionContainer.offset().left;

			containerWidth = elements.$sectionContainer.outerWidth();

			if ( sectionOffset > containerOffset ) {
				correctOffset = sectionOffset - containerOffset;
			} else {
				correctOffset = 0;
			}
		}

		if ( settings.is_rtl ) {
			correctOffset = containerWidth - ( sectionWidth + correctOffset );
		}

		resetCss.width = containerWidth + 'px';

		resetCss[ direction ] = -correctOffset + 'px';

		$section.css( resetCss );
	};

	var initSettings = function() {
		settings.sectionContainerSelector = qazanaFrontend.config.stretchedSectionContainer;
		settings.is_rtl = qazanaFrontend.config.is_rtl;
	};

	var initElements = function() {
		elements.scopeWindow = qazanaFrontend.getScopeWindow();
		elements.$scopeWindow = $( elements.scopeWindow );
		elements.$sectionContainer = $( elements.scopeWindow.document ).find( settings.sectionContainerSelector );
	};

	var bindEvents = function() {
		qazanaFrontend.elementsHandler.addExternalListener( $section, 'resize', stretchSection );
	};

	var init = function() {
		initSettings();
		initElements();
		bindEvents();
		stretchSection();
	};

	init();
};

module.exports = function( $scope, $ ) {
	new StretchedSection( $scope, $ );
	new BackgroundVideo( $scope, $ );
};
