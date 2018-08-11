module.exports = function() {
	var self = this;

	var selectors = {
		templateTypeInput: '#qazana-new-template__form__template-type',
		locationWrapper: '#qazana-new-template__form__location__wrapper',
		postTypeWrapper: '#qazana-new-template__form__post-type__wrapper'
	};

	var elements = {
		$templateTypeInput: null,
		$locationWrapper: null,
		$postTypeWrapper: null
	};

	var setElements = function() {
		jQuery.each( selectors, function( key, selector ) {
			key = '$' + key;
			elements[ key ] = jQuery( selector );
		} );
	};

	var setLocationFieldVisibility = function() {
		elements.$locationWrapper.toggle( 'section' === elements.$templateTypeInput.val() );
		elements.$postTypeWrapper.toggle( 'single' === elements.$templateTypeInput.val() );
	};

	self.init = function() {

		setElements();

		if ( ! elements.$templateTypeInput.length ) {
			return;
		}

		setLocationFieldVisibility();

		elements.$templateTypeInput.change( setLocationFieldVisibility );
	};

	self.init();
};