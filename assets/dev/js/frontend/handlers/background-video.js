module.exports = function( $scope, $ ) {

	var BackgroundVideo = function( $backgroundVideoContainer, $ ) {
		var player,
			elements = {},
			isYTVideo = false;

		var calcVideosSize = function() {
			var containerWidth = $backgroundVideoContainer.outerWidth(),
				containerHeight = $backgroundVideoContainer.outerHeight(),
				aspectRatioSetting = '16:9', //TEMP
				aspectRatioArray = aspectRatioSetting.split( ':' ),
				aspectRatio = aspectRatioArray[ 0 ] / aspectRatioArray[ 1 ],
				ratioWidth = containerWidth / aspectRatio,
				ratioHeight = containerHeight * aspectRatio,
				isWidthFixed = containerWidth / containerHeight > aspectRatio;

			return {
				width: isWidthFixed ? containerWidth : ratioHeight,
				height: isWidthFixed ? ratioWidth : containerHeight
			};
		};

		var changeVideoSize = function() {
			var $video = isYTVideo ? $( player.getIframe() ) : elements.$backgroundVideo,
				size = calcVideosSize();

			$video.width( size.width ).height( size.height );
		};

		var prepareYTVideo = function( YT, videoID ) {
			player = new YT.Player( elements.$backgroundVideo[ 0 ], {
				videoId: videoID,
				events: {
					onReady: function() {
						player.mute();
						player.playVideo();

						changeVideoSize();

					},
					onStateChange: function( event ) {
						if ( event.data === YT.PlayerState.ENDED ) {
							player.seekTo( 0 );
						}
					}
				},
				playerVars: {
					controls: 0,
					showinfo: 0
				}
			} );

			$( qazanaFrontend.getScopeWindow() ).on( 'resize', changeVideoSize );
		};

	    var prepareVimeoVideo = function( YT, videoID ) {

	        $( qazanaFrontend.getScopeWindow() ).on( 'resize', changeVideoSize );
	    };

		var initElements = function() {
			elements.$backgroundVideo = $backgroundVideoContainer.children( '.qazana-background-video' );
		};

		var run = function() {
			var videoID = elements.$backgroundVideo.data( 'video-id' ),
			 	videoHost = elements.$backgroundVideo.data( 'video-host' );

			if ( videoID && videoHost === 'youtube' ) {
				isYTVideo = true;

				qazanaFrontend.utils.onYoutubeApiReady( function( YT ) {
					setTimeout( function() {
						prepareYTVideo( YT, videoID );
					}, 1 );
				} );

	        } else if ( videoID && videoHost === 'vimeo' ) {
			} else {
				elements.$backgroundVideo.one( 'canplay', changeVideoSize );
			}
		};

		var init = function() {
			initElements();
			run();
		};

		init();
	};

	var $backgroundVideoContainer = $scope.find( '.qazana-background-video-container' );

	if ( $backgroundVideoContainer ) {
		new BackgroundVideo( $backgroundVideoContainer, $ );
	}
};
