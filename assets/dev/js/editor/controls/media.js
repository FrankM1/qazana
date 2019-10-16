var ControlMultipleBaseItemView = require( 'qazana-controls/base-multiple' ),
	ControlMediaItemView;

ControlMediaItemView = ControlMultipleBaseItemView.extend( {
	ui: function() {
		var ui = ControlMultipleBaseItemView.prototype.ui.apply( this, arguments );

		ui.controlMedia = '.qazana-control-media';
		ui.mediaImage = '.qazana-control-media-image';
		ui.mediaVideo = '.qazana-control-media-video';
		ui.frameOpeners = '.qazana-control-preview-area';
		ui.deleteButton = '.qazana-control-media-delete';

		return ui;
	},

	events: function() {
		return _.extend( ControlMultipleBaseItemView.prototype.events.apply( this, arguments ), {
			'click @ui.frameOpeners': 'openFrame',
			'click @ui.deleteButton': 'deleteImage',
		} );
	},

	getMediaType: function() {
		return this.model.get( 'media_type' );
	},

	applySavedValue: function() {
		var url = this.getControlValue( 'url' ),
			mediaType = this.getMediaType();

		if ( 'image' === mediaType ) {

              // Fetch thumbnails instead of full size images in editor.
              var thumbnailImage = {
				id: this.getControlValue( 'id' ),
				url: url,
                size: 'custom',
                dimension: {
                    width: 245,
                    height: 135,
                },
                preview: true,
			};

            var imageUrl = qazana.imagesManager.getImageUrl( thumbnailImage );

            // There is a bug here whereby first load doesn't generate thumbs
            if ( _.isEmpty( imageUrl ) ) {
                imageUrl = url;
            }

			this.ui.mediaImage.css( 'background-image', imageUrl ? 'url(' + imageUrl + ')' : '' );
		} else if ( 'video' === mediaType ) {
			this.ui.mediaVideo.attr( 'src', url );
		}

		this.ui.controlMedia.toggleClass( 'qazana-media-empty', ! url );
	},

	openFrame: function() {
		if ( ! this.frame ) {
			this.initFrame();
		}

		this.frame.open();
	},

	deleteImage: function( event ) {
		event.stopPropagation();

		this.setValue( {
			url: '',
			id: '',
		} );

		this.applySavedValue();
	},

	/**
	 * Create a media modal select frame, and store it so the instance can be reused when needed.
	 */
	initFrame: function() {
		// Set current doc id to attach uploaded images.
		wp.media.view.settings.post.id = qazana.config.document.id;
		this.frame = wp.media( {
			button: {
				text: qazana.translate( 'insert_media' ),
			},
			states: [
				new wp.media.controller.Library( {
					title: qazana.translate( 'insert_media' ),
					library: wp.media.query( { type: this.getMediaType() } ),
					multiple: false,
					date: false,
				} ),
			],
		} );

		// When a file is selected, run a callback.
		this.frame.on( 'insert select', this.select.bind( this ) );
	},

	/**
	 * Callback handler for when an attachment is selected in the media modal.
	 * Gets the selected image information, and sets it within the control.
	 */
	select: function() {
		this.trigger( 'before:select' );

		// Get the attachment from the modal frame.
		var attachment = this.frame.state().get( 'selection' ).first().toJSON();

		if ( attachment.url ) {
			this.setValue( {
				url: attachment.url,
				id: attachment.id,
			} );

			this.applySavedValue();
		}

		this.trigger( 'after:select' );
	},

	onBeforeDestroy: function() {
		this.$el.remove();
	},
} );

module.exports = ControlMediaItemView;
