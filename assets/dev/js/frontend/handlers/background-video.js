var HandlerModule = require( 'qazana-frontend/handler-module' );

var BackgroundVideo = HandlerModule.extend( {
	player: null,

	isYTVideo: null,

	getDefaultSettings: function() {
		return {
			selectors: {
				backgroundVideoContainer: '.qazana-background-video-container',
				backgroundVideoEmbed: '.qazana-background-video-embed',
				backgroundVideoHosted: '.qazana-background-video-hosted'
			}
		};
	},

	getDefaultElements: function() {
		var selectors = this.getSettings( 'selectors' ),
			elements = {
				$backgroundVideoContainer: this.$element.find( selectors.backgroundVideoContainer )
			};

		elements.$backgroundVideoEmbed = elements.$backgroundVideoContainer.children( selectors.backgroundVideoEmbed );

		elements.$backgroundVideoHosted = elements.$backgroundVideoContainer.children( selectors.backgroundVideoHosted );

		return elements;
	},

	calcVideosSize: function() {
		var containerWidth = this.elements.$backgroundVideoContainer.outerWidth(),
			containerHeight = this.elements.$backgroundVideoContainer.outerHeight(),
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
	},

	changeVideoSize: function() {
		var $video = this.isYTVideo ? jQuery( this.player.getIframe() ) : this.elements.$backgroundVideoHosted,
			size = this.calcVideosSize();

		$video.width( size.width ).height( size.height );
	},

	prepareYTVideo: function( YT, videoID ) {
		var self = this,
			$backgroundVideoContainer = self.elements.$backgroundVideoContainer;

		$backgroundVideoContainer.addClass( 'qazana-loading qazana-invisible' );

		self.player = new YT.Player( self.elements.$backgroundVideoEmbed[ 0 ], {
			videoId: videoID,
			events: {
				onReady: function() {
					self.player.mute();

					self.changeVideoSize();

					self.player.playVideo();
				},
				onStateChange: function( event ) {
					switch ( event.data ) {
						case YT.PlayerState.PLAYING:
							$backgroundVideoContainer.removeClass( 'qazana-invisible qazana-loading' );

							break;
						case YT.PlayerState.ENDED:
							self.player.seekTo( 0 );
					}
				}
			},
			playerVars: {
				controls: 0,
				showinfo: 0
			}
		} );

		qazanaFrontend.getElements( '$window' ).on( 'resize', self.changeVideoSize );
	},

	activate: function() {
		var self = this,
			videoLink = self.getElementSettings( 'background_video_link' ),
			videoID = qazanaFrontend.utils.youtube.getYoutubeIDFromURL( videoLink );

		self.isYTVideo = !! videoID;

		if ( videoID ) {
			qazanaFrontend.utils.youtube.onYoutubeApiReady( function( YT ) {
				setTimeout( function() {
					self.prepareYTVideo( YT, videoID );
				}, 1 );
			} );
		} else {
			self.elements.$backgroundVideoHosted.attr( 'src', videoLink ).one( 'canplay', self.changeVideoSize );
		}
	},

	deactivate: function() {
		if ( this.isYTVideo && this.player.getIframe() ) {
			this.player.destroy();
		} else {
			this.elements.$backgroundVideoHosted.removeAttr( 'src' );
		}
	},

	run: function() {
		var elementSettings = this.getElementSettings();

		if ( 'video' === elementSettings.background_background && elementSettings.background_video_link ) {
			this.activate();
		} else {
			this.deactivate();
		}
	},

	onInit: function() {
		HandlerModule.prototype.onInit.apply( this, arguments );

		this.run();
	},

	onElementChange: function( propertyName ) {
		if ( 'background_background' === propertyName ) {
			this.run();
		}
	}
} );

module.exports =  BackgroundVideo;

/* 
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
}; */
