var BaseSectionsContainerView = require( 'qazana-views/base-sections-container' ),
	Preview;

Preview = BaseSectionsContainerView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-preview' ),

	className: 'qazana-inner',

	childViewContainer: '.qazana-section-wrap',

	ui: {
		addSectionArea: '#qazana-add-section',
		addNewSection: '#qazana-add-new-section',
		closePresetsIcon: '#qazana-select-preset-close',
		addSectionButton: '#qazana-add-section-button',
		addTemplateButton: '#qazana-add-template-button',
		selectPreset: '#qazana-select-preset',
		presets: '.qazana-preset'
	},

	events: {
		'click @ui.addSectionButton': 'onAddSectionButtonClick',
		'click @ui.addTemplateButton': 'onAddTemplateButtonClick',
		'click @ui.closePresetsIcon': 'closeSelectPresets',
		'click @ui.presets': 'onPresetSelected'
	},

	closeSelectPresets: function() {
		this.ui.addNewSection.show();
		this.ui.selectPreset.hide();
	},

	fixBlankPageOffset: function() {
		var sectionHandleHeight = 27,
			elTopOffset = this.$el.offset().top,
			elTopOffsetRange = sectionHandleHeight - elTopOffset;

		if ( 0 < elTopOffsetRange ) {
			var $style = Backbone.$( '<style>' ).text( '.qazana-editor-active .qazana-inner{margin-top: ' + elTopOffsetRange + 'px}' );
			qazana.$previewContents.children().children( 'head' ).append( $style );
		}
	},

	onAddSectionButtonClick: function() {
		this.ui.addNewSection.hide();
		this.ui.selectPreset.show();
	},

	onAddTemplateButtonClick: function() {
		qazana.templates.startModal( function() {
			qazana.templates.showTemplates();
		} );
	},

	onRender: function() {
		var self = this;

		self.ui.addSectionArea.html5Droppable( {
			axis: [ 'vertical' ],
			groups: [ 'qazana-element' ],
			onDragEnter: function( side ) {
				self.ui.addSectionArea.attr( 'data-side', side );
			},
			onDragLeave: function() {
				self.ui.addSectionArea.removeAttr( 'data-side' );
			},
			onDropping: function() {
				self.addSection().addElementFromPanel();
			}
		} );

		_.defer( _.bind( self.fixBlankPageOffset, this ) );
	},

	onPresetSelected: function( event ) {
		this.closeSelectPresets();

		var selectedStructure = event.currentTarget.dataset.structure,
			parsedStructure = qazana.presetsFactory.getParsedStructure( selectedStructure ),
			elements = [],
			loopIndex;

		for ( loopIndex = 0; loopIndex < parsedStructure.columnsCount; loopIndex++ ) {
			elements.push( {
				id: qazana.helpers.getUniqueID(),
				elType: 'column',
				settings: {},
				elements: []
			} );
		}

		var newSection = this.addSection( { elements: elements } );

		newSection.setStructure( selectedStructure );
		newSection.redefineLayout();
	}
} );

module.exports = Preview;
