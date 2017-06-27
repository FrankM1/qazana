var TemplateLibraryHeaderSearchView;

TemplateLibraryHeaderSearchView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-header-search',

	id: 'qazana-template-library-header-search-input',

	ui: {
		input: 'input',
		clearInput: '#qazana-template-library-header-search-input-clear'
	},

	events: {
		'keyup @ui.input': 'onInputChanged',
		'click @ui.clearInput': 'clearInput'
	},

	onRender: function(){
		var self = this;

		self.ui.input.focus(function() {
			self.$el.addClass( 'active' );
		}).blur(function() {
			self.$el.removeClass( 'active' );
		});
	},

	onInputChanged: function( event ) {
		var ESC_KEY = 27;

		if ( ESC_KEY === event.keyCode ) {
			this.clearInput();
		}

		qazana.templates.onSearchViewChangeInput( this );
	},

	clearInput: function() {
		this.ui.input.val( '' );
		this.$el.removeClass( 'active' );
		qazana.templates.onSearchViewChangeInput( this );
	}
} );

module.exports = TemplateLibraryHeaderSearchView;
