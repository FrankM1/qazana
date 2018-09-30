/* global jQuery, QazanaGutenbergSettings */
( function( $ ) {
	'use strict';

	var QazanaGutenbergApp = {

		cacheElements: function() {
			this.isQazanaMode = '1' === QazanaGutenbergSettings.isQazanaMode;

			this.cache = {};

			this.cache.$gutenberg = $( '#editor' );
			this.cache.$switchMode = $( $( '#qazana-gutenberg-button-switch-mode' ).html() );

			this.cache.$gutenberg.find( '.edit-post-header-toolbar' ).append( this.cache.$switchMode );
			this.cache.$switchModeButton = this.cache.$switchMode.find( '#qazana-switch-mode-button' );

			this.toggleStatus();
			this.buildPanel();

			var self = this;

			wp.data.subscribe( function() {
				setTimeout( function() {
					self.buildPanel();
				}, 1 );
			} );
		},

		buildPanel: function() {
			var self = this;

			if ( ! $( '#qazana-editor' ).length ) {
				self.cache.$editorPanel = $( $( '#qazana-gutenberg-panel' ).html() );
				self.cache.$gurenbergBlockList = self.cache.$gutenberg.find( '.editor-block-list__layout, .editor-post-text-editor' );
				self.cache.$gurenbergBlockList.after( self.cache.$editorPanel );

				self.cache.$editorPanelButton = self.cache.$editorPanel.find( '#qazana-go-to-edit-page-link' );

				self.cache.$editorPanelButton.on( 'click', function( event ) {
					event.preventDefault();

					self.animateLoader();

					var documentTitle = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
					if ( ! documentTitle ) {
						wp.data.dispatch( 'core/editor' ).editPost( { title: 'Qazana #' + $( '#post_ID' ).val() } );
					}

					wp.data.dispatch( 'core/editor' ).savePost();
					self.redirectWhenSave();
				} );
			}
		},

		bindEvents: function() {
			var self = this;

			self.cache.$switchModeButton.on( 'click', function() {
				self.isQazanaMode = ! self.isQazanaMode;

				self.toggleStatus();

				if ( self.isQazanaMode ) {
					self.cache.$editorPanelButton.trigger( 'click' );
				} else {
					var wpEditor = wp.data.dispatch( 'core/editor' );

					wpEditor.editPost( { gutenberg_qazana_mode: false } );
					wpEditor.savePost();
				}
			} );
		},

		redirectWhenSave: function() {
			var self = this;

			setTimeout( function() {
				if ( wp.data.select( 'core/editor' ).isSavingPost() ) {
					self.redirectWhenSave();
				} else {
					location.href = QazanaGutenbergSettings.editLink;
				}
			}, 300 );
		},

		animateLoader: function() {
			this.cache.$editorPanelButton.addClass( 'qazana-animate' );
		},

		toggleStatus: function() {
			jQuery( 'body' )
				.toggleClass( 'qazana-editor-active', this.isQazanaMode )
				.toggleClass( 'qazana-editor-inactive', ! this.isQazanaMode );
		},

		init: function() {
			var self = this;
			setTimeout( function() {
				self.cacheElements();
				self.bindEvents();
			}, 1 );
		},
	};

	$( function() {
		QazanaGutenbergApp.init();
	} );
}( jQuery ) );
