module.exports = qazanaFrontend.Module.extend( {

	getElementName: function() {
		return 'posts';
	},

	getSkinPrefix: function() {
		return 'classic_';
	},

	bindEvents: function() {
		var cid = this.getModelCID();

		qazanaFrontend.addListenerOnce( cid, 'resize', this.onWindowResize );
	},

	getClosureMethodsNames: function() {
		return qazanaFrontend.Module.prototype.getClosureMethodsNames.apply( this, arguments ).concat( [ 'fitImages', 'onWindowResize', 'runMasonry' ] );
	},

	getDefaultSettings: function() {
		return {
			classes: {
				fitHeight: 'qazana-fit-height',
				hasItemRatio: 'qazana-has-item-ratio'
			},
			selectors: {
				postsContainer: '.qazana-posts-container',
				post: '.qazana-post',
				postThumbnail: '.qazana-post__thumbnail',
				postThumbnailImage: '.qazana-post__thumbnail img'
			}
		};
	},

	getDefaultElements: function() {
		var selectors = this.getSettings( 'selectors' );

		return {
			$postsContainer: this.$element.find( selectors.postsContainer ),
			$posts: this.$element.find( selectors.post )
		};
	},

	fitImage: function( $post ) {
		var settings = this.getSettings(),
			$imageParent = $post.find( settings.selectors.postThumbnail ),
			$image = $imageParent.find( 'img' ),
			image = $image[0];

		if ( ! image ) {
			return;
		}

		var imageParentRatio = $imageParent.outerHeight() / $imageParent.outerWidth(),
			imageRatio = image.naturalHeight / image.naturalWidth;

		$imageParent.toggleClass( settings.classes.fitHeight, imageRatio < imageParentRatio );
	},

	fitImages: function() {
		var $ = jQuery,
			self = this,
			itemRatio = getComputedStyle( this.$element[0], ':after' ).content,
			settings = this.getSettings();

		this.elements.$postsContainer.toggleClass( settings.classes.hasItemRatio, !! itemRatio.match( /\d/ ) );

		if ( self.isMasonryEnabled() ) {
			return;
		}

		this.elements.$posts.each( function() {
			var $post = $( this ),
				$image = $post.find( settings.selectors.postThumbnailImage );

			self.fitImage( $post );

			$image.on( 'load', function() {
				self.fitImage( $post );
			} );
		} );
	},

	setColsCountSettings: function() {
		var currentDeviceMode = qazanaFrontend.getCurrentDeviceMode(),
			settings = this.getElementSettings(),
			skinPrefix = this.getSkinPrefix(),
			colsCount;

		switch ( currentDeviceMode ) {
			case 'mobile':
				colsCount = settings[ skinPrefix + 'columns_mobile' ];
				break;
			case 'tablet':
				colsCount = settings[ skinPrefix + 'columns_tablet' ];
				break;
			default:
				colsCount = settings[ skinPrefix + 'columns' ];
		}

		this.setSettings( 'colsCount', colsCount );
	},

	isMasonryEnabled: function() {
		return !! this.getElementSettings( this.getSkinPrefix() + 'masonry' );
	},

	initMasonry: function() {
		imagesLoaded( this.elements.$posts, this.runMasonry );
	},

	runMasonry: function() {
		var $ = jQuery,
			elements = this.elements;

		elements.$posts.css( {
			marginTop: '',
			transitionDuration: ''
		} );

		this.setColsCountSettings();

		var colsCount = this.getSettings( 'colsCount' ),
			hasMasonry = this.isMasonryEnabled() && colsCount >= 2;

		elements.$postsContainer.toggleClass( 'qazana-posts-masonry', hasMasonry );

		if ( ! hasMasonry ) {
			elements.$postsContainer.height( '' );

			return;
		}

		var masonry = new qazanaFrontend.modules.Masonry( {
			container: elements.$postsContainer,
			items: elements.$posts.filter( ':visible' ),
			columnsCount: this.getSettings( 'colsCount' ),
			verticalSpaceBetween: 0
		} );

		masonry.run();
	},

	run: function() {
		// For slow browsers
		setTimeout( this.fitImages, 0 );

		this.initMasonry();
	},

	onInit: function() {
		qazanaFrontend.Module.prototype.onInit.apply( this, arguments );

		this.bindEvents();

		this.run();
	},

	onWindowResize: function() {
		this.fitImages();

		this.runMasonry();
	},

	onElementChange: function() {
		this.fitImages();

		setTimeout( this.runMasonry );
	}
} );