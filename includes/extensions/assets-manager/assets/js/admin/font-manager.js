module.exports = function() {
	var self = this;

	self.fields = {
		upload: require( './fields/upload' ),
		repeater: require( './fields/repeater' )
	};

	self.selectors = {
		editPageClass: 'post-type-qazana_font',
		title: '#title',
		repeaterBlock: '.repeater-block',
		repeaterTitle: '.repeater-title',
		removeRowBtn: '.remove-repeater-row',
		editRowBtn: '.toggle-repeater-row',
		closeRowBtn: '.close-repeater-row',
		styleInput: '.font_style',
		weightInput: '.font_weight',
		customFontsMetaBox: '#qazana-font-custommetabox',
		closeHandle: 'button.handlediv',
		toolbar: '.qazana-field-toolbar',
		inlinePreview: '.inline-preview',
		fileUrlInput: '.qazana-field-file input[type="text"]'
	};

	self.fontLabelTemplate = '<ul class="row-font-label"><li class="row-font-weight">{{weight}}</li><li class="row-font-style">{{style}}</li><li class="row-font-preview">{{preview}}</li>{{toolbar}}</ul>';

	self.renderTemplate = function( tpl, data ) {
		var re = /{{([^}}]+)?}}/g, match;
		while ( match = re.exec( tpl ) ) {
			tpl = tpl.replace( match[ 0 ], data[ match[ 1 ] ] );
		}
		return tpl;
	};

	self.ucFirst = function ( string ) {
		return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
	};

	self.getPreviewStyle = function( $table ) {
		var self = qazanaProAdmin.assetsManager.fontManager,
			fontFamily = jQuery( self.selectors.title ).val(),
			style = $table.find( 'select' + self.selectors.styleInput ).first().val(),
			weight = $table.find( 'select' + self.selectors.weightInput ).first().val();

		return {
			style: self.ucFirst( style ),
			weight: self.ucFirst( weight ),
			styleAttribute: 'font-family: ' + fontFamily + ' ;font-style: ' + style + '; font-weight: ' + weight + ';'
		};
	};

	self.updateRowLabel = function( event, $table, $label, value ) {
		var self = qazanaProAdmin.assetsManager.fontManager,
			$block = $table.closest( self.selectors.repeaterBlock ),
			$deleteBtn = $block.find( self.selectors.removeRowBtn ).first(),
			$editBtn = $block.find( self.selectors.editRowBtn ).first(),
			$closeBtn = $block.find( self.selectors.closeRowBtn ).first(),
			$toolbar = $table.find( self.selectors.toolbar ).last().clone(),
			previewStyle = self.getPreviewStyle( $table ),
			toolbarHtml;

		if ( $editBtn.length > 0) {
			$editBtn.not( self.selectors.toolbar + ' ' + self.selectors.editRowBtn ).remove();
		}

		if ( $closeBtn.length > 0) {
			$closeBtn.not( self.selectors.toolbar + ' ' + self.selectors.closeRowBtn ).remove();
		}

		if ( $deleteBtn.length > 0) {
			$deleteBtn.not( self.selectors.toolbar + ' ' + self.selectors.removeRowBtn ).remove();
		}

		toolbarHtml =  jQuery( '<li class="row-font-actions">' ).append( $toolbar )[0].outerHTML;

		return self.renderTemplate( self.fontLabelTemplate, {
			weight: '<span class="label">Weight:</span>' + previewStyle.weight,
			style: '<span class="label">Style:</span>' + previewStyle.style,
			preview: '<span style="' + previewStyle.styleAttribute + '">Elementor is making the web beautiful</span>',
			toolbar: toolbarHtml
		});
	};

	self.onRepeaterToggleVisible = function( event, $btn, $table, $toggleLabel ) {
		var self = qazanaProAdmin.assetsManager.fontManager,
			$previewElement = $table.find( self.selectors.inlinePreview ),
			previewStyle = self.getPreviewStyle( $table );

		$previewElement.attr( 'style', previewStyle.styleAttribute );
	};

	self.onRepeaterNewRow = function( event, $btn, $block ) {
		var self = qazanaProAdmin.assetsManager.fontManager;
		$block.find( self.selectors.removeRowBtn ).first().remove();
		$block.find( self.selectors.editRowBtn ).first().remove();
		$block.find( self.selectors.closeRowBtn ).first().remove();
	};

	self.maybeToggle = function( event ) {
		var self = qazanaProAdmin.assetsManager.fontManager;
		event.preventDefault();

		if ( jQuery( this ).is( ':visible' ) && ! jQuery( event.target ).hasClass( self.selectors.editRowBtn ) ) {
			jQuery( this ).find( self.selectors.editRowBtn ).click();
		}
	};

	self.onInputChange = function( event ) {
		var self = this,
			$el = jQuery( event.target ).next();

		self.fields.upload.setFields( $el );
		self.fields.upload.setLabels( $el );
		self.fields.upload.replaceButtonClass( $el );
	};

	self.bind = function() {
		jQuery( document ).on( 'repeaterComputedLabel', this.updateRowLabel )
			.on( 'onRepeaterToggleVisible', this.onRepeaterToggleVisible )
			.on( 'onRepeaterNewRow', this.onRepeaterNewRow )
			.on( 'click', this.selectors.repeaterTitle, this.maybeToggle )
			.on( 'input', this.selectors.fileUrlInput, this.onInputChange.bind( this ) );
	};

	self.removeCloseHandle = function() {
		jQuery( this.selectors.closeHandle ).remove();
		jQuery( this.selectors.customFontsMetaBox ).removeClass( 'closed' ).removeClass( 'postbox' );
	};

	self.titleRequired = function() {
		jQuery( self.selectors.title ).prop( 'required', true );
	};

	self.init = function() {
		if ( ! jQuery( 'body' ).hasClass( self.selectors.editPageClass ) ) {
			return;
		}

		this.removeCloseHandle();
		this.titleRequired();
		this.bind();
		this.fields.upload.init();
		this.fields.repeater.init();
	};
};