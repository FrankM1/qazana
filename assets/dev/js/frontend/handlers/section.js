var BackgroundVideo = require( 'qazana-frontend/handlers/background-video' );

var HandlerModule = require( 'qazana-frontend/handler-module' );

var StretchedSection = HandlerModule.extend( {

	stretchElement: null,

	bindEvents: function() {
		var handlerID = this.getUniqueHandlerID();

		qazanaFrontend.addListenerOnce( handlerID, 'resize', this.stretch );

		qazanaFrontend.addListenerOnce( handlerID, 'sticky:stick', this.stretch, this.$element );

		qazanaFrontend.addListenerOnce( handlerID, 'sticky:unstick', this.stretch, this.$element );
	},

	unbindEvents: function() {
		qazanaFrontend.removeListeners( this.getUniqueHandlerID(), 'resize', this.stretch );
	},

	initStretch: function() {
		this.stretchElement = new qazanaFrontend.modules.StretchElement( {
			element: this.$element,
			selectors: {
				container: this.getStretchContainer(),
			},
		} );
	},

	getStretchContainer: function() {
		return qazanaFrontend.getGeneralSettings( 'qazana_stretched_section_container' ) || window;
	},

	stretch: function() {
		if ( ! this.getElementSettings( 'stretch_section' ) ) {
			return;
		}

		this.stretchElement.stretch();
	},

	onInit: function() {
		HandlerModule.prototype.onInit.apply( this, arguments );

		this.initStretch();

		this.stretch();
	},

	onElementChange: function( propertyName ) {
		if ( 'stretch_section' === propertyName ) {
			if ( this.getElementSettings( 'stretch_section' ) ) {
				this.stretch();
			} else {
				this.stretchElement.reset();
			}
		}
	},

	onGeneralSettingsChange: function( changed ) {
		if ( 'qazana_stretched_section_container' in changed ) {
			this.stretchElement.setSettings( 'selectors.container', this.getStretchContainer() );

			this.stretch();
		}
	},
} );

var Shapes = HandlerModule.extend( {

	getDefaultSettings: function() {
		return {
			selectors: {
				container: '> .qazana-shape-%s',
			},
			svgURL: qazanaFrontend.config.urls.assets + 'shapes/',
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
			$svgContainer.append( data.childNodes[ 0 ] );
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
			this.buildSVG( shapeChange[ 1 ] );

			return;
		}

		var negativeChange = propertyName.match( /^shape_divider_(top|bottom)_negative$/ );

		if ( negativeChange ) {
			this.buildSVG( negativeChange[ 1 ] );

			this.setNegative( negativeChange[ 1 ] );
		}
	},
} );

var HandlesPosition = HandlerModule.extend( {

    isFirst: function() {
        return this.$element.is( '.qazana-edit-mode .qazana-top-section:first' );
    },

    getOffset: function() {
        return this.$element.offset().top;
    },

    setHandlesPosition: function() {
        var self = this;

        if ( self.isFirst() ) {
            var offset = self.getOffset(),
                $handlesElement = self.$element.find( '> .qazana-element-overlay > .qazana-editor-section-settings' ),
                insideHandleClass = 'qazana-section--handles-inside';

            if ( offset < 25 ) {
                self.$element.addClass( insideHandleClass );

                if ( offset < -5 ) {
                    $handlesElement.css( 'top', -offset );
                } else {
                    $handlesElement.css( 'top', '' );
                }
            } else {
                self.$element.removeClass( insideHandleClass );
            }
        }
    },

    onInit: function() {
        this.setHandlesPosition();
        this.$element.on( 'mouseenter', this.setHandlesPosition );
    },
} );

module.exports = function( $scope ) {
	if ( qazanaFrontend.isEditMode() || $scope.hasClass( 'qazana-section-stretched' ) ) {
		new StretchedSection( { $element: $scope } );
	}

	if ( qazanaFrontend.isEditMode() ) {
		new Shapes( { $element: $scope } );
		new HandlesPosition( { $element: $scope } );
	}

	new BackgroundVideo( { $element: $scope } );
};
