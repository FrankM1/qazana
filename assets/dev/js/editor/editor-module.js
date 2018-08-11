var EditorModule = function() {
	var self = this;

	this.init = function() {
		jQuery( window ).on( 'qazana:init', this.onQazanaReady.bind( this ) );
	};

	this.getView = function( name ) {
		var editor = qazana.getPanelView().getCurrentPageView();
		return editor.children.findByModelCid( this.getControl( name ).cid );
	};

	this.getControl = function( name ) {
		var editor = qazana.getPanelView().getCurrentPageView();
		return editor.collection.findWhere( { name: name } );
	};

	this.onQazanaReady = function() {
		self.onQazanaInit();

		qazana.on( 'frontend:init', function() {
			self.onQazanaFrontendInit();
		} );

		qazana.on( 'preview:loaded', function() {
			self.onQazanaPreviewLoaded();
		} );
	};

	this.init();
};

EditorModule.prototype.onQazanaInit = function() {};

EditorModule.prototype.onQazanaPreviewLoaded = function() {};

EditorModule.prototype.onQazanaFrontendInit = function() {};

EditorModule.extend = Backbone.View.extend;

module.exports = EditorModule;