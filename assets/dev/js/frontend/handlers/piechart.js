module.exports = function( $scope ) {

    var $chart = $scope.find( '.qazana-piechart' );
    var $piechartProgress = $chart.find( '.qazana-piechart-number-count' );

    var animation = {
        duration: $chart.data( 'duration' ),
    };

    if ( $chart.closest( '.qazana-element' ).hasClass( 'qazana-piechart-animation-type-none' ) ) {
        animation = {
            duration: 0,
        };
    }

    if ( false === animation ) {
        $piechartProgress.html( $piechartProgress.data( 'value' ) );
        $chart.addClass( 'animated' );
    }

    qazanaFrontend.waypoint( $chart, function() {

        if ( ! $chart.hasClass( 'animated' ) ) {

            $chart.circleProgress( {
                    startAngle: -Math.PI / 4 * 2,
                    emptyFill: $chart.data( 'emptyfill' ),
                    animation: animation,
            } ).on( 'circle-animation-progress', function( event, progress ) {
                $piechartProgress.html( parseInt( ( $piechartProgress.data( 'value' ) ) * progress ) );
            } ).on( 'circle-animation-end', function() {
                $chart.addClass( 'animated' );
            } );

        }

    }, { offset: '90%' } );

};
