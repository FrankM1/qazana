var ControlsStack = require( 'qazana-views/controls-stack' ),
	EditorView;

EditorView = ControlsStack.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-editor-content' ),

	id: 'qazana-panel-page-editor',

	childViewContainer: '#qazana-controls',

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model.get( 'settings' ),
			elementEditSettings: this.model.get( 'editSettings' )
		};
	},

	openActiveSection: function() {
		ControlsStack.prototype.openActiveSection.apply( this, arguments );

		qazana.channels.editor.trigger( 'section:activated', this.activeSection, this );
	},

	isVisibleSectionControl: function( sectionControlModel ) {
		return ControlsStack.prototype.isVisibleSectionControl.apply( this, arguments ) && qazana.helpers.isActiveControl( sectionControlModel, this.model.get( 'settings' ).attributes );
	},

	scrollToEditedElement: function() {
		qazana.helpers.scrollToView( this.getOption( 'editedElementView' ) );
	},

	onBeforeRender: function() {
		var controls = qazana.getElementControls( this.model );

		if ( ! controls ) {
			throw new Error( 'Editor controls not found' );
		}

		// Create new instance of that collection
		this.collection = new Backbone.Collection( _.values( controls ) );
	},

	onDestroy: function() {
		var editedElementView = this.getOption( 'editedElementView' );

		if ( editedElementView ) {
			editedElementView.$el.removeClass( 'qazana-element-editable' );
		}

		this.model.trigger( 'editor:close' );

		this.triggerMethod( 'editor:destroy' );
	},

	onRender: function() {
		var editedElementView = this.getOption( 'editedElementView' );

		if ( editedElementView ) {
			editedElementView.$el.addClass( 'qazana-element-editable' );
		}
	},

	onDeviceModeChange: function() {
		ControlsStack.prototype.onDeviceModeChange.apply( this, arguments );

		this.scrollToEditedElement();
	},

	onChildviewSettingsChange: function( childView ) {
		var editedElementView = this.getOption( 'editedElementView' ),
			editedElementType = editedElementView.model.get( 'elType' );

		if ( 'widget' === editedElementType ) {
			editedElementType = editedElementView.model.get( 'widgetType' );
		}

		qazana.channels.editor
			.trigger( 'change', childView, editedElementView )
			.trigger( 'change:' + editedElementType, childView, editedElementView )
			.trigger( 'change:' + editedElementType + ':' + childView.model.get( 'name' ), childView, editedElementView );
	}
} );

module.exports = EditorView;
