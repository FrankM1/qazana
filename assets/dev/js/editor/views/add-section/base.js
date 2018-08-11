module.exports = Marionette.ItemView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-add-section' ),

	attributes: {
		'data-view': 'choose-action'
	},

	ui: {
		addNewSection: '.qazana-add-new-section',
		closeButton: '.qazana-add-section-close',
		addSectionButton: '.qazana-add-section-button',
		addTemplateButton: '.qazana-add-template-button',
		selectPreset: '.qazana-select-preset',
		presets: '.qazana-preset'
	},

	events: {
		'click @ui.addSectionButton': 'onAddSectionButtonClick',
		'click @ui.addTemplateButton': 'onAddTemplateButtonClick',
		'click @ui.closeButton': 'onCloseButtonClick',
		'click @ui.presets': 'onPresetSelected'
	},

	behaviors: function() {
		return {
			contextMenu: {
				behaviorClass: require( 'qazana-behaviors/context-menu' ),
				groups: this.getContextMenuGroups()
			}
		};
	},

	className: function() {
		return 'qazana-add-section qazana-visible-desktop';
	},

	addSection: function( properties, options ) {
		return qazana.getPreviewView().addChildElement( properties, jQuery.extend( {}, this.options, options ) );
	},

	setView: function( view ) {
		this.$el.attr( 'data-view', view );
	},

	showSelectPresets: function() {
		this.setView( 'select-preset' );
	},

	closeSelectPresets: function() {
		this.setView( 'choose-action' );
	},

	getTemplatesModalOptions: function() {
		return {
			importOptions: {
				at: this.getOption( 'at' )
			}
		};
	},

	getContextMenuGroups: function() {
		var hasContent = function() {
			return qazana.elements.length > 0;
		};

		return [
			{
				name: 'paste',
				actions: [
					{
						name: 'paste',
						title: qazana.translate( 'paste' ),
						callback: this.paste.bind( this ),
						isEnabled: this.isPasteEnabled.bind( this )
					}
				]
			}, {
				name: 'content',
				actions: [
					{
						name: 'copy_all_content',
						title: qazana.translate( 'copy_all_content' ),
						callback: this.copy.bind( this ),
						isEnabled: hasContent
					}, {
						name: 'delete_all_content',
						title: qazana.translate( 'delete_all_content' ),
						callback: qazana.clearPage.bind( qazana ),
						isEnabled: hasContent
					}
				]
			}
		];
	},

	copy: function() {
		qazana.getPreviewView().copy();
	},

	paste: function() {
		qazana.getPreviewView().paste( this.getOption( 'at' ) );
	},

	isPasteEnabled: function() {
		return qazana.getStorage( 'transfer' );
	},

	onAddSectionButtonClick: function() {
		this.showSelectPresets();
	},

	onAddTemplateButtonClick: function() {
		qazana.templates.startModal( this.getTemplatesModalOptions() );
	},

	onRender: function() {
		this.$el.html5Droppable( {
			axis: [ 'vertical' ],
			groups: [ 'qazana-element' ],
			placeholder: false,
			currentElementClass: 'qazana-html5dnd-current-element',
			hasDraggingOnChildClass: 'qazana-dragging-on-child',
			onDropping: this.onDropping.bind( this )
		} );
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

		qazana.channels.data.trigger( 'element:before:add', {
			elType: 'section'
		} );

		var newSection = this.addSection( { elements: elements } );

		newSection.setStructure( selectedStructure );

		qazana.channels.data.trigger( 'element:after:add' );
	},

	onDropping: function() {
		qazana.channels.data.trigger( 'section:before:drop' );

		this.addSection().addElementFromPanel();

		qazana.channels.data.trigger( 'section:after:drop' );
	}
} );
