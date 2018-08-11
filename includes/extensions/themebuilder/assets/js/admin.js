(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function ($) {
    'use strict';
    var CreateTemplateDialog = require('./create-template-dialog');
    
    new CreateTemplateDialog();
    
})(jQuery);
},{"./create-template-dialog":2}],2:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmNsdWRlcy9leHRlbnNpb25zL3RoZW1lYnVpbGRlci9hc3NldHMvanMvYWRtaW4vYWRtaW4uanMiLCJpbmNsdWRlcy9leHRlbnNpb25zL3RoZW1lYnVpbGRlci9hc3NldHMvanMvYWRtaW4vY3JlYXRlLXRlbXBsYXRlLWRpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKCQpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIENyZWF0ZVRlbXBsYXRlRGlhbG9nID0gcmVxdWlyZSgnLi9jcmVhdGUtdGVtcGxhdGUtZGlhbG9nJyk7XG4gICAgXG4gICAgbmV3IENyZWF0ZVRlbXBsYXRlRGlhbG9nKCk7XG4gICAgXG59KShqUXVlcnkpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBzZWxmID0gdGhpcztcblxuXHR2YXIgc2VsZWN0b3JzID0ge1xuXHRcdHRlbXBsYXRlVHlwZUlucHV0OiAnI3FhemFuYS1uZXctdGVtcGxhdGVfX2Zvcm1fX3RlbXBsYXRlLXR5cGUnLFxuXHRcdGxvY2F0aW9uV3JhcHBlcjogJyNxYXphbmEtbmV3LXRlbXBsYXRlX19mb3JtX19sb2NhdGlvbl9fd3JhcHBlcicsXG5cdFx0cG9zdFR5cGVXcmFwcGVyOiAnI3FhemFuYS1uZXctdGVtcGxhdGVfX2Zvcm1fX3Bvc3QtdHlwZV9fd3JhcHBlcidcblx0fTtcblxuXHR2YXIgZWxlbWVudHMgPSB7XG5cdFx0JHRlbXBsYXRlVHlwZUlucHV0OiBudWxsLFxuXHRcdCRsb2NhdGlvbldyYXBwZXI6IG51bGwsXG5cdFx0JHBvc3RUeXBlV3JhcHBlcjogbnVsbFxuXHR9O1xuXG5cdHZhciBzZXRFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGpRdWVyeS5lYWNoKCBzZWxlY3RvcnMsIGZ1bmN0aW9uKCBrZXksIHNlbGVjdG9yICkge1xuXHRcdFx0a2V5ID0gJyQnICsga2V5O1xuXHRcdFx0ZWxlbWVudHNbIGtleSBdID0galF1ZXJ5KCBzZWxlY3RvciApO1xuXHRcdH0gKTtcblx0fTtcblxuXHR2YXIgc2V0TG9jYXRpb25GaWVsZFZpc2liaWxpdHkgPSBmdW5jdGlvbigpIHtcblx0XHRlbGVtZW50cy4kbG9jYXRpb25XcmFwcGVyLnRvZ2dsZSggJ3NlY3Rpb24nID09PSBlbGVtZW50cy4kdGVtcGxhdGVUeXBlSW5wdXQudmFsKCkgKTtcblx0XHRlbGVtZW50cy4kcG9zdFR5cGVXcmFwcGVyLnRvZ2dsZSggJ3NpbmdsZScgPT09IGVsZW1lbnRzLiR0ZW1wbGF0ZVR5cGVJbnB1dC52YWwoKSApO1xuXHR9O1xuXG5cdHNlbGYuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0c2V0RWxlbWVudHMoKTtcblxuXHRcdGlmICggISBlbGVtZW50cy4kdGVtcGxhdGVUeXBlSW5wdXQubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHNldExvY2F0aW9uRmllbGRWaXNpYmlsaXR5KCk7XG5cblx0XHRlbGVtZW50cy4kdGVtcGxhdGVUeXBlSW5wdXQuY2hhbmdlKCBzZXRMb2NhdGlvbkZpZWxkVmlzaWJpbGl0eSApO1xuXHR9O1xuXG5cdHNlbGYuaW5pdCgpO1xufTsiXX0=
