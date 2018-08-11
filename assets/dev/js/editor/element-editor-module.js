module.exports = qazana.modules.Module.extend( {
	elementType: null,

	__construct: function( elementType ) {
		this.elementType = elementType;

		this.addEditorListener();
	},

	addEditorListener: function() {
		var self = this;

		if ( self.onElementChange ) {
			var eventName = 'change';

			if ( 'global' !== self.elementType ) {
				eventName += ':' + self.elementType;
			}

			qazana.channels.editor.on( eventName, function( controlView, elementView ) {
				self.onElementChange( controlView.model.get( 'name' ),  controlView, elementView );
			} );
		}
	},

	getView: function( name ) {
		var editor = qazana.getPanelView().getCurrentPageView();
		return editor.children.findByModelCid( this.getControl( name ).cid );
	},

	getControl: function( name ) {
		var editor = qazana.getPanelView().getCurrentPageView();
		return editor.collection.findWhere( { name: name } );
	},

	addControlSpinner: function( name ) {
		this.getView( name ).$el.find( ':input' ).attr( 'disabled', true );
		this.getView( name ).$el.find( '.qazana-control-title' ).after( '<span class="qazana-control-spinner"><i class="fa fa-spinner fa-spin"></i>&nbsp;</span>' );
	},

	removeControlSpinner: function( name ) {
		this.getView( name ).$el.find( ':input' ).attr( 'disabled', false );
		this.getView( name ).$el.find( 'qazana-control-spinner' ).remove();
	},

	addSectionListener: function( section, callback ) {
		var self = this;

		qazana.channels.editor.on( 'section:activated', function( sectionName, editor ) {
			var model = editor.getOption( 'editedElementView' ).getEditModel(),
				currentElementType = model.get( 'elType' ),
				_arguments = arguments;

			if ( 'widget' === currentElementType ) {
				currentElementType = model.get( 'widgetType' );
			}

			if ( self.elementType === currentElementType && section === sectionName ) {
				setTimeout( function() {
					callback.apply( self, _arguments );
				}, 10 );
			}
		} );
	}
} );