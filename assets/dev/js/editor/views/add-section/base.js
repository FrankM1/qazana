class AddSectionBase extends Marionette.ItemView {
	template() {
		return Marionette.TemplateCache.get( '#tmpl-qazana-add-section' );
	}

	attributes() {
		return {
			'data-view': 'choose-action',
		};
	}

	ui() {
		return {
			addNewSection: '.qazana-add-new-section',
			closeButton: '.qazana-add-section-close',
			addSectionButton: '.qazana-add-section-button',
			addTemplateButton: '.qazana-add-template-button',
			selectPreset: '.qazana-select-preset',
			presets: '.qazana-preset',
		};
	}

	events() {
		return {
			'click @ui.addSectionButton': 'onAddSectionButtonClick',
			'click @ui.addTemplateButton': 'onAddTemplateButtonClick',
			'click @ui.closeButton': 'onCloseButtonClick',
			'click @ui.presets': 'onPresetSelected',
		};
	}

	behaviors() {
		return {
			contextMenu: {
				behaviorClass: require( 'qazana-behaviors/context-menu' ),
				groups: this.getContextMenuGroups(),
			},
		};
	}

	className() {
		return 'qazana-add-section qazana-visible-desktop';
	}

	addSection( properties, options ) {
		return qazana.getPreviewView().addChildElement( properties, jQuery.extend( {}, this.options, options ) );
	}

	setView( view ) {
		this.$el.attr( 'data-view', view );
	}

	showSelectPresets() {
		this.setView( 'select-preset' );
	}

	closeSelectPresets() {
		this.setView( 'choose-action' );
	}

	getTemplatesModalOptions() {
		return {
			importOptions: {
				at: this.getOption( 'at' ),
			},
		};
	}

	getContextMenuGroups() {
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
						isEnabled: this.isPasteEnabled.bind( this ),
					},
				],
			}, {
				name: 'content',
				actions: [
					{
						name: 'copy_all_content',
						title: qazana.translate( 'copy_all_content' ),
						callback: this.copy.bind( this ),
						isEnabled: hasContent,
					}, {
						name: 'delete_all_content',
						title: qazana.translate( 'delete_all_content' ),
						callback: qazana.clearPage.bind( qazana ),
						isEnabled: hasContent,
					},
				],
			},
		];
	}

	copy() {
		qazana.getPreviewView().copy();
	}

	paste() {
		qazana.getPreviewView().paste( this.getOption( 'at' ) );
	}

	isPasteEnabled() {
		return qazana.getStorage( 'transfer' );
	}

	onAddSectionButtonClick() {
		this.showSelectPresets();
	}

	onAddTemplateButtonClick() {
		qazana.templates.startModal( this.getTemplatesModalOptions() );
	}

	onRender() {
		this.$el.html5Droppable( {
			axis: [ 'vertical' ],
			groups: [ 'qazana-element' ],
			placeholder: false,
			currentElementClass: 'qazana-html5dnd-current-element',
			hasDraggingOnChildClass: 'qazana-dragging-on-child',
			onDropping: this.onDropping.bind( this ),
		} );
	}

	onPresetSelected( event ) {
		this.closeSelectPresets();

		const selectedStructure = event.currentTarget.dataset.structure,
			parsedStructure = qazana.presetsFactory.getParsedStructure( selectedStructure ),
            elements = [];

		let loopIndex;

		for ( loopIndex = 0; loopIndex < parsedStructure.columnsCount; loopIndex++ ) {
			elements.push( {
				id: qazana.helpers.getUniqueID(),
				elType: 'column',
				settings: {},
				elements: [],
			} );
		}

		qazana.channels.data.trigger( 'element:before:add', {
			elType: 'section',
		} );

		const newSection = this.addSection( { elements: elements } );

		newSection.setStructure( selectedStructure );

        newSection.getEditModel().trigger( 'request:edit' );

		qazana.channels.data.trigger( 'element:after:add' );
	}

	onDropping() {
		qazana.channels.data.trigger( 'section:before:drop' );

		this.addSection().addElementFromPanel();

		qazana.channels.data.trigger( 'section:after:drop' );
	}
}

export default AddSectionBase;
