var HandlerModule = require( 'qazana-frontend/handler-module' );

module.exports = HandlerModule.extend( {
	player: null,

	isYTVideo: null,

	getDefaultSettings: function() {
		return {
			selectors: {
				backgroundVideoContainer: '.qazana-background-video-container',
				backgroundVideoEmbed: '.qazana-background-video-embed',
				backgroundVideoHosted: '.qazana-background-video-hosted',
			},
		};
	},

	getDefaultElements: function() {
		var selectors = this.getSettings( 'selectors' ),
			elements = {
				$backgroundVideoContainer: this.$element.find( selectors.backgroundVideoContainer ),
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
			height: isWidthFixed ? ratioWidth : containerHeight,
		};
	},

	changeVideoSize: function() {
		var $video = this.isYTVideo ? jQuery( this.player.getIframe() ) : this.elements.$backgroundVideoHosted,
			size = this.calcVideosSize();

		$video.width( size.width ).height( size.height );
	},

	startVideoLoop: function() {
		var self = this;

		// If the section has been removed
		if ( ! self.player.getIframe().contentWindow ) {
			return;
		}

		var elementSettings = self.getElementSettings(),
			startPoint = elementSettings.background_video_start || 0,
			endPoint = elementSettings.background_video_end;

		self.player.seekTo( startPoint );

		if ( endPoint ) {
			var durationToEnd = endPoint - startPoint + 1;

			setTimeout( function() {
				self.startVideoLoop();
			}, durationToEnd * 1000 );
		}
	},

	prepareYTVideo: function( YT, videoID ) {
		var self = this,
			$backgroundVideoContainer = self.elements.$backgroundVideoContainer,
			elementSettings = self.getElementSettings(),
			startStateCode = YT.PlayerState.PLAYING;

		// Since version 67, Chrome doesn't fire the `PLAYING` state at start time
		if ( window.chrome ) {
			startStateCode = YT.PlayerState.UNSTARTED;
		}

		$backgroundVideoContainer.addClass( 'qazana-loading qazana-invisible' );

		self.player = new YT.Player( self.elements.$backgroundVideoEmbed[ 0 ], {
			videoId: videoID,
			events: {
				onReady: function() {
					self.player.mute();

					self.changeVideoSize();

					self.startVideoLoop();

					self.player.playVideo();
				},
				onStateChange: function( event ) {
					switch ( event.data ) {
						case startStateCode:
							$backgroundVideoContainer.removeClass( 'qazana-invisible qazana-loading' );

							break;
						case YT.PlayerState.ENDED:
							self.player.seekTo( elementSettings.background_video_start || 0 );
					}
				},
			},
			playerVars: {
				controls: 0,
				rel: 0,
			},
		} );

		qazanaFrontend.elements.$window.on( 'resize', self.changeVideoSize );
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
	},
} );
