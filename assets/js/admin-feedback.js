(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global jQuery, QazanaAdminFeedbackArgs */
( function( $ ) {
	'use strict';

	var QazanaAdminDialogApp = {

		dialogsManager: new DialogsManager.Instance(),

		cacheElements: function() {
			this.cache = {
				$deactivateLink: $( '#the-list' ).find( '[data-slug="qazana"] span.deactivate a' ),
				$dialogHeader: $( '#qazana-deactivate-feedback-dialog-header' ),
				$dialogForm: $( '#qazana-deactivate-feedback-dialog-form' )
			};
		},

		bindEvents: function() {
			var self = this;

			self.cache.$deactivateLink.on( 'click', function( event ) {
				event.preventDefault();

				self.getModal().show();
			} );
		},

		deactivate: function() {
			location.href = this.cache.$deactivateLink.attr( 'href' );
		},

		initModal: function() {
			var self = this,
				modal;

			self.getModal = function() {
				if ( ! modal ) {
					modal = self.dialogsManager.createWidget( 'lightbox', {
						id: 'qazana-deactivate-feedback-modal',
						headerMessage: self.cache.$dialogHeader,
						message: self.cache.$dialogForm,
						hide: {
							onButtonClick: false
						},
						position: {
							my: 'center',
							at: 'center'
						},
						onReady: function() {
							DialogsManager.getWidgetType( 'lightbox' ).prototype.onReady.apply( this, arguments );

							this.addButton( {
								name: 'submit',
								text: QazanaAdminFeedbackArgs.i18n.submit_n_deactivate,
								callback: self.sendFeedback.bind( self )
							} );

							if ( ! QazanaAdminFeedbackArgs.is_tracker_opted_in ) {
								this.addButton( {
									name: 'skip',
									text: QazanaAdminFeedbackArgs.i18n.skip_n_deactivate,
									callback: function() {
										self.deactivate();
									}
								} );
							}
						},

						onShow: function() {
							var $dialogModal = $( '#qazana-deactivate-feedback-modal' ),
								radioSelector = '.qazana-deactivate-feedback-dialog-input';

							$dialogModal.find( radioSelector ).on( 'change', function() {
								$dialogModal.attr( 'data-feedback-selected', $( this ).val() );
							} );

							$dialogModal.find( radioSelector + ':checked' ).trigger( 'change' );
						}
					} );
				}

				return modal;
			};
		},

		sendFeedback: function() {
			var self = this,
				formData = self.cache.$dialogForm.serialize();

			self.getModal().getElements( 'submit' ).text( '' ).addClass( 'qazana-loading' );

			$.post( ajaxurl, formData, this.deactivate.bind( this ) );
		},

		init: function() {
			this.initModal();
			this.cacheElements();
			this.bindEvents();
		}
	};

	$( function() {
		QazanaAdminDialogApp.init();
	} );

}( jQuery ) );

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvZGV2L2pzL2FkbWluL2FkbWluLWZlZWRiYWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIGpRdWVyeSwgUWF6YW5hQWRtaW5GZWVkYmFja0FyZ3MgKi9cbiggZnVuY3Rpb24oICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgUWF6YW5hQWRtaW5EaWFsb2dBcHAgPSB7XG5cblx0XHRkaWFsb2dzTWFuYWdlcjogbmV3IERpYWxvZ3NNYW5hZ2VyLkluc3RhbmNlKCksXG5cblx0XHRjYWNoZUVsZW1lbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuY2FjaGUgPSB7XG5cdFx0XHRcdCRkZWFjdGl2YXRlTGluazogJCggJyN0aGUtbGlzdCcgKS5maW5kKCAnW2RhdGEtc2x1Zz1cInFhemFuYVwiXSBzcGFuLmRlYWN0aXZhdGUgYScgKSxcblx0XHRcdFx0JGRpYWxvZ0hlYWRlcjogJCggJyNxYXphbmEtZGVhY3RpdmF0ZS1mZWVkYmFjay1kaWFsb2ctaGVhZGVyJyApLFxuXHRcdFx0XHQkZGlhbG9nRm9ybTogJCggJyNxYXphbmEtZGVhY3RpdmF0ZS1mZWVkYmFjay1kaWFsb2ctZm9ybScgKVxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0YmluZEV2ZW50czogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdHNlbGYuY2FjaGUuJGRlYWN0aXZhdGVMaW5rLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0c2VsZi5nZXRNb2RhbCgpLnNob3coKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXG5cdFx0ZGVhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRsb2NhdGlvbi5ocmVmID0gdGhpcy5jYWNoZS4kZGVhY3RpdmF0ZUxpbmsuYXR0ciggJ2hyZWYnICk7XG5cdFx0fSxcblxuXHRcdGluaXRNb2RhbDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRcdG1vZGFsO1xuXG5cdFx0XHRzZWxmLmdldE1vZGFsID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggISBtb2RhbCApIHtcblx0XHRcdFx0XHRtb2RhbCA9IHNlbGYuZGlhbG9nc01hbmFnZXIuY3JlYXRlV2lkZ2V0KCAnbGlnaHRib3gnLCB7XG5cdFx0XHRcdFx0XHRpZDogJ3FhemFuYS1kZWFjdGl2YXRlLWZlZWRiYWNrLW1vZGFsJyxcblx0XHRcdFx0XHRcdGhlYWRlck1lc3NhZ2U6IHNlbGYuY2FjaGUuJGRpYWxvZ0hlYWRlcixcblx0XHRcdFx0XHRcdG1lc3NhZ2U6IHNlbGYuY2FjaGUuJGRpYWxvZ0Zvcm0sXG5cdFx0XHRcdFx0XHRoaWRlOiB7XG5cdFx0XHRcdFx0XHRcdG9uQnV0dG9uQ2xpY2s6IGZhbHNlXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0XHRcdFx0bXk6ICdjZW50ZXInLFxuXHRcdFx0XHRcdFx0XHRhdDogJ2NlbnRlcidcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRvblJlYWR5OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0RGlhbG9nc01hbmFnZXIuZ2V0V2lkZ2V0VHlwZSggJ2xpZ2h0Ym94JyApLnByb3RvdHlwZS5vblJlYWR5LmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuXHRcdFx0XHRcdFx0XHR0aGlzLmFkZEJ1dHRvbigge1xuXHRcdFx0XHRcdFx0XHRcdG5hbWU6ICdzdWJtaXQnLFxuXHRcdFx0XHRcdFx0XHRcdHRleHQ6IFFhemFuYUFkbWluRmVlZGJhY2tBcmdzLmkxOG4uc3VibWl0X25fZGVhY3RpdmF0ZSxcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFjazogc2VsZi5zZW5kRmVlZGJhY2suYmluZCggc2VsZiApXG5cdFx0XHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoICEgUWF6YW5hQWRtaW5GZWVkYmFja0FyZ3MuaXNfdHJhY2tlcl9vcHRlZF9pbiApIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmFkZEJ1dHRvbigge1xuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogJ3NraXAnLFxuXHRcdFx0XHRcdFx0XHRcdFx0dGV4dDogUWF6YW5hQWRtaW5GZWVkYmFja0FyZ3MuaTE4bi5za2lwX25fZGVhY3RpdmF0ZSxcblx0XHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5kZWFjdGl2YXRlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0XHRvblNob3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgJGRpYWxvZ01vZGFsID0gJCggJyNxYXphbmEtZGVhY3RpdmF0ZS1mZWVkYmFjay1tb2RhbCcgKSxcblx0XHRcdFx0XHRcdFx0XHRyYWRpb1NlbGVjdG9yID0gJy5xYXphbmEtZGVhY3RpdmF0ZS1mZWVkYmFjay1kaWFsb2ctaW5wdXQnO1xuXG5cdFx0XHRcdFx0XHRcdCRkaWFsb2dNb2RhbC5maW5kKCByYWRpb1NlbGVjdG9yICkub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHQkZGlhbG9nTW9kYWwuYXR0ciggJ2RhdGEtZmVlZGJhY2stc2VsZWN0ZWQnLCAkKCB0aGlzICkudmFsKCkgKTtcblx0XHRcdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0XHRcdCRkaWFsb2dNb2RhbC5maW5kKCByYWRpb1NlbGVjdG9yICsgJzpjaGVja2VkJyApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG1vZGFsO1xuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0c2VuZEZlZWRiYWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdFx0Zm9ybURhdGEgPSBzZWxmLmNhY2hlLiRkaWFsb2dGb3JtLnNlcmlhbGl6ZSgpO1xuXG5cdFx0XHRzZWxmLmdldE1vZGFsKCkuZ2V0RWxlbWVudHMoICdzdWJtaXQnICkudGV4dCggJycgKS5hZGRDbGFzcyggJ3FhemFuYS1sb2FkaW5nJyApO1xuXG5cdFx0XHQkLnBvc3QoIGFqYXh1cmwsIGZvcm1EYXRhLCB0aGlzLmRlYWN0aXZhdGUuYmluZCggdGhpcyApICk7XG5cdFx0fSxcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5pbml0TW9kYWwoKTtcblx0XHRcdHRoaXMuY2FjaGVFbGVtZW50cygpO1xuXHRcdFx0dGhpcy5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdCQoIGZ1bmN0aW9uKCkge1xuXHRcdFFhemFuYUFkbWluRGlhbG9nQXBwLmluaXQoKTtcblx0fSApO1xuXG59KCBqUXVlcnkgKSApO1xuIl19
