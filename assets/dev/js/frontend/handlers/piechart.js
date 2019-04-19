var HandlerModule = require( 'qazana-frontend/handler-module' );

var PieChart = HandlerModule.extend( {

    getDefaultSettings: function() {
		return {
			selectors: {
				chart: '.qazana-piechart-number',
                number: '.qazana-piechart-number',
                numberValue: '.qazana-piechart-number-value',
			},
		};
	},

    getDefaultElements: function() {
		var selectors = this.getSettings( 'selectors' ),
			elements = {
                $chart: this.$element.find( selectors.chart ),
                $number: this.$element.find( selectors.number ),
                $numberValue: this.$element.find( selectors.numberValue ),
			};

		return elements;
    },

    onElementChange: function( propertyName ) {
        if ( 'starting_number' === propertyName || 'ending_number' === propertyName ) {
           this.elements.$number.circleProgress( 'redraw' );
		}
    },

    drawCircle: function() {
        var self = this,
            fill = {
                gradient: [],
            };

        fill.gradient.push( this.getElementSettings( 'circle_start_color' ) );
        fill.gradient.push( this.getElementSettings( 'circle_end_color' ) );

        this.elements.$numberValue.html( parseInt( this.getElementSettings( 'starting_number' ) ) );

        var args = {
            startAngle: -Math.PI / 4 * 2,
            fill: fill,
            emptyFill: 'transparent',
            lineCap: this.getElementSettings( 'line_cap' ),
            animation: {
                duration: this.getElementSettings( 'duration' ),
            },
            size: this.getElementSettings( 'circle_size' ).size,
            thickness: this.getElementSettings( 'circle_width' ).size,
            reverse: true,
            value: ( this.getElementSettings( 'ending_number' ).size / 100 ),
        };

        if ( 'none' === this.getElementSettings( 'animation_type' ) ) {
            args.animation = {
                duration: 0,
            };
        }

        this.elements.$number.circleProgress( args )
            .on( 'circle-animation-progress', function( event, progress ) {
                self.elements.$numberValue.html( parseInt( self.elements.$numberValue.data( 'value' ) * progress ) );
            } ).on( 'circle-animation-end', function() {
                self.elements.$chart.addClass( 'qazana-animated' );
            } );
    },

    onInit: function() {
        HandlerModule.prototype.onInit.apply( this, arguments );

        var self = this;
        var animation = {
            duration: this.getElementSettings( 'duration' ),
        };

        if ( ! animation ) {
            this.elements.$number.html( this.elements.$number.data( 'value' ) );
            this.elements.$chart.addClass( 'qazana-animated' );
        }

        qazanaFrontend.waypoint( this.elements.$chart, function() {
            if ( ! self.elements.$chart.hasClass( 'qazana-animated' ) ) {
              self.drawCircle();
            }
        }, { offset: '90%' } );
    },
} );

module.exports = function( $scope ) {
	new PieChart( { $element: $scope } );
};
