var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlMediaItemView;

ControlMediaItemView = ControlBaseDataView.extend( {
	ui: function() {
		var ui = ControlBaseDataView.prototype.ui.apply( this, arguments );

		ui.addImages = '.qazana-control-gallery-add';
		ui.clearGallery = '.qazana-control-gallery-clear';
		ui.galleryThumbnails = '.qazana-control-gallery-thumbnails';
		ui.status = '.qazana-control-gallery-status-title';

		return ui;
	},

	events: function() {
		return _.extend( ControlBaseDataView.prototype.events.apply( this, arguments ), {
			'click @ui.addImages': 'onAddImagesClick',
			'click @ui.clearGallery': 'onClearGalleryClick',
			'click @ui.galleryThumbnails': 'onGalleryThumbnailsClick',
		} );
	},

	onReady: function() {
		this.initRemoveDialog();
	},

    generateThumbnails: function( images ) {
        var imageThumbnail = [];

        images.forEach( function( image ) {
            // Generate thumbnail previews for control.
            var thumbnailImage = {
				id: image.id,
				url: image.url,
                size: 'custom',
                dimension: {
                    width: 100,
                    height: 100,
                },
                preview: true,
            };

            var imageUrl = qazana.imagesManager.getImageUrl( thumbnailImage );

            if ( imageUrl ) {
                imageThumbnail.push( {
                    id: image.id,
                    url: imageUrl,
                } );
            }
        } );

        return imageThumbnail;
    },

    applySavedValue: function() {
        var images = this.getControlValue(),
            thumbnailImages,
			imagesCount = images.length,
			hasImages = !! imagesCount;

		this.$el
			.toggleClass( 'qazana-gallery-has-images', hasImages )
			.toggleClass( 'qazana-gallery-empty', ! hasImages );

		var $galleryThumbnails = this.ui.galleryThumbnails;

		$galleryThumbnails.empty();

		this.ui.status.text( qazana.translate( hasImages ? 'gallery_images_selected' : 'gallery_no_images_selected', [ imagesCount ] ) );

		if ( ! hasImages ) {
			return;
        }

        thumbnailImages = this.generateThumbnails( images );

        // There is a bug here whereby first load doesn't generate thumbs
        if ( _.isEmpty( thumbnailImages ) ) {
            thumbnailImages = images;
        }

        thumbnailImages.forEach( function( image ) {
            var $thumbnail = jQuery( '<div>', { class: 'qazana-control-gallery-thumbnail' } );

            $thumbnail.css( 'background-image', 'url(' + image.url + ')' );

            $galleryThumbnails.append( $thumbnail );
        } );
	},

	hasImages: function() {
		return !! this.getControlValue().length;
	},

	openFrame: function( action ) {
		this.initFrame( action );

		this.frame.open();
	},

	initFrame: function( action ) {
		var frameStates = {
			create: 'gallery',
			add: 'gallery-library',
			edit: 'gallery-edit',
		};

		var options = {
			frame: 'post',
			multiple: true,
			state: frameStates[ action ],
			button: {
				text: qazana.translate( 'insert_media' ),
			},
		};

		if ( this.hasImages() ) {
			options.selection = this.fetchSelection();
		}

		this.frame = wp.media( options );

		// When a file is selected, run a callback.
		this.frame.on( {
			update: this.select,
			'menu:render:default': this.menuRender,
			'content:render:browse': this.gallerySettings,
		}, this );
	},

	menuRender: function( view ) {
		view.unset( 'insert' );
		view.unset( 'featured-image' );
	},

	gallerySettings: function( browser ) {
		browser.sidebar.on( 'ready', function() {
			browser.sidebar.unset( 'gallery' );
		} );
	},

	fetchSelection: function() {
		var attachments = wp.media.query( {
			orderby: 'post__in',
			order: 'ASC',
			type: 'image',
			perPage: -1,
			post__in: _.pluck( this.getControlValue(), 'id' ),
		} );

		return new wp.media.model.Selection( attachments.models, {
			props: attachments.props.toJSON(),
			multiple: true,
		} );
	},

	/**
	 * Callback handler for when an attachment is selected in the media modal.
	 * Gets the selected image information, and sets it within the control.
	 */
	select: function( selection ) {
		var images = [];

		selection.each( function( image ) {
			images.push( {
				id: image.get( 'id' ),
				url: image.get( 'url' ),
			} );
		} );

		this.setValue( images );

		this.applySavedValue();
	},

	onBeforeDestroy: function() {
		if ( this.frame ) {
			this.frame.off();
		}

		this.$el.remove();
	},

	resetGallery: function() {
		this.setValue( '' );

		this.applySavedValue();
	},

	initRemoveDialog: function() {
		var removeDialog;

		this.getRemoveDialog = function() {
			if ( ! removeDialog ) {
				removeDialog = qazana.dialogsManager.createWidget( 'confirm', {
					message: qazana.translate( 'dialog_confirm_gallery_delete' ),
					headerMessage: qazana.translate( 'delete_gallery' ),
					strings: {
						confirm: qazana.translate( 'delete' ),
						cancel: qazana.translate( 'cancel' ),
					},
					defaultOption: 'confirm',
					onConfirm: this.resetGallery.bind( this ),
				} );
			}

			return removeDialog;
		};
	},

	onAddImagesClick: function() {
		this.openFrame( this.hasImages() ? 'add' : 'create' );
	},

	onClearGalleryClick: function() {
		this.getRemoveDialog().show();
	},

	onGalleryThumbnailsClick: function() {
		this.openFrame( 'edit' );
	},
} );

module.exports = ControlMediaItemView;
