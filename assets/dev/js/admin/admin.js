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
				$settingsTabsWrapper: $( '#qazana-settings-tabs-wrapper' ),
				$addNew: $( '.post-type-qazana_library #wpbody-content .page-title-action:first, #qazana-template-library-add-new' ),
				$addNewDialogHeader:  $( '.qazana-templates-modal__header' ),
				$addNewDialogClose:  $( '.qazana-templates-modal__header__close-modal' ),
				$addNewDialogContent:  $( '#qazana-new-template-dialog-content' )
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

						location.href = self.cache.$goToEditLink.attr( 'href' );
					} );
				}

				self.toggleStatus();
			} );

			self.cache.$addNew.on( 'click', function( event ) {
				event.preventDefault();
				self.getNewTemplateModal().show();
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

			this.initNewTemplateDialog();

			this.initMaintenanceMode();

			this.goToSettingsTabFromHash();

            this.roleManager.init();

            this.extensionManager.init();
		},

		initNewTemplateDialog: function() {
			var self = this,
				modal;

			self.getNewTemplateModal = function() {
				if ( ! modal ) {
					var dialogsManager = new DialogsManager.Instance();

					modal = dialogsManager.createWidget( 'lightbox', {
						id: 'qazana-new-template-modal',
						className: 'qazana-templates-modal',
						headerMessage: self.cache.$addNewDialogHeader,
						message: self.cache.$addNewDialogContent.children(),
						hide: {
							onButtonClick: false
						},
						position: {
							my: 'center',
							at: 'center'
						},
						onReady: function() {
							DialogsManager.getWidgetType( 'lightbox' ).prototype.onReady.apply( this, arguments );

							self.cache.$addNewDialogClose.on( 'click', function() {
								modal.hide();
							} );
						}
					} );
				}

				return modal;
			};

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
			var MaintenanceMode = require( 'qazana-admin/maintenance-mode' );

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
				arrowDown: 'dashicons-arrow-down'
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
				});
			},
			bind: function() {
				var self = this;
				$( document ).on( 'click', self.selectors.label + ',' + self.selectors.toggleHandle, function( event ) {
					event.stopPropagation();
					event.preventDefault();
					self.toggle( $( this ) );
				} ).on( 'change', self.selectors.excludedField, function() {
					self.updateLabel( $( this ).closest( self.selectors.row ) );
				});

			},
			init: function() {
				var self = this;
				if ( ! $( 'body[class*="' + self.selectors.body + '"]' ).length ) {
					return;
				}
				self.bind();
				$( self.selectors.row ).each( function( index, row ) {
					self.updateLabel( $( row ) );
				});
			}
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
                arrowDown: 'dashicons-arrow-down'
            },
            toggle: function ($trigger) {
                var self = this,
                    $row = $trigger.closest(self.selectors.row),
                    $toggleHandleIcon = $row.find(self.selectors.toggleHandle).find('.dashicons'),
                    $controls = $row.find(self.selectors.controlsContainer);

                $controls.toggleClass('hidden');
                if ($controls.hasClass('hidden')) {
                    $toggleHandleIcon.removeClass(self.selectors.arrowUp).addClass(self.selectors.arrowDown);
                } else {
                    $toggleHandleIcon.removeClass(self.selectors.arrowDown).addClass(self.selectors.arrowUp);
                }
                self.updateLabel($row);
            },
            updateLabel: function ($row) {
                var self = this,
                    $indicator = $row.find(self.selectors.activedIndicator),
                    active = $row.find(self.selectors.activeWidgets).is(':checked');
                if (active) {
                    $indicator.html($indicator.data('label'));
                } else {
                    $indicator.html('');
                }
                self.setAdvancedState($row, active);
            },
            setAdvancedState: function ($row, state) {
                var self = this,
                    $controls = $row.find('input[type="checkbox"]').not(self.selectors.activeWidgets);

                $controls.each(function (index, input) {
                    $(input).prop('disabled', state);
                });
            },
            bind: function () {
                var self = this;
                $(document).on('click', self.selectors.label + ',' + self.selectors.toggleHandle, function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    self.toggle($(this));
                }).on('change', self.selectors.activeWidgets, function () {
                    self.updateLabel($(this).closest(self.selectors.row));
                });
            },
            init: function () {
                var self = this;
                if (!$('body[class*="' + self.selectors.body + '"]').length) {
                    return;
                }
                self.bind();
                $(self.selectors.row).each(function (index, row) {
                    self.updateLabel($(row));
                });
            }
        }
	};

	$( function() {
		QazanaAdminApp.init();
	} );

	window.qazanaAdmin = QazanaAdminApp;
}( jQuery ) );
