( function( $ ) {
	var ViewModule = require( 'qazana-utils/view-module' );

	var QazanaAdmin = ViewModule.extend( {

		maintenanceMode: null,

		config: QazanaAdminConfig,

		getDefaultElements: function() {
			var elements = {
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
				$settingsTabsWrapper: $( '#qazana-settings-tabs-wrapper' ),
			};

			elements.$settingsFormPages = elements.$settingsForm.find( '.qazana-settings-form-page' );

			elements.$activeSettingsPage = elements.$settingsFormPages.filter( '.qazana-active' );

			elements.$settingsTabs = elements.$settingsTabsWrapper.children();

			elements.$activeSettingsTab = elements.$settingsTabs.filter( '.nav-tab-active' );

			return elements;
		},

		toggleStatus: function() {
			var isQazanaMode = this.isQazanaMode();

			this.elements.$body
				.toggleClass( 'qazana-editor-active', isQazanaMode )
				.toggleClass( 'qazana-editor-inactive', ! isQazanaMode );
		},

		bindEvents: function() {
			var self = this;

			self.elements.$switchModeButton.on( 'click', function( event ) {
				event.preventDefault();

				if ( self.isQazanaMode() ) {
					self.elements.$switchModeInput.val( '' );
				} else {
					self.elements.$switchModeInput.val( true );

					var $wpTitle = $( '#title' );

					if ( ! $wpTitle.val() ) {
						$wpTitle.val( 'Qazana #' + $( '#post_ID' ).val() );
					}

					if ( wp.autosave ) {
						wp.autosave.server.triggerSave();
					}

					self.animateLoader();

					$( document ).on( 'heartbeat-tick.autosave', function() {
						self.elements.$window.off( 'beforeunload.edit-post' );

						location.href = self.elements.$goToEditLink.attr( 'href' );
					} );
				}

				self.toggleStatus();
			} );

			self.elements.$goToEditLink.on( 'click', function() {
				self.animateLoader();
			} );

			$( 'div.notice.qazana-message-dismissed' ).on( 'click', 'button.notice-dismiss, .qazana-button-notice-dismiss', function( event ) {
				event.preventDefault();

				$.post( ajaxurl, {
					action: 'qazana_set_admin_notice_viewed',
					notice_id: $( this ).closest( '.qazana-message-dismissed' ).data( 'notice_id' ),
				} );

				var $wrapperElm = $( this ).closest( '.qazana-message-dismissed' );
				$wrapperElm.fadeTo( 100, 0, function() {
					$wrapperElm.slideUp( 100, function() {
						$wrapperElm.remove();
					} );
				} );
			} );

			$( '#qazana-clear-cache-button' ).on( 'click', function( event ) {
				event.preventDefault();
				var $thisButton = $( this );

				$thisButton.removeClass( 'success' ).addClass( 'loading' );

				$.post( ajaxurl, {
					action: 'qazana_clear_cache',
					_nonce: $thisButton.data( 'nonce' ),
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
					_nonce: $thisButton.data( 'nonce' ),
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
					_nonce: $this.data( 'nonce' ),
				} )
					.done( function( response ) {
						$this.removeClass( 'loading' );

						if ( response.success ) {
							$this.addClass( 'success' );
						}

						self.getDialogsManager().createWidget( 'alert', {
								message: response.data,
							} ).show();
					} );
			} );

			self.elements.$settingsTabs.on( {
				click: function( event ) {
					event.preventDefault();

					event.currentTarget.focus(); // Safari does not focus the tab automatically
				},
				focus: function() { // Using focus event to enable navigation by tab key
					var hrefWithoutHash = location.href.replace( /#.*/, '' );

					history.pushState( {}, '', hrefWithoutHash + this.hash );

					self.goToSettingsTabFromHash();
				},
			} );

			$( '.qazana-rollback-button' ).on( 'click', function( event ) {
				event.preventDefault();

				var $this = $( this );

				self.getDialogsManager().createWidget( 'confirm', {
					headerMessage: self.config.i18n.rollback_to_previous_version,
					message: self.config.i18n.rollback_confirm,
					strings: {
						confirm: self.config.i18n.yes,
						cancel: self.config.i18n.cancel,
					},
					onConfirm: function() {
						$this.addClass( 'loading' );

						location.href = $this.attr( 'href' );
					},
				} ).show();
			} );

			$( '.qazana_css_print_method select' ).on( 'change', function() {
				var $descriptions = $( '.qazana-css-print-method-description' );

				$descriptions.hide();
				$descriptions.filter( '[data-value="' + $( this ).val() + '"]' ).show();
			} ).trigger( 'change' );
		},

		setMarionetteTemplateCompiler: function() {
			if ( 'undefined' !== typeof Marionette ) {
				Marionette.TemplateCache.prototype.compileTemplate = function( rawTemplate, options ) {
					options = {
						evaluate: /<#([\s\S]+?)#>/g,
						interpolate: /{{{([\s\S]+?)}}}/g,
						escape: /{{([^}]+?)}}(?!})/g,
					};

					return _.template( rawTemplate, options );
				};
			}
		},

		onInit: function() {
			ViewModule.prototype.onInit.apply( this, arguments );

			this.setMarionetteTemplateCompiler();

			this.initDialogsManager();

			this.initTemplatesImport();

			this.initMaintenanceMode();

			this.goToSettingsTabFromHash();

            this.roleManager.init();

            this.extensionManager.init();
		},

		initDialogsManager: function() {
			var dialogsManager;

			this.getDialogsManager = function() {
				if ( ! dialogsManager ) {
					dialogsManager = new DialogsManager.Instance();
				}

				return dialogsManager;
			};
		},

		initTemplatesImport: function() {
			if ( ! this.elements.$body.hasClass( 'post-type-qazana_library' ) ) {
				return;
			}

			var self = this,
				$importButton = self.elements.$importButton,
				$importArea = self.elements.$importArea;

			self.elements.$formAnchor = $( 'h1' );

			$( '#wpbody-content' ).find( '.page-title-action:last' ).after( $importButton );

			self.elements.$formAnchor.after( $importArea );

			$importButton.on( 'click', function() {
				$( '#qazana-import-template-area' ).toggle();
			} );
		},

		initMaintenanceMode: function() {
			var MaintenanceMode = require( 'qazana-admin/maintenance-mode' );

			this.maintenanceMode = new MaintenanceMode();
		},

		isQazanaMode: function() {
			return !! this.elements.$switchModeInput.val();
		},

		animateLoader: function() {
			this.elements.$goToEditLink.addClass( 'qazana-animate' );
		},

		goToSettingsTabFromHash: function() {
			var hash = location.hash.slice( 1 );

			if ( hash ) {
				this.goToSettingsTab( hash );
			}
		},

		goToSettingsTab: function( tabName ) {
			var $activePage = this.elements.$settingsFormPages.filter( '#' + tabName );

			if ( ! $activePage.length ) {
				return;
			}

			this.elements.$activeSettingsPage.removeClass( 'qazana-active' );

			this.elements.$activeSettingsTab.removeClass( 'nav-tab-active' );

			var $activeTab = this.elements.$settingsTabs.filter( '#qazana-settings-' + tabName );

			$activePage.addClass( 'qazana-active' );

			$activeTab.addClass( 'nav-tab-active' );

			this.elements.$settingsForm.attr( 'action', 'options.php#' + tabName );

			this.elements.$activeSettingsPage = $activePage;

			this.elements.$activeSettingsTab = $activeTab;
		},

		roleManager: {
			selectors: {
				body: 'qazana-role-manager',
				row: '.qazana-role-row',
				label: '.qazana-role-label',
				excludedIndicator: '.qazana-role-excluded-indicator',
				excludedField: 'input[name="qazana_exclude_user_roles[]"]',
				controlsContainer: '.qazana-role-controls',
				toggleHandle: '.qazana-role-toggle',
				arrowUp: 'dashicons-arrow-up',
				arrowDown: 'dashicons-arrow-down',
			},
			toggle: function( $trigger ) {
				var self = this,
					$row = $trigger.closest( self.selectors.row ),
					$toggleHandleIcon = $row.find( self.selectors.toggleHandle ).find( '.dashicons' ),
					$controls = $row.find( self.selectors.controlsContainer );

				$controls.toggleClass( 'hidden' );
				if ( $controls.hasClass( 'hidden' ) ) {
					$toggleHandleIcon.removeClass( self.selectors.arrowUp ).addClass( self.selectors.arrowDown );
				} else {
					$toggleHandleIcon.removeClass( self.selectors.arrowDown ).addClass( self.selectors.arrowUp );
				}
				self.updateLabel( $row );
			},
			updateLabel: function( $row ) {
				var self = this,
					$indicator = $row.find( self.selectors.excludedIndicator ),
					excluded = $row.find( self.selectors.excludedField ).is( ':checked' );
				if ( excluded ) {
					$indicator.html( $indicator.data( 'excluded-label' ) );
				} else {
					$indicator.html( '' );
				}
				self.setAdvancedState( $row, excluded );
			},
			setAdvancedState: function( $row, state ) {
				var self = this,
					$controls = $row.find( 'input[type="checkbox"]' ).not( self.selectors.excludedField );

				$controls.each( function( index, input ) {
					$( input ).prop( 'disabled', state );
				} );
			},
			bind: function() {
				var self = this;
				$( document ).on( 'click', self.selectors.label + ',' + self.selectors.toggleHandle, function( event ) {
					event.stopPropagation();
					event.preventDefault();
					self.toggle( $( this ) );
				} ).on( 'change', self.selectors.excludedField, function() {
					self.updateLabel( $( this ).closest( self.selectors.row ) );
				} );
			},
			init: function() {
				var self = this;
				if ( ! $( 'body[class*="' + self.selectors.body + '"]' ).length ) {
					return;
				}
				self.bind();
				$( self.selectors.row ).each( function( index, row ) {
					self.updateLabel( $( row ) );
				} );
			},
        },

        extensionManager: {
            selectors: {
                body: 'qazana-extensions-manager',
                row: '.qazana-extension-row',
                label: '.qazana-extension-indicator',
                activedIndicator: '.qazana-extension-active-indicator',
                activeWidgets: 'input[name="qazana_extension-manage-widgets[]"]',
                controlsContainer: '.qazana-extension-controls',
                toggleHandle: '.qazana-extension-toggle',
                arrowUp: 'dashicons-arrow-up',
                arrowDown: 'dashicons-arrow-down',
            },
            toggle: function( $trigger ) {
                var self = this,
                    $row = $trigger.closest( self.selectors.row ),
                    $toggleHandleIcon = $row.find( self.selectors.toggleHandle ).find( '.dashicons' ),
                    $controls = $row.find( self.selectors.controlsContainer );

                $controls.toggleClass( 'hidden' );
                if ( $controls.hasClass( 'hidden' ) ) {
                    $toggleHandleIcon.removeClass( self.selectors.arrowUp ).addClass( self.selectors.arrowDown );
                } else {
                    $toggleHandleIcon.removeClass( self.selectors.arrowDown ).addClass( self.selectors.arrowUp );
                }
                self.updateLabel( $row );
            },
            updateLabel: function( $row ) {
                var self = this,
                    $indicator = $row.find( self.selectors.activedIndicator ),
                    active = $row.find( self.selectors.activeWidgets ).is( ':checked' );
                if ( active ) {
                    $indicator.html( $indicator.data( 'label' ) );
                } else {
                    $indicator.html( '' );
                }
                self.setAdvancedState( $row, active );
            },
            setAdvancedState: function( $row, state ) {
                var self = this,
                    $controls = $row.find( 'input[type="checkbox"]' ).not( self.selectors.activeWidgets );

                $controls.each( function( index, input ) {
                    $( input ).prop( 'disabled', state );
                } );
            },
            bind: function() {
                var self = this;
                $( document ).on( 'click', self.selectors.label + ',' + self.selectors.toggleHandle, function( event ) {
                    event.stopPropagation();
                    event.preventDefault();
                    self.toggle( $( this ) );
                } ).on( 'change', self.selectors.activeWidgets, function() {
                    self.updateLabel( $( this ).closest( self.selectors.row ) );
                } );
            },
            init: function() {
                var self = this;
                if ( ! $( 'body[class*="' + self.selectors.body + '"]' ).length ) {
                    return;
                }
                self.bind();
                $( self.selectors.row ).each( function( index, row ) {
                    self.updateLabel( $( row ) );
                } );
            },
        },

	} );

	$( function() {
		window.qazanaAdmin = new QazanaAdmin();

		qazanaAdmin.elements.$window.trigger( 'qazana/admin/init' );
	} );
}( jQuery ) );
