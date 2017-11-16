(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
( function( $ ) {
	'use strict';

	var QazanaAdminApp = {

		maintenanceMode: null,

		cacheElements: function() {
			this.cache = {
				$window: $( window ),
				$body: $( 'body' ),
				$switchMode: $( '#qazana-switch-mode' ),
				$goToEditLink: $( '#qazana-go-to-edit-page-link' ),
				$switchModeInput: $( '#qazana-switch-mode-input' ),
				$switchModeButton: $( '#qazana-switch-mode-button' ),
				$qazanaLoader: $( '.qazana-loader' ),
				$builderEditor: $( '#qazana-editor' ),
				$importButton: $( '#qazana-import-template-trigger' ),
				$importArea: $( '#qazana-import-template-area' ),
				$settingsForm: $( '#qazana-settings-form' ),
				$settingsTabsWrapper: $( '#qazana-settings-tabs-wrapper' )
			};

			this.cache.$settingsFormPages = this.cache.$settingsForm.find( '.qazana-settings-form-page' );
            
			this.cache.$activeSettingsPage = this.cache.$settingsFormPages.filter( '.qazana-active' );

			this.cache.$settingsTabs = this.cache.$settingsTabsWrapper.children();

			this.cache.$activeSettingsTab = this.cache.$settingsTabs.filter( '.nav-tab-active' );
		},

		toggleStatus: function() {
			var isQazanaMode = this.isQazanaMode();

			this.cache.$body
			    .toggleClass( 'qazana-editor-active', isQazanaMode )
			    .toggleClass( 'qazana-editor-inactive', ! isQazanaMode );
		},

		bindEvents: function() {
            var self = this;
            
			self.cache.$switchModeButton.on( 'click', function( event ) {
				event.preventDefault();

				if ( self.isQazanaMode() ) {
					self.cache.$switchModeInput.val( '' );
				} else {
					self.cache.$switchModeInput.val( true );

					var $wpTitle = $( '#title' );

					if ( ! $wpTitle.val() ) {
						$wpTitle.val( 'Qazana #' + $( '#post_ID' ).val() );
					}

					if ( wp.autosave ) {
						wp.autosave.server.triggerSave();
					}

					self.animateLoader();

					$( document ).on( 'heartbeat-tick.autosave', function() {
						self.cache.$window.off( 'beforeunload.edit-post' );

						window.location = self.cache.$goToEditLink.attr( 'href' );
					} );
				}

				self.toggleStatus();
			} );

			self.cache.$goToEditLink.on( 'click', function() {
				self.animateLoader();
			} );

			$( 'div.notice.qazana-message-dismissed' ).on( 'click', 'button.notice-dismiss', function( event ) {
				event.preventDefault();

				$.post( ajaxurl, {
					action: 'qazana_set_admin_notice_viewed',
					notice_id: $( this ).closest( '.qazana-message-dismissed' ).data( 'notice_id' )
				} );
			} );

			$( '#qazana-clear-cache-button' ).on( 'click', function( event ) {
				event.preventDefault();
				var $thisButton = $( this );

				$thisButton.removeClass( 'success' ).addClass( 'loading' );

				$.post( ajaxurl, {
					action: 'qazana_clear_cache',
					_nonce: $thisButton.data( 'nonce' )
				} )
					.done( function() {
						$thisButton.removeClass( 'loading' ).addClass( 'success' );
					} );
			} );

			$( '#qazana-library-sync-button' ).on( 'click', function( event ) {
				event.preventDefault();
				var $thisButton = $( this );

				$thisButton.removeClass( 'success' ).addClass( 'loading' );

				$.post( ajaxurl, {
					action: 'qazana_reset_library',
					_nonce: $thisButton.data( 'nonce' )
				} )
					.done( function() {
						$thisButton.removeClass( 'loading' ).addClass( 'success' );
					} );
			} );

			$( '#qazana-replace-url-button' ).on( 'click', function( event ) {
				event.preventDefault();
				var $this = $( this ),
					$tr = $this.parents( 'tr' ),
					$from = $tr.find( '[name="from"]' ),
					$to = $tr.find( '[name="to"]' );

				$this.removeClass( 'success' ).addClass( 'loading' );

				$.post( ajaxurl, {
					action: 'qazana_replace_url',
					from: $from.val(),
					to: $to.val(),
					_nonce: $this.data( 'nonce' )
				} )
					.done( function( response ) {
						$this.removeClass( 'loading' );

						if ( response.success ) {
							$this.addClass( 'success' );
						}

						var dialogsManager = new DialogsManager.Instance();
							dialogsManager.createWidget( 'alert', {
								message: response.data
							} ).show();
					} );
			} );

			self.cache.$settingsTabs.on( {
				click: function( event ) {
					event.preventDefault();

					event.currentTarget.focus(); // Safari does not focus the tab automatically
				},
				focus: function() { // Using focus event to enable navigation by tab key
					var hrefWithoutHash = location.href.replace( /#.*/, '' );

					history.pushState( {}, '', hrefWithoutHash + this.hash );

					self.goToSettingsTabFromHash();
				}
			} );

			$( '.qazana-rollback-button' ).on( 'click', function( event ) {
				event.preventDefault();

				var $this = $( this ),
					dialogsManager = new DialogsManager.Instance();

				dialogsManager.createWidget( 'confirm', {
					headerMessage: QazanaAdminConfig.i18n.rollback_to_previous_version,
					message: QazanaAdminConfig.i18n.rollback_confirm,
					strings: {
						confirm: QazanaAdminConfig.i18n.yes,
						cancel: QazanaAdminConfig.i18n.cancel
					},
					onConfirm: function() {
						$this.addClass( 'loading' );

						location.href = $this.attr( 'href' );
					}
				} ).show();
			} );

			$( '.qazana_css_print_method select' ).on( 'change', function() {
				var $descriptions = $( '.qazana-css-print-method-description' );

				$descriptions.hide();
				$descriptions.filter( '[data-value="' + $( this ).val() + '"]' ).show();
			} ).trigger( 'change' );
		},

		init: function() {
			this.cacheElements();

			this.bindEvents();

			this.initTemplatesImport();

			this.initMaintenanceMode();

			this.goToSettingsTabFromHash();
		},

		initTemplatesImport: function() {
			if ( ! this.cache.$body.hasClass( 'post-type-qazana_library' ) ) {
				return;
			}

			var self = this,
				$importButton = self.cache.$importButton,
				$importArea = self.cache.$importArea;

			self.cache.$formAnchor = $( 'h1' );

			$( '#wpbody-content' ).find( '.page-title-action:last' ).after( $importButton );

			self.cache.$formAnchor.after( $importArea );

			$importButton.on( 'click', function() {
				$( '#qazana-import-template-area' ).toggle();
			} );
		},

		initMaintenanceMode: function() {
			var MaintenanceMode = require( './maintenance-mode' );

			this.maintenanceMode = new MaintenanceMode();
		},

		isQazanaMode: function() {
			return !! this.cache.$switchModeInput.val();
		},

		animateLoader: function() {
			this.cache.$goToEditLink.addClass( 'qazana-animate' );
		},

		goToSettingsTabFromHash: function() {
			var hash = location.hash.slice( 1 );

			if ( hash ) {
				this.goToSettingsTab( hash );
			}
		},

		goToSettingsTab: function( tabName ) {
			var $activePage = this.cache.$settingsFormPages.filter( '#' + tabName );

			if ( ! $activePage.length ) {
				return;
			}

			this.cache.$activeSettingsPage.removeClass( 'qazana-active' );

			this.cache.$activeSettingsTab.removeClass( 'nav-tab-active' );

			var $activeTab = this.cache.$settingsTabs.filter( '#qazana-settings-' + tabName );

			$activePage.addClass( 'qazana-active' );

			$activeTab.addClass( 'nav-tab-active' );

			this.cache.$settingsForm.attr( 'action', 'options.php#' + tabName  );

			this.cache.$activeSettingsPage = $activePage;

			this.cache.$activeSettingsTab = $activeTab;
		}
	};

	$( function() {
		QazanaAdminApp.init();
	} );

	window.qazanaAdmin = QazanaAdminApp;
}( jQuery ) );

},{"./maintenance-mode":2}],2:[function(require,module,exports){
var ViewModule = require( 'qazana-utils/view-module' ),
	MaintenanceModeModule;

MaintenanceModeModule = ViewModule.extend( {
	getDefaultSettings: function() {
		return {
			selectors: {
				modeSelect: '.qazana_maintenance_mode_mode select',
				maintenanceModeTable: '#tab-maintenance_mode table',
				maintenanceModeDescriptions: '.qazana-maintenance-mode-description',
				excludeModeSelect: '.qazana_maintenance_mode_exclude_mode select',
				excludeRolesArea: '.qazana_maintenance_mode_exclude_roles',
				templateSelect: '.qazana_maintenance_mode_template_id select',
				editTemplateButton: '.qazana-edit-template',
				maintenanceModeError: '.qazana-maintenance-mode-error'
			},
			classes: {
				isEnabled: 'qazana-maintenance-mode-is-enabled'
			}
		};
	},

	getDefaultElements: function() {
		var elements = {},
			selectors = this.getSettings( 'selectors' );

		elements.$modeSelect = jQuery( selectors.modeSelect );
		elements.$maintenanceModeTable = elements.$modeSelect.parents( selectors.maintenanceModeTable );
		elements.$excludeModeSelect = elements.$maintenanceModeTable.find( selectors.excludeModeSelect );
		elements.$excludeRolesArea = elements.$maintenanceModeTable.find( selectors.excludeRolesArea );
		elements.$templateSelect = elements.$maintenanceModeTable.find( selectors.templateSelect );
		elements.$editTemplateButton = elements.$maintenanceModeTable.find( selectors.editTemplateButton );
		elements.$maintenanceModeDescriptions = elements.$maintenanceModeTable.find( selectors.maintenanceModeDescriptions );
		elements.$maintenanceModeError = elements.$maintenanceModeTable.find( selectors.maintenanceModeError );

		return elements;
	},

	bindEvents: function() {
		var settings = this.getSettings(),
			elements = this.elements;

		elements.$modeSelect.on( 'change', function() {
			elements.$maintenanceModeTable.toggleClass( settings.classes.isEnabled, !! elements.$modeSelect.val() );
			elements.$maintenanceModeDescriptions.hide();
			elements.$maintenanceModeDescriptions.filter( '[data-value="' + elements.$modeSelect.val() + '"]' ).show();
		} ).trigger( 'change' );

		elements.$excludeModeSelect.on( 'change', function() {
			elements.$excludeRolesArea.toggle( 'custom' === elements.$excludeModeSelect.val() );
		} ).trigger( 'change' );

		elements.$templateSelect.on( 'change', function() {
			var templateID = elements.$templateSelect.val();

			if ( ! templateID ) {
				elements.$editTemplateButton.hide();
				elements.$maintenanceModeError.show();
				return;
			}

			var editUrl = QazanaAdminConfig.home_url + '?p=' + templateID + '&qazana';

			elements.$editTemplateButton
				.prop( 'href', editUrl )
				.show();
			elements.$maintenanceModeError.hide();
		} ).trigger( 'change' );
	}
} );

module.exports = MaintenanceModeModule;

},{"qazana-utils/view-module":4}],3:[function(require,module,exports){
var Module = function() {
	var $ = jQuery,
		instanceParams = arguments,
		self = this,
		settings,
		events = {};

	var ensureClosureMethods = function() {
		$.each( self, function( methodName ) {
			var oldMethod = self[ methodName ];

			if ( 'function' !== typeof oldMethod ) {
				return;
			}

			self[ methodName ] = function() {
				return oldMethod.apply( self, arguments );
			};
		});
	};

	var initSettings = function() {
		settings = self.getDefaultSettings();

		var instanceSettings = instanceParams[0];

		if ( instanceSettings ) {
			$.extend( settings, instanceSettings );
		}
	};

	var init = function() {
		self.__construct.apply( self, instanceParams );

		ensureClosureMethods();

		initSettings();

		self.trigger( 'init' );
	};

	this.getItems = function( items, itemKey ) {
		if ( itemKey ) {
			var keyStack = itemKey.split( '.' ),
				currentKey = keyStack.splice( 0, 1 );

			if ( ! keyStack.length ) {
				return items[ currentKey ];
			}

			if ( ! items[ currentKey ] ) {
				return;
			}

			return this.getItems(  items[ currentKey ], keyStack.join( '.' ) );
		}

		return items;
	};

	this.getSettings = function( setting ) {
		return this.getItems( settings, setting );
	};

	this.setSettings = function( settingKey, value, settingsContainer ) {
		if ( ! settingsContainer ) {
			settingsContainer = settings;
		}

		if ( 'object' === typeof settingKey ) {
			$.extend( settingsContainer, settingKey );

			return self;
		}

		var keyStack = settingKey.split( '.' ),
			currentKey = keyStack.splice( 0, 1 );

		if ( ! keyStack.length ) {
			settingsContainer[ currentKey ] = value;

			return self;
		}

		if ( ! settingsContainer[ currentKey ] ) {
			settingsContainer[ currentKey ] = {};
		}

		return self.setSettings( keyStack.join( '.' ), value, settingsContainer[ currentKey ] );
	};

	this.forceMethodImplementation = function( methodArguments ) {
		var functionName = methodArguments.callee.name;

		throw new ReferenceError( 'The method ' + functionName + ' must to be implemented in the inheritor child.' );
	};

	this.on = function( eventName, callback ) {
		if ( ! events[ eventName ] ) {
			events[ eventName ] = [];
		}

		events[ eventName ].push( callback );

		return self;
	};

	this.off = function( eventName, callback ) {
		if ( ! events[ eventName ] ) {
			return self;
		}

		if ( ! callback ) {
			delete events[ eventName ];

			return self;
		}

		var callbackIndex = events[ eventName ].indexOf( callback );

		if ( -1 !== callbackIndex ) {
			delete events[ eventName ][ callbackIndex ];
		}

		return self;
	};

	this.trigger = function( eventName ) {
		var methodName = 'on' + eventName[ 0 ].toUpperCase() + eventName.slice( 1 ),
			params = Array.prototype.slice.call( arguments, 1 );

		if ( self[ methodName ] ) {
			self[ methodName ].apply( self, params );
		}

		var callbacks = events[ eventName ];

		if ( ! callbacks ) {
			return;
		}

		$.each( callbacks, function( index, callback ) {
			callback.apply( self, params );
		} );
	};

	init();
};

Module.prototype.__construct = function() {};

Module.prototype.getDefaultSettings = function() {
	return {};
};

Module.extendsCount = 0;

Module.extend = function( properties ) {
	var $ = jQuery,
		parent = this;

	var child = function() {
		return parent.apply( this, arguments );
	};

	$.extend( child, parent );

	child.prototype = Object.create( $.extend( {}, parent.prototype, properties ) );

	child.prototype.constructor = child;

	/*
	 * Constructor ID is used to set an unique ID
     * to every extend of the Module.
     *
	 * It's useful in some cases such as unique
	 * listener for frontend handlers.
	 */
	var constructorID = ++Module.extendsCount;

	child.prototype.getConstructorID = function() {
		return constructorID;
	};

	child.__super__ = parent.prototype;

	return child;
};

module.exports = Module;

},{}],4:[function(require,module,exports){
var Module = require( 'qazana-utils/module' ),
	ViewModule;

ViewModule = Module.extend( {
	elements: null,

	getDefaultElements: function() {
		return {};
	},

	bindEvents: function() {},

	onInit: function() {
		this.initElements();

		this.bindEvents();
	},

	initElements: function() {
		this.elements = this.getDefaultElements();
	}
} );

module.exports = ViewModule;

},{"qazana-utils/module":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvZGV2L2pzL2FkbWluL2FkbWluLmpzIiwiYXNzZXRzL2Rldi9qcy9hZG1pbi9tYWludGVuYW5jZS1tb2RlLmpzIiwiYXNzZXRzL2Rldi9qcy91dGlscy9tb2R1bGUuanMiLCJhc3NldHMvZGV2L2pzL3V0aWxzL3ZpZXctbW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiggZnVuY3Rpb24oICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgUWF6YW5hQWRtaW5BcHAgPSB7XG5cblx0XHRtYWludGVuYW5jZU1vZGU6IG51bGwsXG5cblx0XHRjYWNoZUVsZW1lbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuY2FjaGUgPSB7XG5cdFx0XHRcdCR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0XHQkYm9keTogJCggJ2JvZHknICksXG5cdFx0XHRcdCRzd2l0Y2hNb2RlOiAkKCAnI3FhemFuYS1zd2l0Y2gtbW9kZScgKSxcblx0XHRcdFx0JGdvVG9FZGl0TGluazogJCggJyNxYXphbmEtZ28tdG8tZWRpdC1wYWdlLWxpbmsnICksXG5cdFx0XHRcdCRzd2l0Y2hNb2RlSW5wdXQ6ICQoICcjcWF6YW5hLXN3aXRjaC1tb2RlLWlucHV0JyApLFxuXHRcdFx0XHQkc3dpdGNoTW9kZUJ1dHRvbjogJCggJyNxYXphbmEtc3dpdGNoLW1vZGUtYnV0dG9uJyApLFxuXHRcdFx0XHQkcWF6YW5hTG9hZGVyOiAkKCAnLnFhemFuYS1sb2FkZXInICksXG5cdFx0XHRcdCRidWlsZGVyRWRpdG9yOiAkKCAnI3FhemFuYS1lZGl0b3InICksXG5cdFx0XHRcdCRpbXBvcnRCdXR0b246ICQoICcjcWF6YW5hLWltcG9ydC10ZW1wbGF0ZS10cmlnZ2VyJyApLFxuXHRcdFx0XHQkaW1wb3J0QXJlYTogJCggJyNxYXphbmEtaW1wb3J0LXRlbXBsYXRlLWFyZWEnICksXG5cdFx0XHRcdCRzZXR0aW5nc0Zvcm06ICQoICcjcWF6YW5hLXNldHRpbmdzLWZvcm0nICksXG5cdFx0XHRcdCRzZXR0aW5nc1RhYnNXcmFwcGVyOiAkKCAnI3FhemFuYS1zZXR0aW5ncy10YWJzLXdyYXBwZXInIClcblx0XHRcdH07XG5cblx0XHRcdHRoaXMuY2FjaGUuJHNldHRpbmdzRm9ybVBhZ2VzID0gdGhpcy5jYWNoZS4kc2V0dGluZ3NGb3JtLmZpbmQoICcucWF6YW5hLXNldHRpbmdzLWZvcm0tcGFnZScgKTtcbiAgICAgICAgICAgIFxuXHRcdFx0dGhpcy5jYWNoZS4kYWN0aXZlU2V0dGluZ3NQYWdlID0gdGhpcy5jYWNoZS4kc2V0dGluZ3NGb3JtUGFnZXMuZmlsdGVyKCAnLnFhemFuYS1hY3RpdmUnICk7XG5cblx0XHRcdHRoaXMuY2FjaGUuJHNldHRpbmdzVGFicyA9IHRoaXMuY2FjaGUuJHNldHRpbmdzVGFic1dyYXBwZXIuY2hpbGRyZW4oKTtcblxuXHRcdFx0dGhpcy5jYWNoZS4kYWN0aXZlU2V0dGluZ3NUYWIgPSB0aGlzLmNhY2hlLiRzZXR0aW5nc1RhYnMuZmlsdGVyKCAnLm5hdi10YWItYWN0aXZlJyApO1xuXHRcdH0sXG5cblx0XHR0b2dnbGVTdGF0dXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGlzUWF6YW5hTW9kZSA9IHRoaXMuaXNRYXphbmFNb2RlKCk7XG5cblx0XHRcdHRoaXMuY2FjaGUuJGJvZHlcblx0XHRcdCAgICAudG9nZ2xlQ2xhc3MoICdxYXphbmEtZWRpdG9yLWFjdGl2ZScsIGlzUWF6YW5hTW9kZSApXG5cdFx0XHQgICAgLnRvZ2dsZUNsYXNzKCAncWF6YW5hLWVkaXRvci1pbmFjdGl2ZScsICEgaXNRYXphbmFNb2RlICk7XG5cdFx0fSxcblxuXHRcdGJpbmRFdmVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgXG5cdFx0XHRzZWxmLmNhY2hlLiRzd2l0Y2hNb2RlQnV0dG9uLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0aWYgKCBzZWxmLmlzUWF6YW5hTW9kZSgpICkge1xuXHRcdFx0XHRcdHNlbGYuY2FjaGUuJHN3aXRjaE1vZGVJbnB1dC52YWwoICcnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VsZi5jYWNoZS4kc3dpdGNoTW9kZUlucHV0LnZhbCggdHJ1ZSApO1xuXG5cdFx0XHRcdFx0dmFyICR3cFRpdGxlID0gJCggJyN0aXRsZScgKTtcblxuXHRcdFx0XHRcdGlmICggISAkd3BUaXRsZS52YWwoKSApIHtcblx0XHRcdFx0XHRcdCR3cFRpdGxlLnZhbCggJ1FhemFuYSAjJyArICQoICcjcG9zdF9JRCcgKS52YWwoKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggd3AuYXV0b3NhdmUgKSB7XG5cdFx0XHRcdFx0XHR3cC5hdXRvc2F2ZS5zZXJ2ZXIudHJpZ2dlclNhdmUoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzZWxmLmFuaW1hdGVMb2FkZXIoKTtcblxuXHRcdFx0XHRcdCQoIGRvY3VtZW50ICkub24oICdoZWFydGJlYXQtdGljay5hdXRvc2F2ZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0c2VsZi5jYWNoZS4kd2luZG93Lm9mZiggJ2JlZm9yZXVubG9hZC5lZGl0LXBvc3QnICk7XG5cblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHNlbGYuY2FjaGUuJGdvVG9FZGl0TGluay5hdHRyKCAnaHJlZicgKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzZWxmLnRvZ2dsZVN0YXR1cygpO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRzZWxmLmNhY2hlLiRnb1RvRWRpdExpbmsub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxmLmFuaW1hdGVMb2FkZXIoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JCggJ2Rpdi5ub3RpY2UucWF6YW5hLW1lc3NhZ2UtZGlzbWlzc2VkJyApLm9uKCAnY2xpY2snLCAnYnV0dG9uLm5vdGljZS1kaXNtaXNzJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdCQucG9zdCggYWpheHVybCwge1xuXHRcdFx0XHRcdGFjdGlvbjogJ3FhemFuYV9zZXRfYWRtaW5fbm90aWNlX3ZpZXdlZCcsXG5cdFx0XHRcdFx0bm90aWNlX2lkOiAkKCB0aGlzICkuY2xvc2VzdCggJy5xYXphbmEtbWVzc2FnZS1kaXNtaXNzZWQnICkuZGF0YSggJ25vdGljZV9pZCcgKVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCQoICcjcWF6YW5hLWNsZWFyLWNhY2hlLWJ1dHRvbicgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgJHRoaXNCdXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0JHRoaXNCdXR0b24ucmVtb3ZlQ2xhc3MoICdzdWNjZXNzJyApLmFkZENsYXNzKCAnbG9hZGluZycgKTtcblxuXHRcdFx0XHQkLnBvc3QoIGFqYXh1cmwsIHtcblx0XHRcdFx0XHRhY3Rpb246ICdxYXphbmFfY2xlYXJfY2FjaGUnLFxuXHRcdFx0XHRcdF9ub25jZTogJHRoaXNCdXR0b24uZGF0YSggJ25vbmNlJyApXG5cdFx0XHRcdH0gKVxuXHRcdFx0XHRcdC5kb25lKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCR0aGlzQnV0dG9uLnJlbW92ZUNsYXNzKCAnbG9hZGluZycgKS5hZGRDbGFzcyggJ3N1Y2Nlc3MnICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkKCAnI3FhemFuYS1saWJyYXJ5LXN5bmMtYnV0dG9uJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciAkdGhpc0J1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQkdGhpc0J1dHRvbi5yZW1vdmVDbGFzcyggJ3N1Y2Nlc3MnICkuYWRkQ2xhc3MoICdsb2FkaW5nJyApO1xuXG5cdFx0XHRcdCQucG9zdCggYWpheHVybCwge1xuXHRcdFx0XHRcdGFjdGlvbjogJ3FhemFuYV9yZXNldF9saWJyYXJ5Jyxcblx0XHRcdFx0XHRfbm9uY2U6ICR0aGlzQnV0dG9uLmRhdGEoICdub25jZScgKVxuXHRcdFx0XHR9IClcblx0XHRcdFx0XHQuZG9uZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkdGhpc0J1dHRvbi5yZW1vdmVDbGFzcyggJ2xvYWRpbmcnICkuYWRkQ2xhc3MoICdzdWNjZXNzJyApO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JCggJyNxYXphbmEtcmVwbGFjZS11cmwtYnV0dG9uJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcblx0XHRcdFx0XHQkdHIgPSAkdGhpcy5wYXJlbnRzKCAndHInICksXG5cdFx0XHRcdFx0JGZyb20gPSAkdHIuZmluZCggJ1tuYW1lPVwiZnJvbVwiXScgKSxcblx0XHRcdFx0XHQkdG8gPSAkdHIuZmluZCggJ1tuYW1lPVwidG9cIl0nICk7XG5cblx0XHRcdFx0JHRoaXMucmVtb3ZlQ2xhc3MoICdzdWNjZXNzJyApLmFkZENsYXNzKCAnbG9hZGluZycgKTtcblxuXHRcdFx0XHQkLnBvc3QoIGFqYXh1cmwsIHtcblx0XHRcdFx0XHRhY3Rpb246ICdxYXphbmFfcmVwbGFjZV91cmwnLFxuXHRcdFx0XHRcdGZyb206ICRmcm9tLnZhbCgpLFxuXHRcdFx0XHRcdHRvOiAkdG8udmFsKCksXG5cdFx0XHRcdFx0X25vbmNlOiAkdGhpcy5kYXRhKCAnbm9uY2UnIClcblx0XHRcdFx0fSApXG5cdFx0XHRcdFx0LmRvbmUoIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRcdCR0aGlzLnJlbW92ZUNsYXNzKCAnbG9hZGluZycgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCByZXNwb25zZS5zdWNjZXNzICkge1xuXHRcdFx0XHRcdFx0XHQkdGhpcy5hZGRDbGFzcyggJ3N1Y2Nlc3MnICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHZhciBkaWFsb2dzTWFuYWdlciA9IG5ldyBEaWFsb2dzTWFuYWdlci5JbnN0YW5jZSgpO1xuXHRcdFx0XHRcdFx0XHRkaWFsb2dzTWFuYWdlci5jcmVhdGVXaWRnZXQoICdhbGVydCcsIHtcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiByZXNwb25zZS5kYXRhXG5cdFx0XHRcdFx0XHRcdH0gKS5zaG93KCk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRzZWxmLmNhY2hlLiRzZXR0aW5nc1RhYnMub24oIHtcblx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0ZXZlbnQuY3VycmVudFRhcmdldC5mb2N1cygpOyAvLyBTYWZhcmkgZG9lcyBub3QgZm9jdXMgdGhlIHRhYiBhdXRvbWF0aWNhbGx5XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvY3VzOiBmdW5jdGlvbigpIHsgLy8gVXNpbmcgZm9jdXMgZXZlbnQgdG8gZW5hYmxlIG5hdmlnYXRpb24gYnkgdGFiIGtleVxuXHRcdFx0XHRcdHZhciBocmVmV2l0aG91dEhhc2ggPSBsb2NhdGlvbi5ocmVmLnJlcGxhY2UoIC8jLiovLCAnJyApO1xuXG5cdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgaHJlZldpdGhvdXRIYXNoICsgdGhpcy5oYXNoICk7XG5cblx0XHRcdFx0XHRzZWxmLmdvVG9TZXR0aW5nc1RhYkZyb21IYXNoKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0JCggJy5xYXphbmEtcm9sbGJhY2stYnV0dG9uJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApLFxuXHRcdFx0XHRcdGRpYWxvZ3NNYW5hZ2VyID0gbmV3IERpYWxvZ3NNYW5hZ2VyLkluc3RhbmNlKCk7XG5cblx0XHRcdFx0ZGlhbG9nc01hbmFnZXIuY3JlYXRlV2lkZ2V0KCAnY29uZmlybScsIHtcblx0XHRcdFx0XHRoZWFkZXJNZXNzYWdlOiBRYXphbmFBZG1pbkNvbmZpZy5pMThuLnJvbGxiYWNrX3RvX3ByZXZpb3VzX3ZlcnNpb24sXG5cdFx0XHRcdFx0bWVzc2FnZTogUWF6YW5hQWRtaW5Db25maWcuaTE4bi5yb2xsYmFja19jb25maXJtLFxuXHRcdFx0XHRcdHN0cmluZ3M6IHtcblx0XHRcdFx0XHRcdGNvbmZpcm06IFFhemFuYUFkbWluQ29uZmlnLmkxOG4ueWVzLFxuXHRcdFx0XHRcdFx0Y2FuY2VsOiBRYXphbmFBZG1pbkNvbmZpZy5pMThuLmNhbmNlbFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0b25Db25maXJtOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCR0aGlzLmFkZENsYXNzKCAnbG9hZGluZycgKTtcblxuXHRcdFx0XHRcdFx0bG9jYXRpb24uaHJlZiA9ICR0aGlzLmF0dHIoICdocmVmJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApLnNob3coKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JCggJy5xYXphbmFfY3NzX3ByaW50X21ldGhvZCBzZWxlY3QnICkub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyICRkZXNjcmlwdGlvbnMgPSAkKCAnLnFhemFuYS1jc3MtcHJpbnQtbWV0aG9kLWRlc2NyaXB0aW9uJyApO1xuXG5cdFx0XHRcdCRkZXNjcmlwdGlvbnMuaGlkZSgpO1xuXHRcdFx0XHQkZGVzY3JpcHRpb25zLmZpbHRlciggJ1tkYXRhLXZhbHVlPVwiJyArICQoIHRoaXMgKS52YWwoKSArICdcIl0nICkuc2hvdygpO1xuXHRcdFx0fSApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdFx0fSxcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5jYWNoZUVsZW1lbnRzKCk7XG5cblx0XHRcdHRoaXMuYmluZEV2ZW50cygpO1xuXG5cdFx0XHR0aGlzLmluaXRUZW1wbGF0ZXNJbXBvcnQoKTtcblxuXHRcdFx0dGhpcy5pbml0TWFpbnRlbmFuY2VNb2RlKCk7XG5cblx0XHRcdHRoaXMuZ29Ub1NldHRpbmdzVGFiRnJvbUhhc2goKTtcblx0XHR9LFxuXG5cdFx0aW5pdFRlbXBsYXRlc0ltcG9ydDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgdGhpcy5jYWNoZS4kYm9keS5oYXNDbGFzcyggJ3Bvc3QtdHlwZS1xYXphbmFfbGlicmFyeScgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRcdCRpbXBvcnRCdXR0b24gPSBzZWxmLmNhY2hlLiRpbXBvcnRCdXR0b24sXG5cdFx0XHRcdCRpbXBvcnRBcmVhID0gc2VsZi5jYWNoZS4kaW1wb3J0QXJlYTtcblxuXHRcdFx0c2VsZi5jYWNoZS4kZm9ybUFuY2hvciA9ICQoICdoMScgKTtcblxuXHRcdFx0JCggJyN3cGJvZHktY29udGVudCcgKS5maW5kKCAnLnBhZ2UtdGl0bGUtYWN0aW9uOmxhc3QnICkuYWZ0ZXIoICRpbXBvcnRCdXR0b24gKTtcblxuXHRcdFx0c2VsZi5jYWNoZS4kZm9ybUFuY2hvci5hZnRlciggJGltcG9ydEFyZWEgKTtcblxuXHRcdFx0JGltcG9ydEJ1dHRvbi5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoICcjcWF6YW5hLWltcG9ydC10ZW1wbGF0ZS1hcmVhJyApLnRvZ2dsZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cblx0XHRpbml0TWFpbnRlbmFuY2VNb2RlOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBNYWludGVuYW5jZU1vZGUgPSByZXF1aXJlKCAnLi9tYWludGVuYW5jZS1tb2RlJyApO1xuXG5cdFx0XHR0aGlzLm1haW50ZW5hbmNlTW9kZSA9IG5ldyBNYWludGVuYW5jZU1vZGUoKTtcblx0XHR9LFxuXG5cdFx0aXNRYXphbmFNb2RlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAhISB0aGlzLmNhY2hlLiRzd2l0Y2hNb2RlSW5wdXQudmFsKCk7XG5cdFx0fSxcblxuXHRcdGFuaW1hdGVMb2FkZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5jYWNoZS4kZ29Ub0VkaXRMaW5rLmFkZENsYXNzKCAncWF6YW5hLWFuaW1hdGUnICk7XG5cdFx0fSxcblxuXHRcdGdvVG9TZXR0aW5nc1RhYkZyb21IYXNoOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBoYXNoID0gbG9jYXRpb24uaGFzaC5zbGljZSggMSApO1xuXG5cdFx0XHRpZiAoIGhhc2ggKSB7XG5cdFx0XHRcdHRoaXMuZ29Ub1NldHRpbmdzVGFiKCBoYXNoICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGdvVG9TZXR0aW5nc1RhYjogZnVuY3Rpb24oIHRhYk5hbWUgKSB7XG5cdFx0XHR2YXIgJGFjdGl2ZVBhZ2UgPSB0aGlzLmNhY2hlLiRzZXR0aW5nc0Zvcm1QYWdlcy5maWx0ZXIoICcjJyArIHRhYk5hbWUgKTtcblxuXHRcdFx0aWYgKCAhICRhY3RpdmVQYWdlLmxlbmd0aCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmNhY2hlLiRhY3RpdmVTZXR0aW5nc1BhZ2UucmVtb3ZlQ2xhc3MoICdxYXphbmEtYWN0aXZlJyApO1xuXG5cdFx0XHR0aGlzLmNhY2hlLiRhY3RpdmVTZXR0aW5nc1RhYi5yZW1vdmVDbGFzcyggJ25hdi10YWItYWN0aXZlJyApO1xuXG5cdFx0XHR2YXIgJGFjdGl2ZVRhYiA9IHRoaXMuY2FjaGUuJHNldHRpbmdzVGFicy5maWx0ZXIoICcjcWF6YW5hLXNldHRpbmdzLScgKyB0YWJOYW1lICk7XG5cblx0XHRcdCRhY3RpdmVQYWdlLmFkZENsYXNzKCAncWF6YW5hLWFjdGl2ZScgKTtcblxuXHRcdFx0JGFjdGl2ZVRhYi5hZGRDbGFzcyggJ25hdi10YWItYWN0aXZlJyApO1xuXG5cdFx0XHR0aGlzLmNhY2hlLiRzZXR0aW5nc0Zvcm0uYXR0ciggJ2FjdGlvbicsICdvcHRpb25zLnBocCMnICsgdGFiTmFtZSAgKTtcblxuXHRcdFx0dGhpcy5jYWNoZS4kYWN0aXZlU2V0dGluZ3NQYWdlID0gJGFjdGl2ZVBhZ2U7XG5cblx0XHRcdHRoaXMuY2FjaGUuJGFjdGl2ZVNldHRpbmdzVGFiID0gJGFjdGl2ZVRhYjtcblx0XHR9XG5cdH07XG5cblx0JCggZnVuY3Rpb24oKSB7XG5cdFx0UWF6YW5hQWRtaW5BcHAuaW5pdCgpO1xuXHR9ICk7XG5cblx0d2luZG93LnFhemFuYUFkbWluID0gUWF6YW5hQWRtaW5BcHA7XG59KCBqUXVlcnkgKSApO1xuIiwidmFyIFZpZXdNb2R1bGUgPSByZXF1aXJlKCAncWF6YW5hLXV0aWxzL3ZpZXctbW9kdWxlJyApLFxuXHRNYWludGVuYW5jZU1vZGVNb2R1bGU7XG5cbk1haW50ZW5hbmNlTW9kZU1vZHVsZSA9IFZpZXdNb2R1bGUuZXh0ZW5kKCB7XG5cdGdldERlZmF1bHRTZXR0aW5nczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbGVjdG9yczoge1xuXHRcdFx0XHRtb2RlU2VsZWN0OiAnLnFhemFuYV9tYWludGVuYW5jZV9tb2RlX21vZGUgc2VsZWN0Jyxcblx0XHRcdFx0bWFpbnRlbmFuY2VNb2RlVGFibGU6ICcjdGFiLW1haW50ZW5hbmNlX21vZGUgdGFibGUnLFxuXHRcdFx0XHRtYWludGVuYW5jZU1vZGVEZXNjcmlwdGlvbnM6ICcucWF6YW5hLW1haW50ZW5hbmNlLW1vZGUtZGVzY3JpcHRpb24nLFxuXHRcdFx0XHRleGNsdWRlTW9kZVNlbGVjdDogJy5xYXphbmFfbWFpbnRlbmFuY2VfbW9kZV9leGNsdWRlX21vZGUgc2VsZWN0Jyxcblx0XHRcdFx0ZXhjbHVkZVJvbGVzQXJlYTogJy5xYXphbmFfbWFpbnRlbmFuY2VfbW9kZV9leGNsdWRlX3JvbGVzJyxcblx0XHRcdFx0dGVtcGxhdGVTZWxlY3Q6ICcucWF6YW5hX21haW50ZW5hbmNlX21vZGVfdGVtcGxhdGVfaWQgc2VsZWN0Jyxcblx0XHRcdFx0ZWRpdFRlbXBsYXRlQnV0dG9uOiAnLnFhemFuYS1lZGl0LXRlbXBsYXRlJyxcblx0XHRcdFx0bWFpbnRlbmFuY2VNb2RlRXJyb3I6ICcucWF6YW5hLW1haW50ZW5hbmNlLW1vZGUtZXJyb3InXG5cdFx0XHR9LFxuXHRcdFx0Y2xhc3Nlczoge1xuXHRcdFx0XHRpc0VuYWJsZWQ6ICdxYXphbmEtbWFpbnRlbmFuY2UtbW9kZS1pcy1lbmFibGVkJ1xuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Z2V0RGVmYXVsdEVsZW1lbnRzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZWxlbWVudHMgPSB7fSxcblx0XHRcdHNlbGVjdG9ycyA9IHRoaXMuZ2V0U2V0dGluZ3MoICdzZWxlY3RvcnMnICk7XG5cblx0XHRlbGVtZW50cy4kbW9kZVNlbGVjdCA9IGpRdWVyeSggc2VsZWN0b3JzLm1vZGVTZWxlY3QgKTtcblx0XHRlbGVtZW50cy4kbWFpbnRlbmFuY2VNb2RlVGFibGUgPSBlbGVtZW50cy4kbW9kZVNlbGVjdC5wYXJlbnRzKCBzZWxlY3RvcnMubWFpbnRlbmFuY2VNb2RlVGFibGUgKTtcblx0XHRlbGVtZW50cy4kZXhjbHVkZU1vZGVTZWxlY3QgPSBlbGVtZW50cy4kbWFpbnRlbmFuY2VNb2RlVGFibGUuZmluZCggc2VsZWN0b3JzLmV4Y2x1ZGVNb2RlU2VsZWN0ICk7XG5cdFx0ZWxlbWVudHMuJGV4Y2x1ZGVSb2xlc0FyZWEgPSBlbGVtZW50cy4kbWFpbnRlbmFuY2VNb2RlVGFibGUuZmluZCggc2VsZWN0b3JzLmV4Y2x1ZGVSb2xlc0FyZWEgKTtcblx0XHRlbGVtZW50cy4kdGVtcGxhdGVTZWxlY3QgPSBlbGVtZW50cy4kbWFpbnRlbmFuY2VNb2RlVGFibGUuZmluZCggc2VsZWN0b3JzLnRlbXBsYXRlU2VsZWN0ICk7XG5cdFx0ZWxlbWVudHMuJGVkaXRUZW1wbGF0ZUJ1dHRvbiA9IGVsZW1lbnRzLiRtYWludGVuYW5jZU1vZGVUYWJsZS5maW5kKCBzZWxlY3RvcnMuZWRpdFRlbXBsYXRlQnV0dG9uICk7XG5cdFx0ZWxlbWVudHMuJG1haW50ZW5hbmNlTW9kZURlc2NyaXB0aW9ucyA9IGVsZW1lbnRzLiRtYWludGVuYW5jZU1vZGVUYWJsZS5maW5kKCBzZWxlY3RvcnMubWFpbnRlbmFuY2VNb2RlRGVzY3JpcHRpb25zICk7XG5cdFx0ZWxlbWVudHMuJG1haW50ZW5hbmNlTW9kZUVycm9yID0gZWxlbWVudHMuJG1haW50ZW5hbmNlTW9kZVRhYmxlLmZpbmQoIHNlbGVjdG9ycy5tYWludGVuYW5jZU1vZGVFcnJvciApO1xuXG5cdFx0cmV0dXJuIGVsZW1lbnRzO1xuXHR9LFxuXG5cdGJpbmRFdmVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZXR0aW5ncyA9IHRoaXMuZ2V0U2V0dGluZ3MoKSxcblx0XHRcdGVsZW1lbnRzID0gdGhpcy5lbGVtZW50cztcblxuXHRcdGVsZW1lbnRzLiRtb2RlU2VsZWN0Lm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRlbGVtZW50cy4kbWFpbnRlbmFuY2VNb2RlVGFibGUudG9nZ2xlQ2xhc3MoIHNldHRpbmdzLmNsYXNzZXMuaXNFbmFibGVkLCAhISBlbGVtZW50cy4kbW9kZVNlbGVjdC52YWwoKSApO1xuXHRcdFx0ZWxlbWVudHMuJG1haW50ZW5hbmNlTW9kZURlc2NyaXB0aW9ucy5oaWRlKCk7XG5cdFx0XHRlbGVtZW50cy4kbWFpbnRlbmFuY2VNb2RlRGVzY3JpcHRpb25zLmZpbHRlciggJ1tkYXRhLXZhbHVlPVwiJyArIGVsZW1lbnRzLiRtb2RlU2VsZWN0LnZhbCgpICsgJ1wiXScgKS5zaG93KCk7XG5cdFx0fSApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cblx0XHRlbGVtZW50cy4kZXhjbHVkZU1vZGVTZWxlY3Qub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGVsZW1lbnRzLiRleGNsdWRlUm9sZXNBcmVhLnRvZ2dsZSggJ2N1c3RvbScgPT09IGVsZW1lbnRzLiRleGNsdWRlTW9kZVNlbGVjdC52YWwoKSApO1xuXHRcdH0gKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXG5cdFx0ZWxlbWVudHMuJHRlbXBsYXRlU2VsZWN0Lm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdGVtcGxhdGVJRCA9IGVsZW1lbnRzLiR0ZW1wbGF0ZVNlbGVjdC52YWwoKTtcblxuXHRcdFx0aWYgKCAhIHRlbXBsYXRlSUQgKSB7XG5cdFx0XHRcdGVsZW1lbnRzLiRlZGl0VGVtcGxhdGVCdXR0b24uaGlkZSgpO1xuXHRcdFx0XHRlbGVtZW50cy4kbWFpbnRlbmFuY2VNb2RlRXJyb3Iuc2hvdygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHZhciBlZGl0VXJsID0gUWF6YW5hQWRtaW5Db25maWcuaG9tZV91cmwgKyAnP3A9JyArIHRlbXBsYXRlSUQgKyAnJnFhemFuYSc7XG5cblx0XHRcdGVsZW1lbnRzLiRlZGl0VGVtcGxhdGVCdXR0b25cblx0XHRcdFx0LnByb3AoICdocmVmJywgZWRpdFVybCApXG5cdFx0XHRcdC5zaG93KCk7XG5cdFx0XHRlbGVtZW50cy4kbWFpbnRlbmFuY2VNb2RlRXJyb3IuaGlkZSgpO1xuXHRcdH0gKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHR9XG59ICk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFpbnRlbmFuY2VNb2RlTW9kdWxlO1xuIiwidmFyIE1vZHVsZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgJCA9IGpRdWVyeSxcblx0XHRpbnN0YW5jZVBhcmFtcyA9IGFyZ3VtZW50cyxcblx0XHRzZWxmID0gdGhpcyxcblx0XHRzZXR0aW5ncyxcblx0XHRldmVudHMgPSB7fTtcblxuXHR2YXIgZW5zdXJlQ2xvc3VyZU1ldGhvZHMgPSBmdW5jdGlvbigpIHtcblx0XHQkLmVhY2goIHNlbGYsIGZ1bmN0aW9uKCBtZXRob2ROYW1lICkge1xuXHRcdFx0dmFyIG9sZE1ldGhvZCA9IHNlbGZbIG1ldGhvZE5hbWUgXTtcblxuXHRcdFx0aWYgKCAnZnVuY3Rpb24nICE9PSB0eXBlb2Ygb2xkTWV0aG9kICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHNlbGZbIG1ldGhvZE5hbWUgXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gb2xkTWV0aG9kLmFwcGx5KCBzZWxmLCBhcmd1bWVudHMgKTtcblx0XHRcdH07XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGluaXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuXHRcdHNldHRpbmdzID0gc2VsZi5nZXREZWZhdWx0U2V0dGluZ3MoKTtcblxuXHRcdHZhciBpbnN0YW5jZVNldHRpbmdzID0gaW5zdGFuY2VQYXJhbXNbMF07XG5cblx0XHRpZiAoIGluc3RhbmNlU2V0dGluZ3MgKSB7XG5cdFx0XHQkLmV4dGVuZCggc2V0dGluZ3MsIGluc3RhbmNlU2V0dGluZ3MgKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRzZWxmLl9fY29uc3RydWN0LmFwcGx5KCBzZWxmLCBpbnN0YW5jZVBhcmFtcyApO1xuXG5cdFx0ZW5zdXJlQ2xvc3VyZU1ldGhvZHMoKTtcblxuXHRcdGluaXRTZXR0aW5ncygpO1xuXG5cdFx0c2VsZi50cmlnZ2VyKCAnaW5pdCcgKTtcblx0fTtcblxuXHR0aGlzLmdldEl0ZW1zID0gZnVuY3Rpb24oIGl0ZW1zLCBpdGVtS2V5ICkge1xuXHRcdGlmICggaXRlbUtleSApIHtcblx0XHRcdHZhciBrZXlTdGFjayA9IGl0ZW1LZXkuc3BsaXQoICcuJyApLFxuXHRcdFx0XHRjdXJyZW50S2V5ID0ga2V5U3RhY2suc3BsaWNlKCAwLCAxICk7XG5cblx0XHRcdGlmICggISBrZXlTdGFjay5sZW5ndGggKSB7XG5cdFx0XHRcdHJldHVybiBpdGVtc1sgY3VycmVudEtleSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgaXRlbXNbIGN1cnJlbnRLZXkgXSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5nZXRJdGVtcyggIGl0ZW1zWyBjdXJyZW50S2V5IF0sIGtleVN0YWNrLmpvaW4oICcuJyApICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGl0ZW1zO1xuXHR9O1xuXG5cdHRoaXMuZ2V0U2V0dGluZ3MgPSBmdW5jdGlvbiggc2V0dGluZyApIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRJdGVtcyggc2V0dGluZ3MsIHNldHRpbmcgKTtcblx0fTtcblxuXHR0aGlzLnNldFNldHRpbmdzID0gZnVuY3Rpb24oIHNldHRpbmdLZXksIHZhbHVlLCBzZXR0aW5nc0NvbnRhaW5lciApIHtcblx0XHRpZiAoICEgc2V0dGluZ3NDb250YWluZXIgKSB7XG5cdFx0XHRzZXR0aW5nc0NvbnRhaW5lciA9IHNldHRpbmdzO1xuXHRcdH1cblxuXHRcdGlmICggJ29iamVjdCcgPT09IHR5cGVvZiBzZXR0aW5nS2V5ICkge1xuXHRcdFx0JC5leHRlbmQoIHNldHRpbmdzQ29udGFpbmVyLCBzZXR0aW5nS2V5ICk7XG5cblx0XHRcdHJldHVybiBzZWxmO1xuXHRcdH1cblxuXHRcdHZhciBrZXlTdGFjayA9IHNldHRpbmdLZXkuc3BsaXQoICcuJyApLFxuXHRcdFx0Y3VycmVudEtleSA9IGtleVN0YWNrLnNwbGljZSggMCwgMSApO1xuXG5cdFx0aWYgKCAhIGtleVN0YWNrLmxlbmd0aCApIHtcblx0XHRcdHNldHRpbmdzQ29udGFpbmVyWyBjdXJyZW50S2V5IF0gPSB2YWx1ZTtcblxuXHRcdFx0cmV0dXJuIHNlbGY7XG5cdFx0fVxuXG5cdFx0aWYgKCAhIHNldHRpbmdzQ29udGFpbmVyWyBjdXJyZW50S2V5IF0gKSB7XG5cdFx0XHRzZXR0aW5nc0NvbnRhaW5lclsgY3VycmVudEtleSBdID0ge307XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNlbGYuc2V0U2V0dGluZ3MoIGtleVN0YWNrLmpvaW4oICcuJyApLCB2YWx1ZSwgc2V0dGluZ3NDb250YWluZXJbIGN1cnJlbnRLZXkgXSApO1xuXHR9O1xuXG5cdHRoaXMuZm9yY2VNZXRob2RJbXBsZW1lbnRhdGlvbiA9IGZ1bmN0aW9uKCBtZXRob2RBcmd1bWVudHMgKSB7XG5cdFx0dmFyIGZ1bmN0aW9uTmFtZSA9IG1ldGhvZEFyZ3VtZW50cy5jYWxsZWUubmFtZTtcblxuXHRcdHRocm93IG5ldyBSZWZlcmVuY2VFcnJvciggJ1RoZSBtZXRob2QgJyArIGZ1bmN0aW9uTmFtZSArICcgbXVzdCB0byBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgaW5oZXJpdG9yIGNoaWxkLicgKTtcblx0fTtcblxuXHR0aGlzLm9uID0gZnVuY3Rpb24oIGV2ZW50TmFtZSwgY2FsbGJhY2sgKSB7XG5cdFx0aWYgKCAhIGV2ZW50c1sgZXZlbnROYW1lIF0gKSB7XG5cdFx0XHRldmVudHNbIGV2ZW50TmFtZSBdID0gW107XG5cdFx0fVxuXG5cdFx0ZXZlbnRzWyBldmVudE5hbWUgXS5wdXNoKCBjYWxsYmFjayApO1xuXG5cdFx0cmV0dXJuIHNlbGY7XG5cdH07XG5cblx0dGhpcy5vZmYgPSBmdW5jdGlvbiggZXZlbnROYW1lLCBjYWxsYmFjayApIHtcblx0XHRpZiAoICEgZXZlbnRzWyBldmVudE5hbWUgXSApIHtcblx0XHRcdHJldHVybiBzZWxmO1xuXHRcdH1cblxuXHRcdGlmICggISBjYWxsYmFjayApIHtcblx0XHRcdGRlbGV0ZSBldmVudHNbIGV2ZW50TmFtZSBdO1xuXG5cdFx0XHRyZXR1cm4gc2VsZjtcblx0XHR9XG5cblx0XHR2YXIgY2FsbGJhY2tJbmRleCA9IGV2ZW50c1sgZXZlbnROYW1lIF0uaW5kZXhPZiggY2FsbGJhY2sgKTtcblxuXHRcdGlmICggLTEgIT09IGNhbGxiYWNrSW5kZXggKSB7XG5cdFx0XHRkZWxldGUgZXZlbnRzWyBldmVudE5hbWUgXVsgY2FsbGJhY2tJbmRleCBdO1xuXHRcdH1cblxuXHRcdHJldHVybiBzZWxmO1xuXHR9O1xuXG5cdHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uKCBldmVudE5hbWUgKSB7XG5cdFx0dmFyIG1ldGhvZE5hbWUgPSAnb24nICsgZXZlbnROYW1lWyAwIF0udG9VcHBlckNhc2UoKSArIGV2ZW50TmFtZS5zbGljZSggMSApLFxuXHRcdFx0cGFyYW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuXG5cdFx0aWYgKCBzZWxmWyBtZXRob2ROYW1lIF0gKSB7XG5cdFx0XHRzZWxmWyBtZXRob2ROYW1lIF0uYXBwbHkoIHNlbGYsIHBhcmFtcyApO1xuXHRcdH1cblxuXHRcdHZhciBjYWxsYmFja3MgPSBldmVudHNbIGV2ZW50TmFtZSBdO1xuXG5cdFx0aWYgKCAhIGNhbGxiYWNrcyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLmVhY2goIGNhbGxiYWNrcywgZnVuY3Rpb24oIGluZGV4LCBjYWxsYmFjayApIHtcblx0XHRcdGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBwYXJhbXMgKTtcblx0XHR9ICk7XG5cdH07XG5cblx0aW5pdCgpO1xufTtcblxuTW9kdWxlLnByb3RvdHlwZS5fX2NvbnN0cnVjdCA9IGZ1bmN0aW9uKCkge307XG5cbk1vZHVsZS5wcm90b3R5cGUuZ2V0RGVmYXVsdFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7fTtcbn07XG5cbk1vZHVsZS5leHRlbmRzQ291bnQgPSAwO1xuXG5Nb2R1bGUuZXh0ZW5kID0gZnVuY3Rpb24oIHByb3BlcnRpZXMgKSB7XG5cdHZhciAkID0galF1ZXJ5LFxuXHRcdHBhcmVudCA9IHRoaXM7XG5cblx0dmFyIGNoaWxkID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHBhcmVudC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdH07XG5cblx0JC5leHRlbmQoIGNoaWxkLCBwYXJlbnQgKTtcblxuXHRjaGlsZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCAkLmV4dGVuZCgge30sIHBhcmVudC5wcm90b3R5cGUsIHByb3BlcnRpZXMgKSApO1xuXG5cdGNoaWxkLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNoaWxkO1xuXG5cdC8qXG5cdCAqIENvbnN0cnVjdG9yIElEIGlzIHVzZWQgdG8gc2V0IGFuIHVuaXF1ZSBJRFxuICAgICAqIHRvIGV2ZXJ5IGV4dGVuZCBvZiB0aGUgTW9kdWxlLlxuICAgICAqXG5cdCAqIEl0J3MgdXNlZnVsIGluIHNvbWUgY2FzZXMgc3VjaCBhcyB1bmlxdWVcblx0ICogbGlzdGVuZXIgZm9yIGZyb250ZW5kIGhhbmRsZXJzLlxuXHQgKi9cblx0dmFyIGNvbnN0cnVjdG9ySUQgPSArK01vZHVsZS5leHRlbmRzQ291bnQ7XG5cblx0Y2hpbGQucHJvdG90eXBlLmdldENvbnN0cnVjdG9ySUQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gY29uc3RydWN0b3JJRDtcblx0fTtcblxuXHRjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xuXG5cdHJldHVybiBjaGlsZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kdWxlO1xuIiwidmFyIE1vZHVsZSA9IHJlcXVpcmUoICdxYXphbmEtdXRpbHMvbW9kdWxlJyApLFxuXHRWaWV3TW9kdWxlO1xuXG5WaWV3TW9kdWxlID0gTW9kdWxlLmV4dGVuZCgge1xuXHRlbGVtZW50czogbnVsbCxcblxuXHRnZXREZWZhdWx0RWxlbWVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7fTtcblx0fSxcblxuXHRiaW5kRXZlbnRzOiBmdW5jdGlvbigpIHt9LFxuXG5cdG9uSW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pbml0RWxlbWVudHMoKTtcblxuXHRcdHRoaXMuYmluZEV2ZW50cygpO1xuXHR9LFxuXG5cdGluaXRFbGVtZW50czogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5lbGVtZW50cyA9IHRoaXMuZ2V0RGVmYXVsdEVsZW1lbnRzKCk7XG5cdH1cbn0gKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3TW9kdWxlO1xuIl19
