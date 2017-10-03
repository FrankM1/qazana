module.exports = function( $scope, $ ) {

    var $chart = $scope.find('.qazana-piechart');
    var $piechart_progress = $chart.find('.qazana-piechart-number-count');

    var animation = {
        duration: $chart.data('duration')
    };

    if ( $chart.closest('.qazana-element').hasClass('qazana-piechart-animation-type-none') ) {
        animation = {
            duration: 0
        };
    }

    if ( false == animation ){
        $piechart_progress.html($piechart_progress.data('value') );
        $chart.addClass('animated');
    }

    qazanaFrontend.waypoint( $chart, function() {

        if ( ! $chart.hasClass('animated') ) {

            $chart.circleProgress({
                    startAngle: -Math.PI / 4 * 2,
                    emptyFill: $chart.data('emptyfill'),
                    animation: animation
            }).on('circle-animation-progress', function (event, progress) {
                $piechart_progress.html( parseInt( ( $piechart_progress.data('value') ) * progress ) );
            }).on('circle-animation-end', function (event) {
                $chart.addClass('animated');
            });

        }

    }, { offset: '90%' } );

};
