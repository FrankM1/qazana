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

var SVGShapes = HandlerModule.extend( {
	
	getDefaultSettings: function() {
		return {
			selectors: {
				container: '> .qazana-shape-%s'
			},
			svgURL: qazanaFrontend.config.urls.assets + 'shapes/'
		};
	},

	getDefaultElements: function() {
		var elements = {},
			selectors = this.getSettings( 'selectors' );

		elements.$topContainer = this.$element.find( selectors.container.replace( '%s', 'top' ) );

		elements.$bottomContainer = this.$element.find( selectors.container.replace( '%s', 'bottom' ) );

		return elements;
	},

	buildSVG: function( side ) {
		var self = this,
			baseSettingKey = 'shape_divider_' + side,
			shapeType = self.getElementSettings( baseSettingKey ),
			$svgContainer = this.elements[ '$' + side + 'Container' ];

		$svgContainer.empty().attr( 'data-shape', shapeType );

		if ( ! shapeType ) {
			return;
		}

		var fileName = shapeType;

		if ( self.getElementSettings( baseSettingKey + '_negative' ) ) {
			fileName += '-negative';
		}

		var svgURL = self.getSettings( 'svgURL' ) + fileName + '.svg';

		jQuery.get( svgURL, function( data ) {
			$svgContainer.append( data.childNodes[0] );
		} );

		this.setNegative( side );
	},

	setNegative: function( side ) {
		this.elements[ '$' + side + 'Container' ].attr( 'data-negative', !! this.getElementSettings( 'shape_divider_' + side + '_negative' ) );
	},

	onInit: function() {
		var self = this;

		HandlerModule.prototype.onInit.apply( self, arguments );

		[ 'top', 'bottom' ].forEach( function( side ) {
			if ( self.getElementSettings( 'shape_divider_' + side ) ) {
				self.buildSVG( side );
			}
		} );
	},

	onElementChange: function( propertyName ) {
		var shapeChange = propertyName.match( /^shape_divider_(top|bottom)$/ );

		if ( shapeChange ) {
			this.buildSVG( shapeChange[1] );

			return;
		}

		var negativeChange = propertyName.match( /^shape_divider_(top|bottom)_negative$/ );

		if ( negativeChange ) {
			this.buildSVG( negativeChange[1] );

			this.setNegative( negativeChange[1] );
		}
	}
} );

module.exports = function( $scope ) {

	if ( qazanaFrontend.isEditMode() ) {
		new SVGShapes( { $element: $scope } );

		if ( $scope.hasClass( 'qazana-section-stretched' ) ) {
			new StretchedSection( { $element: $scope } );
		}
	}

	new BackgroundVideo( { $element: $scope } );

};
