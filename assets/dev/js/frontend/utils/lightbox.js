var ViewModule = require( '../../utils/view-module' ),
	LightboxModule;

LightboxModule = ViewModule.extend( {
	oldAspectRatio: null,

	oldAnimation: null,

	swiper: null,

	getDefaultSettings: function() {
		return {
			classes: {
				aspectRatio: 'qazana-aspect-ratio-%s',
				item: 'qazana-lightbox-item',
				image: 'qazana-lightbox-image',
				videoContainer: 'qazana-video-container',
				videoWrapper: 'qazana-fit-aspect-ratio',
				playButton: 'qazana-custom-embed-play',
				playButtonIcon: 'fa',
				playing: 'qazana-playing',
				hidden: 'qazana-hidden',
				invisible: 'qazana-invisible',
				preventClose: 'qazana-lightbox-prevent-close',
				slideshow: {
					container: 'swiper-container',
					slidesWrapper: 'swiper-wrapper',
					prevButton: 'qazana-swiper-button qazana-swiper-button-prev',
					nextButton: 'qazana-swiper-button qazana-swiper-button-next',
					prevButtonIcon: 'eicon-chevron-left',
					nextButtonIcon: 'eicon-chevron-right',
					slide: 'swiper-slide',
				},
			},
			selectors: {
				links: 'a, [data-qazana-lightbox]',
				slideshow: {
					activeSlide: '.swiper-slide-active',
					prevSlide: '.swiper-slide-prev',
					nextSlide: '.swiper-slide-next',
				},
			},
			modalOptions: {
				id: 'qazana-lightbox',
				entranceAnimation: 'zoomIn',
				videoAspectRatio: 169,
				position: {
					enable: false,
				},
			},
		};
	},

	getModal: function() {
		if ( ! LightboxModule.modal ) {
			this.initModal();
		}

		return LightboxModule.modal;
	},

	initModal: function() {
		var modal = LightboxModule.modal = qazanaFrontend.getDialogsManager().createWidget( 'lightbox', {
			className: 'qazana-lightbox',
			closeButton: true,
			closeButtonClass: 'eicon-close',
			selectors: {
				preventClose: '.' + this.getSettings( 'classes.preventClose' ),
			},
			hide: {
				onClick: true,
			},
		} );

		modal.on( 'hide', function() {
			modal.setMessage( '' );
		} );
	},

	showModal: function( options ) {
		var self = this,
			defaultOptions = self.getDefaultSettings().modalOptions;

		self.setSettings( 'modalOptions', jQuery.extend( defaultOptions, options.modalOptions ) );

		var modal = self.getModal();

		modal.setID( self.getSettings( 'modalOptions.id' ) );

		modal.onShow = function() {
			DialogsManager.getWidgetType( 'lightbox' ).prototype.onShow.apply( modal, arguments );

			setTimeout( function() {
				self.setEntranceAnimation();
			}, 10 );
		};

		modal.onHide = function() {
			DialogsManager.getWidgetType( 'lightbox' ).prototype.onHide.apply( modal, arguments );

			modal.getElements( 'widgetContent' ).removeClass( 'qazana-element-animated' );
		};

		switch ( options.type ) {
			case 'image':
				self.setImageContent( options.url );

				break;
			case 'video':
				self.setVideoContent( options );

				break;
			case 'slideshow':
				self.setSlideshowContent( options.slideshow );

				break;
			default:
				self.setHTMLContent( options.html );
		}

		modal.show();
	},

	setHTMLContent: function( html ) {
		this.getModal().setMessage( html );
	},

	setImageContent: function( imageURL ) {
		var self = this,
			classes = self.getSettings( 'classes' ),
			$item = jQuery( '<div>', { class: classes.item } ),
			$image = jQuery( '<img>', { src: imageURL, class: classes.image + ' ' + classes.preventClose } );

		$item.append( $image );

		self.getModal().setMessage( $item );
	},

	setVideoContent: function( options ) {
		var classes = this.getSettings( 'classes' ),
			$videoContainer = jQuery( '<div>', { class: classes.videoContainer } ),
			$videoWrapper = jQuery( '<div>', { class: classes.videoWrapper } ),
			$videoElement,
			modal = this.getModal();

		if ( 'hosted' === options.videoType ) {
			var videoParams = { src: options.url, autoplay: '' };

			options.videoParams.forEach( function( param ) {
				videoParams[ param ] = '';
			} );

			$videoElement = jQuery( '<video>', videoParams );
		} else {
			var videoURL = options.url.replace( '&autoplay=0', '' ) + '&autoplay=1';

			$videoElement = jQuery( '<iframe>', { src: videoURL, allowfullscreen: 1 } );
		}

		$videoContainer.append( $videoWrapper );

		$videoWrapper.append( $videoElement );

		modal.setMessage( $videoContainer );

		this.setVideoAspectRatio();

		var onHideMethod = modal.onHide;

		modal.onHide = function() {
			onHideMethod();

			modal.getElements( 'message' ).removeClass( 'qazana-fit-aspect-ratio' );
		};
	},

	setSlideshowContent: function( options ) {
		var $ = jQuery,
			self = this,
			classes = self.getSettings( 'classes' ),
			slideshowClasses = classes.slideshow,
			$container = $( '<div>', { class: slideshowClasses.container } ),
			$slidesWrapper = $( '<div>', { class: slideshowClasses.slidesWrapper } ),
			$prevButton = $( '<div>', { class: slideshowClasses.prevButton + ' ' + classes.preventClose } ).html( $( '<i>', { class: slideshowClasses.prevButtonIcon } ) ),
			$nextButton = $( '<div>', { class: slideshowClasses.nextButton + ' ' + classes.preventClose } ).html( $( '<i>', { class: slideshowClasses.nextButtonIcon } ) );

		options.slides.forEach( function( slide ) {
			var slideClass = slideshowClasses.slide + ' ' + classes.item;

			if ( slide.video ) {
				slideClass += ' ' + classes.video;
			}

			var $slide = $( '<div>', { class: slideClass } );

			if ( slide.video ) {
				$slide.attr( 'data-qazana-slideshow-video', slide.video );

				var $playIcon = $( '<div>', { class: classes.playButton } ).html( $( '<i>', { class: classes.playButtonIcon } ) );

				$slide.append( $playIcon );
			} else {
				var $zoomContainer = $( '<div>', { class: 'swiper-zoom-container' } ),
					$slideImage = $( '<img>', { class: classes.image + ' ' + classes.preventClose, src: slide.image } );

				$zoomContainer.append( $slideImage );

				$slide.append( $zoomContainer );
			}

			$slidesWrapper.append( $slide );
		} );

		$container.append(
			$slidesWrapper,
			$prevButton,
			$nextButton
		);

		var modal = self.getModal();

		modal.setMessage( $container );

		var onShowMethod = modal.onShow;

		modal.onShow = function() {
			onShowMethod();

			var swiperOptions = {
				navigation: {
					prevEl: $prevButton,
					nextEl: $nextButton,
				},
				pagination: {
					clickable: true,
				},
				on: {
					slideChangeTransitionEnd: self.onSlideChange,
				},
				grabCursor: true,
				runCallbacksOnInit: false,
				loop: true,
				keyboard: true,
			};

			if ( options.swiper ) {
				$.extend( swiperOptions, options.swiper );
			}

			self.swiper = new Swiper( $container, swiperOptions );

			self.setVideoAspectRatio();

			self.playSlideVideo();
		};
	},

	setVideoAspectRatio: function( aspectRatio ) {
		aspectRatio = aspectRatio || this.getSettings( 'modalOptions.videoAspectRatio' );

		var $widgetContent = this.getModal().getElements( 'widgetContent' ),
			oldAspectRatio = this.oldAspectRatio,
			aspectRatioClass = this.getSettings( 'classes.aspectRatio' );

		this.oldAspectRatio = aspectRatio;

		if ( oldAspectRatio ) {
			$widgetContent.removeClass( aspectRatioClass.replace( '%s', oldAspectRatio ) );
		}

		if ( aspectRatio ) {
			$widgetContent.addClass( aspectRatioClass.replace( '%s', aspectRatio ) );
		}
	},

	getSlide: function( slideState ) {
		return jQuery( this.swiper.slides ).filter( this.getSettings( 'selectors.slideshow.' + slideState + 'Slide' ) );
	},

	playSlideVideo: function() {
		var $activeSlide = this.getSlide( 'active' ),
			videoURL = $activeSlide.data( 'qazana-slideshow-video' );

		if ( ! videoURL ) {
			return;
		}

		var classes = this.getSettings( 'classes' ),
			$videoContainer = jQuery( '<div>', { class: classes.videoContainer + ' ' + classes.invisible } ),
			$videoWrapper = jQuery( '<div>', { class: classes.videoWrapper } ),
			$videoFrame = jQuery( '<iframe>', { src: videoURL } ),
			$playIcon = $activeSlide.children( '.' + classes.playButton );

		$videoContainer.append( $videoWrapper );

		$videoWrapper.append( $videoFrame );

		$activeSlide.append( $videoContainer );

		$playIcon.addClass( classes.playing ).removeClass( classes.hidden );

		$videoFrame.on( 'load', function() {
			$playIcon.addClass( classes.hidden );

			$videoContainer.removeClass( classes.invisible );
		} );
	},

	setEntranceAnimation: function( animation ) {
		animation = animation || this.getSettings( 'modalOptions.entranceAnimation' );

		var $widgetMessage = this.getModal().getElements( 'message' );

		if ( this.oldAnimation ) {
			$widgetMessage.removeClass( this.oldAnimation );
		}

		this.oldAnimation = animation;

		if ( animation ) {
			$widgetMessage.addClass( 'qazana-element-animated ' + animation );
		}
	},

	isLightboxLink: function( element ) {
		if ( 'A' === element.tagName && ! /\.(png|jpe?g|gif|svg)$/i.test( element.href ) ) {
			return false;
		}

		var generalOpenInLightbox = qazanaFrontend.getGeneralSettings( 'qazana_global_image_lightbox' ),
			currentLinkOpenInLightbox = element.dataset.qazanaOpenLightbox;

		return 'yes' === currentLinkOpenInLightbox || ( generalOpenInLightbox && 'no' !== currentLinkOpenInLightbox );
	},

	openLink: function( event ) {
		var element = event.currentTarget,
			$target = jQuery( event.target ),
			editMode = qazanaFrontend.isEditMode(),
			isClickInsideQazana = !! $target.closest( '#qazana' ).length;

		if ( ! this.isLightboxLink( element ) ) {
			if ( editMode && isClickInsideQazana ) {
				event.preventDefault();
			}

			return;
		}

		event.preventDefault();

		if ( editMode && ! qazanaFrontend.getGeneralSettings( 'qazana_enable_lightbox_in_editor' ) ) {
			return;
		}

		var lightboxData = {};

		if ( element.dataset.qazanaLightbox ) {
			lightboxData = JSON.parse( element.dataset.qazanaLightbox );
		}

		if ( lightboxData.type && 'slideshow' !== lightboxData.type ) {
			this.showModal( lightboxData );

			return;
		}

		if ( ! element.dataset.qazanaLightboxSlideshow ) {
			this.showModal( {
				type: 'image',
				url: element.href,
			} );

			return;
		}

		var slideshowID = element.dataset.qazanaLightboxSlideshow;

		var $allSlideshowLinks = jQuery( this.getSettings( 'selectors.links' ) ).filter( function() {
			return slideshowID === this.dataset.qazanaLightboxSlideshow;
		} );

		var slides = [],
			uniqueLinks = {};

		$allSlideshowLinks.each( function() {
			var slideVideo = this.dataset.qazanaLightboxVideo,
				uniqueID = slideVideo || this.href;

			if ( uniqueLinks[ uniqueID ] ) {
				return;
			}

			uniqueLinks[ uniqueID ] = true;

			var slideIndex = this.dataset.qazanaLightboxIndex;

			if ( undefined === slideIndex ) {
				slideIndex = $allSlideshowLinks.index( this );
			}

			var slideData = {
				image: this.href,
				index: slideIndex,
			};

			if ( slideVideo ) {
				slideData.video = slideVideo;
			}

			slides.push( slideData );
		} );

		slides.sort( function( a, b ) {
			return a.index - b.index;
		} );

		var initialSlide = element.dataset.qazanaLightboxIndex;

		if ( undefined === initialSlide ) {
			initialSlide = $allSlideshowLinks.index( element );
		}

		this.showModal( {
			type: 'slideshow',
			modalOptions: {
				id: 'qazana-lightbox-slideshow-' + slideshowID,
			},
			slideshow: {
				slides: slides,
				swiper: {
					initialSlide: +initialSlide,
				},
			},
		} );
	},

	bindEvents: function() {
		qazanaFrontend.getElements( '$document' ).on( 'click', this.getSettings( 'selectors.links' ), this.openLink );
	},

	onInit: function() {
		ViewModule.prototype.onInit.apply( this, arguments );

		if ( qazanaFrontend.isEditMode() ) {
			qazana.settings.general.model.on( 'change', this.onGeneralSettingsChange );
		}
	},

	onGeneralSettingsChange: function( model ) {
		if ( 'qazana_lightbox_content_animation' in model.changed ) {
			this.setSettings( 'modalOptions.entranceAnimation', model.changed.qazana_lightbox_content_animation );

			this.setEntranceAnimation();
		}
	},

	onSlideChange: function() {
		this
			.getSlide( 'prev' )
			.add( this.getSlide( 'next' ) )
			.add( this.getSlide( 'active' ) )
			.find( '.' + this.getSettings( 'classes.videoWrapper' ) )
			.remove();

		this.playSlideVideo();
	},
} );

module.exports = LightboxModule;
