(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
module.exports = qazana.modules.views.ControlsStack.extend( {
	activeTab: 'content',

	activeSection: 'settings',

	initialize: function() {
		this.collection = new Backbone.Collection( _.values( this.options.controls ) );
	},

	filter: function( model ) {
		if ( 'section' === model.get( 'type' ) ) {
			return true;
		}

		var section = model.get( 'section' );

		return ! section || section === this.activeSection;
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model
		};
	}
} );
},{}],3:[function(require,module,exports){
var SaverBehavior = qazana.modules.components.saver.behaviors.FooterSaver;

module.exports = SaverBehavior.extend( {
	ui: function() {
		var ui = SaverBehavior.prototype.ui.apply( this, arguments );

		ui.menuConditions = '#qazana-pro-panel-saver-conditions';
		ui.previewWrapper = '#qazana-panel-footer-theme-builder-button-preview-wrapper';
		ui.buttonPreviewSettings = '#qazana-panel-footer-theme-builder-button-preview-settings';
		ui.buttonOpenPreview = '#qazana-panel-footer-theme-builder-button-open-preview';

		return ui;
	},

	events: function() {
		var events = SaverBehavior.prototype.events.apply( this, arguments );

		events[ 'click @ui.previewWrapper' ] = 'onClickPreviewWrapper';
		events[ 'click @ui.menuConditions' ] = 'onClickMenuConditions';
		events[ 'click @ui.buttonPreviewSettings' ] = 'onClickButtonPreviewSettings';
		events[ 'click @ui.buttonOpenPreview' ] = 'onClickButtonPreview';

		return events;
	},

	initialize: function() {
		SaverBehavior.prototype.initialize.apply( this, arguments );

		qazana.settings.page.model.on( 'change', this.onChangeLocation.bind( this ) );
	},

	onRender: function() {
		SaverBehavior.prototype.onRender.apply( this, arguments );

		var $menuConditions = jQuery( '<div />', {
			id: 'qazana-pro-panel-saver-conditions',
			class: 'qazana-panel-footer-sub-menu-item',
			html: '<i class="qazana-icon fa fa-paper-plane"></i>' +
			'<span class="qazana-title">' +
			qazana.translate( 'display_conditions' ) +
			'</span>'
		} );

		this.ui.menuConditions = $menuConditions;

		this.toggleMenuConditions();

		this.ui.saveTemplate.before( $menuConditions );

		this.ui.buttonPreview.replaceWith( jQuery( '#tmpl-qazana-theme-builder-button-preview' ).html() );
	},

	toggleMenuConditions: function() {
		this.ui.menuConditions.toggle( ! ! qazana.config.theme_builder.settings.location );
	},

	onChangeLocation: function( settings ) {
		if ( ! _.isUndefined( settings.changed.location ) ) {
			qazana.config.theme_builder.settings.location = settings.changed.location;
			this.toggleMenuConditions();
		}
	},

	onClickPreviewWrapper: function( event ) {
		var $target = jQuery( event.target ),
			$tool = $target.closest( '.qazana-panel-footer-tool' ),
			isClickInsideOfTool = $target.closest( '.qazana-panel-footer-sub-menu-wrapper' ).length;

		if ( isClickInsideOfTool ) {
			$tool.removeClass( 'qazana-open' );
			return;
		}

		this.ui.menuButtons.filter( ':not(.qazana-leave-open)' ).removeClass( 'qazana-open' );

		var isClosedTool = $tool.length && ! $tool.hasClass( 'qazana-open' );
		$tool.toggleClass( 'qazana-open', isClosedTool );

		event.stopPropagation();
	},

	onClickMenuConditions: function() {
		qazana.modules.themeBuilder.showConditionsModal();
	},

	onClickButtonPublish: function() {
		var hasConditions = qazana.config.theme_builder.settings.conditions.length,
			hasLocation = qazana.config.theme_builder.settings.location,
			isDraft = 'draft' === qazana.settings.page.model.get( 'post_status' );
		if ( ( hasConditions && ! isDraft ) || ! hasLocation ) {
			SaverBehavior.prototype.onClickButtonPublish.apply( this, arguments );
		} else {
			qazana.modules.themeBuilder.showConditionsModal();
		}
	},

	onClickButtonPreviewSettings: function() {
		var panel = qazana.getPanelView();
		panel.setPage( 'page_settings' );
		panel.getCurrentPageView().activateSection( 'preview_settings' );
		panel.getCurrentPageView()._renderChildren();
	}
} );
},{}],4:[function(require,module,exports){
var RepeaterRowView = require( './conditions-repeater-row' );

module.exports = qazana.modules.controls.Repeater.extend( {

	childView: RepeaterRowView,

	updateActiveRow: function() {},

	initialize: function( options ) {
		qazana.modules.controls.Repeater.prototype.initialize.apply( this, arguments );

		this.config = qazana.config.theme_builder;

		this.updateConditionsOptions( this.config.settings.template_type );
	},

	checkConflicts:function( model ) {
		var modelId = model.get( '_id' ),
			rowId = 'qazana-condition-id-' + modelId,
			errorMessageId = 'qazana-conditions-conflict-message-' + modelId,
			$error = jQuery( '#' + errorMessageId );

		// On render - the row isn't exist, so don't cache it.
		jQuery( '#' + rowId ).removeClass( 'qazana-error' );

		$error.remove();

		qazana.ajax.addRequest( 'theme_builder_conditions_check_conflicts', {
			unique_id: rowId,
			data: {
				condition: model.toJSON( { removeDefaults: true } )
			},
			success: function( data ) {
				if ( ! _.isEmpty( data ) ) {
					jQuery( '#' + rowId )
						.addClass( 'qazana-error' )
						.after( '<div id="' + errorMessageId + '" class="qazana-conditions-conflict-message">' + data + '</div>' );

				}
			}
		} );
	},

	updateConditionsOptions: function( templateType ) {
		var self = this,
			conditionType = self.config.types[ templateType ].condition_type,
			options = {};

		_( [ conditionType ] ).each( function( conditionId, conditionIndex ) {
			var conditionConfig = self.config.conditions[ conditionId ],
				group = {
					label: conditionConfig.label,
					options: {}
				};

			group.options[ conditionId ] = conditionConfig.all_label;

			_( conditionConfig.sub_conditions ).each( function( subConditionId ) {
				group.options[ subConditionId ] = self.config.conditions[ subConditionId ].label;
			} );

			options[ conditionIndex ] = group;
		} );

		var fields = this.model.get( 'fields' );

		fields[1]['default'] = conditionType;

		if ( 'general' === conditionType ) {
			fields[1].groups = options;
		} else {
			fields[2].groups = options;
		}
	},

	togglePublishButtonState: function() {
		var conditionsModalUI = qazana.modules.themeBuilder.conditionsLayout.modalContent.currentView.ui,
			$publishButton = conditionsModalUI.publishButton,
			$publishButtonTitle = conditionsModalUI.publishButtonTitle;

		if ( this.collection.length ) {
			$publishButton.addClass( 'qazana-button-success' );

			$publishButtonTitle.text( qazana.translate( 'publish' ) );
		} else {
			$publishButton.removeClass( 'qazana-button-success' );

			$publishButtonTitle.text( qazana.translate( 'save_without_conditions' ) );
		}
	},

	onRender: function() {
		this.ui.btnAddRow.text( qazana.translate( 'add_condition' ) );

		var self = this;

		this.collection.each( function( model ) {
			self.checkConflicts( model );
		});

		_.defer( this.togglePublishButtonState.bind( this ) );
	},

	// Overwrite thr original + checkConflicts.
	onRowControlChange: function( model ) {
		this.checkConflicts( model );
	},

	onRowUpdate: function() {
		qazana.modules.controls.Repeater.prototype.onRowUpdate.apply( this, arguments );

		this.togglePublishButtonState();
	}
} );
},{"./conditions-repeater-row":5}],5:[function(require,module,exports){
module.exports = qazana.modules.controls.RepeaterRow.extend( {

	template: '#tmpl-qazana-theme-builder-conditions-repeater-row',

	childViewContainer: '.qazana-theme-builder-conditions-repeater-row-controls',

	id: function() {
		return 'qazana-condition-id-' + this.model.get( '_id' );
	},

	onBeforeRender: function() {
		var	subNameModel = this.collection.findWhere( {
				name: 'sub_name'
			} ),
			subIdModel = this.collection.findWhere( {
				name: 'sub_id'
			} ),
			subConditionConfig = this.config.conditions[ this.model.attributes.sub_name ];

		subNameModel.attributes.groups = this.getOptions();

		if ( subConditionConfig && subConditionConfig.controls ) {
			_( subConditionConfig.controls ).each( function( control ) {
				subIdModel.set( control );
				subIdModel.set( 'name', 'sub_id' );
			} );
		}
	},

	initialize: function( options ) {
		qazana.modules.controls.RepeaterRow.prototype.initialize.apply( this, arguments );

		this.config = qazana.config.theme_builder;
	},

	updateOptions:function() {
		if ( this.model.changed.name ) {
			this.model.set({
				sub_name: '',
				sub_id: ''
			} );
		}

		if ( this.model.changed.name || this.model.changed.sub_name ) {
			this.model.set( 'sub_id', '' );

			var subIdModel = this.collection.findWhere( {
				name: 'sub_id'
			} );

			subIdModel.set( {
				type: 'select',
				options: {
					'': 'All'
				}
			} );

			this.render();
		}

		if ( this.model.changed.type ) {
			this.setTypeAttribute();
		}
	},

	getOptions:function() {
		var self = this,
			conditionConfig = self.config.conditions[ this.model.get( 'name' ) ];

		if ( ! conditionConfig ) {
			return;
		}

		var options = {
			'': conditionConfig.all_label
		};

		_( conditionConfig.sub_conditions ).each( function( conditionId, conditionIndex ) {
			var subConditionConfig = self.config.conditions[ conditionId ],
				group;

			if ( ! subConditionConfig ) {
				return;
			}

			if ( subConditionConfig.sub_conditions.length ) {
				group = {
					label: subConditionConfig.label,
					options: {}
				};
				group.options[ conditionId ]	= subConditionConfig.all_label;

				_( subConditionConfig.sub_conditions ).each( function( subConditionId ) {
					group.options[ subConditionId ] = self.config.conditions[ subConditionId ].label;
				} );

				// Use a sting key - to keep order
				options[ 'key' + conditionIndex ] = group;
			} else {
				options[ conditionId ] = subConditionConfig.label;
			}
		} );

		return options;
	},

	setTypeAttribute: function() {
		var typeView = this.children.findByModel( this.collection.findWhere( { name: 'type' } ) );

		typeView.$el.attr( 'data-qazana-condition-type', typeView.getControlValue() );
	},

	onRender: function() {
		var nameModel = this.collection.findWhere( {
				name: 'name'
			} ),
			subNameModel = this.collection.findWhere( {
				name: 'sub_name'
			} ),
			subIdModel = this.collection.findWhere( {
				name: 'sub_id'
			} ),
			nameView = this.children.findByModel( nameModel ),
			subNameView = this.children.findByModel( subNameModel ),
			subIdView = this.children.findByModel( subIdModel ),
			conditionConfig = this.config.conditions[ this.model.attributes.name ],
			subConditionConfig = this.config.conditions[ this.model.attributes.sub_name ],
			typeConfig = this.config.types[ this.config.settings.template_type ];

		if ( typeConfig.condition_type === nameView.getControlValue() && 'general' !== nameView.getControlValue() && ! _.isEmpty( conditionConfig.sub_conditions ) ) {
			nameView.$el.hide();
		}

		if ( ! conditionConfig || ( _.isEmpty( conditionConfig.sub_conditions ) && _.isEmpty( conditionConfig.controls ) ) || ! nameView.getControlValue() || 'general' === nameView.getControlValue() ) {
			subNameView.$el.hide();
		}

		if ( ! subConditionConfig || ( _.isEmpty( subConditionConfig.controls ) ) || ! subNameView.getControlValue() ) {
			subIdView.$el.hide();
		}

		this.setTypeAttribute();
	},

	onModelChange: function() {
		qazana.modules.controls.RepeaterRow.prototype.onModelChange.apply( this, arguments );

		this.updateOptions();
	}
} );
},{}],6:[function(require,module,exports){
(function ($) {
    'use strict';

    var ThemeBuilder = require('./module');

    jQuery(window).on('qazana:init', function () {
        qazana.modules.themeBuilder = new ThemeBuilder();
        qazana.modules.themeBuilder.onQazanaInit();
    });

})(jQuery);
},{"./module":7}],7:[function(require,module,exports){
var EditorModule = require('qazana-editor/editor-module');

module.exports = EditorModule.extend({

    onQazanaInit: function () {
                console.log('====================================');
                console.log(qazana.modules);
                console.log('====================================');
        qazana.addControlView('Conditions_repeater', require('./conditions-repeater-control'));

        qazana.hooks.addFilter('panel/footer/behaviors', this.addFooterBehavior);
        qazana.hooks.addFilter('panel/header/behaviors', this.addFooterBehavior);

        this.initConditionsLayout();
    },

    addFooterBehavior: function (behaviors) {
        if (qazana.config.theme_builder) {
            behaviors.saver = {
                behaviorClass: require('./behaviors/pro-saver-behavior')
            };
        }

        return behaviors;
    },

    saveAndReload: function () {
        qazana.saver.saveAutoSave({
            onSuccess: function () {
                qazana.dynamicTags.cleanCache();
                qazana.reloadPreview();
            }
        });
    },

    onApplyPreview: function () {
        this.saveAndReload();
    },

    onPageSettingsChange: function (model) {
        if (model.changed.preview_type) {
            model.set({
                preview_id: '',
                preview_search_term: ''
            });
            this.updatePreviewIdOptions(true);
        }

        if (!_.isUndefined(model.changed.page_template)) {
            qazana.saver.saveAutoSave({
                onSuccess: function () {
                    qazana.reloadPreview();

                    qazana.once('preview:loaded', function () {
                        qazana.getPanelView().setPage('page_settings');
                    });
                }
            });
        }
    },

    updatePreviewIdOptions: function (render) {
        var previewType = qazana.settings.page.model.get('preview_type');
        if (!previewType) {
            return;
        }
        previewType = previewType.split('/');

        var currentView = qazana.getPanelView().getCurrentPageView(),
            controlModel = currentView.collection.findWhere({
                name: 'preview_id'
            });

        if ('author' === previewType[1]) {
            controlModel.set({
                filter_type: 'author',
                object_type: 'author'
            });
        } else if ('taxonomy' === previewType[0]) {
            controlModel.set({
                filter_type: 'taxonomy',
                object_type: previewType[1]
            });
        } else if ('single' === previewType[0]) {
            controlModel.set({
                filter_type: 'post',
                object_type: previewType[1]
            });
        } else {
            controlModel.set({
                filter_type: '',
                object_type: ''
            });
        }

        if (true === render) { // Can be model.

            var controlView = currentView.children.findByModel(controlModel);

            controlView.render();

            controlView.$el.toggle(!!controlModel.get('filter_type'));
        }
    },

    onQazanaPreviewLoaded: function () {
        if (!qazana.config.theme_builder) {
            return;
        }

        qazana.getPanelView().on('set:page:page_settings', this.updatePreviewIdOptions);

        qazana.settings.page.model.on('change', this.onPageSettingsChange.bind(this));

        qazana.channels.editor.on('qazanaThemeBuilder:ApplyPreview', this.onApplyPreview.bind(this));

        // Scroll to Editor. Timeout according to preview resize css animation duration.
        setTimeout(function () {
            qazana.$previewContents.find('html, body').animate({
                scrollTop: qazana.$previewContents.find('#qazana').offset().top - qazana.$preview[0].contentWindow.innerHeight / 2
            });
        }, 500);
    },

    showConditionsModal: function () {
        var ThemeTemplateConditionsView = require('./views/conditions-view'),
            themeBuilderModule = qazana.config.theme_builder,
            settings = themeBuilderModule.settings;

        var model = new qazana.modules.elements.models.BaseSettings(settings, {
            controls: themeBuilderModule.template_conditions.controls
        });

        this.conditionsLayout.modalContent.show(new ThemeTemplateConditionsView({
            model: model,
            controls: model.controls
        }));

        this.conditionsLayout.modal.show();
    },

    initConditionsLayout: function () {
        var ConditionsLayout = require('./views/conditions-layout');

        this.conditionsLayout = new ConditionsLayout();
    }
});
},{"./behaviors/pro-saver-behavior":3,"./conditions-repeater-control":4,"./views/conditions-layout":8,"./views/conditions-view":9,"qazana-editor/editor-module":1}],8:[function(require,module,exports){
var BaseModalLayout = qazana.modules.components.templateLibrary.views.BaseModalLayout;

module.exports = BaseModalLayout.extend( {

	getModalOptions: function() {
		return {
			id: 'qazana-conditions-modal'
		};
	},

	getLogoOptions: function() {
		return {
			title: qazana.translate( 'display_conditions' )
		};
	},

	initialize: function() {
		BaseModalLayout.prototype.initialize.apply( this, arguments );

		this.showLogo();
	}
} );
},{}],9:[function(require,module,exports){
var inlineControlsStack = require( 'qazana-editor/inline-controls-stack.js' );

module.exports = inlineControlsStack.extend( {
	id: 'qazana-theme-builder-conditions-view',

	template: '#tmpl-qazana-theme-builder-conditions-view',

	childViewContainer: '#qazana-theme-builder-conditions-controls',

	ui: function() {
		var ui = inlineControlsStack.prototype.ui.apply( this, arguments );

		ui.publishButton = '#qazana-theme-builder-conditions__publish';

		ui.publishButtonTitle = '#qazana-theme-builder-conditions__publish__title';

		return ui;
	},

	events: {
		'click @ui.publishButton': 'onClickPublish'
	},

	templateHelpers: function() {
		return {
			title: qazana.translate( 'conditions_title' ),
			description: qazana.translate( 'conditions_description' )
		};
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model
		};
	},

	onClickPublish: function( event ) {
		var self = this,
			$button = jQuery( event.currentTarget ),
			data = this.model.toJSON( { removeDefault: true } );

		event.stopPropagation();

		$button
			.attr( 'disabled', true )
			.addClass( 'qazana-button-state' );

		// Publish.
		qazana.ajax.addRequest( 'theme_builder_save_conditions', {
			data: data,
			success: function() {
				qazana.config.theme_builder.settings.conditions = self.model.get( 'conditions' );
				qazana.saver.publish();
			},
			complete: function() {
				self.afterAjax( $button );
			}
		} );
	},

	afterAjax: function( $button ) {
		$button
			.attr( 'disabled', false )
			.removeClass( 'qazana-button-state' );

		qazana.modules.themeBuilder.conditionsLayout.modal.hide();
	}
} );
},{"qazana-editor/inline-controls-stack.js":2}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvZGV2L2pzL2VkaXRvci9lZGl0b3ItbW9kdWxlLmpzIiwiYXNzZXRzL2Rldi9qcy9lZGl0b3IvaW5saW5lLWNvbnRyb2xzLXN0YWNrLmpzIiwiaW5jbHVkZXMvZXh0ZW5zaW9ucy90aGVtZWJ1aWxkZXIvYXNzZXRzL2pzL2VkaXRvci9iZWhhdmlvcnMvcHJvLXNhdmVyLWJlaGF2aW9yLmpzIiwiaW5jbHVkZXMvZXh0ZW5zaW9ucy90aGVtZWJ1aWxkZXIvYXNzZXRzL2pzL2VkaXRvci9jb25kaXRpb25zLXJlcGVhdGVyLWNvbnRyb2wuanMiLCJpbmNsdWRlcy9leHRlbnNpb25zL3RoZW1lYnVpbGRlci9hc3NldHMvanMvZWRpdG9yL2NvbmRpdGlvbnMtcmVwZWF0ZXItcm93LmpzIiwiaW5jbHVkZXMvZXh0ZW5zaW9ucy90aGVtZWJ1aWxkZXIvYXNzZXRzL2pzL2VkaXRvci9lZGl0b3IuanMiLCJpbmNsdWRlcy9leHRlbnNpb25zL3RoZW1lYnVpbGRlci9hc3NldHMvanMvZWRpdG9yL21vZHVsZS5qcyIsImluY2x1ZGVzL2V4dGVuc2lvbnMvdGhlbWVidWlsZGVyL2Fzc2V0cy9qcy9lZGl0b3Ivdmlld3MvY29uZGl0aW9ucy1sYXlvdXQuanMiLCJpbmNsdWRlcy9leHRlbnNpb25zL3RoZW1lYnVpbGRlci9hc3NldHMvanMvZWRpdG9yL3ZpZXdzL2NvbmRpdGlvbnMtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRWRpdG9yTW9kdWxlID0gZnVuY3Rpb24oKSB7XG5cdHZhciBzZWxmID0gdGhpcztcblxuXHR0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRqUXVlcnkoIHdpbmRvdyApLm9uKCAncWF6YW5hOmluaXQnLCB0aGlzLm9uUWF6YW5hUmVhZHkuYmluZCggdGhpcyApICk7XG5cdH07XG5cblx0dGhpcy5nZXRWaWV3ID0gZnVuY3Rpb24oIG5hbWUgKSB7XG5cdFx0dmFyIGVkaXRvciA9IHFhemFuYS5nZXRQYW5lbFZpZXcoKS5nZXRDdXJyZW50UGFnZVZpZXcoKTtcblx0XHRyZXR1cm4gZWRpdG9yLmNoaWxkcmVuLmZpbmRCeU1vZGVsQ2lkKCB0aGlzLmdldENvbnRyb2woIG5hbWUgKS5jaWQgKTtcblx0fTtcblxuXHR0aGlzLmdldENvbnRyb2wgPSBmdW5jdGlvbiggbmFtZSApIHtcblx0XHR2YXIgZWRpdG9yID0gcWF6YW5hLmdldFBhbmVsVmlldygpLmdldEN1cnJlbnRQYWdlVmlldygpO1xuXHRcdHJldHVybiBlZGl0b3IuY29sbGVjdGlvbi5maW5kV2hlcmUoIHsgbmFtZTogbmFtZSB9ICk7XG5cdH07XG5cblx0dGhpcy5vblFhemFuYVJlYWR5ID0gZnVuY3Rpb24oKSB7XG5cdFx0c2VsZi5vblFhemFuYUluaXQoKTtcblxuXHRcdHFhemFuYS5vbiggJ2Zyb250ZW5kOmluaXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdHNlbGYub25RYXphbmFGcm9udGVuZEluaXQoKTtcblx0XHR9ICk7XG5cblx0XHRxYXphbmEub24oICdwcmV2aWV3OmxvYWRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0c2VsZi5vblFhemFuYVByZXZpZXdMb2FkZWQoKTtcblx0XHR9ICk7XG5cdH07XG5cblx0dGhpcy5pbml0KCk7XG59O1xuXG5FZGl0b3JNb2R1bGUucHJvdG90eXBlLm9uUWF6YW5hSW5pdCA9IGZ1bmN0aW9uKCkge307XG5cbkVkaXRvck1vZHVsZS5wcm90b3R5cGUub25RYXphbmFQcmV2aWV3TG9hZGVkID0gZnVuY3Rpb24oKSB7fTtcblxuRWRpdG9yTW9kdWxlLnByb3RvdHlwZS5vblFhemFuYUZyb250ZW5kSW5pdCA9IGZ1bmN0aW9uKCkge307XG5cbkVkaXRvck1vZHVsZS5leHRlbmQgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZDtcblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3JNb2R1bGU7IiwibW9kdWxlLmV4cG9ydHMgPSBxYXphbmEubW9kdWxlcy52aWV3cy5Db250cm9sc1N0YWNrLmV4dGVuZCgge1xuXHRhY3RpdmVUYWI6ICdjb250ZW50JyxcblxuXHRhY3RpdmVTZWN0aW9uOiAnc2V0dGluZ3MnLFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuY29sbGVjdGlvbiA9IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKCBfLnZhbHVlcyggdGhpcy5vcHRpb25zLmNvbnRyb2xzICkgKTtcblx0fSxcblxuXHRmaWx0ZXI6IGZ1bmN0aW9uKCBtb2RlbCApIHtcblx0XHRpZiAoICdzZWN0aW9uJyA9PT0gbW9kZWwuZ2V0KCAndHlwZScgKSApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHZhciBzZWN0aW9uID0gbW9kZWwuZ2V0KCAnc2VjdGlvbicgKTtcblxuXHRcdHJldHVybiAhIHNlY3Rpb24gfHwgc2VjdGlvbiA9PT0gdGhpcy5hY3RpdmVTZWN0aW9uO1xuXHR9LFxuXG5cdGNoaWxkVmlld09wdGlvbnM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRlbGVtZW50U2V0dGluZ3NNb2RlbDogdGhpcy5tb2RlbFxuXHRcdH07XG5cdH1cbn0gKTsiLCJ2YXIgU2F2ZXJCZWhhdmlvciA9IHFhemFuYS5tb2R1bGVzLmNvbXBvbmVudHMuc2F2ZXIuYmVoYXZpb3JzLkZvb3RlclNhdmVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNhdmVyQmVoYXZpb3IuZXh0ZW5kKCB7XG5cdHVpOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdWkgPSBTYXZlckJlaGF2aW9yLnByb3RvdHlwZS51aS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cblx0XHR1aS5tZW51Q29uZGl0aW9ucyA9ICcjcWF6YW5hLXByby1wYW5lbC1zYXZlci1jb25kaXRpb25zJztcblx0XHR1aS5wcmV2aWV3V3JhcHBlciA9ICcjcWF6YW5hLXBhbmVsLWZvb3Rlci10aGVtZS1idWlsZGVyLWJ1dHRvbi1wcmV2aWV3LXdyYXBwZXInO1xuXHRcdHVpLmJ1dHRvblByZXZpZXdTZXR0aW5ncyA9ICcjcWF6YW5hLXBhbmVsLWZvb3Rlci10aGVtZS1idWlsZGVyLWJ1dHRvbi1wcmV2aWV3LXNldHRpbmdzJztcblx0XHR1aS5idXR0b25PcGVuUHJldmlldyA9ICcjcWF6YW5hLXBhbmVsLWZvb3Rlci10aGVtZS1idWlsZGVyLWJ1dHRvbi1vcGVuLXByZXZpZXcnO1xuXG5cdFx0cmV0dXJuIHVpO1xuXHR9LFxuXG5cdGV2ZW50czogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGV2ZW50cyA9IFNhdmVyQmVoYXZpb3IucHJvdG90eXBlLmV2ZW50cy5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cblx0XHRldmVudHNbICdjbGljayBAdWkucHJldmlld1dyYXBwZXInIF0gPSAnb25DbGlja1ByZXZpZXdXcmFwcGVyJztcblx0XHRldmVudHNbICdjbGljayBAdWkubWVudUNvbmRpdGlvbnMnIF0gPSAnb25DbGlja01lbnVDb25kaXRpb25zJztcblx0XHRldmVudHNbICdjbGljayBAdWkuYnV0dG9uUHJldmlld1NldHRpbmdzJyBdID0gJ29uQ2xpY2tCdXR0b25QcmV2aWV3U2V0dGluZ3MnO1xuXHRcdGV2ZW50c1sgJ2NsaWNrIEB1aS5idXR0b25PcGVuUHJldmlldycgXSA9ICdvbkNsaWNrQnV0dG9uUHJldmlldyc7XG5cblx0XHRyZXR1cm4gZXZlbnRzO1xuXHR9LFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuXHRcdFNhdmVyQmVoYXZpb3IucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG5cdFx0cWF6YW5hLnNldHRpbmdzLnBhZ2UubW9kZWwub24oICdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlTG9jYXRpb24uYmluZCggdGhpcyApICk7XG5cdH0sXG5cblx0b25SZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFNhdmVyQmVoYXZpb3IucHJvdG90eXBlLm9uUmVuZGVyLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuXHRcdHZhciAkbWVudUNvbmRpdGlvbnMgPSBqUXVlcnkoICc8ZGl2IC8+Jywge1xuXHRcdFx0aWQ6ICdxYXphbmEtcHJvLXBhbmVsLXNhdmVyLWNvbmRpdGlvbnMnLFxuXHRcdFx0Y2xhc3M6ICdxYXphbmEtcGFuZWwtZm9vdGVyLXN1Yi1tZW51LWl0ZW0nLFxuXHRcdFx0aHRtbDogJzxpIGNsYXNzPVwicWF6YW5hLWljb24gZmEgZmEtcGFwZXItcGxhbmVcIj48L2k+JyArXG5cdFx0XHQnPHNwYW4gY2xhc3M9XCJxYXphbmEtdGl0bGVcIj4nICtcblx0XHRcdHFhemFuYS50cmFuc2xhdGUoICdkaXNwbGF5X2NvbmRpdGlvbnMnICkgK1xuXHRcdFx0Jzwvc3Bhbj4nXG5cdFx0fSApO1xuXG5cdFx0dGhpcy51aS5tZW51Q29uZGl0aW9ucyA9ICRtZW51Q29uZGl0aW9ucztcblxuXHRcdHRoaXMudG9nZ2xlTWVudUNvbmRpdGlvbnMoKTtcblxuXHRcdHRoaXMudWkuc2F2ZVRlbXBsYXRlLmJlZm9yZSggJG1lbnVDb25kaXRpb25zICk7XG5cblx0XHR0aGlzLnVpLmJ1dHRvblByZXZpZXcucmVwbGFjZVdpdGgoIGpRdWVyeSggJyN0bXBsLXFhemFuYS10aGVtZS1idWlsZGVyLWJ1dHRvbi1wcmV2aWV3JyApLmh0bWwoKSApO1xuXHR9LFxuXG5cdHRvZ2dsZU1lbnVDb25kaXRpb25zOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnVpLm1lbnVDb25kaXRpb25zLnRvZ2dsZSggISAhIHFhemFuYS5jb25maWcudGhlbWVfYnVpbGRlci5zZXR0aW5ncy5sb2NhdGlvbiApO1xuXHR9LFxuXG5cdG9uQ2hhbmdlTG9jYXRpb246IGZ1bmN0aW9uKCBzZXR0aW5ncyApIHtcblx0XHRpZiAoICEgXy5pc1VuZGVmaW5lZCggc2V0dGluZ3MuY2hhbmdlZC5sb2NhdGlvbiApICkge1xuXHRcdFx0cWF6YW5hLmNvbmZpZy50aGVtZV9idWlsZGVyLnNldHRpbmdzLmxvY2F0aW9uID0gc2V0dGluZ3MuY2hhbmdlZC5sb2NhdGlvbjtcblx0XHRcdHRoaXMudG9nZ2xlTWVudUNvbmRpdGlvbnMoKTtcblx0XHR9XG5cdH0sXG5cblx0b25DbGlja1ByZXZpZXdXcmFwcGVyOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyICR0YXJnZXQgPSBqUXVlcnkoIGV2ZW50LnRhcmdldCApLFxuXHRcdFx0JHRvb2wgPSAkdGFyZ2V0LmNsb3Nlc3QoICcucWF6YW5hLXBhbmVsLWZvb3Rlci10b29sJyApLFxuXHRcdFx0aXNDbGlja0luc2lkZU9mVG9vbCA9ICR0YXJnZXQuY2xvc2VzdCggJy5xYXphbmEtcGFuZWwtZm9vdGVyLXN1Yi1tZW51LXdyYXBwZXInICkubGVuZ3RoO1xuXG5cdFx0aWYgKCBpc0NsaWNrSW5zaWRlT2ZUb29sICkge1xuXHRcdFx0JHRvb2wucmVtb3ZlQ2xhc3MoICdxYXphbmEtb3BlbicgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLnVpLm1lbnVCdXR0b25zLmZpbHRlciggJzpub3QoLnFhemFuYS1sZWF2ZS1vcGVuKScgKS5yZW1vdmVDbGFzcyggJ3FhemFuYS1vcGVuJyApO1xuXG5cdFx0dmFyIGlzQ2xvc2VkVG9vbCA9ICR0b29sLmxlbmd0aCAmJiAhICR0b29sLmhhc0NsYXNzKCAncWF6YW5hLW9wZW4nICk7XG5cdFx0JHRvb2wudG9nZ2xlQ2xhc3MoICdxYXphbmEtb3BlbicsIGlzQ2xvc2VkVG9vbCApO1xuXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH0sXG5cblx0b25DbGlja01lbnVDb25kaXRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRxYXphbmEubW9kdWxlcy50aGVtZUJ1aWxkZXIuc2hvd0NvbmRpdGlvbnNNb2RhbCgpO1xuXHR9LFxuXG5cdG9uQ2xpY2tCdXR0b25QdWJsaXNoOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaGFzQ29uZGl0aW9ucyA9IHFhemFuYS5jb25maWcudGhlbWVfYnVpbGRlci5zZXR0aW5ncy5jb25kaXRpb25zLmxlbmd0aCxcblx0XHRcdGhhc0xvY2F0aW9uID0gcWF6YW5hLmNvbmZpZy50aGVtZV9idWlsZGVyLnNldHRpbmdzLmxvY2F0aW9uLFxuXHRcdFx0aXNEcmFmdCA9ICdkcmFmdCcgPT09IHFhemFuYS5zZXR0aW5ncy5wYWdlLm1vZGVsLmdldCggJ3Bvc3Rfc3RhdHVzJyApO1xuXHRcdGlmICggKCBoYXNDb25kaXRpb25zICYmICEgaXNEcmFmdCApIHx8ICEgaGFzTG9jYXRpb24gKSB7XG5cdFx0XHRTYXZlckJlaGF2aW9yLnByb3RvdHlwZS5vbkNsaWNrQnV0dG9uUHVibGlzaC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHFhemFuYS5tb2R1bGVzLnRoZW1lQnVpbGRlci5zaG93Q29uZGl0aW9uc01vZGFsKCk7XG5cdFx0fVxuXHR9LFxuXG5cdG9uQ2xpY2tCdXR0b25QcmV2aWV3U2V0dGluZ3M6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwYW5lbCA9IHFhemFuYS5nZXRQYW5lbFZpZXcoKTtcblx0XHRwYW5lbC5zZXRQYWdlKCAncGFnZV9zZXR0aW5ncycgKTtcblx0XHRwYW5lbC5nZXRDdXJyZW50UGFnZVZpZXcoKS5hY3RpdmF0ZVNlY3Rpb24oICdwcmV2aWV3X3NldHRpbmdzJyApO1xuXHRcdHBhbmVsLmdldEN1cnJlbnRQYWdlVmlldygpLl9yZW5kZXJDaGlsZHJlbigpO1xuXHR9XG59ICk7IiwidmFyIFJlcGVhdGVyUm93VmlldyA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbnMtcmVwZWF0ZXItcm93JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHFhemFuYS5tb2R1bGVzLmNvbnRyb2xzLlJlcGVhdGVyLmV4dGVuZCgge1xuXG5cdGNoaWxkVmlldzogUmVwZWF0ZXJSb3dWaWV3LFxuXG5cdHVwZGF0ZUFjdGl2ZVJvdzogZnVuY3Rpb24oKSB7fSxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcblx0XHRxYXphbmEubW9kdWxlcy5jb250cm9scy5SZXBlYXRlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cblx0XHR0aGlzLmNvbmZpZyA9IHFhemFuYS5jb25maWcudGhlbWVfYnVpbGRlcjtcblxuXHRcdHRoaXMudXBkYXRlQ29uZGl0aW9uc09wdGlvbnMoIHRoaXMuY29uZmlnLnNldHRpbmdzLnRlbXBsYXRlX3R5cGUgKTtcblx0fSxcblxuXHRjaGVja0NvbmZsaWN0czpmdW5jdGlvbiggbW9kZWwgKSB7XG5cdFx0dmFyIG1vZGVsSWQgPSBtb2RlbC5nZXQoICdfaWQnICksXG5cdFx0XHRyb3dJZCA9ICdxYXphbmEtY29uZGl0aW9uLWlkLScgKyBtb2RlbElkLFxuXHRcdFx0ZXJyb3JNZXNzYWdlSWQgPSAncWF6YW5hLWNvbmRpdGlvbnMtY29uZmxpY3QtbWVzc2FnZS0nICsgbW9kZWxJZCxcblx0XHRcdCRlcnJvciA9IGpRdWVyeSggJyMnICsgZXJyb3JNZXNzYWdlSWQgKTtcblxuXHRcdC8vIE9uIHJlbmRlciAtIHRoZSByb3cgaXNuJ3QgZXhpc3QsIHNvIGRvbid0IGNhY2hlIGl0LlxuXHRcdGpRdWVyeSggJyMnICsgcm93SWQgKS5yZW1vdmVDbGFzcyggJ3FhemFuYS1lcnJvcicgKTtcblxuXHRcdCRlcnJvci5yZW1vdmUoKTtcblxuXHRcdHFhemFuYS5hamF4LmFkZFJlcXVlc3QoICd0aGVtZV9idWlsZGVyX2NvbmRpdGlvbnNfY2hlY2tfY29uZmxpY3RzJywge1xuXHRcdFx0dW5pcXVlX2lkOiByb3dJZCxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0Y29uZGl0aW9uOiBtb2RlbC50b0pTT04oIHsgcmVtb3ZlRGVmYXVsdHM6IHRydWUgfSApXG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRcdGlmICggISBfLmlzRW1wdHkoIGRhdGEgKSApIHtcblx0XHRcdFx0XHRqUXVlcnkoICcjJyArIHJvd0lkIClcblx0XHRcdFx0XHRcdC5hZGRDbGFzcyggJ3FhemFuYS1lcnJvcicgKVxuXHRcdFx0XHRcdFx0LmFmdGVyKCAnPGRpdiBpZD1cIicgKyBlcnJvck1lc3NhZ2VJZCArICdcIiBjbGFzcz1cInFhemFuYS1jb25kaXRpb25zLWNvbmZsaWN0LW1lc3NhZ2VcIj4nICsgZGF0YSArICc8L2Rpdj4nICk7XG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblxuXHR1cGRhdGVDb25kaXRpb25zT3B0aW9uczogZnVuY3Rpb24oIHRlbXBsYXRlVHlwZSApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRjb25kaXRpb25UeXBlID0gc2VsZi5jb25maWcudHlwZXNbIHRlbXBsYXRlVHlwZSBdLmNvbmRpdGlvbl90eXBlLFxuXHRcdFx0b3B0aW9ucyA9IHt9O1xuXG5cdFx0XyggWyBjb25kaXRpb25UeXBlIF0gKS5lYWNoKCBmdW5jdGlvbiggY29uZGl0aW9uSWQsIGNvbmRpdGlvbkluZGV4ICkge1xuXHRcdFx0dmFyIGNvbmRpdGlvbkNvbmZpZyA9IHNlbGYuY29uZmlnLmNvbmRpdGlvbnNbIGNvbmRpdGlvbklkIF0sXG5cdFx0XHRcdGdyb3VwID0ge1xuXHRcdFx0XHRcdGxhYmVsOiBjb25kaXRpb25Db25maWcubGFiZWwsXG5cdFx0XHRcdFx0b3B0aW9uczoge31cblx0XHRcdFx0fTtcblxuXHRcdFx0Z3JvdXAub3B0aW9uc1sgY29uZGl0aW9uSWQgXSA9IGNvbmRpdGlvbkNvbmZpZy5hbGxfbGFiZWw7XG5cblx0XHRcdF8oIGNvbmRpdGlvbkNvbmZpZy5zdWJfY29uZGl0aW9ucyApLmVhY2goIGZ1bmN0aW9uKCBzdWJDb25kaXRpb25JZCApIHtcblx0XHRcdFx0Z3JvdXAub3B0aW9uc1sgc3ViQ29uZGl0aW9uSWQgXSA9IHNlbGYuY29uZmlnLmNvbmRpdGlvbnNbIHN1YkNvbmRpdGlvbklkIF0ubGFiZWw7XG5cdFx0XHR9ICk7XG5cblx0XHRcdG9wdGlvbnNbIGNvbmRpdGlvbkluZGV4IF0gPSBncm91cDtcblx0XHR9ICk7XG5cblx0XHR2YXIgZmllbGRzID0gdGhpcy5tb2RlbC5nZXQoICdmaWVsZHMnICk7XG5cblx0XHRmaWVsZHNbMV1bJ2RlZmF1bHQnXSA9IGNvbmRpdGlvblR5cGU7XG5cblx0XHRpZiAoICdnZW5lcmFsJyA9PT0gY29uZGl0aW9uVHlwZSApIHtcblx0XHRcdGZpZWxkc1sxXS5ncm91cHMgPSBvcHRpb25zO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRmaWVsZHNbMl0uZ3JvdXBzID0gb3B0aW9ucztcblx0XHR9XG5cdH0sXG5cblx0dG9nZ2xlUHVibGlzaEJ1dHRvblN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgY29uZGl0aW9uc01vZGFsVUkgPSBxYXphbmEubW9kdWxlcy50aGVtZUJ1aWxkZXIuY29uZGl0aW9uc0xheW91dC5tb2RhbENvbnRlbnQuY3VycmVudFZpZXcudWksXG5cdFx0XHQkcHVibGlzaEJ1dHRvbiA9IGNvbmRpdGlvbnNNb2RhbFVJLnB1Ymxpc2hCdXR0b24sXG5cdFx0XHQkcHVibGlzaEJ1dHRvblRpdGxlID0gY29uZGl0aW9uc01vZGFsVUkucHVibGlzaEJ1dHRvblRpdGxlO1xuXG5cdFx0aWYgKCB0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoICkge1xuXHRcdFx0JHB1Ymxpc2hCdXR0b24uYWRkQ2xhc3MoICdxYXphbmEtYnV0dG9uLXN1Y2Nlc3MnICk7XG5cblx0XHRcdCRwdWJsaXNoQnV0dG9uVGl0bGUudGV4dCggcWF6YW5hLnRyYW5zbGF0ZSggJ3B1Ymxpc2gnICkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHB1Ymxpc2hCdXR0b24ucmVtb3ZlQ2xhc3MoICdxYXphbmEtYnV0dG9uLXN1Y2Nlc3MnICk7XG5cblx0XHRcdCRwdWJsaXNoQnV0dG9uVGl0bGUudGV4dCggcWF6YW5hLnRyYW5zbGF0ZSggJ3NhdmVfd2l0aG91dF9jb25kaXRpb25zJyApICk7XG5cdFx0fVxuXHR9LFxuXG5cdG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnVpLmJ0bkFkZFJvdy50ZXh0KCBxYXphbmEudHJhbnNsYXRlKCAnYWRkX2NvbmRpdGlvbicgKSApO1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0dGhpcy5jb2xsZWN0aW9uLmVhY2goIGZ1bmN0aW9uKCBtb2RlbCApIHtcblx0XHRcdHNlbGYuY2hlY2tDb25mbGljdHMoIG1vZGVsICk7XG5cdFx0fSk7XG5cblx0XHRfLmRlZmVyKCB0aGlzLnRvZ2dsZVB1Ymxpc2hCdXR0b25TdGF0ZS5iaW5kKCB0aGlzICkgKTtcblx0fSxcblxuXHQvLyBPdmVyd3JpdGUgdGhyIG9yaWdpbmFsICsgY2hlY2tDb25mbGljdHMuXG5cdG9uUm93Q29udHJvbENoYW5nZTogZnVuY3Rpb24oIG1vZGVsICkge1xuXHRcdHRoaXMuY2hlY2tDb25mbGljdHMoIG1vZGVsICk7XG5cdH0sXG5cblx0b25Sb3dVcGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHFhemFuYS5tb2R1bGVzLmNvbnRyb2xzLlJlcGVhdGVyLnByb3RvdHlwZS5vblJvd1VwZGF0ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cblx0XHR0aGlzLnRvZ2dsZVB1Ymxpc2hCdXR0b25TdGF0ZSgpO1xuXHR9XG59ICk7IiwibW9kdWxlLmV4cG9ydHMgPSBxYXphbmEubW9kdWxlcy5jb250cm9scy5SZXBlYXRlclJvdy5leHRlbmQoIHtcblxuXHR0ZW1wbGF0ZTogJyN0bXBsLXFhemFuYS10aGVtZS1idWlsZGVyLWNvbmRpdGlvbnMtcmVwZWF0ZXItcm93JyxcblxuXHRjaGlsZFZpZXdDb250YWluZXI6ICcucWF6YW5hLXRoZW1lLWJ1aWxkZXItY29uZGl0aW9ucy1yZXBlYXRlci1yb3ctY29udHJvbHMnLFxuXG5cdGlkOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJ3FhemFuYS1jb25kaXRpb24taWQtJyArIHRoaXMubW9kZWwuZ2V0KCAnX2lkJyApO1xuXHR9LFxuXG5cdG9uQmVmb3JlUmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXJcdHN1Yk5hbWVNb2RlbCA9IHRoaXMuY29sbGVjdGlvbi5maW5kV2hlcmUoIHtcblx0XHRcdFx0bmFtZTogJ3N1Yl9uYW1lJ1xuXHRcdFx0fSApLFxuXHRcdFx0c3ViSWRNb2RlbCA9IHRoaXMuY29sbGVjdGlvbi5maW5kV2hlcmUoIHtcblx0XHRcdFx0bmFtZTogJ3N1Yl9pZCdcblx0XHRcdH0gKSxcblx0XHRcdHN1YkNvbmRpdGlvbkNvbmZpZyA9IHRoaXMuY29uZmlnLmNvbmRpdGlvbnNbIHRoaXMubW9kZWwuYXR0cmlidXRlcy5zdWJfbmFtZSBdO1xuXG5cdFx0c3ViTmFtZU1vZGVsLmF0dHJpYnV0ZXMuZ3JvdXBzID0gdGhpcy5nZXRPcHRpb25zKCk7XG5cblx0XHRpZiAoIHN1YkNvbmRpdGlvbkNvbmZpZyAmJiBzdWJDb25kaXRpb25Db25maWcuY29udHJvbHMgKSB7XG5cdFx0XHRfKCBzdWJDb25kaXRpb25Db25maWcuY29udHJvbHMgKS5lYWNoKCBmdW5jdGlvbiggY29udHJvbCApIHtcblx0XHRcdFx0c3ViSWRNb2RlbC5zZXQoIGNvbnRyb2wgKTtcblx0XHRcdFx0c3ViSWRNb2RlbC5zZXQoICduYW1lJywgJ3N1Yl9pZCcgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH0sXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG5cdFx0cWF6YW5hLm1vZHVsZXMuY29udHJvbHMuUmVwZWF0ZXJSb3cucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG5cdFx0dGhpcy5jb25maWcgPSBxYXphbmEuY29uZmlnLnRoZW1lX2J1aWxkZXI7XG5cdH0sXG5cblx0dXBkYXRlT3B0aW9uczpmdW5jdGlvbigpIHtcblx0XHRpZiAoIHRoaXMubW9kZWwuY2hhbmdlZC5uYW1lICkge1xuXHRcdFx0dGhpcy5tb2RlbC5zZXQoe1xuXHRcdFx0XHRzdWJfbmFtZTogJycsXG5cdFx0XHRcdHN1Yl9pZDogJydcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoIHRoaXMubW9kZWwuY2hhbmdlZC5uYW1lIHx8IHRoaXMubW9kZWwuY2hhbmdlZC5zdWJfbmFtZSApIHtcblx0XHRcdHRoaXMubW9kZWwuc2V0KCAnc3ViX2lkJywgJycgKTtcblxuXHRcdFx0dmFyIHN1YklkTW9kZWwgPSB0aGlzLmNvbGxlY3Rpb24uZmluZFdoZXJlKCB7XG5cdFx0XHRcdG5hbWU6ICdzdWJfaWQnXG5cdFx0XHR9ICk7XG5cblx0XHRcdHN1YklkTW9kZWwuc2V0KCB7XG5cdFx0XHRcdHR5cGU6ICdzZWxlY3QnLFxuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Jyc6ICdBbGwnXG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9XG5cblx0XHRpZiAoIHRoaXMubW9kZWwuY2hhbmdlZC50eXBlICkge1xuXHRcdFx0dGhpcy5zZXRUeXBlQXR0cmlidXRlKCk7XG5cdFx0fVxuXHR9LFxuXG5cdGdldE9wdGlvbnM6ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0Y29uZGl0aW9uQ29uZmlnID0gc2VsZi5jb25maWcuY29uZGl0aW9uc1sgdGhpcy5tb2RlbC5nZXQoICduYW1lJyApIF07XG5cblx0XHRpZiAoICEgY29uZGl0aW9uQ29uZmlnICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0Jyc6IGNvbmRpdGlvbkNvbmZpZy5hbGxfbGFiZWxcblx0XHR9O1xuXG5cdFx0XyggY29uZGl0aW9uQ29uZmlnLnN1Yl9jb25kaXRpb25zICkuZWFjaCggZnVuY3Rpb24oIGNvbmRpdGlvbklkLCBjb25kaXRpb25JbmRleCApIHtcblx0XHRcdHZhciBzdWJDb25kaXRpb25Db25maWcgPSBzZWxmLmNvbmZpZy5jb25kaXRpb25zWyBjb25kaXRpb25JZCBdLFxuXHRcdFx0XHRncm91cDtcblxuXHRcdFx0aWYgKCAhIHN1YkNvbmRpdGlvbkNvbmZpZyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHN1YkNvbmRpdGlvbkNvbmZpZy5zdWJfY29uZGl0aW9ucy5sZW5ndGggKSB7XG5cdFx0XHRcdGdyb3VwID0ge1xuXHRcdFx0XHRcdGxhYmVsOiBzdWJDb25kaXRpb25Db25maWcubGFiZWwsXG5cdFx0XHRcdFx0b3B0aW9uczoge31cblx0XHRcdFx0fTtcblx0XHRcdFx0Z3JvdXAub3B0aW9uc1sgY29uZGl0aW9uSWQgXVx0PSBzdWJDb25kaXRpb25Db25maWcuYWxsX2xhYmVsO1xuXG5cdFx0XHRcdF8oIHN1YkNvbmRpdGlvbkNvbmZpZy5zdWJfY29uZGl0aW9ucyApLmVhY2goIGZ1bmN0aW9uKCBzdWJDb25kaXRpb25JZCApIHtcblx0XHRcdFx0XHRncm91cC5vcHRpb25zWyBzdWJDb25kaXRpb25JZCBdID0gc2VsZi5jb25maWcuY29uZGl0aW9uc1sgc3ViQ29uZGl0aW9uSWQgXS5sYWJlbDtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdC8vIFVzZSBhIHN0aW5nIGtleSAtIHRvIGtlZXAgb3JkZXJcblx0XHRcdFx0b3B0aW9uc1sgJ2tleScgKyBjb25kaXRpb25JbmRleCBdID0gZ3JvdXA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvcHRpb25zWyBjb25kaXRpb25JZCBdID0gc3ViQ29uZGl0aW9uQ29uZmlnLmxhYmVsO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdHJldHVybiBvcHRpb25zO1xuXHR9LFxuXG5cdHNldFR5cGVBdHRyaWJ1dGU6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0eXBlVmlldyA9IHRoaXMuY2hpbGRyZW4uZmluZEJ5TW9kZWwoIHRoaXMuY29sbGVjdGlvbi5maW5kV2hlcmUoIHsgbmFtZTogJ3R5cGUnIH0gKSApO1xuXG5cdFx0dHlwZVZpZXcuJGVsLmF0dHIoICdkYXRhLXFhemFuYS1jb25kaXRpb24tdHlwZScsIHR5cGVWaWV3LmdldENvbnRyb2xWYWx1ZSgpICk7XG5cdH0sXG5cblx0b25SZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuYW1lTW9kZWwgPSB0aGlzLmNvbGxlY3Rpb24uZmluZFdoZXJlKCB7XG5cdFx0XHRcdG5hbWU6ICduYW1lJ1xuXHRcdFx0fSApLFxuXHRcdFx0c3ViTmFtZU1vZGVsID0gdGhpcy5jb2xsZWN0aW9uLmZpbmRXaGVyZSgge1xuXHRcdFx0XHRuYW1lOiAnc3ViX25hbWUnXG5cdFx0XHR9ICksXG5cdFx0XHRzdWJJZE1vZGVsID0gdGhpcy5jb2xsZWN0aW9uLmZpbmRXaGVyZSgge1xuXHRcdFx0XHRuYW1lOiAnc3ViX2lkJ1xuXHRcdFx0fSApLFxuXHRcdFx0bmFtZVZpZXcgPSB0aGlzLmNoaWxkcmVuLmZpbmRCeU1vZGVsKCBuYW1lTW9kZWwgKSxcblx0XHRcdHN1Yk5hbWVWaWV3ID0gdGhpcy5jaGlsZHJlbi5maW5kQnlNb2RlbCggc3ViTmFtZU1vZGVsICksXG5cdFx0XHRzdWJJZFZpZXcgPSB0aGlzLmNoaWxkcmVuLmZpbmRCeU1vZGVsKCBzdWJJZE1vZGVsICksXG5cdFx0XHRjb25kaXRpb25Db25maWcgPSB0aGlzLmNvbmZpZy5jb25kaXRpb25zWyB0aGlzLm1vZGVsLmF0dHJpYnV0ZXMubmFtZSBdLFxuXHRcdFx0c3ViQ29uZGl0aW9uQ29uZmlnID0gdGhpcy5jb25maWcuY29uZGl0aW9uc1sgdGhpcy5tb2RlbC5hdHRyaWJ1dGVzLnN1Yl9uYW1lIF0sXG5cdFx0XHR0eXBlQ29uZmlnID0gdGhpcy5jb25maWcudHlwZXNbIHRoaXMuY29uZmlnLnNldHRpbmdzLnRlbXBsYXRlX3R5cGUgXTtcblxuXHRcdGlmICggdHlwZUNvbmZpZy5jb25kaXRpb25fdHlwZSA9PT0gbmFtZVZpZXcuZ2V0Q29udHJvbFZhbHVlKCkgJiYgJ2dlbmVyYWwnICE9PSBuYW1lVmlldy5nZXRDb250cm9sVmFsdWUoKSAmJiAhIF8uaXNFbXB0eSggY29uZGl0aW9uQ29uZmlnLnN1Yl9jb25kaXRpb25zICkgKSB7XG5cdFx0XHRuYW1lVmlldy4kZWwuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmICggISBjb25kaXRpb25Db25maWcgfHwgKCBfLmlzRW1wdHkoIGNvbmRpdGlvbkNvbmZpZy5zdWJfY29uZGl0aW9ucyApICYmIF8uaXNFbXB0eSggY29uZGl0aW9uQ29uZmlnLmNvbnRyb2xzICkgKSB8fCAhIG5hbWVWaWV3LmdldENvbnRyb2xWYWx1ZSgpIHx8ICdnZW5lcmFsJyA9PT0gbmFtZVZpZXcuZ2V0Q29udHJvbFZhbHVlKCkgKSB7XG5cdFx0XHRzdWJOYW1lVmlldy4kZWwuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmICggISBzdWJDb25kaXRpb25Db25maWcgfHwgKCBfLmlzRW1wdHkoIHN1YkNvbmRpdGlvbkNvbmZpZy5jb250cm9scyApICkgfHwgISBzdWJOYW1lVmlldy5nZXRDb250cm9sVmFsdWUoKSApIHtcblx0XHRcdHN1YklkVmlldy4kZWwuaGlkZSgpO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0VHlwZUF0dHJpYnV0ZSgpO1xuXHR9LFxuXG5cdG9uTW9kZWxDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuXHRcdHFhemFuYS5tb2R1bGVzLmNvbnRyb2xzLlJlcGVhdGVyUm93LnByb3RvdHlwZS5vbk1vZGVsQ2hhbmdlLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuXHRcdHRoaXMudXBkYXRlT3B0aW9ucygpO1xuXHR9XG59ICk7IiwiKGZ1bmN0aW9uICgkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIFRoZW1lQnVpbGRlciA9IHJlcXVpcmUoJy4vbW9kdWxlJyk7XG5cbiAgICBqUXVlcnkod2luZG93KS5vbigncWF6YW5hOmluaXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHFhemFuYS5tb2R1bGVzLnRoZW1lQnVpbGRlciA9IG5ldyBUaGVtZUJ1aWxkZXIoKTtcbiAgICAgICAgcWF6YW5hLm1vZHVsZXMudGhlbWVCdWlsZGVyLm9uUWF6YW5hSW5pdCgpO1xuICAgIH0pO1xuXG59KShqUXVlcnkpOyIsInZhciBFZGl0b3JNb2R1bGUgPSByZXF1aXJlKCdxYXphbmEtZWRpdG9yL2VkaXRvci1tb2R1bGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3JNb2R1bGUuZXh0ZW5kKHtcblxuICAgIG9uUWF6YW5hSW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0nKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhxYXphbmEubW9kdWxlcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PScpO1xuICAgICAgICBxYXphbmEuYWRkQ29udHJvbFZpZXcoJ0NvbmRpdGlvbnNfcmVwZWF0ZXInLCByZXF1aXJlKCcuL2NvbmRpdGlvbnMtcmVwZWF0ZXItY29udHJvbCcpKTtcblxuICAgICAgICBxYXphbmEuaG9va3MuYWRkRmlsdGVyKCdwYW5lbC9mb290ZXIvYmVoYXZpb3JzJywgdGhpcy5hZGRGb290ZXJCZWhhdmlvcik7XG4gICAgICAgIHFhemFuYS5ob29rcy5hZGRGaWx0ZXIoJ3BhbmVsL2hlYWRlci9iZWhhdmlvcnMnLCB0aGlzLmFkZEZvb3RlckJlaGF2aW9yKTtcblxuICAgICAgICB0aGlzLmluaXRDb25kaXRpb25zTGF5b3V0KCk7XG4gICAgfSxcblxuICAgIGFkZEZvb3RlckJlaGF2aW9yOiBmdW5jdGlvbiAoYmVoYXZpb3JzKSB7XG4gICAgICAgIGlmIChxYXphbmEuY29uZmlnLnRoZW1lX2J1aWxkZXIpIHtcbiAgICAgICAgICAgIGJlaGF2aW9ycy5zYXZlciA9IHtcbiAgICAgICAgICAgICAgICBiZWhhdmlvckNsYXNzOiByZXF1aXJlKCcuL2JlaGF2aW9ycy9wcm8tc2F2ZXItYmVoYXZpb3InKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiZWhhdmlvcnM7XG4gICAgfSxcblxuICAgIHNhdmVBbmRSZWxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcWF6YW5hLnNhdmVyLnNhdmVBdXRvU2F2ZSh7XG4gICAgICAgICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBxYXphbmEuZHluYW1pY1RhZ3MuY2xlYW5DYWNoZSgpO1xuICAgICAgICAgICAgICAgIHFhemFuYS5yZWxvYWRQcmV2aWV3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvbkFwcGx5UHJldmlldzogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNhdmVBbmRSZWxvYWQoKTtcbiAgICB9LFxuXG4gICAgb25QYWdlU2V0dGluZ3NDaGFuZ2U6IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICBpZiAobW9kZWwuY2hhbmdlZC5wcmV2aWV3X3R5cGUpIHtcbiAgICAgICAgICAgIG1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgcHJldmlld19pZDogJycsXG4gICAgICAgICAgICAgICAgcHJldmlld19zZWFyY2hfdGVybTogJydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQcmV2aWV3SWRPcHRpb25zKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFfLmlzVW5kZWZpbmVkKG1vZGVsLmNoYW5nZWQucGFnZV90ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgIHFhemFuYS5zYXZlci5zYXZlQXV0b1NhdmUoe1xuICAgICAgICAgICAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBxYXphbmEucmVsb2FkUHJldmlldygpO1xuXG4gICAgICAgICAgICAgICAgICAgIHFhemFuYS5vbmNlKCdwcmV2aWV3OmxvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHFhemFuYS5nZXRQYW5lbFZpZXcoKS5zZXRQYWdlKCdwYWdlX3NldHRpbmdzJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZVByZXZpZXdJZE9wdGlvbnM6IGZ1bmN0aW9uIChyZW5kZXIpIHtcbiAgICAgICAgdmFyIHByZXZpZXdUeXBlID0gcWF6YW5hLnNldHRpbmdzLnBhZ2UubW9kZWwuZ2V0KCdwcmV2aWV3X3R5cGUnKTtcbiAgICAgICAgaWYgKCFwcmV2aWV3VHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHByZXZpZXdUeXBlID0gcHJldmlld1R5cGUuc3BsaXQoJy8nKTtcblxuICAgICAgICB2YXIgY3VycmVudFZpZXcgPSBxYXphbmEuZ2V0UGFuZWxWaWV3KCkuZ2V0Q3VycmVudFBhZ2VWaWV3KCksXG4gICAgICAgICAgICBjb250cm9sTW9kZWwgPSBjdXJyZW50Vmlldy5jb2xsZWN0aW9uLmZpbmRXaGVyZSh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3ByZXZpZXdfaWQnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAoJ2F1dGhvcicgPT09IHByZXZpZXdUeXBlWzFdKSB7XG4gICAgICAgICAgICBjb250cm9sTW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJfdHlwZTogJ2F1dGhvcicsXG4gICAgICAgICAgICAgICAgb2JqZWN0X3R5cGU6ICdhdXRob3InXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICgndGF4b25vbXknID09PSBwcmV2aWV3VHlwZVswXSkge1xuICAgICAgICAgICAgY29udHJvbE1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgZmlsdGVyX3R5cGU6ICd0YXhvbm9teScsXG4gICAgICAgICAgICAgICAgb2JqZWN0X3R5cGU6IHByZXZpZXdUeXBlWzFdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICgnc2luZ2xlJyA9PT0gcHJldmlld1R5cGVbMF0pIHtcbiAgICAgICAgICAgIGNvbnRyb2xNb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgIGZpbHRlcl90eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgb2JqZWN0X3R5cGU6IHByZXZpZXdUeXBlWzFdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRyb2xNb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgIGZpbHRlcl90eXBlOiAnJyxcbiAgICAgICAgICAgICAgICBvYmplY3RfdHlwZTogJydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRydWUgPT09IHJlbmRlcikgeyAvLyBDYW4gYmUgbW9kZWwuXG5cbiAgICAgICAgICAgIHZhciBjb250cm9sVmlldyA9IGN1cnJlbnRWaWV3LmNoaWxkcmVuLmZpbmRCeU1vZGVsKGNvbnRyb2xNb2RlbCk7XG5cbiAgICAgICAgICAgIGNvbnRyb2xWaWV3LnJlbmRlcigpO1xuXG4gICAgICAgICAgICBjb250cm9sVmlldy4kZWwudG9nZ2xlKCEhY29udHJvbE1vZGVsLmdldCgnZmlsdGVyX3R5cGUnKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25RYXphbmFQcmV2aWV3TG9hZGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghcWF6YW5hLmNvbmZpZy50aGVtZV9idWlsZGVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBxYXphbmEuZ2V0UGFuZWxWaWV3KCkub24oJ3NldDpwYWdlOnBhZ2Vfc2V0dGluZ3MnLCB0aGlzLnVwZGF0ZVByZXZpZXdJZE9wdGlvbnMpO1xuXG4gICAgICAgIHFhemFuYS5zZXR0aW5ncy5wYWdlLm1vZGVsLm9uKCdjaGFuZ2UnLCB0aGlzLm9uUGFnZVNldHRpbmdzQ2hhbmdlLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHFhemFuYS5jaGFubmVscy5lZGl0b3Iub24oJ3FhemFuYVRoZW1lQnVpbGRlcjpBcHBseVByZXZpZXcnLCB0aGlzLm9uQXBwbHlQcmV2aWV3LmJpbmQodGhpcykpO1xuXG4gICAgICAgIC8vIFNjcm9sbCB0byBFZGl0b3IuIFRpbWVvdXQgYWNjb3JkaW5nIHRvIHByZXZpZXcgcmVzaXplIGNzcyBhbmltYXRpb24gZHVyYXRpb24uXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcWF6YW5hLiRwcmV2aWV3Q29udGVudHMuZmluZCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogcWF6YW5hLiRwcmV2aWV3Q29udGVudHMuZmluZCgnI3FhemFuYScpLm9mZnNldCgpLnRvcCAtIHFhemFuYS4kcHJldmlld1swXS5jb250ZW50V2luZG93LmlubmVySGVpZ2h0IC8gMlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfSxcblxuICAgIHNob3dDb25kaXRpb25zTW9kYWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIFRoZW1lVGVtcGxhdGVDb25kaXRpb25zVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvY29uZGl0aW9ucy12aWV3JyksXG4gICAgICAgICAgICB0aGVtZUJ1aWxkZXJNb2R1bGUgPSBxYXphbmEuY29uZmlnLnRoZW1lX2J1aWxkZXIsXG4gICAgICAgICAgICBzZXR0aW5ncyA9IHRoZW1lQnVpbGRlck1vZHVsZS5zZXR0aW5ncztcblxuICAgICAgICB2YXIgbW9kZWwgPSBuZXcgcWF6YW5hLm1vZHVsZXMuZWxlbWVudHMubW9kZWxzLkJhc2VTZXR0aW5ncyhzZXR0aW5ncywge1xuICAgICAgICAgICAgY29udHJvbHM6IHRoZW1lQnVpbGRlck1vZHVsZS50ZW1wbGF0ZV9jb25kaXRpb25zLmNvbnRyb2xzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY29uZGl0aW9uc0xheW91dC5tb2RhbENvbnRlbnQuc2hvdyhuZXcgVGhlbWVUZW1wbGF0ZUNvbmRpdGlvbnNWaWV3KHtcbiAgICAgICAgICAgIG1vZGVsOiBtb2RlbCxcbiAgICAgICAgICAgIGNvbnRyb2xzOiBtb2RlbC5jb250cm9sc1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgdGhpcy5jb25kaXRpb25zTGF5b3V0Lm1vZGFsLnNob3coKTtcbiAgICB9LFxuXG4gICAgaW5pdENvbmRpdGlvbnNMYXlvdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIENvbmRpdGlvbnNMYXlvdXQgPSByZXF1aXJlKCcuL3ZpZXdzL2NvbmRpdGlvbnMtbGF5b3V0Jyk7XG5cbiAgICAgICAgdGhpcy5jb25kaXRpb25zTGF5b3V0ID0gbmV3IENvbmRpdGlvbnNMYXlvdXQoKTtcbiAgICB9XG59KTsiLCJ2YXIgQmFzZU1vZGFsTGF5b3V0ID0gcWF6YW5hLm1vZHVsZXMuY29tcG9uZW50cy50ZW1wbGF0ZUxpYnJhcnkudmlld3MuQmFzZU1vZGFsTGF5b3V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VNb2RhbExheW91dC5leHRlbmQoIHtcblxuXHRnZXRNb2RhbE9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpZDogJ3FhemFuYS1jb25kaXRpb25zLW1vZGFsJ1xuXHRcdH07XG5cdH0sXG5cblx0Z2V0TG9nb09wdGlvbnM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0aXRsZTogcWF6YW5hLnRyYW5zbGF0ZSggJ2Rpc3BsYXlfY29uZGl0aW9ucycgKVxuXHRcdH07XG5cdH0sXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cdFx0QmFzZU1vZGFsTGF5b3V0LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuXHRcdHRoaXMuc2hvd0xvZ28oKTtcblx0fVxufSApOyIsInZhciBpbmxpbmVDb250cm9sc1N0YWNrID0gcmVxdWlyZSggJ3FhemFuYS1lZGl0b3IvaW5saW5lLWNvbnRyb2xzLXN0YWNrLmpzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlubGluZUNvbnRyb2xzU3RhY2suZXh0ZW5kKCB7XG5cdGlkOiAncWF6YW5hLXRoZW1lLWJ1aWxkZXItY29uZGl0aW9ucy12aWV3JyxcblxuXHR0ZW1wbGF0ZTogJyN0bXBsLXFhemFuYS10aGVtZS1idWlsZGVyLWNvbmRpdGlvbnMtdmlldycsXG5cblx0Y2hpbGRWaWV3Q29udGFpbmVyOiAnI3FhemFuYS10aGVtZS1idWlsZGVyLWNvbmRpdGlvbnMtY29udHJvbHMnLFxuXG5cdHVpOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdWkgPSBpbmxpbmVDb250cm9sc1N0YWNrLnByb3RvdHlwZS51aS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cblx0XHR1aS5wdWJsaXNoQnV0dG9uID0gJyNxYXphbmEtdGhlbWUtYnVpbGRlci1jb25kaXRpb25zX19wdWJsaXNoJztcblxuXHRcdHVpLnB1Ymxpc2hCdXR0b25UaXRsZSA9ICcjcWF6YW5hLXRoZW1lLWJ1aWxkZXItY29uZGl0aW9uc19fcHVibGlzaF9fdGl0bGUnO1xuXG5cdFx0cmV0dXJuIHVpO1xuXHR9LFxuXG5cdGV2ZW50czoge1xuXHRcdCdjbGljayBAdWkucHVibGlzaEJ1dHRvbic6ICdvbkNsaWNrUHVibGlzaCdcblx0fSxcblxuXHR0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0aXRsZTogcWF6YW5hLnRyYW5zbGF0ZSggJ2NvbmRpdGlvbnNfdGl0bGUnICksXG5cdFx0XHRkZXNjcmlwdGlvbjogcWF6YW5hLnRyYW5zbGF0ZSggJ2NvbmRpdGlvbnNfZGVzY3JpcHRpb24nIClcblx0XHR9O1xuXHR9LFxuXG5cdGNoaWxkVmlld09wdGlvbnM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRlbGVtZW50U2V0dGluZ3NNb2RlbDogdGhpcy5tb2RlbFxuXHRcdH07XG5cdH0sXG5cblx0b25DbGlja1B1Ymxpc2g6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHQkYnV0dG9uID0galF1ZXJ5KCBldmVudC5jdXJyZW50VGFyZ2V0ICksXG5cdFx0XHRkYXRhID0gdGhpcy5tb2RlbC50b0pTT04oIHsgcmVtb3ZlRGVmYXVsdDogdHJ1ZSB9ICk7XG5cblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdCRidXR0b25cblx0XHRcdC5hdHRyKCAnZGlzYWJsZWQnLCB0cnVlIClcblx0XHRcdC5hZGRDbGFzcyggJ3FhemFuYS1idXR0b24tc3RhdGUnICk7XG5cblx0XHQvLyBQdWJsaXNoLlxuXHRcdHFhemFuYS5hamF4LmFkZFJlcXVlc3QoICd0aGVtZV9idWlsZGVyX3NhdmVfY29uZGl0aW9ucycsIHtcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cWF6YW5hLmNvbmZpZy50aGVtZV9idWlsZGVyLnNldHRpbmdzLmNvbmRpdGlvbnMgPSBzZWxmLm1vZGVsLmdldCggJ2NvbmRpdGlvbnMnICk7XG5cdFx0XHRcdHFhemFuYS5zYXZlci5wdWJsaXNoKCk7XG5cdFx0XHR9LFxuXHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxmLmFmdGVyQWpheCggJGJ1dHRvbiApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblxuXHRhZnRlckFqYXg6IGZ1bmN0aW9uKCAkYnV0dG9uICkge1xuXHRcdCRidXR0b25cblx0XHRcdC5hdHRyKCAnZGlzYWJsZWQnLCBmYWxzZSApXG5cdFx0XHQucmVtb3ZlQ2xhc3MoICdxYXphbmEtYnV0dG9uLXN0YXRlJyApO1xuXG5cdFx0cWF6YW5hLm1vZHVsZXMudGhlbWVCdWlsZGVyLmNvbmRpdGlvbnNMYXlvdXQubW9kYWwuaGlkZSgpO1xuXHR9XG59ICk7Il19
