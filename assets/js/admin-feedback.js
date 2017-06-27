(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global jQuery, QazanaAdminFeedbackArgs */
( function( $ ) {
	'use strict';

	var QazanaAdminDialogApp = {

		qazanaModals: require( 'qazana-utils/modals' ),

		dialogsManager: new DialogsManager.Instance(),

		cacheElements: function() {
			this.cache = {
				$deactivateLink: $( '#the-list' ).find( '[data-plugin="qazana/qazana.php"] span.deactivate a' ),
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
					modal = self.dialogsManager.createWidget( 'qazana-modal', {
						id: 'qazana-deactivate-feedback-modal',
						headerMessage: self.cache.$dialogHeader,
						message: self.cache.$dialogForm,
						hideOnButtonClick: false,
						onReady: function() {
							DialogsManager.getWidgetType( 'qazana-modal' ).prototype.onReady.apply( this, arguments );

							this.addButton( {
								name: 'submit',
								text: QazanaAdminFeedbackArgs.i18n.submit_n_deactivate,
								callback: _.bind( self.sendFeedback, self )
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

			$.post( ajaxurl, formData, _.bind( this.deactivate, this ) );
		},

		init: function() {
			this.qazanaModals.init();
			this.initModal();
			this.cacheElements();
			this.bindEvents();
		}
	};

	$( function() {
		QazanaAdminDialogApp.init();
	} );

}( jQuery ) );

},{"qazana-utils/modals":2}],2:[function(require,module,exports){
var Modals;

Modals = {
	init: function() {
		this.initModalWidgetType();
	},

	initModalWidgetType: function() {
		var modalProperties = {
			getDefaultSettings: function() {
				var settings = DialogsManager.getWidgetType( 'options' ).prototype.getDefaultSettings.apply( this, arguments );

				return _.extend( settings, {
					position: {
						my: 'center',
						at: 'center'
					},
					contentWidth: 'auto',
					contentHeight: 'auto',
					closeButton: true
				} );
			},
			buildWidget: function() {
				DialogsManager.getWidgetType( 'options' ).prototype.buildWidget.apply( this, arguments );

				if ( ! this.getSettings( 'closeButton' ) ) {
					return;
				}

				var $closeButton = this.addElement( 'closeButton', '<div><i class="fa fa-times"></i></div>' );

				this.getElements( 'widgetContent' ).prepend( $closeButton );
			},
			attachEvents: function() {
				if ( this.getSettings( 'closeButton' ) ) {
					this.getElements( 'closeButton' ).on( 'click', this.hide );
				}
			},
			onReady: function() {
				DialogsManager.getWidgetType( 'options' ).prototype.onReady.apply( this, arguments );

				var elements = this.getElements(),
					settings = this.getSettings();

				if ( 'auto' !== settings.contentWidth ) {
					elements.message.width( settings.contentWidth );
				}

				if ( 'auto' !== settings.contentHeight ) {
					elements.message.height( settings.contentHeight );
				}
			}
		};

		DialogsManager.addWidgetType( 'qazana-modal', DialogsManager.getWidgetType( 'options' ).extend( 'qazana-modal', modalProperties ) );
	}
};

module.exports = Modals;

},{}]},{},[1])
//# sourceMappingURL=admin-feedback.js.map
