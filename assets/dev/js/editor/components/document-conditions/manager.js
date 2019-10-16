var Module = require( 'qazana-utils/module' );

module.exports = Module.extend( {

    onInit: function() {
		var self = this;

		if ( this.hasDocumentConditions() ) {
			this.config = qazana.config.documentConditions;

			qazana.addControlView( 'Conditions_repeater', require( './conditions/repeater-control' ) );

			qazana.hooks.addFilter( 'panel/header/behaviors', this.addHeaderSaver );
			qazana.hooks.addFilter( 'panel/footer/behaviors', this.addFooterSaver );

			this.initConditionsLayout();
		}

		qazana.once( 'preview:loaded', function() {
			self.onQazanaPreviewLoaded();
		} );
	},

	hasDocumentConditions: function() {
		return ( 'undefined' === typeof qazana.config.documentConditions ) ? false : true;
	},

	addHeaderSaver: function( behavior ) {
        behavior.saver = {
            behaviorClass: require( './behavior/header-saver' ),
        };

		return behavior;
    },

    addFooterSaver: function( behavior ) {
        behavior.saver = {
            behaviorClass: require( './behavior/footer-saver' ),
        };

        return behavior;
    },

	saveAndReload: function() {
		qazana.saver.saveAutoSave( {
			onSuccess: function() {
				qazana.dynamicTags.cleanCache();
				qazana.reloadPreview();
			},
		} );
	},

	onApplyPreview: function() {
		this.saveAndReload();
	},

	onPageSettingsChange: function( model ) {
		if ( model.changed.preview_type ) {
			model.set( {
				preview_id: '',
				preview_search_term: '',
			} );
			this.updatePreviewIdOptions( true );
		}

		if ( ! _.isUndefined( model.changed.page_template ) ) {
			qazana.saver.saveAutoSave( {
				onSuccess: function() {
					qazana.reloadPreview();

					qazana.once( 'preview:loaded', function() {
						qazana.getPanelView().setPage( 'page_settings' );
					} );
				},
			} );
		}
	},

	updatePreviewIdOptions: function( render ) {
		var previewType = qazana.settings.page.model.get( 'preview_type' );
		if ( ! previewType ) {
			return;
		}
		previewType = previewType.split( '/' );

		var currentView = qazana.getPanelView().getCurrentPageView(),
			controlModel = currentView.collection.findWhere( {
				name: 'preview_id',
			} );

		if ( 'author' === previewType[ 1 ] ) {
			controlModel.set( {
				filter_type: 'author',
				object_type: 'author',
			} );
		} else if ( 'taxonomy' === previewType[ 0 ] ) {
			controlModel.set( {
				filter_type: 'taxonomy',
				object_type: previewType[ 1 ],
			} );
		} else if ( 'single' === previewType[ 0 ] ) {
			controlModel.set( {
				filter_type: 'post',
				object_type: previewType[ 1 ],
			} );
		} else {
			controlModel.set( {
				filter_type: '',
				object_type: '',
			} );
		}

		if ( true === render ) { // Can be model.
			var controlView = currentView.children.findByModel( controlModel );

			controlView.render();

			controlView.$el.toggle( !! controlModel.get( 'filter_type' ) );
		}
	},

	onQazanaPreviewLoaded: function() {
		qazana.getPanelView().on( 'set:page:page_settings', this.updatePreviewIdOptions );

		qazana.settings.page.model.on( 'change', this.onPageSettingsChange.bind( this ) );

		qazana.channels.editor.on( 'qazanaDocumentConditions:ApplyPreview', this.onApplyPreview.bind( this ) );

		// Scroll to Editor. Timeout according to preview resize css animation duration.
		setTimeout( function() {
			qazana.$previewContents.find( 'html, body' ).animate( {
				scrollTop: qazana.$previewContents.find( '#qazana' ).offset().top - ( qazana.$preview[ 0 ].contentWindow.innerHeight / 2 ),
			} );
		}, 500 );
	},

    initConditionsLayout: function() {
		var ConditionsLayout = require( './conditions/views/layout' );

		this.conditionsLayout = new ConditionsLayout();
	},

	showConditionsModal: function() {
		var self = this,
            ConditionsView = require( './conditions/views/view' );

		var model = new qazana.modules.elements.models.BaseSettings( this.config.settings, {
			controls: self.config.template_conditions.controls,
		} );

		this.conditionsLayout.modalContent.show( new ConditionsView( {
			model: model,
			controls: model.controls,
		} ) );

		this.conditionsLayout.modal.show();
	},

} );
