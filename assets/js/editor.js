(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TagPanelView = require( 'qazana-dynamic-tags/tag-panel-view' );

module.exports = Marionette.Behavior.extend( {

	tagView: null,

	listenerAttached: false,

	ui: {
		tagArea: '.qazana-control-tag-area',
		dynamicSwitcher: '.qazana-control-dynamic-switcher'
	},

	events: {
		'click @ui.dynamicSwitcher': 'onDynamicSwitcherClick'
	},

	initialize: function() {
		if ( ! this.listenerAttached ) {
			this.listenTo( this.view.options.elementSettingsModel, 'change:external:__dynamic__', this.onAfterExternalChange );
			this.listenerAttached = true;
		}
	},

	renderTools: function() {
		if ( this.getOption( 'dynamicSettings' )['default'] ) {
			return;
		}

		var $dynamicSwitcher = jQuery( Marionette.Renderer.render( '#tmpl-qazana-control-dynamic-switcher' ) );

		this.ui.controlTitle[ this.view.model.get( 'label_block' ) ? 'after' : 'before' ]( $dynamicSwitcher );

		this.ui.dynamicSwitcher = this.$el.find( this.ui.dynamicSwitcher.selector );
	},

	toggleDynamicClass: function() {
		this.$el.toggleClass( 'qazana-control-dynamic-value', this.isDynamicMode() );
	},

	isDynamicMode: function() {
		var dynamicSettings = this.view.elementSettingsModel.get( '__dynamic__' );

		return ! ! ( dynamicSettings && dynamicSettings[ this.view.model.get( 'name' ) ] );
	},

	createTagsList: function() {
		var tags = _.groupBy( this.getOption( 'tags' ), 'group' ),
			groups = qazana.dynamicTags.getConfig( 'groups' ),
			$tagsList = this.ui.tagsList = jQuery( '<div>', { 'class': 'qazana-tags-list' } ),
			$tagsListInner = jQuery( '<div>', { 'class': 'qazana-tags-list__inner' } );

		$tagsList.append( $tagsListInner );

		jQuery.each( groups, function( groupName ) {
			var groupTags = tags[ groupName ];

			if ( ! groupTags ) {
				return;
			}

			var group = this,
				$groupTitle = jQuery( '<div>', { 'class': 'qazana-tags-list__group-title' } ).text( group.title );

			$tagsListInner.append( $groupTitle );

			groupTags.forEach( function( tag ) {
				var $tag = jQuery( '<div>', { 'class': 'qazana-tags-list__item' } );

				$tag.text( tag.title ).attr( 'data-tag-name', tag.name );

				$tagsListInner.append( $tag );
			} );
		} );

		$tagsListInner.on( 'click', '.qazana-tags-list__item', this.onTagsListItemClick.bind( this ) );

		qazana.$body.append( $tagsList );
	},

	getTagsList: function() {
		if ( ! this.ui.tagsList ) {
			this.createTagsList();
		}

		return this.ui.tagsList;
	},

	toggleTagsList: function() {
		var $tagsList = this.getTagsList();

		if ( $tagsList.is( ':visible' ) ) {
			$tagsList.hide();

			return;
		}

		$tagsList.show().position( {
			my: 'right top',
			at: 'right bottom+5',
			of: this.ui.dynamicSwitcher
		} );
	},

	setTagView: function( id, name, settings ) {
		if ( this.tagView ) {
			this.tagView.destroy();
		}

		var tagView = this.tagView = new TagPanelView( {
			id: id,
			name: name,
			settings: settings,
			dynamicSettings: this.getOption( 'dynamicSettings' )
		} );

		tagView.render();

		this.ui.tagArea.after( tagView.el );

		this.listenTo( tagView.model, 'change', this.onTagViewModelChange.bind( this ) )
			.listenTo( tagView, 'remove', this.onTagViewRemove.bind( this ) );
	},

	setDefaultTagView: function() {
		var tagData = qazana.dynamicTags.tagTextToTagData( this.getDynamicValue() );

		this.setTagView( tagData.id, tagData.name, tagData.settings );
	},

	tagViewToTagText: function() {
		var tagView = this.tagView;

		return qazana.dynamicTags.tagDataToTagText( tagView.getOption( 'id' ), tagView.getOption( 'name' ), tagView.model );
	},

	getDynamicValue: function() {
		return this.view.elementSettingsModel.get( '__dynamic__' )[ this.view.model.get( 'name' ) ];
	},

	getDynamicControlSettings: function() {
		return {
			control: {
				name: '__dynamic__',
				label: this.view.model.get( 'label' )
			}
		};
	},

	setDynamicValue: function( value ) {
		var settingKey = this.view.model.get( 'name' ),
			dynamicSettings = this.view.elementSettingsModel.get( '__dynamic__' ) || {};

		dynamicSettings = qazana.helpers.cloneObject( dynamicSettings );

		dynamicSettings[ settingKey ] = value;

		this.view.elementSettingsModel.set( '__dynamic__', dynamicSettings, this.getDynamicControlSettings( settingKey ) );

		this.toggleDynamicClass();
	},

	destroyTagView: function() {
		if ( this.tagView ) {
			this.tagView.destroy();

			this.tagView = null;
		}
	},

	onRender: function() {
		this.$el.addClass( 'qazana-control-dynamic' );

		this.renderTools();

		this.toggleDynamicClass();

		if ( this.isDynamicMode() ) {
			this.setDefaultTagView();
		}
	},

	onDynamicSwitcherClick: function() {
		this.toggleTagsList();
	},

	onTagsListItemClick: function( event ) {
		var $tag = jQuery( event.currentTarget );

		this.setTagView( qazana.helpers.getUniqueID(), $tag.data( 'tagName' ), {} );

		this.setDynamicValue( this.tagViewToTagText() );

		this.toggleTagsList();

		if ( this.tagView.getTagConfig().settings_required ) {
			this.tagView.showSettingsPopup();
		}
	},

	onTagViewModelChange: function() {
		this.setDynamicValue( this.tagViewToTagText() );
	},

	onTagViewRemove: function() {
		var settingKey = this.view.model.get( 'name' ),
			dynamicSettings = this.view.elementSettingsModel.get( '__dynamic__' );

		dynamicSettings = qazana.helpers.cloneObject( dynamicSettings );

		delete dynamicSettings[settingKey ];

		if ( Object.keys( dynamicSettings ).length ) {
			this.view.elementSettingsModel.set( '__dynamic__', dynamicSettings, this.getDynamicControlSettings( settingKey ) );
		} else {
			this.view.elementSettingsModel.unset( '__dynamic__', this.getDynamicControlSettings( settingKey ) );
		}

		this.toggleDynamicClass();
	},

	onAfterExternalChange: function() {
		this.destroyTagView();

		if ( this.isDynamicMode() ) {
			this.setDefaultTagView();
		}

		this.toggleDynamicClass();
	},

	onDestroy: function() {
		this.destroyTagView();
	}
} );

},{"qazana-dynamic-tags/tag-panel-view":5}],2:[function(require,module,exports){
var Module = require( 'qazana-utils/module' ),
	SettingsModel = require( 'qazana-elements/models/base-settings' );

module.exports = Module.extend( {

	CACHE_KEY_NOT_FOUND_ERROR: 'Cache key not found',

	tags: {
		Base: require( 'qazana-dynamic-tags/tag' )
	},

	cache: {},

	cacheRequests: {},

	cacheCallbacks: [],

	addCacheRequest: function( tag ) {
		this.cacheRequests[ this.createCacheKey( tag ) ] = true;
	},

	createCacheKey: function( tag ) {
		return btoa( tag.getOption( 'name' ) ) + '-' + btoa( encodeURIComponent( JSON.stringify( tag.model ) ) );
	},

	loadTagDataFromCache: function( tag ) {
		var cacheKey = this.createCacheKey( tag );

		if ( undefined !== this.cache[ cacheKey ] ) {
			return this.cache[ cacheKey ];
		}

		if ( ! this.cacheRequests[ cacheKey ] ) {
			this.addCacheRequest( tag );
		}
	},

	loadCacheRequests: function() {
		var cache = this.cache,
			cacheRequests = this.cacheRequests,
			cacheCallbacks = this.cacheCallbacks;

		this.cacheRequests = {};

		this.cacheCallbacks = [];

		qazana.ajax.send( 'render_tags', {
			data: {
				post_id: qazana.config.document.id,
				tags: Object.keys( cacheRequests )
			},
			success: function( data ) {
				jQuery.extend( cache, data );

				cacheCallbacks.forEach( function( callback ) {
					callback();
				} );
			}
		} );
	},

	refreshCacheFromServer: function( callback ) {
		this.cacheCallbacks.push( callback );

		this.loadCacheRequests();
	},

	getConfig: function( key ) {
		return this.getItems( qazana.config.dynamicTags, key );
	},

	parseTagsText: function( text, settings, parseCallback ) {
		var self = this;

		if ( 'object' === settings.returnType ) {
			return self.parseTagText( text, settings, parseCallback );
		}

		return text.replace( /\[qazana-tag[^\]]+]/g, function( tagText ) {
			return self.parseTagText( tagText, settings, parseCallback );
		} );
	},

	parseTagText: function( tagText, settings, parseCallback ) {
		var tagData = this.tagTextToTagData( tagText );

		if ( ! tagData ) {
			if ( 'object' === settings.returnType ) {
				return {};
			}

			return '';
		}

		return parseCallback( tagData.id, tagData.name, tagData.settings );
	},

	tagTextToTagData: function( tagText ) {
		var tagIDMatch = tagText.match( /id="(.*?(?="))"/ ),
			tagNameMatch = tagText.match( /name="(.*?(?="))"/ ),
			tagSettingsMatch = tagText.match( /settings="(.*?(?="]))/ );

		if ( ! tagIDMatch || ! tagNameMatch || ! tagSettingsMatch ) {
			return false;
		}

		return {
			id: tagIDMatch[1],
			name: tagNameMatch[1],
			settings: JSON.parse( decodeURIComponent( tagSettingsMatch[1] ) )
		};
	},

	createTag: function( tagID, tagName, tagSettings ) {
		var tagConfig = this.getConfig( 'tags.' + tagName );

		if ( ! tagConfig ) {
			return;
		}

		var TagClass = this.tags[ tagName ] || this.tags.Base,
			model = new SettingsModel( tagSettings, {
				controls: tagConfig.controls
			} );

		return new TagClass( { id: tagID, name: tagName, model: model } );
	},

	getTagDataContent: function( tagID, tagName, tagSettings ) {
		var tag = this.createTag( tagID, tagName, tagSettings );

		if ( ! tag ) {
			return;
		}

		return tag.getContent();
	},

	tagDataToTagText: function( tagID, tagName, tagSettings ) {
		tagSettings = encodeURIComponent( JSON.stringify( tagSettings && tagSettings.toJSON( { removeDefault: true } ) || {} ) );

		return '[qazana-tag id="' + tagID + '" name="' + tagName + '" settings="' + tagSettings + '"]';
	},

	cleanCache: function() {
		this.cache = {};
	},

	onInit: function() {
		this.loadCacheRequests = _.debounce( this.loadCacheRequests, 300 );
	}
} );

},{"qazana-dynamic-tags/tag":6,"qazana-elements/models/base-settings":71,"qazana-utils/module":140}],3:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	className: 'qazana-tag-controls-stack-empty',

	template: '#tmpl-qazana-tag-controls-stack-empty'
} );

},{}],4:[function(require,module,exports){
var ControlsStack = require( 'qazana-views/controls-stack' ),
	EmptyView = require( 'qazana-dynamic-tags/tag-controls-stack-empty' );

module.exports = ControlsStack.extend( {
	activeTab: 'content',

	template: _.noop,

	emptyView: EmptyView,

	isEmpty: function() {
		// Ignore the section control
		return this.collection.length < 2;
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model
		};
	},

	onRenderTemplate: function() {
		this.activateFirstSection();
	}
} );

},{"qazana-dynamic-tags/tag-controls-stack-empty":3,"qazana-views/controls-stack":135}],5:[function(require,module,exports){
var TagControlsStack = require( 'qazana-dynamic-tags/tag-controls-stack' ),
	SettingsModel = require( 'qazana-elements/models/base-settings' );

module.exports = Marionette.ItemView.extend( {

	className: 'qazana-dynamic-cover qazana-input-style',

	tagControlsStack: null,

	templateHelpers: function() {
		var helpers = {};
		if ( this.model ) {
			helpers.controls = this.model.options.controls;
		}

		return helpers;
	},

	ui: {
		remove: '.qazana-dynamic-cover__remove'
	},

	events: function() {
		var events = {
			'click @ui.remove': 'onRemoveClick'
		};

		if ( this.hasSettings() ) {
			events.click = 'onClick';
		}

		return events;
	},

	getTemplate: function() {
		var config = this.getTagConfig(),
			templateFunction = Marionette.TemplateCache.get( '#tmpl-qazana-control-dynamic-cover' ),
			renderedTemplate = Marionette.Renderer.render( templateFunction, {
				hasSettings: this.hasSettings(),
				isRemovable: ! this.getOption( 'dynamicSettings' )['default'],
				title: config.title,
				content: config.panel_template
			} );

		return Marionette.TemplateCache.prototype.compileTemplate( renderedTemplate.trim() );
	},

	getTagConfig: function() {
		return qazana.dynamicTags.getConfig( 'tags.' + this.getOption( 'name' ) );
	},

	initSettingsPopup: function() {
		var settingsPopupOptions = {
			className: 'qazana-tag-settings-popup',
			position: {
				my: 'left top+5',
				at: 'left bottom',
				of: this.$el,
				autoRefresh: true
			}
		};

		var settingsPopup = qazana.dialogsManager.createWidget( 'buttons', settingsPopupOptions );

		this.getSettingsPopup = function() {
			return settingsPopup;
		};
	},

	hasSettings: function() {
		return !! Object.values( this.getTagConfig().controls ).length;
	},

	showSettingsPopup: function() {
		if ( ! this.tagControlsStack ) {
			this.initTagControlsStack();
		}

		var settingsPopup = this.getSettingsPopup();

		if ( settingsPopup.isVisible() ) {
			return;
		}

		settingsPopup.show();
	},

	initTagControlsStack: function() {
		this.tagControlsStack = new TagControlsStack( {
			model: this.model,
			controls: this.model.controls,
			el: this.getSettingsPopup().getElements( 'message' )[0]
		} );

		this.tagControlsStack.render();
	},

	initModel: function() {
		this.model = new SettingsModel( this.getOption( 'settings' ), {
			controls: this.getTagConfig().controls
		} );
	},

	initialize: function() {
		if ( ! this.hasSettings() ) {
			return;
		}

		this.initModel();

		this.initSettingsPopup();

		this.listenTo( this.model, 'change', this.render );
	},

	onClick: function() {
		this.showSettingsPopup();
	},

	onRemoveClick: function( event ) {
		event.stopPropagation();

		this.destroy();

		this.trigger( 'remove' );
	},

	onDestroy: function() {
		if ( this.hasSettings() ) {
			this.getSettingsPopup().destroy();
		}
	}
} );

},{"qazana-dynamic-tags/tag-controls-stack":4,"qazana-elements/models/base-settings":71}],6:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {

	hasTemplate: true,

	tagName: 'span',

	className: function() {
		return 'qazana-tag';
	},

	getTemplate: function() {
		if ( ! this.hasTemplate ) {
			return false;
		}

		return Marionette.TemplateCache.get( '#tmpl-qazana-tag-' + this.getOption( 'name' ) + '-content' );
	},

	initialize: function() {
		try {
			this.getTemplate();
		} catch ( e ) {
			this.hasTemplate = false;
		}
	},

	getConfig: function( key ) {
		var config = qazana.dynamicTags.getConfig( 'tags.' + this.getOption( 'name' ) );

		if ( key ) {
			return config[ key ];
		}

		return config;
	},

	getContent: function() {
		var contentType = this.getConfig( 'content_type' ),
			data;

		if ( ! this.hasTemplate ) {
			data = qazana.dynamicTags.loadTagDataFromCache( this );

			if ( undefined === data ) {
				throw new Error( qazana.dynamicTags.CACHE_KEY_NOT_FOUND_ERROR );
			}
		}

		if ( 'ui' === contentType ) {
			this.render();

			if ( this.hasTemplate ) {
				return this.el.outerHTML;
			}

			if ( this.getConfig( 'wrapped_tag' ) ) {
				data = jQuery( data ).html();
			}

			this.$el.html( data );
		}

		return data;
	},

	onRender: function() {
		this.el.id = 'qazana-tag-' + this.getOption( 'id' );
	}
} );

},{}],7:[function(require,module,exports){
module.exports = Marionette.Behavior.extend( {
	previewWindow: null,

	ui: function() {
		return {
			buttonPreview: '#qazana-panel-saver-button-preview',
			buttonPublish: '#qazana-panel-saver-button-publish',
			buttonSaveOptions: '#qazana-panel-saver-button-save-options',
			buttonPublishLabel: '#qazana-panel-saver-button-publish-label',
			menuSaveDraft: '#qazana-panel-saver-menu-save-draft',
			lastEditedWrapper: '.qazana-last-edited-wrapper'
		};
	},

	events: function() {
		return {
			'click @ui.buttonPreview': 'onClickButtonPreview',
			'click @ui.buttonPublish': 'onClickButtonPublish',
			'click @ui.menuSaveDraft': 'onClickMenuSaveDraft'
		};
	},

	initialize: function() {
		qazana.saver
			.on( 'before:save', this.onBeforeSave.bind( this ) )
			.on( 'after:save', this.onAfterSave.bind( this ) )
			.on( 'after:saveError', this.onAfterSaveError.bind( this ) )
			.on( 'page:status:change', this.onPageStatusChange );

		qazana.settings.page.model.on( 'change', this.onPageSettingsChange.bind( this ) );

		qazana.channels.editor.on( 'status:change', this.activateSaveButtons.bind( this ) );
	},

	activateSaveButtons: function( hasChanges ) {
		hasChanges = hasChanges || 'draft' === qazana.settings.page.model.get( 'post_status' );

		this.ui.buttonPublish.add( this.ui.menuSaveDraft ).toggleClass( 'qazana-saver-disabled', ! hasChanges );
		this.ui.buttonSaveOptions.toggleClass( 'qazana-saver-disabled', ! hasChanges );
	},

	onRender: function() {
		this.setMenuItems( qazana.settings.page.model.get( 'post_status' ) );
		this.addTooltip();
	},

	onPageSettingsChange: function( settings ) {
		var changed = settings.changed;

		if ( ! _.isUndefined( changed.post_status ) ) {
			this.setMenuItems( changed.post_status );

			this.refreshWpPreview();

			// Refresh page-settings post-status value.
			if ( 'page_settings' === qazana.getPanelView().getCurrentPageName() ) {
				qazana.getPanelView().getCurrentPageView().render();
			}
		}
	},

	onPageStatusChange: function( newStatus ) {
		if ( 'publish' === newStatus ) {
			qazana.notifications.showToast( {
				message: qazana.config.document.panel.messages.publish_notification,
				buttons: [
					{
						name: 'view_page',
						text: qazana.translate( 'have_a_look' ),
						callback: function() {
							open( qazana.config.document.urls.permalink );
						}
					}
				]
			} );
		}
	},

	onBeforeSave: function( options ) {
		NProgress.start();
		if ( 'autosave' === options.status ) {
			this.ui.lastEditedWrapper.addClass( 'qazana-state-active' );
		} else {
			this.ui.buttonPublish.addClass( 'qazana-button-state' );
		}
	},

	onAfterSave: function( data ) {
		NProgress.done();
		this.ui.buttonPublish.removeClass( 'qazana-button-state' );
		this.ui.lastEditedWrapper.removeClass( 'qazana-state-active' );
		this.refreshWpPreview();
		this.setLastEdited( data );
	},

	setLastEdited: function( data ) {
		this.ui.lastEditedWrapper
			.removeClass( 'qazana-button-state' )
			.find( '.qazana-last-edited' )
			.html( data.config.last_edited );
	},

	onAfterSaveError: function() {
		NProgress.done();
		this.ui.buttonPublish.removeClass( 'qazana-button-state' );
	},

	onClickButtonPreview: function() {
		// Open immediately in order to avoid popup blockers.
		this.previewWindow = open( qazana.config.document.urls.wp_preview, 'wp-preview-' + qazana.config.document.id );

		if ( qazana.saver.isEditorChanged() ) {
			// Force save even if it's saving now.
			if ( qazana.saver.isSaving ) {
				qazana.saver.isSaving = false;
			}

			qazana.saver.doAutoSave();
		}
	},

	onClickButtonPublish: function() {
		var postStatus = qazana.settings.page.model.get( 'post_status' );

		if ( this.ui.buttonPublish.hasClass( 'qazana-saver-disabled' ) ) {
			return;
		}

		switch ( postStatus ) {
			case 'publish':
			case 'private':
				qazana.saver.update();
				break;
			case 'draft':
				if ( qazana.config.current_user_can_publish ) {
					qazana.saver.publish();
				} else {
					qazana.saver.savePending();
				}
				break;
			case 'pending': // User cannot change post status
			case undefined: // TODO: as a contributor it's undefined instead of 'pending'.
				if ( qazana.config.current_user_can_publish ) {
					qazana.saver.publish();
				} else {
					qazana.saver.update();
				}
				break;
		}
	},

	onClickMenuSaveDraft: function() {
		qazana.saver.saveDraft();
	},

	setMenuItems: function( postStatus ) {
		var publishLabel = 'publish';

		switch ( postStatus ) {
			case 'publish':
			case 'private':
				publishLabel = 'update';

				if ( qazana.config.current_revision_id !== qazana.config.document.id ) {
					this.activateSaveButtons( true );
				}

				break;
			case 'draft':
				if ( ! qazana.config.current_user_can_publish ) {
					publishLabel = 'submit';
				}

				this.activateSaveButtons( true );
				break;
			case 'pending': // User cannot change post status
			case undefined: // TODO: as a contributor it's undefined instead of 'pending'.
				if ( ! qazana.config.current_user_can_publish ) {
					publishLabel = 'update';
				}
				break;
		}

		this.ui.buttonPublishLabel.html( qazana.translate( publishLabel ) );
	},

	addTooltip: function() {
		// Create tooltip on controls
		this.$el.find( '.tooltip-target' ).tipsy( {
			// `n` for down, `s` for up
			gravity: 's',
			title: function() {
				return this.getAttribute( 'data-tooltip' );
			}
		} );
	},

	refreshWpPreview: function() {
		if ( this.previewWindow ) {
			// Refresh URL form updated config.
			try {
				this.previewWindow.location.href = qazana.config.document.urls.wp_preview;
			} catch ( e ) {
				// If the this.previewWindow is closed or it's domain was changed.
				// Do nothing.
			}
		}
	}
} );

},{}],8:[function(require,module,exports){
var FooterSaver = require('./footer-saver');

module.exports = FooterSaver.extend({

	ui: function() {
		return {
			buttonPreview: '#qazana-panel-header-saver-button-preview',
			buttonPublish: '#qazana-panel-header-saver-button-publish',
			buttonSaveOptions: '#qazana-panel-header-saver-button-save-options',
			buttonPublishLabel: '#qazana-panel-header-saver-button-publish-label',
			menuSaveDraft: '#qazana-panel-header-saver-button-save-draft',
			lastEditedWrapper: '.qazana-last-edited-wrapper'
		};
    },

    addTooltip: function () {
        // Create tooltip on controls
        this.$el.find('.tooltip-target').tipsy({
            gravity: function () {
                // `n` for down, `s` for up
                var gravity = jQuery(this).data('tooltip-pos');

                if (undefined !== gravity) {
                    return gravity;
                } else {
                    return 'n';
                }
            },
            title: function () {
                return this.getAttribute('data-tooltip');
            }
        });
    },

    activateSaveButtons: function (hasChanges) {
        hasChanges = hasChanges || 'draft' === qazana.settings.page.model.get('post_status');

        this.ui.buttonPublish.add(this.ui.menuSaveDraft).toggleClass('qazana-saver-disabled', !hasChanges);
        this.ui.buttonSaveOptions.toggleClass('qazana-saver-disabled', !hasChanges);
    },
    
} );

},{"./footer-saver":7}],9:[function(require,module,exports){
var Module = require( 'qazana-utils/module' );

module.exports = Module.extend( {
	autoSaveTimer: null,

	autosaveInterval: qazana.config.autosave_interval * 1000,

	isSaving: false,

	isChangedDuringSave: false,

	__construct: function() {
		this.setWorkSaver();
	},

	startTimer: function( hasChanges ) {
		clearTimeout( this.autoSaveTimer );
		if ( hasChanges ) {
			this.autoSaveTimer = setTimeout( _.bind( this.doAutoSave, this ), this.autosaveInterval );
		}
	},

	saveDraft: function() {
		var postStatus = qazana.settings.page.model.get( 'post_status' );

		if ( ! qazana.saver.isEditorChanged() && 'draft' !== postStatus ) {
			return;
		}

		switch ( postStatus ) {
			case 'publish':
			case 'private':
				this.doAutoSave();
				break;
			default:
				// Update and create a revision
				this.update();
		}
	},

	doAutoSave: function() {
		var editorMode = qazana.channels.dataEditMode.request( 'activeMode' );

		// Avoid auto save for Revisions Preview changes.
		if ( 'edit' !== editorMode ) {
			return;
		}

		this.saveAutoSave();
	},

	saveAutoSave: function( options ) {
		if ( ! this.isEditorChanged() ) {
			return;
		}

		options = _.extend( {
			status: 'autosave'
		}, options );

		this.saveEditor( options );
	},

	savePending: function( options ) {
		options = _.extend( {
			status: 'pending'
		}, options );

		this.saveEditor( options );
	},

	discard: function() {
		var self = this;
		qazana.ajax.addRequest( 'discard_changes', {
			success: function() {
				self.setFlagEditorChange( false );
				location.href = qazana.config.document.urls.exit_to_dashboard;
			}
		} );
	},

	update: function( options ) {
		options = _.extend( {
			status: qazana.settings.page.model.get( 'post_status' )
		}, options );

		this.saveEditor( options );
	},

	publish: function( options ) {
		options = _.extend( {
			status: 'publish'
		}, options );

		this.saveEditor( options );
	},

	setFlagEditorChange: function( status ) {
		if ( status && this.isSaving ) {
			this.isChangedDuringSave = true;
		}

		this.startTimer( status );

		qazana.channels.editor
			.reply( 'status', status )
			.trigger( 'status:change', status );
	},

	isEditorChanged: function() {
		return ( true === qazana.channels.editor.request( 'status' ) );
	},

	setWorkSaver: function() {
		var self = this;
		qazana.$window.on( 'beforeunload', function() {
			if ( self.isEditorChanged() ) {
				return qazana.translate( 'before_unload_alert' );
			}
		} );
	},

	saveEditor: function( options ) {
		if ( this.isSaving ) {
			return;
		}

		options = _.extend( {
			status: 'draft',
			onSuccess: null
		}, options );

		var self = this,
			elements = qazana.elements.toJSON( { removeDefault: true } ),
			settings = qazana.settings.page.model.toJSON( { removeDefault: true } ),
			oldStatus = qazana.settings.page.model.get( 'post_status' ),
			statusChanged = oldStatus !== options.status;

		self.trigger( 'before:save', options )
			.trigger( 'before:save:' + options.status, options );

		self.isSaving = true;

		self.isChangedDuringSave = false;

		settings.post_status = options.status;

		qazana.ajax.addRequest( 'save_builder', {
			data: {
				status: options.status,
				elements: elements,
				settings: settings
			},

			success: function( data ) {
				self.afterAjax();

				if ( 'autosave' !== options.status ) {
					if ( statusChanged ) {
						qazana.settings.page.model.set( 'post_status', options.status );
					}

					// Notice: Must be after update page.model.post_status to the new status.
					if ( ! self.isChangedDuringSave ) {
						self.setFlagEditorChange( false );
					}
				}

				if ( data.config ) {
					jQuery.extend( true, qazana.config, data.config );
				}

				qazana.config.data = elements;

				qazana.channels.editor.trigger( 'saved', data );

				self.trigger( 'after:save', data )
					.trigger( 'after:save:' + options.status, data );

				if ( statusChanged ) {
					self.trigger( 'page:status:change', options.status, oldStatus );
				}

				if ( _.isFunction( options.onSuccess ) ) {
					options.onSuccess.call( this, data );
				}
			},
			error: function( data ) {
				self.afterAjax();

				self.trigger( 'after:saveError', data )
					.trigger( 'after:saveError:' + options.status, data );

				var message;

				if ( _.isString( data ) ) {
					message = data;
				} else if ( data.statusText ) {
					message = qazana.ajax.createErrorMessage( data );

					if ( 0 === data.readyState ) {
						message += ' ' + qazana.translate( 'saving_disabled' );
					}
				} else if ( data[0] && data[0].code ) {
					message = qazana.translate( 'server_error' ) + ' ' + data[0].code;
				}

				qazana.notifications.showToast( {
					message: message
				} );
			}
		} );
	},

	afterAjax: function() {
		this.isSaving = false;
	}
} );

},{"qazana-utils/module":140}],10:[function(require,module,exports){
var ViewModule = require( 'qazana-utils/view-module' ),
	SettingsModel = require( 'qazana-elements/models/base-settings' ),
	ControlsCSSParser = require( 'qazana-editor-utils/controls-css-parser' );

module.exports = ViewModule.extend( {
	model: null,

	hasChange: false,
	
	reloadPreviewFlag: false,
	
	changeCallbacks: {},

	addChangeCallback: function( attribute, callback ) {
		this.changeCallbacks[ attribute ] = callback;
	},

	bindEvents: function() {
		qazana.on( 'preview:loaded', this.onQazanaPreviewLoaded );

		this.model.on( 'change', this.onModelChange );
	},

	addPanelPage: function() {
		var name = this.getSettings( 'name' );

		qazana.getPanelView().addPage( name + '_settings', {
			view: qazana.settings.panelPages[ name ] || qazana.settings.panelPages.base,
			title: this.getSettings( 'panelPage.title' ),
			options: {
				model: this.model,
				controls: this.model.controls,
				name: name
			}
		} );
	},

	updateStylesheet: function( keepOldEntries ) {
		var controlsCSS = this.getControlsCSS();

		if ( ! keepOldEntries ) {
			controlsCSS.stylesheet.empty();
		}

		controlsCSS.addStyleRules( this.model.getStyleControls(), this.model.attributes, this.model.controls, [ /{{WRAPPER}}/g ], [ this.getSettings( 'cssWrapperSelector' ) ] );

		controlsCSS.addStyleToDocument();
	},

	initModel: function() {
		this.model = new SettingsModel( this.getSettings( 'settings' ), {
			controls: this.getSettings( 'controls' )
		} );
	},

	initControlsCSSParser: function() {
		var controlsCSS;

		this.getControlsCSS = function() {
			if ( ! controlsCSS ) {
				controlsCSS = new ControlsCSSParser( {
					id: this.getSettings( 'name' ),
					settingsModel: this.model
				} );

				/*
				 * @deprecated 2.1.0
				 */
				this.controlsCSS = controlsCSS;
			}

			return controlsCSS;
		};
	},

	getDataToSave: function( data ) {
		return data;
	},

	save: function( callback ) {
		var self = this;

		if ( ! self.hasChange ) {
			return;
		}

		var settings = this.model.toJSON( { removeDefault: true } ),
			data = this.getDataToSave( {
				data: settings
			} );

		NProgress.start();

		qazana.ajax.addRequest( 'save_' + this.getSettings( 'name' ) + '_settings', {
			data: data,
			success: function() {
				NProgress.done();

				self.setSettings( 'settings', settings );

				self.hasChange = false;

				if ( self.reloadPreviewFlag ) {
					self.reloadPreviewFlag = false;
					self.reloadPreview();
				}

				if ( callback ) {
					callback.apply( self, arguments );
				}
			},
			error: function() {
				alert( 'An error occurred' );
			}
		} );
	},

	addPanelMenuItem: function() {
		var menuSettings = this.getSettings( 'panelPage.menu' );

		if ( ! menuSettings ) {
			return;
		}

		var menuItemOptions = {
				icon: menuSettings.icon,
				title: this.getSettings( 'panelPage.title' ),
				type: 'page',
				pageName: this.getSettings( 'name' ) + '_settings'
			};

		qazana.modules.layouts.panel.pages.menu.Menu.addItem( menuItemOptions, 'settings', menuSettings.beforeItem );
	},

	onInit: function() {
		this.initModel();

		this.initControlsCSSParser();

		this.addPanelMenuItem();

		this.debounceSave = _.debounce( this.save, 3000 );

		ViewModule.prototype.onInit.apply( this, arguments );
	},

	onModelChange: function( model ) {
		var self = this;

		self.hasChange = true;

		this.getControlsCSS().stylesheet.empty();

		_.each( model.changed, function( value, key ) {
			if ( self.changeCallbacks[ key ] ) {
				self.changeCallbacks[ key ].call( self, value );
			}

			if ( self.model.controls[ key ].render_type === 'preview' ) {
				self.reloadPreviewFlag = true;
			}

		} );

		self.updateStylesheet( true );

		self.debounceSave();
	},

	onQazanaPreviewLoaded: function() {
		this.updateStylesheet();

		this.addPanelPage();

		if ( ! qazana.userCan( 'design' ) ) {
			qazana.panel.currentView.setPage( 'page_settings' );
		}
	}
} );

},{"qazana-editor-utils/controls-css-parser":119,"qazana-elements/models/base-settings":71,"qazana-utils/view-module":141}],11:[function(require,module,exports){
var ControlsStack = require( 'qazana-views/controls-stack' );

module.exports = ControlsStack.extend( {
	id: function() {
		return 'qazana-panel-' + this.getOption( 'name' ) + '-settings';
	},

	getTemplate: function() {
		return '#tmpl-qazana-panel-' + this.getOption( 'name' ) + '-settings';
	},

	childViewContainer: function() {
		return '#qazana-panel-' + this.getOption( 'name' ) + '-settings-controls';
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model
		};
	}
} );

},{"qazana-views/controls-stack":135}],12:[function(require,module,exports){
var BaseSettings = require( 'qazana-editor/components/settings/base/manager' );

module.exports = BaseSettings.extend( {
	changeCallbacks: {
		qazana_page_title_selector: function( newValue ) {
			var newSelector = newValue || 'h1.entry-title',
				titleSelectors = qazana.settings.page.model.controls.hide_title.selectors = {};

			titleSelectors[ newSelector ] = 'display: none';

			qazana.settings.page.updateStylesheet();
		},
		custom_css: function( newValue ) {
            this.custom_css( newValue );
		}
    },
    
    custom_css: function( newValue ) {
		var controlsCSS = this.getControlsCSS();

        if ( ! newValue ) {
            newValue = this.model.get('custom_css');
        } 
        
        if ( newValue ) {
            newValue = newValue.replace( /selector/g, this.getSettings( 'cssWrapperSelector' ) );
            controlsCSS.stylesheet.addRawCSS('general-settings-custom-css', newValue);
        }
    },

    updateStylesheet: function( keepOldEntries ) {
        var controlsCSS = this.getControlsCSS();

		if ( ! keepOldEntries ) {
			controlsCSS.stylesheet.empty();
        }
        
		controlsCSS.addStyleRules(this.model.getStyleControls(), this.model.attributes, this.model.controls, [/{{WRAPPER}}/g], [this.getSettings('cssWrapperSelector')]);
        
        this.custom_css();
        
		controlsCSS.addStyleToDocument();
	},
	
	reloadPreview: function() {
		qazana.reloadPreview();

		qazana.once( 'preview:loaded', function() {
			qazana.getPanelView().setPage( 'general_settings' );
		} );
	}
} );

},{"qazana-editor/components/settings/base/manager":10}],13:[function(require,module,exports){
var BaseSettings = require( 'qazana-editor/components/settings/base/manager' );

module.exports = BaseSettings.extend( {

	save: function() {},

	changeCallbacks: {
		post_title: function( newValue ) {
			var $title = qazanaFrontend.getElements( '$document' ).find( qazana.config.page_title_selector );

			$title.text( newValue );
		},

		template: function() {
			qazana.saver.saveAutoSave( {
				onSuccess: function() {
					qazana.reloadPreview();

					qazana.once( 'preview:loaded', function() {
						qazana.getPanelView().setPage( 'page_settings' );
					} );
				}
			} );

		},

		custom_css: function( newValue ) {
			this.custom_css( newValue );
		}
    },

    custom_css: function( newValue ) {
		var controlsCSS = this.getControlsCSS();

        if ( ! newValue ) {
            newValue = this.model.get('custom_css');
        } 

        if ( newValue ) {
            newValue = newValue.replace( /selector/g, this.getSettings( 'cssWrapperSelector' ) );
            controlsCSS.stylesheet.addRawCSS('page-settings-custom-css', newValue);
        }
    },

    updateStylesheet: function( keepOldEntries ) {
        var controlsCSS = this.getControlsCSS();

		if ( ! keepOldEntries ) {
			controlsCSS.stylesheet.empty();
        }
        
		controlsCSS.addStyleRules(this.model.getStyleControls(), this.model.attributes, this.model.controls, [/{{WRAPPER}}/g], [this.getSettings('cssWrapperSelector')]);
        
        this.custom_css();
        
		controlsCSS.addStyleToDocument();
	},
    
	renderStyles: function() {
        var controlsCSS = this.getControlsCSS();
		controlsCSS.addStyleRules(this.model.getStyleControls(), this.model.attributes, this.model.controls, [/\{\{WRAPPER}}/g], ['body.qazana-page-' + qazana.config.post_id]);
		controlsCSS.stylesheet.addRawCSS('page-settings-custom-css', this.model.get('custom_css').replace(/selector/g, 'body.qazana-page-' + qazana.config.post_id));
	},

	onModelChange: function() {
		qazana.saver.setFlagEditorChange( true );
		BaseSettings.prototype.onModelChange.apply( this, arguments );
	},

	getDataToSave: function( data ) {
		data.id = qazana.config.document.id;
		return data;
	},

	reloadPreview: function() {
		qazana.reloadPreview();

		qazana.once( 'preview:loaded', function() {
			qazana.getPanelView().setPage( 'page_settings' );
		} );
	}
} );

},{"qazana-editor/components/settings/base/manager":10}],14:[function(require,module,exports){
var Module = require( 'qazana-utils/module' );

module.exports = Module.extend( {
	modules: {
		base: require( 'qazana-editor/components/settings/base/manager' ),
		general: require( 'qazana-editor/components/settings/general/manager' ),
		page: require( 'qazana-editor/components/settings/page/manager' )
	},

	panelPages: {
		base: require( 'qazana-editor/components/settings/base/panel' )
	},

	onInit: function() {
		this.initSettings();
	},

	initSettings: function() {
		var self = this;

		_.each( qazana.config.settings, function( config, name ) {
			var Manager = self.modules[ name ] || self.modules.base;

			self[ name ] = new Manager( config );
		} );
	}
} );

},{"qazana-editor/components/settings/base/manager":10,"qazana-editor/components/settings/base/panel":11,"qazana-editor/components/settings/general/manager":12,"qazana-editor/components/settings/page/manager":13,"qazana-utils/module":140}],15:[function(require,module,exports){
var InsertTemplateHandler;

InsertTemplateHandler = Marionette.Behavior.extend( {
	ui: {
		insertButton: '.qazana-template-library-template-insert'
	},

	events: {
		'click @ui.insertButton': 'onInsertButtonClick'
	},

	onInsertButtonClick: function() {
		if ( this.view.model.get( 'hasPageSettings' ) ) {
			InsertTemplateHandler.showImportDialog( this.view.model );
			return;
		}

		qazana.templates.importTemplate( this.view.model );
	}
}, {
	dialog: null,

	showImportDialog: function( model ) {
		var dialog = InsertTemplateHandler.getDialog();

		dialog.onConfirm = function() {
			qazana.templates.importTemplate( model, { withPageSettings: true } );
		};

		dialog.onCancel = function() {
			qazana.templates.importTemplate( model );
		};

		dialog.show();
	},

	initDialog: function() {
		InsertTemplateHandler.dialog = qazana.dialogsManager.createWidget( 'confirm', {
			id: 'qazana-insert-template-settings-dialog',
			headerMessage: qazana.translate( 'import_template_dialog_header' ),
			message: qazana.translate( 'import_template_dialog_message' ) + '<br>' + qazana.translate( 'import_template_dialog_message_attention' ),
			strings: {
				confirm: qazana.translate( 'yes' ),
				cancel: qazana.translate( 'no' )
			}
		} );
	},

	getDialog: function() {
		if ( ! InsertTemplateHandler.dialog ) {
			InsertTemplateHandler.initDialog();
		}

		return InsertTemplateHandler.dialog;
	}
} );

module.exports = InsertTemplateHandler;

},{}],16:[function(require,module,exports){
var TemplateLibraryTemplateModel = require( 'qazana-templates/models/template' ),
	TemplateLibraryCollection;

TemplateLibraryCollection = Backbone.Collection.extend( {
	model: TemplateLibraryTemplateModel
} );

module.exports = TemplateLibraryCollection;

},{"qazana-templates/models/template":18}],17:[function(require,module,exports){
var TemplateLibraryLayoutView = require( 'qazana-templates/views/library-layout' ),
	TemplateLibraryCollection = require( 'qazana-templates/collections/templates' ),
	TemplateLibraryManager;

TemplateLibraryManager = function() {
	var self = this,
		deleteDialog,
		errorDialog,
		layout,
		config = {},
		startIntent = {},
		templateTypes = {},
		filterTerms = {},
		templatesCollection;

	var initLayout = function() {
		layout = new TemplateLibraryLayoutView();
	};

	var registerDefaultTemplateTypes = function() {
		var data = {
			saveDialog: {
				description: qazana.translate( 'save_your_template_description' )
			},
			ajaxParams: {
				success: function( data ) {
					self.getTemplatesCollection().add( data );

					self.setTemplatesPage( 'local' );
				},
				error: function( data ) {
					self.showErrorDialog( data );
				}
			}
		};

		_.each( [ 'page', 'section' ], function( type ) {
			var safeData = jQuery.extend( true, {}, data, {
				saveDialog: {
					title: qazana.translate( 'save_your_template', [ qazana.translate( type ) ] )
				}
			} );

			self.registerTemplateType( type, safeData );
		} );
	};

	var registerDefaultFilterTerms = function() {
		filterTerms = {
			text: {
				callback: function( value ) {
					value = value.toLowerCase();

					if ( this.get( 'title' ).toLowerCase().indexOf( value ) >= 0 ) {
						return true;
					}

					return _.any( this.get( 'tags' ), function( tag ) {
						return tag.toLowerCase().indexOf( value ) >= 0;
					} );
				}
			},
			type: {},
			subtype: {},
			favorite: {}
		};
	};

	var setIntentFilters = function() {
		jQuery.each( startIntent.filters, function( filterKey, filterValue ) {
			self.setFilter( filterKey, filterValue, true );
		} );
	};

	this.init = function() {
		registerDefaultTemplateTypes();

		registerDefaultFilterTerms();

		qazana.addBackgroundClickListener( 'libraryToggleMore', {
			element: '.qazana-template-library-template-more'
		} );
	};

	this.getTemplateTypes = function( type ) {
		if ( type ) {
			return templateTypes[ type ];
		}

		return templateTypes;
	};

	this.registerTemplateType = function( type, data ) {
		templateTypes[ type ] = data;
	};

	this.deleteTemplate = function( templateModel, options ) {
		var dialog = self.getDeleteDialog();

		dialog.onConfirm = function() {
			if ( options.onConfirm ) {
				options.onConfirm();
			}

			qazana.ajax.send( 'delete_template', {
				data: {
					source: templateModel.get( 'source' ),
					template_id: templateModel.get( 'template_id' )
				},
				success: function( response ) {
					templatesCollection.remove( templateModel, { silent: true } );

					if ( options.onSuccess ) {
						options.onSuccess( response );
					}
				}
			} );
		};

		dialog.show();
	};

	this.importTemplate = function( templateModel, options ) {
		options = options || {};

		layout.showLoadingView();

		self.requestTemplateContent( templateModel.get( 'source' ), templateModel.get( 'template_id' ), {
			data: {
				page_settings: options.withPageSettings
			},
			success: function( data ) {
				self.closeModal();

				qazana.channels.data.trigger( 'template:before:insert', templateModel );

				qazana.getPreviewView().addChildModel( data.content, startIntent.importOptions || {} );

				qazana.channels.data.trigger( 'template:after:insert', templateModel );

				if ( options.withPageSettings ) {
					qazana.settings.page.model.set( data.page_settings );
				}
			},
			error: function( data ) {
				self.showErrorDialog( data );
			},
			complete: function() {
				layout.hideLoadingView();
			}
		} );
	};

	this.saveTemplate = function( type, data ) {
		var templateType = templateTypes[ type ];

		_.extend( data, {
			source: 'local',
			type: type
		} );

		if ( templateType.prepareSavedData ) {
			data = templateType.prepareSavedData( data );
		}

		data.content = JSON.stringify( data.content );

		var ajaxParams = { data: data };

		if ( templateType.ajaxParams ) {
			_.extend( ajaxParams, templateType.ajaxParams );
		}

		qazana.ajax.send( 'save_template', ajaxParams );
	};

	this.requestTemplateContent = function( source, id, ajaxOptions ) {
		var options = {
			data: {
				source: source,
				edit_mode: true,
				display: true,
				template_id: id
			}
		};

		if ( ajaxOptions ) {
			jQuery.extend( true, options, ajaxOptions );
		}

		return qazana.ajax.send( 'get_template_data', options );
	};

	this.markAsFavorite = function( templateModel, favorite ) {
		var options = {
			data: {
				source: templateModel.get( 'source' ),
				template_id: templateModel.get( 'template_id' ),
				favorite: favorite
			}
		};

		return qazana.ajax.send( 'mark_template_as_favorite', options );
	};

	this.getDeleteDialog = function() {
		if ( ! deleteDialog ) {
			deleteDialog = qazana.dialogsManager.createWidget( 'confirm', {
				id: 'qazana-template-library-delete-dialog',
				headerMessage: qazana.translate( 'delete_template' ),
				message: qazana.translate( 'delete_template_confirm' ),
				strings: {
					confirm: qazana.translate( 'delete' )
				}
			} );
		}

		return deleteDialog;
	};

	this.getErrorDialog = function() {
		if ( ! errorDialog ) {
			errorDialog = qazana.dialogsManager.createWidget( 'alert', {
				id: 'qazana-template-library-error-dialog',
				headerMessage: qazana.translate( 'an_error_occurred' )
			} );
		}

		return errorDialog;
	};

	this.getLayout = function() {
		return layout;
	};

	this.getTemplatesCollection = function() {
		return templatesCollection;
	};

	this.getConfig = function( item ) {
		if ( item ) {
			return config[ item ];
		}

		return config;
	};

	this.requestLibraryData = function( options ) {
		if ( templatesCollection && ! options.forceUpdate ) {
			if ( options.onUpdate ) {
				options.onUpdate();
			}

			return;
		}

		if ( options.onBeforeUpdate ) {
			options.onBeforeUpdate();
		}

		var ajaxOptions = {
			data: {},
			success: function( data ) {
				templatesCollection = new TemplateLibraryCollection( data.templates );

				config = data.config;

				if ( options.onUpdate ) {
					options.onUpdate();
				}
			}
		};

		if ( options.forceSync ) {
			ajaxOptions.data.sync = true;
		}

		qazana.ajax.send( 'get_library_data', ajaxOptions );
	};

	this.startModal = function( customStartIntent ) {
		if ( ! layout ) {
			initLayout();
		}

		layout.showModal();

		self.requestLibraryData( {
			onBeforeUpdate: layout.showLoadingView.bind( layout ),
			onUpdate: function() {
				var documentType = qazana.config.document.remote_type,
					isBlockType = config.categories && -1 !== config.categories.indexOf( documentType ),
					oldStartIntent = Object.create( startIntent );

				startIntent = jQuery.extend( {
					filters: {
						source: 'remote',
						type: isBlockType ? 'block' : 'page',
						subtype: isBlockType ? documentType : null
					},
					onReady: self.showTemplates
				}, customStartIntent );

				var isSameIntent = _.isEqual( Object.getPrototypeOf( oldStartIntent ), startIntent );

				if ( isSameIntent && 'qazana-template-library-templates' === layout.modalContent.currentView.id ) {
					return;
				}

				layout.hideLoadingView();

				setIntentFilters();

				startIntent.onReady();
			}
		} );
	};

	this.closeModal = function() {
		layout.hideModal();
	};

	this.getFilter = function( name ) {
		return qazana.channels.templates.request( 'filter:' + name );
	};

	this.setFilter = function( name, value, silent ) {
		qazana.channels.templates.reply( 'filter:' + name, value );

		if ( ! silent ) {
			qazana.channels.templates.trigger( 'filter:change' );
		}
	};

	this.getFilterTerms = function( termName ) {
		if ( termName ) {
			return filterTerms[ termName ];
		}

		return filterTerms;
	};

	this.setTemplatesPage = function( source, type, silent ) {
		qazana.channels.templates.stopReplying();

		self.setFilter( 'source', source, true );

		if ( type ) {
			self.setFilter( 'type', type, true );
		}

		if ( ! silent ) {
			self.showTemplates();
		}
	};

	this.showTemplates = function() {
		var activeSource = self.getFilter( 'source' );

		var templatesToShow = templatesCollection.filter( function( model ) {
			if ( activeSource !== model.get( 'source' ) ) {
				return false;
			}

			var typeInfo = templateTypes[ model.get( 'type' ) ];

			return ! typeInfo || false !== typeInfo.showInLibrary;
		} );

		layout.showTemplatesView( new TemplateLibraryCollection( templatesToShow ) );
	};

	this.showErrorDialog = function( errorMessage ) {
		if ( 'object' === typeof errorMessage ) {
			var message = '';

			_.each( errorMessage, function( error ) {
				message += '<div>' + error.message + '.</div>';
			} );

			errorMessage = message;
		} else if ( errorMessage ) {
			errorMessage += '.';
		} else {
			errorMessage = '<i>&#60;The error message is empty&#62;</i>';
		}

		self.getErrorDialog()
		    .setMessage( qazana.translate( 'templates_request_error' ) + '<div id="qazana-template-library-error-info">' + errorMessage + '</div>' )
		    .show();
	};
};

module.exports = new TemplateLibraryManager();

},{"qazana-templates/collections/templates":16,"qazana-templates/views/library-layout":20}],18:[function(require,module,exports){
module.exports = Backbone.Model.extend( {
	defaults: {
		template_id: 0,
		name: '',
		title: '',
		source: '',
		type: '',
		subtype: '',
		author: '',
		thumbnail: '',
		url: '',
		export_link: '',
		categories: [],
		tags: [],
		keywords: []
	}
} );

},{}],19:[function(require,module,exports){
var TemplateLibraryHeaderView = require( 'qazana-templates/views/parts/header' ),
	TemplateLibraryHeaderLogoView = require( 'qazana-templates/views/parts/header-parts/logo' ),
	TemplateLibraryLoadingView = require( 'qazana-templates/views/parts/loading' );

module.exports = Marionette.LayoutView.extend( {
	el: function() {
		return this.modal.getElements( 'widget' );
	},

	modal: null,

	regions: function() {
		return {
			modalHeader: '.dialog-header',
			modalContent: '.dialog-lightbox-content',
			modalLoading: '.dialog-lightbox-loading'
		};
	},

	constructor: function() {
		this.initModal();

		Marionette.LayoutView.prototype.constructor.apply( this, arguments );
	},

	initialize: function() {
		this.modalHeader.show( new TemplateLibraryHeaderView() );
	},

	initModal: function() {
		var modalOptions = {
			className: 'qazana-templates-modal',
			closeButton: false,
			hide: {
				onOutsideClick: false
			}
		};

		jQuery.extend( true, modalOptions, this.getModalOptions() );

		this.modal = qazana.dialogsManager.createWidget( 'lightbox', modalOptions );

		this.modal.getElements( 'message' ).append( this.modal.addElement( 'content' ), this.modal.addElement( 'loading' ) );
	},

	showModal: function() {
		this.modal.show();
	},

	hideModal: function() {
		this.modal.hide();
	},

	getModalOptions: function() {
		return {};
	},

	getLogoOptions: function() {
		return {};
	},

	getHeaderView: function() {
		return this.modalHeader.currentView;
	},

	showLoadingView: function() {
		this.modalLoading.show( new TemplateLibraryLoadingView() );

		this.modalLoading.$el.show();

		this.modalContent.$el.hide();
	},

	hideLoadingView: function() {
		this.modalContent.$el.show();

		this.modalLoading.$el.hide();
	},

	showLogo: function() {
		this.getHeaderView().logoArea.show( new TemplateLibraryHeaderLogoView( this.getLogoOptions() ) );
	}
} );

},{"qazana-templates/views/parts/header":26,"qazana-templates/views/parts/header-parts/logo":23,"qazana-templates/views/parts/loading":28}],20:[function(require,module,exports){
var BaseModalLayout = require( 'qazana-templates/views/base-modal-layout' ),
	TemplateLibraryHeaderActionsView = require( 'qazana-templates/views/parts/header-parts/actions' ),
	TemplateLibraryHeaderMenuView = require( 'qazana-templates/views/parts/header-parts/menu' ),
	TemplateLibraryHeaderPreviewView = require( 'qazana-templates/views/parts/header-parts/preview' ),
	TemplateLibraryHeaderBackView = require( 'qazana-templates/views/parts/header-parts/back' ),
	TemplateLibraryCollectionView = require( 'qazana-templates/views/parts/templates' ),
	TemplateLibrarySaveTemplateView = require( 'qazana-templates/views/parts/save-template' ),
	TemplateLibraryImportView = require( 'qazana-templates/views/parts/import' ),
	TemplateLibraryPreviewView = require( 'qazana-templates/views/parts/preview' );

module.exports = BaseModalLayout.extend( {

	getModalOptions: function() {
		return {
			id: 'qazana-template-library-modal'
		};
	},

	getLogoOptions: function() {
		return {
			title: qazana.translate( 'library' ),
			click: function() {
				qazana.templates.setTemplatesPage( 'remote', 'page' );
			}
		};
	},

	getTemplateActionButton: function( templateData ) {
		var viewId = '#tmpl-qazana-template-library-insert-button';

		viewId = qazana.hooks.applyFilters( 'qazana/editor/template-library/template/action-button', viewId, templateData );

		var template = Marionette.TemplateCache.get( viewId );

		return Marionette.Renderer.render( template );
	},

	setHeaderDefaultParts: function() {
		var headerView = this.getHeaderView();

		headerView.tools.show( new TemplateLibraryHeaderActionsView() );
		headerView.menuArea.show( new TemplateLibraryHeaderMenuView() );

		this.showLogo();
	},

	showTemplatesView: function( templatesCollection ) {
		this.modalContent.show( new TemplateLibraryCollectionView( {
			collection: templatesCollection
		} ) );

		this.setHeaderDefaultParts();
	},

	showImportView: function() {
		this.getHeaderView().menuArea.reset();

		this.modalContent.show( new TemplateLibraryImportView() );
	},

	showSaveTemplateView: function( elementModel ) {
		this.getHeaderView().menuArea.reset();

		this.modalContent.show( new TemplateLibrarySaveTemplateView( { model: elementModel } ) );
	},

	showPreviewView: function( templateModel ) {
		this.modalContent.show( new TemplateLibraryPreviewView( {
			url: templateModel.get( 'url' )
		} ) );

		var headerView = this.getHeaderView();

		headerView.menuArea.reset();

		headerView.tools.show( new TemplateLibraryHeaderPreviewView( {
			model: templateModel
		} ) );

		headerView.logoArea.show( new TemplateLibraryHeaderBackView() );
	}
} );

},{"qazana-templates/views/base-modal-layout":19,"qazana-templates/views/parts/header-parts/actions":21,"qazana-templates/views/parts/header-parts/back":22,"qazana-templates/views/parts/header-parts/menu":24,"qazana-templates/views/parts/header-parts/preview":25,"qazana-templates/views/parts/import":27,"qazana-templates/views/parts/preview":29,"qazana-templates/views/parts/save-template":30,"qazana-templates/views/parts/templates":32}],21:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-header-actions',

	id: 'qazana-template-library-header-actions',

	ui: {
		'import': '#qazana-template-library-header-import i',
		sync: '#qazana-template-library-header-sync i',
		save: '#qazana-template-library-header-save i'
	},

	events: {
		'click @ui.import': 'onImportClick',
		'click @ui.sync': 'onSyncClick',
		'click @ui.save': 'onSaveClick'
	},

	onImportClick: function() {
		qazana.templates.getLayout().showImportView();
	},

	onSyncClick: function() {
		var self = this;

		self.ui.sync.addClass( 'eicon-animation-spin' );

		qazana.templates.requestLibraryData( {
			onUpdate: function() {
				self.ui.sync.removeClass( 'eicon-animation-spin' );

				qazana.templates.setTemplatesPage( qazana.templates.getFilter( 'source' ), qazana.templates.getFilter( 'type' ) );
			},
			forceUpdate: true,
			forceSync: true
		} );
	},

	onSaveClick: function() {
		qazana.templates.getLayout().showSaveTemplateView();
	}
} );

},{}],22:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-header-back',

	id: 'qazana-template-library-header-preview-back',

	events: {
		'click': 'onClick'
	},

	onClick: function() {
		qazana.templates.showTemplates();
	}
} );

},{}],23:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-templates-modal__header__logo',

	className: 'qazana-templates-modal__header__logo',

	events: {
		'click': 'onClick'
	},

	templateHelpers: function() {
		return {
			title: this.getOption( 'title' )
		};
	},

	onClick: function() {
		var clickCallback = this.getOption( 'click' );

		if ( clickCallback ) {
			clickCallback();
		}
	}
} );

},{}],24:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	options: {
		activeClass: 'qazana-active'
	},

	template: '#tmpl-qazana-template-library-header-menu',

	id: 'qazana-template-library-header-menu',

	ui: {
		menuItems: '.qazana-template-library-menu-item'
	},

	events: {
		'click @ui.menuItems': 'onMenuItemClick'
	},

	$activeItem: null,

	activateMenuItem: function( $item ) {
		var activeClass = this.getOption( 'activeClass' );

		if ( this.$activeItem === $item ) {
			return;
		}

		if ( this.$activeItem ) {
			this.$activeItem.removeClass( activeClass );
		}

		$item.addClass( activeClass );

		this.$activeItem = $item;
	},

	onRender: function() {
		var currentSource = qazana.templates.getFilter( 'source' ),
			$sourceItem = this.ui.menuItems.filter( '[data-template-source="' + currentSource + '"]' );

		if ( 'remote' === currentSource ) {
			$sourceItem = $sourceItem.filter( '[data-template-type="' + qazana.templates.getFilter( 'type' ) + '"]' );
		}

		this.activateMenuItem( $sourceItem );
	},

	onMenuItemClick: function( event ) {
		var item = event.currentTarget,
			itemData = item.dataset;

		this.activateMenuItem( jQuery( item ) );

		qazana.templates.setTemplatesPage( item.dataset.templateSource, itemData.templateType );
	}
} );

},{}],25:[function(require,module,exports){
var TemplateLibraryInsertTemplateBehavior = require( 'qazana-templates/behaviors/insert-template' );

module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-header-preview',

	id: 'qazana-template-library-header-preview',

	behaviors: {
		insertTemplate: {
			behaviorClass: TemplateLibraryInsertTemplateBehavior
		}
	}
} );

},{"qazana-templates/behaviors/insert-template":15}],26:[function(require,module,exports){
var TemplateLibraryHeaderView;

TemplateLibraryHeaderView = Marionette.LayoutView.extend( {

	className: 'qazana-templates-modal__header',

	template: '#tmpl-qazana-templates-modal__header',

	regions: {
		logoArea: '.qazana-templates-modal__header__logo-area',
		tools: '#qazana-template-library-header-tools',
		menuArea: '.qazana-templates-modal__header__menu-area'
	},

	ui: {
		closeModal: '.qazana-templates-modal__header__close-modal'
	},

	events: {
		'click @ui.closeModal': 'onCloseModalClick'
	},

	onCloseModalClick: function() {
		this._parent._parent._parent.hideModal();
	}
} );

module.exports = TemplateLibraryHeaderView;

},{}],27:[function(require,module,exports){
var TemplateLibraryImportView;

TemplateLibraryImportView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-import',

	id: 'qazana-template-library-import',

	ui: {
		uploadForm: '#qazana-template-library-import-form',
		fileInput: '#qazana-template-library-import-form-input'
	},

	events: {
		'change @ui.fileInput': 'onFileInputChange'
	},

	droppedFiles: null,

	submitForm: function() {
		var layout = qazana.templates.getLayout(),
			data = new FormData();

		if ( this.droppedFiles ) {
			data.append( 'file', this.droppedFiles[0] );

			this.droppedFiles = null;
		} else {
			data.append( 'file', this.ui.fileInput[0].files[0] );

			this.ui.uploadForm[0].reset();
		}

		var options = {
			data: data,
			processData: false,
			contentType: false,
			success: function( data ) {
				qazana.templates.getTemplatesCollection().add( data );

				qazana.templates.setTemplatesPage( 'local' );
			},
			error: function( data ) {
				qazana.templates.showErrorDialog( data );

				layout.showImportView();
			},
			complete: function() {
				layout.hideLoadingView();
			}
		};

		qazana.ajax.send( 'import_template', options );

		layout.showLoadingView();
	},

	onRender: function() {
		this.ui.uploadForm.on( {
			'drag dragstart dragend dragover dragenter dragleave drop': this.onFormActions.bind( this ),
			dragenter: this.onFormDragEnter.bind( this ),
			'dragleave drop': this.onFormDragLeave.bind( this ),
			drop: this.onFormDrop.bind( this )
		} );
	},

	onFormActions: function( event ) {
		event.preventDefault();
		event.stopPropagation();
	},

	onFormDragEnter: function() {
		this.ui.uploadForm.addClass( 'qazana-drag-over' );
	},

	onFormDragLeave: function( event ) {
		if ( jQuery( event.relatedTarget ).closest( this.ui.uploadForm ).length ) {
			return;
		}

		this.ui.uploadForm.removeClass( 'qazana-drag-over' );
	},

	onFormDrop: function( event ) {
		this.droppedFiles = event.originalEvent.dataTransfer.files;

		this.submitForm();
	},

	onFileInputChange: function() {
		this.submitForm();
	}
} );

module.exports = TemplateLibraryImportView;

},{}],28:[function(require,module,exports){
var TemplateLibraryLoadingView;

TemplateLibraryLoadingView = Marionette.ItemView.extend( {
	id: 'qazana-template-library-loading',

	template: '#tmpl-qazana-template-library-loading'
} );

module.exports = TemplateLibraryLoadingView;

},{}],29:[function(require,module,exports){
var TemplateLibraryPreviewView;

TemplateLibraryPreviewView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-preview',

	id: 'qazana-template-library-preview',

	ui: {
		iframe: '> iframe'
	},

	onRender: function() {
		this.ui.iframe.attr( 'src', this.getOption( 'url' ) );
	}
} );

module.exports = TemplateLibraryPreviewView;

},{}],30:[function(require,module,exports){
var TemplateLibrarySaveTemplateView;

TemplateLibrarySaveTemplateView = Marionette.ItemView.extend( {
	id: 'qazana-template-library-save-template',

	template: '#tmpl-qazana-template-library-save-template',

	ui: {
		form: '#qazana-template-library-save-template-form',
		submitButton: '#qazana-template-library-save-template-submit'
	},

	events: {
		'submit @ui.form': 'onFormSubmit'
	},

	getSaveType: function() {
		return this.model ? this.model.get( 'elType' ) : 'page';
	},

	templateHelpers: function() {
		var saveType = this.getSaveType(),
			templateType = qazana.templates.getTemplateTypes( saveType );

		return templateType.saveDialog;
	},

	onFormSubmit: function( event ) {
		event.preventDefault();

		var formData = this.ui.form.qazanaSerializeObject(),
			saveType = this.model ? this.model.get( 'elType' ) : 'page',
			JSONParams = { removeDefault: true };

		formData.content = this.model ? [ this.model.toJSON( JSONParams ) ] : qazana.elements.toJSON( JSONParams );

		this.ui.submitButton.addClass( 'qazana-button-state' );

		qazana.templates.saveTemplate( saveType, formData );
	}
} );

module.exports = TemplateLibrarySaveTemplateView;

},{}],31:[function(require,module,exports){
var TemplateLibraryTemplatesEmptyView;

TemplateLibraryTemplatesEmptyView = Marionette.ItemView.extend( {
	id: 'qazana-template-library-templates-empty',

	template: '#tmpl-qazana-template-library-templates-empty',

	ui: {
		title: '.qazana-template-library-blank-title',
		message: '.qazana-template-library-blank-message'
	},

	modesStrings: {
		empty: {
			title: qazana.translate( 'templates_empty_title' ),
			message: qazana.translate( 'templates_empty_message' )
		},
		noResults: {
			title: qazana.translate( 'templates_no_results_title' ),
			message: qazana.translate( 'templates_no_results_message' )
		},
		noFavorites: {
			title: qazana.translate( 'templates_no_favorites_title' ),
			message: qazana.translate( 'templates_no_favorites_message' )
		}
	},

	getCurrentMode: function() {
		if ( qazana.templates.getFilter( 'text' ) ) {
			return 'noResults';
		}

		if ( qazana.templates.getFilter( 'favorite' ) ) {
			return 'noFavorites';
		}

		return 'empty';
	},

	onRender: function() {
		var modeStrings = this.modesStrings[ this.getCurrentMode() ];

		this.ui.title.html( modeStrings.title );

		this.ui.message.html( modeStrings.message );
	}
} );

module.exports = TemplateLibraryTemplatesEmptyView;

},{}],32:[function(require,module,exports){
var TemplateLibraryTemplateLocalView = require( 'qazana-templates/views/template/local' ),
	TemplateLibraryTemplateRemoteView = require( 'qazana-templates/views/template/remote' ),
	Masonry = require( 'qazana-utils/masonry' ),
	TemplateLibraryCollectionView;

TemplateLibraryCollectionView = Marionette.CompositeView.extend( {
	template: '#tmpl-qazana-template-library-templates',

	id: 'qazana-template-library-templates',

	childViewContainer: '#qazana-template-library-templates-container',

	reorderOnSort: true,

	emptyView: function() {
		var EmptyView = require( 'qazana-templates/views/parts/templates-empty' );

		return new EmptyView();
	},

	ui: {
		textFilter: '#qazana-template-library-filter-text',
		selectFilter: '.qazana-template-library-filter-select',
		myFavoritesFilter: '#qazana-template-library-filter-my-favorites',
		orderInputs: '.qazana-template-library-order-input',
		orderLabels: '.qazana-template-library-order-label'
	},

	events: {
		'input @ui.textFilter': 'onTextFilterInput',
		'change @ui.selectFilter': 'onSelectFilterChange',
		'change @ui.myFavoritesFilter': 'onMyFavoritesFilterChange',
		'mousedown @ui.orderLabels': 'onOrderLabelsClick'
	},

	comparators: {
		title: function( model ) {
			return model.get( 'title' ).toLowerCase();
		},
		popularityIndex: function( model ) {
			var popularityIndex = model.get( 'popularityIndex' );

			if ( ! popularityIndex ) {
				popularityIndex = model.get( 'date' );
			}

			return -popularityIndex;
		},
		trendIndex: function( model ) {
			var trendIndex = model.get( 'trendIndex' );

			if ( ! trendIndex ) {
				trendIndex = model.get( 'date' );
			}

			return -trendIndex;
		}
	},

	getChildView: function( childModel ) {
		if ( 'remote' === childModel.get( 'source' ) ) {
			return TemplateLibraryTemplateRemoteView;
		}

		return TemplateLibraryTemplateLocalView;
	},

	initialize: function() {
		this.listenTo( qazana.channels.templates, 'filter:change', this._renderChildren );
	},

	filter: function( childModel ) {
		var filterTerms = qazana.templates.getFilterTerms(),
			passingFilter = true;

		jQuery.each( filterTerms, function( filterTermName ) {
			var filterValue = qazana.templates.getFilter( filterTermName );

			if ( ! filterValue ) {
				return;
			}

			if ( this.callback ) {
				var callbackResult = this.callback.call( childModel, filterValue );

				if ( ! callbackResult ) {
					passingFilter = false;
				}

				return callbackResult;
			}

			var filterResult = filterValue === childModel.get( filterTermName );

			if ( ! filterResult ) {
				passingFilter = false;
			}

			return filterResult;
		} );

		return passingFilter;
	},

	order: function( by, reverseOrder ) {
		var comparator = this.comparators[ by ] || by;

		if ( reverseOrder ) {
			comparator = this.reverseOrder( comparator );
		}

		this.collection.comparator = comparator;

		this.collection.sort();
	},

	reverseOrder: function( comparator ) {
		if ( 'function' !== typeof comparator ) {
			var comparatorValue = comparator;

			comparator = function( model ) {
				return model.get( comparatorValue );
			};
		}

		return function( left, right ) {
			var l = comparator( left ),
				r = comparator( right );

			if ( undefined === l ) {
				return -1;
			}

			if ( undefined === r ) {
				return 1;
			}

			return l < r ? 1 : l > r ? -1 : 0;
		};
	},

	addSourceData: function() {
		var isEmpty = this.children.isEmpty();

		this.$el.attr( 'data-template-source', isEmpty ? 'empty' : qazana.templates.getFilter( 'source' ) );
	},

	setFiltersUI: function() {
		var $filters = this.$( this.ui.selectFilter );

		$filters.select2( {
			placeholder: qazana.translate( 'category' ),
			allowClear: true,
			width: 150
		} );
	},

	setMasonrySkin: function() {
		var masonry = new Masonry( {
			container: this.$childViewContainer,
			items: this.$childViewContainer.children()
		} );

		this.$childViewContainer.imagesLoaded( masonry.run.bind( masonry ) );
	},

	toggleFilterClass: function() {
		this.$el.toggleClass( 'qazana-templates-filter-active', !! ( qazana.templates.getFilter( 'text' ) || qazana.templates.getFilter( 'favorite' ) ) );
	},

	onRenderCollection: function() {
		this.addSourceData();

		this.toggleFilterClass();

		if ( 'remote' === qazana.templates.getFilter( 'source' ) && 'block' === qazana.templates.getFilter( 'type' ) ) {
			this.setFiltersUI();

			this.setMasonrySkin();
		}
	},

	onBeforeRenderEmpty: function() {
		this.addSourceData();
	},

	onTextFilterInput: function() {
		qazana.templates.setFilter( 'text', this.ui.textFilter.val() );
	},

	onSelectFilterChange: function( event ) {
		var $select = jQuery( event.currentTarget ),
			filterName = $select.data( 'qazana-filter' );

		qazana.templates.setFilter( filterName, $select.val() );
	},

	onMyFavoritesFilterChange: function(  ) {
		qazana.templates.setFilter( 'favorite', this.ui.myFavoritesFilter[0].checked );
	},

	onOrderLabelsClick: function( event ) {
		var $clickedInput = jQuery( event.currentTarget.control ),
			toggle;

		if ( ! $clickedInput[0].checked ) {
			toggle = 'asc' !== $clickedInput.data( 'default-ordering-direction' );
		}

		$clickedInput.toggleClass( 'qazana-template-library-order-reverse', toggle );

		this.order( $clickedInput.val(), $clickedInput.hasClass( 'qazana-template-library-order-reverse' ) );
	}
} );

module.exports = TemplateLibraryCollectionView;

},{"qazana-templates/views/parts/templates-empty":31,"qazana-templates/views/template/local":34,"qazana-templates/views/template/remote":35,"qazana-utils/masonry":139}],33:[function(require,module,exports){
var TemplateLibraryInsertTemplateBehavior = require( 'qazana-templates/behaviors/insert-template' ),
	TemplateLibraryTemplateView;

TemplateLibraryTemplateView = Marionette.ItemView.extend( {
	className: function() {
		var classes = 'qazana-template-library-template',
			source = this.model.get( 'source' );

		classes += ' qazana-template-library-template-' + source;

		if ( 'remote' === source ) {
			classes += ' qazana-template-library-template-' + this.model.get( 'type' );
		}

		return classes;
	},

	ui: function() {
		return {
			insertButton: '.qazana-template-library-template-insert',
			previewButton: '.qazana-template-library-template-preview'
		};
	},

	events: function() {
		return {
			'click @ui.insertButton': 'onInsertButtonClick',
			'click @ui.previewButton': 'onPreviewButtonClick'
		};
	},

	behaviors: {
		insertTemplate: {
			behaviorClass: TemplateLibraryInsertTemplateBehavior
		}
	}
} );

module.exports = TemplateLibraryTemplateView;

},{"qazana-templates/behaviors/insert-template":15}],34:[function(require,module,exports){
var TemplateLibraryTemplateView = require( 'qazana-templates/views/template/base' ),
	TemplateLibraryTemplateLocalView;

TemplateLibraryTemplateLocalView = TemplateLibraryTemplateView.extend( {
	template: '#tmpl-qazana-template-library-template-local',

	ui: function() {
		return _.extend( TemplateLibraryTemplateView.prototype.ui.apply( this, arguments ), {
			deleteButton: '.qazana-template-library-template-delete',
			morePopup: '.qazana-template-library-template-more',
			toggleMore: '.qazana-template-library-template-more-toggle',
			toggleMoreIcon: '.qazana-template-library-template-more-toggle i'
		} );
	},

	events: function() {
		return _.extend( TemplateLibraryTemplateView.prototype.events.apply( this, arguments ), {
			'click @ui.deleteButton': 'onDeleteButtonClick',
			'click @ui.toggleMore': 'onToggleMoreClick'
		} );
	},

	onDeleteButtonClick: function() {
		var toggleMoreIcon = this.ui.toggleMoreIcon;

		qazana.templates.deleteTemplate( this.model, {
			onConfirm: function() {
				toggleMoreIcon.removeClass( 'eicon-ellipsis-h' ).addClass( 'fa fa-circle-o-notch fa-spin' );
			},
			onSuccess: function() {
				qazana.templates.showTemplates();
			}
		} );
	},

	onToggleMoreClick: function() {
		this.ui.morePopup.show();
	},

	onPreviewButtonClick: function() {
		open( this.model.get( 'url' ), '_blank' );
	}
} );

module.exports = TemplateLibraryTemplateLocalView;

},{"qazana-templates/views/template/base":33}],35:[function(require,module,exports){
var TemplateLibraryTemplateView = require( 'qazana-templates/views/template/base' ),
	TemplateLibraryTemplateRemoteView;

TemplateLibraryTemplateRemoteView = TemplateLibraryTemplateView.extend( {
	template: '#tmpl-qazana-template-library-template-remote',

	ui: function() {
		return jQuery.extend( TemplateLibraryTemplateView.prototype.ui.apply( this, arguments ), {
			favoriteCheckbox: '.qazana-template-library-template-favorite-input'
		} );
	},

	events: function() {
		return jQuery.extend( TemplateLibraryTemplateView.prototype.events.apply( this, arguments ), {
			'change @ui.favoriteCheckbox': 'onFavoriteCheckboxChange'
		} );
	},

	onPreviewButtonClick: function() {
		qazana.templates.getLayout().showPreviewView( this.model );
	},

	onFavoriteCheckboxChange: function() {
		var isFavorite = this.ui.favoriteCheckbox[0].checked;

		this.model.set( 'favorite', isFavorite );

		qazana.templates.markAsFavorite( this.model, isFavorite );

		if ( ! isFavorite && qazana.templates.getFilter( 'favorite' ) ) {
			qazana.channels.templates.trigger( 'filter:change' );
		}
	}
} );

module.exports = TemplateLibraryTemplateRemoteView;

},{"qazana-templates/views/template/base":33}],36:[function(require,module,exports){
var Module = require( 'qazana-utils/module' ),
	Validator;

Validator = Module.extend( {
	errors: [],

	__construct: function( settings ) {
		var customValidationMethod = settings.customValidationMethod;

		if ( customValidationMethod ) {
			this.validationMethod = customValidationMethod;
		}
	},

	getDefaultSettings: function() {
		return {
			validationTerms: {}
		};
	},

	isValid: function() {
		var validationErrors = this.validationMethod.apply( this, arguments );

		if ( validationErrors.length ) {
			this.errors = validationErrors;

			return false;
		}

		return true;
	},

	validationMethod: function( newValue ) {
		var validationTerms = this.getSettings( 'validationTerms' ),
			errors = [];

		if ( validationTerms.required ) {
			if ( ! ( '' + newValue ).length ) {
				errors.push( 'Required value is empty' );
			}
		}

		return errors;
	}
} );

module.exports = Validator;

},{"qazana-utils/module":140}],37:[function(require,module,exports){
var Validator = require( 'qazana-validator/base' );

module.exports = Validator.extend( {
	validationMethod: function( newValue ) {
		var validationTerms = this.getSettings( 'validationTerms' ),
			errors = [];

		if ( _.isFinite( newValue ) ) {
			if ( undefined !== validationTerms.min && newValue < validationTerms.min ) {
				errors.push( 'Value is less than minimum' );
			}

			if ( undefined !== validationTerms.max && newValue > validationTerms.max ) {
				errors.push( 'Value is greater than maximum' );
			}
		}

		return errors;
	}
} );

},{"qazana-validator/base":36}],38:[function(require,module,exports){
var ControlBaseView = require( 'qazana-controls/base' ),
	TagsBehavior = require( 'qazana-dynamic-tags/control-behavior' ),
	Validator = require( 'qazana-validator/base' ),
	ControlBaseDataView;

ControlBaseDataView = ControlBaseView.extend( {

	ui: function() {
		var ui = ControlBaseView.prototype.ui.apply( this, arguments );

		_.extend( ui, {
			input: 'input[data-setting][type!="checkbox"][type!="radio"]',
			checkbox: 'input[data-setting][type="checkbox"]',
			radio: 'input[data-setting][type="radio"]',
			select: 'select[data-setting]',
			textarea: 'textarea[data-setting]',
			responsiveSwitchers: '.qazana-responsive-switcher',
			contentEditable: '[contenteditable="true"]',
			tooltipTarget: '.tooltip-target'
		} );

		return ui;
	},

	templateHelpers: function() {
		var controlData = ControlBaseView.prototype.templateHelpers.apply( this, arguments );

		controlData.data.controlValue = this.getControlValue();

		return controlData;
	},

	events: function() {
		return {
			'input @ui.input': 'onBaseInputChange',
			'change @ui.checkbox': 'onBaseInputChange',
			'change @ui.radio': 'onBaseInputChange',
			'input @ui.textarea': 'onBaseInputChange',
			'change @ui.select': 'onBaseInputChange',
			'input @ui.contentEditable': 'onBaseInputChange',
			'click @ui.responsiveSwitchers': 'onResponsiveSwitchersClick'
		};
	},

	behaviors: function() {
		var behaviors = {},
			dynamicSettings = this.options.model.get( 'dynamic' );

		if ( dynamicSettings && dynamicSettings.active ) {
			var tags = _.filter( qazana.dynamicTags.getConfig( 'tags' ), function( tag ) {
				return _.intersection( tag.categories, dynamicSettings.categories ).length;
			} );

			if ( tags.length ) {
				behaviors.tags = {
					behaviorClass: TagsBehavior,
					tags: tags,
					dynamicSettings: dynamicSettings
				};
			}
		}

		return behaviors;
	},

	initialize: function( options ) {
		ControlBaseView.prototype.initialize.apply( this, arguments );

		this.registerValidators();

		this.listenTo( this.elementSettingsModel, 'change:external:' + this.model.get( 'name' ), this.onAfterExternalChange );
	},

	getControlValue: function() {
		return this.elementSettingsModel.get( this.model.get( 'name' ) );
	},

	setValue: function( value ) {
		this.setSettingsModel( value );
	},

	setSettingsModel: function( value ) {
		this.elementSettingsModel.set( this.model.get( 'name' ), value );

		this.triggerMethod( 'settings:change' );
	},

	applySavedValue: function() {
		this.setInputValue( '[data-setting="' + this.model.get( 'name' ) + '"]', this.getControlValue() );
	},

	getEditSettings: function( setting ) {
		var settings = this.getOption( 'elementEditSettings' ).toJSON();

		if ( setting ) {
			return settings[ setting ];
		}

		return settings;
	},

	setEditSetting: function( settingKey, settingValue ) {
		var settings = this.getOption( 'elementEditSettings' );

		settings.set( settingKey, settingValue );
	},

	getInputValue: function( input ) {
		var $input = this.$( input );

		if ( $input.is( '[contenteditable="true"]' ) ) {
			return $input.html();
		}

		var inputValue = $input.val(),
			inputType = $input.attr( 'type' );

		if ( -1 !== [ 'radio', 'checkbox' ].indexOf( inputType ) ) {
			return $input.prop( 'checked' ) ? inputValue : '';
		}

		if ( 'number' === inputType && _.isFinite( inputValue ) ) {
			return +inputValue;
		}

		// Temp fix for jQuery (< 3.0) that return null instead of empty array
		if ( 'SELECT' === input.tagName && $input.prop( 'multiple' ) && null === inputValue ) {
			inputValue = [];
		}

		return inputValue;
	},

	setInputValue: function( input, value ) {
		var $input = this.$( input ),
			inputType = $input.attr( 'type' );

		if ( 'checkbox' === inputType ) {
			$input.prop( 'checked', !! value );
		} else if ( 'radio' === inputType ) {
			$input.filter( '[value="' + value + '"]' ).prop( 'checked', true );
		} else {
			$input.val( value );
		}
	},

	addValidator: function( validator ) {
		this.validators.push( validator );
	},

	registerValidators: function() {
		this.validators = [];

		var validationTerms = {};

		if ( this.model.get( 'required' ) ) {
			validationTerms.required = true;
		}

		if ( ! jQuery.isEmptyObject( validationTerms ) ) {
			this.addValidator( new Validator( {
				validationTerms: validationTerms
			} ) );
		}
	},

	onRender: function() {
		ControlBaseView.prototype.onRender.apply( this, arguments );

		if ( this.model.get( 'responsive' ) ) {
			this.renderResponsiveSwitchers();
		}

		this.applySavedValue();

		this.triggerMethod( 'ready' );

		this.toggleControlVisibility();

		this.addTooltip();
	},

	onBaseInputChange: function( event ) {
		clearTimeout( this.correctionTimeout );

		var input = event.currentTarget,
			value = this.getInputValue( input ),
			validators = this.validators.slice( 0 ),
			settingsValidators = this.elementSettingsModel.validators[ this.model.get( 'name' ) ];

		if ( settingsValidators ) {
			validators = validators.concat( settingsValidators );
		}

		if ( validators ) {
			var oldValue = this.getControlValue( input.dataset.setting );

			var isValidValue = validators.every( function( validator ) {
				return validator.isValid( value, oldValue );
			} );

			if ( ! isValidValue ) {
				this.correctionTimeout = setTimeout( this.setInputValue.bind( this, input, oldValue ), 1200 );

				return;
			}
		}

		this.updateElementModel( value, input );

		this.triggerMethod( 'input:change', event );
	},

	onResponsiveSwitchersClick: function( event ) {
		var device = jQuery( event.currentTarget ).data( 'device' );

		qazana.changeDeviceMode( device );

		this.triggerMethod( 'responsive:switcher:click', device );
	},

	renderResponsiveSwitchers: function() {
		var templateHtml = Marionette.Renderer.render( '#tmpl-qazana-control-responsive-switchers', this.model.attributes );

		this.ui.controlTitle.after( templateHtml );
	},

	onAfterExternalChange: function() {
		this.hideTooltip();

		this.applySavedValue();
	},

	addTooltip: function() {
		if ( ! this.ui.tooltipTarget ) {
			return;
		}

		// Create tooltip on controls
		this.ui.tooltipTarget.tipsy( {
			gravity: function() {
				// `n` for down, `s` for up
				var gravity = jQuery( this ).data( 'tooltip-pos' );

				if ( undefined !== gravity ) {
					return gravity;
				} else {
					return 'n';
				}
			},
			title: function() {
				return this.getAttribute( 'data-tooltip' );
			}
		} );
	},

	hideTooltip: function() {
		if ( this.ui.tooltipTarget ) {
			this.ui.tooltipTarget.tipsy( 'hide' );
		}
	},

	updateElementModel: function( value ) {
		this.setValue( value );
	}
}, {
	// Static methods
	getStyleValue: function( placeholder, controlValue ) {
		return controlValue;
	},

	onPasteStyle: function() {
		return true;
	}
} );

module.exports = ControlBaseDataView;

},{"qazana-controls/base":41,"qazana-dynamic-tags/control-behavior":1,"qazana-validator/base":36}],39:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlBaseMultipleItemView;

ControlBaseMultipleItemView = ControlBaseDataView.extend( {

	applySavedValue: function() {
		var values = this.getControlValue(),
			$inputs = this.$( '[data-setting]' ),
			self = this;

		_.each( values, function( value, key ) {
			var $input = $inputs.filter( function() {
				return key === this.dataset.setting;
			} );

			self.setInputValue( $input, value );
		} );
	},

	getControlValue: function( key ) {
		var values = this.elementSettingsModel.get( this.model.get( 'name' ) );

		if ( ! jQuery.isPlainObject( values ) ) {
			return {};
		}

		if ( key ) {
			var value = values[ key ];

			if ( undefined === value ) {
				value = '';
			}

			return value;
		}

		return qazana.helpers.cloneObject( values );
	},

	setValue: function( key, value ) {
		var values = this.getControlValue();

		if ( 'object' === typeof key ) {
			_.each( key, function( internalValue, internalKey ) {
				values[ internalKey ] = internalValue;
			} );
		} else {
			values[ key ] = value;
		}

		this.setSettingsModel( values );
	},

	updateElementModel: function( value, input ) {
		var key = input.dataset.setting;

		this.setValue( key, value );
	}
}, {
	// Static methods
	getStyleValue: function( placeholder, controlValue ) {
		if ( ! _.isObject( controlValue ) ) {
			return ''; // invalid
		}

		return controlValue[ placeholder ];
	}
} );

module.exports = ControlBaseMultipleItemView;

},{"qazana-controls/base-data":38}],40:[function(require,module,exports){
var ControlBaseMultipleItemView = require( 'qazana-controls/base-multiple' ),
	ControlBaseUnitsItemView;

ControlBaseUnitsItemView = ControlBaseMultipleItemView.extend( {

	getCurrentRange: function() {
		return this.getUnitRange( this.getControlValue( 'unit' ) );
	},

	getUnitRange: function( unit ) {
		var ranges = this.model.get( 'range' );

		if ( ! ranges || ! ranges[ unit ] ) {
			return false;
		}

		return ranges[ unit ];
	}
} );

module.exports = ControlBaseUnitsItemView;

},{"qazana-controls/base-multiple":39}],41:[function(require,module,exports){
var ControlBaseView;

ControlBaseView = Marionette.CompositeView.extend( {
	ui: function() {
		return {
			controlTitle: '.qazana-control-title'
		};
	},

	behaviors: function() {
		var behaviors = {};

		return qazana.hooks.applyFilters( 'controls/base/behaviors', behaviors, this );
	},

	getBehavior: function( name ) {
		return this._behaviors[ Object.keys( this.behaviors() ).indexOf( name ) ];
	},

	className: function() {
		// TODO: Any better classes for that?
		var classes = 'qazana-control qazana-control-' + this.model.get( 'name' ) + ' qazana-control-type-' + this.model.get( 'type' ),
			modelClasses = this.model.get( 'classes' ),
			responsive = this.model.get( 'responsive' );

		if ( ! _.isEmpty( modelClasses ) ) {
			classes += ' ' + modelClasses;
		}

		if ( ! _.isEmpty( responsive ) ) {
			classes += ' qazana-control-responsive-' + responsive.max;
		}

		return classes;
	},

	templateHelpers: function() {
		var controlData = {
			_cid: this.model.cid
		};

		return {
			data: _.extend( {}, this.model.toJSON(), controlData )
		};
	},

	getTemplate: function() {
		return Marionette.TemplateCache.get( '#tmpl-qazana-control-' + this.model.get( 'type' ) + '-content' );
	},

	initialize: function( options ) {
		this.elementSettingsModel = options.elementSettingsModel;

		var controlType = this.model.get( 'type' ),
			controlSettings = jQuery.extend( true, {}, qazana.config.controls[ controlType ], this.model.attributes );

		this.model.set( controlSettings );

		this.listenTo( this.elementSettingsModel, 'change', this.toggleControlVisibility );
	},

	toggleControlVisibility: function() {
		var isVisible = qazana.helpers.isActiveControl( this.model, this.elementSettingsModel.attributes );

		this.$el.toggleClass( 'qazana-hidden-control', ! isVisible );

		qazana.getPanelView().updateScrollbar();
	},

	onRender: function() {
		var layoutType = this.model.get( 'label_block' ) ? 'block' : 'inline',
            showLabel = this.model.get( 'show_label' ),
            elCustomClass = this.model.get( 'custom_class' ),
			elClasses = 'qazana-label-' + layoutType;

		elClasses += ' qazana-control-separator-' + this.model.get( 'separator' );

		if ( ! showLabel ) {
			elClasses += ' qazana-control-hidden-label';
        }
        
        if ( elCustomClass ) {
            elClasses += ' qazana-control-custom-class-' + elCustomClass;
		}

		this.$el.addClass( elClasses );

		this.toggleControlVisibility();
	}
} );

module.exports = ControlBaseView;

},{}],42:[function(require,module,exports){
var ControlMultipleBaseItemView = require( 'qazana-controls/base-multiple' ),
	ControlBoxShadowItemView;

ControlBoxShadowItemView = ControlMultipleBaseItemView.extend( {
	ui: function() {
		var ui = ControlMultipleBaseItemView.prototype.ui.apply( this, arguments );

		ui.sliders = '.qazana-slider';
		ui.colors = '.qazana-shadow-color-picker';

		return ui;
	},

	events: function() {
		return _.extend( ControlMultipleBaseItemView.prototype.events.apply( this, arguments ), {
			'slide @ui.sliders': 'onSlideChange'
		} );
	},

	initSliders: function() {
		var value = this.getControlValue();

		this.ui.sliders.each( function() {
			var $slider = jQuery( this ),
				$input = $slider.next( '.qazana-slider-input' ).find( 'input' );

			$slider.slider( {
				value: value[ this.dataset.input ],
				min: +$input.attr( 'min' ),
				max: +$input.attr( 'max' )
			} );
		} );
	},

	initColors: function() {
		var self = this;

		qazana.helpers.wpColorPicker( this.ui.colors, {
			change: function() {
				var $this = jQuery( this ),
					type = $this.data( 'setting' );

				self.setValue( type, $this.wpColorPicker( 'color' ) );
			},

			clear: function() {
				self.setValue( this.dataset.setting, '' );
			}
		} );
	},

	onInputChange: function( event ) {
		var type = event.currentTarget.dataset.setting,
			$slider = this.ui.sliders.filter( '[data-input="' + type + '"]' );

		$slider.slider( 'value', this.getControlValue( type ) );
	},

	onReady: function() {
		this.initSliders();
		this.initColors();
	},

	onSlideChange: function( event, ui ) {
		var type = event.currentTarget.dataset.input,
			$input = this.ui.input.filter( '[data-setting="' + type + '"]' );

		$input.val( ui.value );
		this.setValue( type, ui.value );
	},

	onBeforeDestroy: function() {
		this.ui.colors.each( function() {
			var $color = jQuery( this );

			if ( $color.wpColorPicker( 'instance' ) ) {
				$color.wpColorPicker( 'close' );
			}
		} );

		this.$el.remove();
	}
} );

module.exports = ControlBoxShadowItemView;

},{"qazana-controls/base-multiple":39}],43:[function(require,module,exports){
var ControlBaseView = require( 'qazana-controls/base' );

module.exports = ControlBaseView.extend( {

	ui: function() {
		var ui = ControlBaseView.prototype.ui.apply( this, arguments );

		ui.button = 'button';

		return ui;
	},

	events: {
		'click @ui.button': 'onButtonClick'
	},

	onButtonClick: function() {
		var eventName = this.model.get( 'event' );

		qazana.channels.editor.trigger( eventName, this );
	}
} );

},{"qazana-controls/base":41}],44:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlChooseItemView;

ControlChooseItemView = ControlBaseDataView.extend( {
	ui: function() {
		var ui = ControlBaseDataView.prototype.ui.apply( this, arguments );

		ui.inputs = '[type="radio"]';

		return ui;
	},

	events: function() {
		return _.extend( ControlBaseDataView.prototype.events.apply( this, arguments ), {
			'mousedown label': 'onMouseDownLabel',
			'click @ui.inputs': 'onClickInput',
			'change @ui.inputs': 'onBaseInputChange'
		} );
	},

	onMouseDownLabel: function( event ) {
		var $clickedLabel = this.$( event.currentTarget ),
			$selectedInput = this.$( '#' + $clickedLabel.attr( 'for' ) );

		$selectedInput.data( 'checked', $selectedInput.prop( 'checked' ) );
	},

	onClickInput: function( event ) {
		if ( ! this.model.get( 'toggle' ) ) {
			return;
		}

		var $selectedInput = this.$( event.currentTarget );

		if ( $selectedInput.data( 'checked' ) ) {
			$selectedInput.prop( 'checked', false ).trigger( 'change' );
		}
	},

	onRender: function() {
		ControlBaseDataView.prototype.onRender.apply( this, arguments );

		var currentValue = this.getControlValue();

		if ( currentValue ) {
			this.ui.inputs.filter( '[value="' + currentValue + '"]' ).prop( 'checked', true );
		}
	}
}, {

	onPasteStyle: function( control, clipboardValue ) {
		return '' === clipboardValue || undefined !== control.options[ clipboardValue ];
	}
} );

module.exports = ControlChooseItemView;

},{"qazana-controls/base-data":38}],45:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlCodeEditorItemView;

ControlCodeEditorItemView = ControlBaseDataView.extend( {

	ui: function() {
		var ui = ControlBaseDataView.prototype.ui.apply( this, arguments );

		ui.editor = '.qazana-code-editor';

		return ui;
	},

	onReady: function() {
		var self = this;

		if ( 'undefined' === typeof ace ) {
			return;
		}

		var langTools = ace.require( 'ace/ext/language_tools' );

		self.editor = ace.edit( this.ui.editor[0] );

		jQuery( self.editor.container ).addClass( 'qazana-input-style qazana-code-editor' );

		self.editor.setOptions( {
			mode: 'ace/mode/' + self.model.attributes.language,
			minLines: 10,
			maxLines: Infinity,
			showGutter: true,
			useWorker: true,
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true
		} );

		self.editor.getSession().setUseWrapMode( true );

		qazana.panel.$el.on( 'resize.aceEditor', self.onResize.bind( this ) );

		if ( 'css' === self.model.attributes.language ) {
			var selectorCompleter = {
				getCompletions: function( editor, session, pos, prefix, callback ) {
					var list = [],
						token = session.getTokenAt( pos.row, pos.column );

					if ( 0 < prefix.length && 'selector'.match( prefix ) && 'constant' === token.type ) {
						list = [ {
							name: 'selector',
							value: 'selector',
							score: 1,
							meta: 'Qazana'
						} ];
					}

					callback( null, list );
				}
			};

			langTools.addCompleter( selectorCompleter );
		}

		self.editor.setValue( self.getControlValue(), -1 ); // -1 =  move cursor to the start

		self.editor.on( 'change', function() {
			self.setValue( self.editor.getValue() );
		} );

		if ( 'html' === self.model.attributes.language ) {
			// Remove the `doctype` annotation
			var session = self.editor.getSession();

			session.on( 'changeAnnotation', function() {
				var annotations = session.getAnnotations() || [],
					annotationsLength = annotations.length,
					index = annotations.length;

				while ( index-- ) {
					if ( /doctype first\. Expected/.test( annotations[ index ].text ) ) {
						annotations.splice( index, 1 );
					}
				}

				if ( annotationsLength > annotations.length ) {
					session.setAnnotations( annotations );
				}
			} );
		}
	},

	onResize: function() {
		this.editor.resize();
	},

	onDestroy: function() {
		qazana.panel.$el.off( 'resize.aceEditor' );
	}
} );

module.exports = ControlCodeEditorItemView;

},{"qazana-controls/base-data":38}],46:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlColorItemView;

ControlColorItemView = ControlBaseDataView.extend( {
	applySavedValue: function() {
		ControlBaseDataView.prototype.applySavedValue.apply( this, arguments );

		var self = this,
			value = self.getControlValue(),
			colorInstance = self.ui.input.wpColorPicker( 'instance' );

		if ( colorInstance ) {
			self.ui.input.wpColorPicker( 'color', value );

			if ( ! value ) {
				// Trigger `change` event manually, since it will not be triggered automatically on empty value
				self.ui.input.data( 'a8cIris' )._change();
			}
		} else {
			qazana.helpers.wpColorPicker( self.ui.input, {
				change: function() {
					self.setValue( self.ui.input.wpColorPicker( 'color' ) );
				},
				clear: function() {
					self.setValue( '' );
				}
			} );
		}
	},

	onBeforeDestroy: function() {
		if ( this.ui.input.wpColorPicker( 'instance' ) ) {
			this.ui.input.wpColorPicker( 'close' );
		}

		this.$el.remove();
	}
} );

module.exports = ControlColorItemView;

},{"qazana-controls/base-data":38}],47:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlDateTimePickerItemView;

ControlDateTimePickerItemView = ControlBaseDataView.extend( {

	onReady: function() {
		var self = this;

		var options = _.extend( {
			onClose: function() {
				self.saveValue();
			},
			enableTime: true,
			minuteIncrement: 1
		}, this.model.get( 'picker_options' ) );

		this.ui.input.flatpickr( options );
	},

	saveValue: function() {
		this.setValue( this.ui.input.val() );
	},

	onBeforeDestroy: function() {
		this.saveValue();
		this.ui.input.flatpickr().destroy();
	}
} );

module.exports = ControlDateTimePickerItemView;

},{"qazana-controls/base-data":38}],48:[function(require,module,exports){
var ControlBaseUnitsItemView = require( 'qazana-controls/base-units' ),
	ControlDimensionsItemView;

ControlDimensionsItemView = ControlBaseUnitsItemView.extend( {
	ui: function() {
		var ui = ControlBaseUnitsItemView.prototype.ui.apply( this, arguments );

		ui.controls = '.qazana-control-dimension > input:enabled';
		ui.link = 'button.qazana-link-dimensions';

		return ui;
	},

	events: function() {
		return _.extend( ControlBaseUnitsItemView.prototype.events.apply( this, arguments ), {
			'click @ui.link': 'onLinkDimensionsClicked'
		} );
	},

	defaultDimensionValue: 0,

	initialize: function() {
		ControlBaseUnitsItemView.prototype.initialize.apply( this, arguments );

		// TODO: Need to be in helpers, and not in variable
		this.model.set( 'allowed_dimensions', this.filterDimensions( this.model.get( 'allowed_dimensions' ) ) );
	},

	getPossibleDimensions: function() {
		return [
			'top',
			'right',
			'bottom',
			'left'
		];
	},

	filterDimensions: function( filter ) {
		filter = filter || 'all';

		var dimensions = this.getPossibleDimensions();

		if ( 'all' === filter ) {
			return dimensions;
		}

		if ( ! _.isArray( filter ) ) {
			if ( 'horizontal' === filter ) {
				filter = [ 'right', 'left' ];
			} else if ( 'vertical' === filter ) {
				filter = [ 'top', 'bottom' ];
			}
		}

		return filter;
	},

	onReady: function() {
		var self = this,
			currentValue = self.getControlValue();

		if ( ! self.isLinkedDimensions() ) {
			self.ui.link.addClass( 'unlinked' );

			self.ui.controls.each( function( index, element ) {
				var value = currentValue[ element.dataset.setting ];

				if ( _.isEmpty( value ) ) {
					value = self.defaultDimensionValue;
				}

				self.$( element ).val( value );
			} );
		}

		self.fillEmptyDimensions();
	},

	updateDimensionsValue: function() {
		var currentValue = {},
			dimensions = this.getPossibleDimensions(),
			$controls = this.ui.controls,
			defaultDimensionValue = this.defaultDimensionValue;

		dimensions.forEach( function( dimension ) {
			var $element = $controls.filter( '[data-setting="' + dimension + '"]' );

			currentValue[ dimension ] = $element.length ? $element.val() : defaultDimensionValue;
		} );

		this.setValue( currentValue );
	},

	fillEmptyDimensions: function() {
		var dimensions = this.getPossibleDimensions(),
			allowedDimensions = this.model.get( 'allowed_dimensions' ),
			$controls = this.ui.controls,
			defaultDimensionValue = this.defaultDimensionValue;

		if ( this.isLinkedDimensions() ) {
			return;
		}

		dimensions.forEach( function( dimension ) {
			var $element = $controls.filter( '[data-setting="' + dimension + '"]' ),
				isAllowedDimension = -1 !== _.indexOf( allowedDimensions, dimension );

			if ( isAllowedDimension && $element.length && _.isEmpty( $element.val() ) ) {
				$element.val( defaultDimensionValue );
			}

		} );
	},

	updateDimensions: function() {
		this.fillEmptyDimensions();
		this.updateDimensionsValue();
	},

	resetDimensions: function() {
		this.ui.controls.val( '' );

		this.updateDimensionsValue();
	},

	onInputChange: function( event ) {
		var inputSetting = event.target.dataset.setting;

		if ( 'unit' === inputSetting ) {
			this.resetDimensions();
		}

		if ( ! _.contains( this.getPossibleDimensions(), inputSetting ) ) {
			return;
		}

		if ( this.isLinkedDimensions() ) {
			var $thisControl = this.$( event.target );

			this.ui.controls.val( $thisControl.val() );
		}

		this.updateDimensions();
	},

	onLinkDimensionsClicked: function( event ) {
		event.preventDefault();
		event.stopPropagation();

		this.ui.link.toggleClass( 'unlinked' );

		this.setValue( 'isLinked', ! this.ui.link.hasClass( 'unlinked' ) );

		if ( this.isLinkedDimensions() ) {
			// Set all controls value from the first control.
			this.ui.controls.val( this.ui.controls.eq( 0 ).val() );
		}

		this.updateDimensions();
	},

	isLinkedDimensions: function() {
		return this.getControlValue( 'isLinked' );
	}
} );

module.exports = ControlDimensionsItemView;

},{"qazana-controls/base-units":40}],49:[function(require,module,exports){
var ControlSelect2View = require( 'qazana-controls/select2' );

module.exports = ControlSelect2View.extend( {
	getSelect2Options: function() {
		return {
			dir: qazana.config.is_rtl ? 'rtl' : 'ltr'
		};
	},

	templateHelpers: function() {
		var helpers = ControlSelect2View.prototype.templateHelpers.apply( this, arguments ),
			fonts = this.model.get( 'options' );

		helpers.getFontsByGroups = function( groups ) {
			var filteredFonts = {};

			_.each( fonts, function( fontType, fontName ) {
				if ( _.isArray( groups ) && _.contains( groups, fontType ) || fontType === groups ) {
					filteredFonts[ fontName ] = fontName;
				}
			} );

			return filteredFonts;
		};

		return helpers;
	}
} );

},{"qazana-controls/select2":61}],50:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlMediaItemView;

ControlMediaItemView = ControlBaseDataView.extend( {
	ui: function() {
		var ui = ControlBaseDataView.prototype.ui.apply( this, arguments );

		ui.addImages = '.qazana-control-gallery-add';
		ui.clearGallery = '.qazana-control-gallery-clear';
		ui.galleryThumbnails = '.qazana-control-gallery-thumbnails';
		ui.status = '.qazana-control-gallery-status-title';

		return ui;
	},

	events: function() {
		return _.extend( ControlBaseDataView.prototype.events.apply( this, arguments ), {
			'click @ui.addImages': 'onAddImagesClick',
			'click @ui.clearGallery': 'onClearGalleryClick',
			'click @ui.galleryThumbnails': 'onGalleryThumbnailsClick'
		} );
	},

	onReady: function() {
		this.initRemoveDialog();
	},

	applySavedValue: function() {
		var images = this.getControlValue(),
			imagesCount = images.length,
			hasImages = !! imagesCount;

		this.$el
			.toggleClass( 'qazana-gallery-has-images', hasImages )
			.toggleClass( 'qazana-gallery-empty', ! hasImages );

		var $galleryThumbnails = this.ui.galleryThumbnails;

		$galleryThumbnails.empty();

		this.ui.status.text( qazana.translate( hasImages ? 'gallery_images_selected' : 'gallery_no_images_selected', [ imagesCount ] ) );

		if ( ! hasImages ) {
			return;
		}

		this.getControlValue().forEach( function( image ) {
			var $thumbnail = jQuery( '<div>', { 'class': 'qazana-control-gallery-thumbnail' } );

			$thumbnail.css( 'background-image', 'url(' + image.url + ')' );

			$galleryThumbnails.append( $thumbnail );
		} );
	},

	hasImages: function() {
		return !! this.getControlValue().length;
	},

	openFrame: function( action ) {
		this.initFrame( action );

		this.frame.open();
	},

	initFrame: function( action ) {
		var frameStates = {
			create: 'gallery',
			add: 'gallery-library',
			edit: 'gallery-edit'
		};

		var options = {
			frame:  'post',
			multiple: true,
			state: frameStates[ action ],
			button: {
				text: qazana.translate( 'insert_media' )
			}
		};

		if ( this.hasImages() ) {
			options.selection = this.fetchSelection();
		}

		this.frame = wp.media( options );

		// When a file is selected, run a callback.
		this.frame.on( {
			'update': this.select,
			'menu:render:default': this.menuRender,
			'content:render:browse': this.gallerySettings
		}, this );
	},

	menuRender: function( view ) {
		view.unset( 'insert' );
		view.unset( 'featured-image' );
	},

	gallerySettings: function( browser ) {
		browser.sidebar.on( 'ready', function() {
			browser.sidebar.unset( 'gallery' );
		} );
	},

	fetchSelection: function() {
		var attachments = wp.media.query( {
			orderby: 'post__in',
			order: 'ASC',
			type: 'image',
			perPage: -1,
			post__in: _.pluck( this.getControlValue(), 'id' )
		} );

		return new wp.media.model.Selection( attachments.models, {
			props: attachments.props.toJSON(),
			multiple: true
		} );
	},

	/**
	 * Callback handler for when an attachment is selected in the media modal.
	 * Gets the selected image information, and sets it within the control.
	 */
	select: function( selection ) {
		var images = [];

		selection.each( function( image ) {
			images.push( {
				id: image.get( 'id' ),
				url: image.get( 'url' )
			} );
		} );

		this.setValue( images );

		this.applySavedValue();
	},

	onBeforeDestroy: function() {
		if ( this.frame ) {
			this.frame.off();
		}

		this.$el.remove();
	},

	resetGallery: function() {
		this.setValue( '' );

		this.applySavedValue();
	},

	initRemoveDialog: function() {
		var removeDialog;

		this.getRemoveDialog = function() {
			if ( ! removeDialog ) {
				removeDialog = qazana.dialogsManager.createWidget( 'confirm', {
					message: qazana.translate( 'dialog_confirm_gallery_delete' ),
					headerMessage: qazana.translate( 'delete_gallery' ),
					strings: {
						confirm: qazana.translate( 'delete' ),
						cancel: qazana.translate( 'cancel' )
					},
					defaultOption: 'confirm',
					onConfirm: this.resetGallery.bind( this )
				} );
			}

			return removeDialog;
		};
	},

	onAddImagesClick: function() {
		this.openFrame( this.hasImages() ? 'add' : 'create' );
	},

	onClearGalleryClick: function() {
		this.getRemoveDialog().show();
	},

	onGalleryThumbnailsClick: function() {
		this.openFrame( 'edit' );
	}
} );

module.exports = ControlMediaItemView;

},{"qazana-controls/base-data":38}],51:[function(require,module,exports){
var ControlBaseDataView = require('qazana-controls/base-data'),
	ControlIconView;

ControlIconView = ControlBaseDataView.extend( {

	initialize: function() {
		ControlBaseDataView.prototype.initialize.apply( this, arguments );

		this.filterIcons();
	},

	filterIcons: function() {
		var icons = this.model.get( 'options' ),
			include = this.model.get( 'include' ),
			exclude = this.model.get( 'exclude' );

		if ( include ) {
			var filteredIcons = {};

			_.each( include, function( iconKey ) {
				filteredIcons[ iconKey ] = icons[ iconKey ];
			} );

			this.model.set( 'options', filteredIcons );
			return;
		}

		if ( exclude ) {
			_.each( exclude, function( iconKey ) {
				delete icons[ iconKey ];
			} );
		}
	},

	iconsList: function( icon ) {
		if ( ! icon.id ) {
			return icon.text;
		}

		return jQuery(
			'<span><i class="' + icon.id + '"></i> ' + icon.text + '</span>'
		);
	},

	onReady: function() {
		this.ui.select.fontIconPicker({
	       theme: 'fip-grey'
        }); // Load with default options
	},

	templateHelpers: function() {
		var helpers = ControlBaseDataView.prototype.templateHelpers.apply( this, arguments );

		helpers.getIconsByGroups = _.bind( function( groups ) {
			var icons = this.model.get( 'options' ),
				filterIcons = {};

			_.each( icons, function( iconType, iconName ) {
				if ( _.isArray( groups ) && _.contains( groups, iconType ) || iconType === groups ) {
					filterIcons[ iconName ] = iconType;
				}
			} );

			return filterIcons;
		}, this );

		return helpers;
	}

} );

module.exports = ControlIconView;

},{"qazana-controls/base-data":38}],52:[function(require,module,exports){
var ControlMultipleBaseItemView = require( 'qazana-controls/base-multiple' ),
	ControlImageDimensionsItemView;

ControlImageDimensionsItemView = ControlMultipleBaseItemView.extend( {
	ui: function() {
		return {
			inputWidth: 'input[data-setting="width"]',
			inputHeight: 'input[data-setting="height"]',

			btnApply: 'button.qazana-image-dimensions-apply-button'
		};
	},

	// Override the base events
	events: function() {
		return {
			'click @ui.btnApply': 'onApplyClicked'
		};
	},

	onApplyClicked: function( event ) {
		event.preventDefault();

		this.setValue( {
			width: this.ui.inputWidth.val(),
			height: this.ui.inputHeight.val()
		} );
	}
} );

module.exports = ControlImageDimensionsItemView;

},{"qazana-controls/base-multiple":39}],53:[function(require,module,exports){
var ControlMultipleBaseItemView = require( 'qazana-controls/base-multiple' ),
	ControlMediaItemView;

ControlMediaItemView = ControlMultipleBaseItemView.extend( {
	ui: function() {
		var ui = ControlMultipleBaseItemView.prototype.ui.apply( this, arguments );

		ui.controlMedia = '.qazana-control-media';
		ui.mediaImage = '.qazana-control-media-image';
		ui.mediaVideo = '.qazana-control-media-video';
		ui.frameOpeners = '.qazana-control-preview-area';
		ui.deleteButton = '.qazana-control-media-delete';

		return ui;
	},

	events: function() {
		return _.extend( ControlMultipleBaseItemView.prototype.events.apply( this, arguments ), {
			'click @ui.frameOpeners': 'openFrame',
			'click @ui.deleteButton': 'deleteImage'
		} );
	},

	getMediaType: function() {
		return this.model.get( 'media_type' );
	},

	applySavedValue: function() {
		var url = this.getControlValue( 'url' ),
			mediaType = this.getMediaType();

		if ( 'image' === mediaType ) {
			this.ui.mediaImage.css( 'background-image', url ? 'url(' + url + ')' : '' );
		} else if ( 'video' === mediaType ) {
			this.ui.mediaVideo.attr( 'src', url );
		}

		this.ui.controlMedia.toggleClass( 'qazana-media-empty', ! url );
	},

	openFrame: function() {
		if ( ! this.frame ) {
			this.initFrame();
		}

		this.frame.open();
	},

	deleteImage: function( event ) {
		event.stopPropagation();

		this.setValue( {
			url: '',
			id: ''
		} );

		this.applySavedValue();
	},

	/**
	 * Create a media modal select frame, and store it so the instance can be reused when needed.
	 */
	initFrame: function() {
		// Set current doc id to attach uploaded images.
		wp.media.view.settings.post.id = qazana.config.document.id;
		this.frame = wp.media( {
			button: {
				text: qazana.translate( 'insert_media' )
			},
			states: [
				new wp.media.controller.Library( {
					title: qazana.translate( 'insert_media' ),
					library: wp.media.query( { type: this.getMediaType() } ),
					multiple: false,
					date: false
				} )
			]
		} );

		// When a file is selected, run a callback.
		this.frame.on( 'insert select', this.select.bind( this ) );
	},

	/**
	 * Callback handler for when an attachment is selected in the media modal.
	 * Gets the selected image information, and sets it within the control.
	 */
	select: function() {
		this.trigger( 'before:select' );

		// Get the attachment from the modal frame.
		var attachment = this.frame.state().get( 'selection' ).first().toJSON();

		if ( attachment.url ) {
			this.setValue( {
				url: attachment.url,
				id: attachment.id
			} );

			this.applySavedValue();
		}

		this.trigger( 'after:select' );
	},

	onBeforeDestroy: function() {
		this.$el.remove();
	}
} );

module.exports = ControlMediaItemView;

},{"qazana-controls/base-multiple":39}],54:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	NumberValidator = require( 'qazana-validator/number' ),
	ControlNumberItemView;

ControlNumberItemView = ControlBaseDataView.extend( {

	registerValidators: function() {
		ControlBaseDataView.prototype.registerValidators.apply( this, arguments );

		var validationTerms = {},
			model = this.model;

		[ 'min', 'max' ].forEach( function( term ) {
			var termValue = model.get( term );

			if ( _.isFinite( termValue ) ) {
				validationTerms[ term ] = termValue;
			}
		} );

		if ( ! jQuery.isEmptyObject( validationTerms ) ) {
			this.addValidator( new NumberValidator( {
				validationTerms: validationTerms
			} ) );
		}
	}
} );

module.exports = ControlNumberItemView;

},{"qazana-controls/base-data":38,"qazana-validator/number":37}],55:[function(require,module,exports){
var ControlMultipleBaseItemView = require( 'qazana-controls/base-multiple' ),
	ControlOrderItemView;

ControlOrderItemView = ControlMultipleBaseItemView.extend( {
	ui: function() {
		var ui = ControlMultipleBaseItemView.prototype.ui.apply( this, arguments );

		ui.reverseOrderLabel = '.qazana-control-order-label';

		return ui;
	},

	changeLabelTitle: function() {
		var reverseOrder = this.getControlValue( 'reverse_order' );

		this.ui.reverseOrderLabel.attr( 'title', qazana.translate( reverseOrder ? 'asc' : 'desc' ) );
	},

	onRender: function() {
		ControlMultipleBaseItemView.prototype.onRender.apply( this, arguments );

		this.changeLabelTitle();
	},

	onInputChange: function() {
		this.changeLabelTitle();
	}
} );

module.exports = ControlOrderItemView;

},{"qazana-controls/base-multiple":39}],56:[function(require,module,exports){
var ControlChooseView = require( 'qazana-controls/choose' ),
	ControlPopoverStarterView;

ControlPopoverStarterView = ControlChooseView.extend( {
	ui: function() {
		var ui = ControlChooseView.prototype.ui.apply( this, arguments );

		ui.popoverToggle = '.qazana-control-popover-toggle-toggle';

		return ui;
	},

	events: function() {
		return _.extend( ControlChooseView.prototype.events.apply( this, arguments ), {
			'click @ui.popoverToggle': 'onPopoverToggleClick'
		} );
	},

	onPopoverToggleClick: function() {
		this.$el.next( '.qazana-controls-popover' ).toggle();
	}
}, {

	onPasteStyle: function( control, clipboardValue ) {
		return ! clipboardValue || clipboardValue === control.return_value;
	}
} );

module.exports = ControlPopoverStarterView;

},{"qazana-controls/choose":44}],57:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	RepeaterRowView;

RepeaterRowView = Marionette.CompositeView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-repeater-row' ),

	className: 'qazana-repeater-fields',

	ui: {
		duplicateButton: '.qazana-repeater-tool-duplicate',
		editButton: '.qazana-repeater-tool-edit',
		removeButton: '.qazana-repeater-tool-remove',
		itemTitle: '.qazana-repeater-row-item-title'
	},

	behaviors: {
		HandleInnerTabs: {
			behaviorClass: require( 'qazana-behaviors/inner-tabs' )
		}
	},

	triggers: {
		'click @ui.removeButton': 'click:remove',
		'click @ui.duplicateButton': 'click:duplicate',
		'click @ui.itemTitle': 'click:edit'
	},

	modelEvents: {
		change: 'onModelChange'
	},

	templateHelpers: function() {
		return {
			itemIndex: this.getOption( 'itemIndex' )
		};
	},

	childViewContainer: '.qazana-repeater-row-controls',

	getChildView: function( item ) {
		var controlType = item.get( 'type' );

		return qazana.getControlView( controlType );
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model
		};
	},

	updateIndex: function( newIndex ) {
		this.itemIndex = newIndex;
	},

	setTitle: function() {
		var titleField = this.getOption( 'titleField' ),
			title = '';

		if ( titleField ) {
			var values = {};

			this.children.each( function( child ) {
				if ( ! ( child instanceof ControlBaseDataView ) ) {
					return;
				}

				values[ child.model.get( 'name' ) ] = child.getControlValue();
			} );

			title = Marionette.TemplateCache.prototype.compileTemplate( titleField )( this.model.parseDynamicSettings() );
		}

		if ( ! title ) {
			title = qazana.translate( 'Item #{0}', [ this.getOption( 'itemIndex' ) ] );
		}

		this.ui.itemTitle.html( title );
	},

	initialize: function( options ) {
		this.itemIndex = 0;

		// Collection for Controls list
		this.collection = new Backbone.Collection( _.values( qazana.mergeControlsSettings( options.controlFields ) ) );
	},

	onRender: function() {
		this.setTitle();
	},

	onModelChange: function() {
		if ( this.getOption( 'titleField' ) ) {
			this.setTitle();
		}
	},

	onChildviewResponsiveSwitcherClick: function( childView, device ) {
		if ( 'desktop' === device ) {
			qazana.getPanelView().getCurrentPageView().$el.toggleClass( 'qazana-responsive-switchers-open' );
		}
	}
} );

module.exports = RepeaterRowView;

},{"qazana-behaviors/inner-tabs":77,"qazana-controls/base-data":38}],58:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	RepeaterRowView = require( 'qazana-controls/repeater-row' ),
	BaseSettingsModel = require( 'qazana-elements/models/base-settings' ),
	ControlRepeaterItemView;

ControlRepeaterItemView = ControlBaseDataView.extend( {
	ui: {
		btnAddRow: '.qazana-repeater-add',
		fieldContainer: '.qazana-repeater-fields-wrapper'
	},

	events: function() {
		return {
			'click @ui.btnAddRow': 'onButtonAddRowClick',
			'sortstart @ui.fieldContainer': 'onSortStart',
			'sortupdate @ui.fieldContainer': 'onSortUpdate',
			'sortstop @ui.fieldContainer': 'onSortStop'
		};
	},

	childView: RepeaterRowView,

	childViewContainer: '.qazana-repeater-fields-wrapper',

	templateHelpers: function() {
		return {
			data: _.extend( {}, this.model.toJSON(), { controlValue: [] } )
		};
	},

	childViewOptions: function() {
		return {
			controlFields: this.model.get( 'fields' ),
			titleField: this.model.get( 'title_field' )
		};
	},

	createItemModel: function( attrs, options, controlView ) {
		options = options || {};

		options.controls = controlView.model.get( 'fields' );

		if ( ! attrs._id ) {
			attrs._id = qazana.helpers.getUniqueID();
		}

		return new BaseSettingsModel( attrs, options );
	},

	fillCollection: function() {
		var controlName = this.model.get( 'name' );
		this.collection = this.elementSettingsModel.get( controlName );

		// Hack for history redo/undo
		if ( ! ( this.collection instanceof Backbone.Collection ) ) {
			this.collection = new Backbone.Collection( this.collection, {
				// Use `partial` to supply the `this` as an argument, but not as context
				// the `_` is a place holder for original arguments: `attrs` & `options`
				model: _.partial( this.createItemModel, _, _, this )
			} );

			// Set the value silent
			this.elementSettingsModel.set( controlName, this.collection, { silent: true } );
			this.listenTo( this.collection, 'change', this.onRowControlChange );
			this.listenTo( this.collection, 'update', this.onRowUpdate, this );
		}
	},

	initialize: function( options ) {
		ControlBaseDataView.prototype.initialize.apply( this, arguments );

		this.fillCollection();

		this.listenTo( this.collection, 'change', this.onRowControlChange );
		this.listenTo( this.collection, 'update', this.onRowUpdate, this );
	},

	addRow: function( data, options ) {
		var id = qazana.helpers.getUniqueID();

		if ( data instanceof Backbone.Model ) {
			data.set( '_id', id );
		} else {
			data._id = id;
		}

		return this.collection.add( data, options );
	},

	editRow: function( rowView ) {
		if ( this.currentEditableChild ) {
			var currentEditable = this.currentEditableChild.getChildViewContainer( this.currentEditableChild );
			currentEditable.removeClass( 'editable' );

			// If the repeater contains TinyMCE editors, fire the `hide` trigger to hide floated toolbars
			currentEditable.find( '.qazana-wp-editor' ).each( function() {
				tinymce.get( this.id ).fire( 'hide' );
			} );
		}

		if ( this.currentEditableChild === rowView ) {
			delete this.currentEditableChild;
			return;
		}

		rowView.getChildViewContainer( rowView ).addClass( 'editable' );

		this.currentEditableChild = rowView;

		this.updateActiveRow();
	},

	toggleMinRowsClass: function() {
		if ( ! this.model.get( 'prevent_empty' ) ) {
			return;
		}

		this.$el.toggleClass( 'qazana-repeater-has-minimum-rows', 1 >= this.collection.length );
	},

	updateActiveRow: function() {
		var activeItemIndex = 1;

		if ( this.currentEditableChild ) {
			activeItemIndex = this.currentEditableChild.itemIndex;
		}

		this.setEditSetting( 'activeItemIndex', activeItemIndex );
	},

	updateChildIndexes: function() {
		var collection = this.collection;

		this.children.each( function( view ) {
			view.updateIndex( collection.indexOf( view.model ) + 1 );

			view.setTitle();
		} );
	},

	onRender: function() {
		ControlBaseDataView.prototype.onRender.apply( this, arguments );

		this.ui.fieldContainer.sortable( { axis: 'y', handle: '.qazana-repeater-row-tools' } );

		this.toggleMinRowsClass();
	},

	onSortStart: function( event, ui ) {
		ui.item.data( 'oldIndex', ui.item.index() );
	},

	onSortStop: function( event, ui ) {
		// Reload TinyMCE editors (if exist), it's a bug that TinyMCE content is missing after stop dragging
		var self = this,
			sortedIndex = ui.item.index();

		if ( -1 === sortedIndex ) {
			return;
		}

		var sortedRowView = self.children.findByIndex( ui.item.index() ),
			rowControls = sortedRowView.children._views;

		jQuery.each( rowControls, function() {
			if ( 'wysiwyg' === this.model.get( 'type' ) ) {
				sortedRowView.render();

				delete self.currentEditableChild;

				return false;
			}
		} );
	},

	onSortUpdate: function( event, ui ) {
		var oldIndex = ui.item.data( 'oldIndex' ),
			model = this.collection.at( oldIndex ),
			newIndex = ui.item.index();

		this.collection.remove( model );

		this.addRow( model, { at: newIndex } );
	},

	onAddChild: function() {
		this.updateChildIndexes();
		this.updateActiveRow();
	},

	onRowUpdate: function( collection, event ) {
		// Simulate `changed` and `_previousAttributes` values
		var settings = this.elementSettingsModel,
			collectionCloned = collection.clone(),
			controlName = this.model.get( 'name' );

		if ( event.add ) {
			collectionCloned.remove( event.changes.added[0] );
		} else {
			collectionCloned.add( event.changes.removed[0], { at: event.index } );
		}

		settings.changed = {};
		settings.changed[ controlName ] = collection;

		settings._previousAttributes = {};
		settings._previousAttributes[ controlName ] = collectionCloned.toJSON();

		settings.trigger( 'change', settings,  settings._pending );

		delete settings.changed;
		delete settings._previousAttributes;

		this.toggleMinRowsClass();
	},

	onRowControlChange: function( model ) {
		// Simulate `changed` and `_previousAttributes` values
		var changed = Object.keys( model.changed );

		if ( ! changed.length ) {
			return;
		}

		var collectionCloned = model.collection.toJSON(),
			modelIndex = model.collection.findIndex( model ),
			element = this._parent.model,
			settings = element.get( 'settings' ),
			controlName = this.model.get( 'name' );

		// Save it with old values
		collectionCloned[ modelIndex ] = model._previousAttributes;

		settings.changed = {};
		settings.changed[ controlName ] =  model.collection;

		settings._previousAttributes = {};
		settings._previousAttributes[ controlName ] = collectionCloned;

		settings.trigger( 'change', settings );

		delete settings.changed;
		delete settings._previousAttributes;
	},

	onButtonAddRowClick: function() {
		var defaults = {};
		_.each( this.model.get( 'fields' ), function( field ) {
			defaults[ field.name ] = field['default'];
		} );

		var newModel = this.addRow( defaults ),
			newChildView = this.children.findByModel( newModel );

		this.editRow( newChildView );
	},

	onChildviewClickRemove: function( childView ) {
		childView.model.destroy();

		if ( childView === this.currentEditableChild ) {
			delete this.currentEditableChild;
		}

		this.updateChildIndexes();

		this.updateActiveRow();
	},

	onChildviewClickDuplicate: function( childView ) {
		var newModel = this.createItemModel( childView.model.toJSON(), {}, this );

		this.addRow( newModel, { at: childView.itemIndex } );
	},

	onChildviewClickEdit: function( childView ) {
		this.editRow( childView );
	},

	onAfterExternalChange: function() {
		// Update the collection with current value
		this.fillCollection();

		ControlBaseDataView.prototype.onAfterExternalChange.apply( this, arguments );
	}
} );

module.exports = ControlRepeaterItemView;

},{"qazana-controls/base-data":38,"qazana-controls/repeater-row":57,"qazana-elements/models/base-settings":71}],59:[function(require,module,exports){
var ControlBaseView = require( 'qazana-controls/base' ),
	ControlSectionItemView;

ControlSectionItemView = ControlBaseView.extend( {
	ui: function() {
		var ui = ControlBaseView.prototype.ui.apply( this, arguments );

		ui.heading = '.qazana-panel-heading';

		return ui;
	},

	triggers: {
		'click': 'control:section:clicked'
	}
} );

module.exports = ControlSectionItemView;

},{"qazana-controls/base":41}],60:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlSelectItemView;

ControlSelectItemView = ControlBaseDataView.extend( {}, {

	onPasteStyle: function( control, clipboardValue ) {
		if ( control.groups ) {
			return control.groups.some( function( group ) {
				return ControlSelectItemView.onPasteStyle( group, clipboardValue );
			} );
		}

		return undefined !== control.options[ clipboardValue ];
	}
} );

module.exports = ControlSelectItemView;

},{"qazana-controls/base-data":38}],61:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlSelect2ItemView;

ControlSelect2ItemView = ControlBaseDataView.extend( {
	getSelect2Placeholder: function() {
		return this.ui.select.children( 'option:first[value=""]' ).text();
	},

	getSelect2DefaultOptions: function() {
		return {
			allowClear: true,
			placeholder: this.getSelect2Placeholder(),
			dir: qazana.config.is_rtl ? 'rtl' : 'ltr'
		};
	},

	getSelect2Options: function() {
		return jQuery.extend( this.getSelect2DefaultOptions(), this.model.get( 'select2options' ) );
	},

	onReady: function() {
		this.ui.select.select2( this.getSelect2Options() );
	},

	onBeforeDestroy: function() {
		if ( this.ui.select.data( 'select2' ) ) {
			this.ui.select.select2( 'destroy' );
		}

		this.$el.remove();
	}
} );

module.exports = ControlSelect2ItemView;

},{"qazana-controls/base-data":38}],62:[function(require,module,exports){
var ControlBaseUnitsItemView = require( 'qazana-controls/base-units' ),
	ControlSliderItemView;

ControlSliderItemView = ControlBaseUnitsItemView.extend( {
	ui: function() {
		var ui = ControlBaseUnitsItemView.prototype.ui.apply( this, arguments );

		ui.slider = '.qazana-slider';

		return ui;
	},

	events: function() {
		return _.extend( ControlBaseUnitsItemView.prototype.events.apply( this, arguments ), {
			'slide @ui.slider': 'onSlideChange'
		} );
	},

	initSlider: function() {
		var size = this.getControlValue( 'size' ),
			unitRange = this.getCurrentRange();

		this.ui.input.attr( unitRange ).val( size );

		this.ui.slider.slider( _.extend( {}, unitRange, { value: size } ) );
	},

	resetSize: function() {
		this.setValue( 'size', '' );

		this.initSlider();
	},

	onReady: function() {
		this.initSlider();
	},

	onSlideChange: function( event, ui ) {
		this.setValue( 'size', ui.value );

		this.ui.input.val( ui.value );
	},

	onInputChange: function( event ) {
		var dataChanged = event.currentTarget.dataset.setting;

		if ( 'size' === dataChanged ) {
			this.ui.slider.slider( 'value', this.getControlValue( 'size' ) );
		} else if ( 'unit' === dataChanged ) {
			this.resetSize();
		}
	},

	onBeforeDestroy: function() {
		if ( this.ui.slider.data( 'uiSlider' ) ) {
			this.ui.slider.slider( 'destroy' );
		}

		this.$el.remove();
	}
} );

module.exports = ControlSliderItemView;

},{"qazana-controls/base-units":40}],63:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlStructureItemView;

ControlStructureItemView = ControlBaseDataView.extend( {
	ui: function() {
		var ui = ControlBaseDataView.prototype.ui.apply( this, arguments );

		ui.resetStructure = '.qazana-control-structure-reset';

		return ui;
	},

	events: function() {
		return _.extend( ControlBaseDataView.prototype.events.apply( this, arguments ), {
			'click @ui.resetStructure': 'onResetStructureClick'
		} );
	},

	templateHelpers: function() {
		var helpers = ControlBaseDataView.prototype.templateHelpers.apply( this, arguments );

		helpers.getMorePresets = this.getMorePresets.bind( this );

		return helpers;
	},

	getCurrentEditedSection: function() {
		var editor = qazana.getPanelView().getCurrentPageView();

		return editor.getOption( 'editedElementView' );
	},

	getMorePresets: function() {
		var parsedStructure = qazana.presetsFactory.getParsedStructure( this.getControlValue() );

		return qazana.presetsFactory.getPresets( parsedStructure.columnsCount );
	},

	onInputChange: function() {
		this.getCurrentEditedSection().redefineLayout();

		this.render();
	},

	onResetStructureClick: function() {
		this.getCurrentEditedSection().resetColumnsCustomSize();
	}
} );

module.exports = ControlStructureItemView;

},{"qazana-controls/base-data":38}],64:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' );

module.exports = ControlBaseDataView.extend( {

	setInputValue: function( input, value ) {
		this.$( input ).prop( 'checked', this.model.get( 'return_value' ) === value );
	}
}, {

	onPasteStyle: function( control, clipboardValue ) {
		return ! clipboardValue || clipboardValue === control.return_value;
	}
} );

},{"qazana-controls/base-data":38}],65:[function(require,module,exports){
var ControlBaseView = require( 'qazana-controls/base' ),
	ControlTabItemView;

ControlTabItemView = ControlBaseView.extend( {
	triggers: {
		'click': {
			event: 'control:tab:clicked',
			stopPropagation: false
		}
	}
} );

module.exports = ControlTabItemView;

},{"qazana-controls/base":41}],66:[function(require,module,exports){
var BaseMultiple = require( 'qazana-controls/base-multiple' );

module.exports = BaseMultiple.extend( {

	onReady: function() {
		var self = this,
			last, cache;

		// Based on /wp-includes/js/tinymce/plugins/wplink/plugin.js.
		this.ui.input.autocomplete( {
			source: function( request, response ) {
				if ( last === request.term ) {
					response( cache );
					return;
				}

				if ( /^https?:/.test( request.term ) || request.term.indexOf( '.' ) !== -1 ) {
					return response();
				}

				// Show Spinner.
				self.ui.input.prev().show();

				jQuery.post( window.ajaxurl, {
					editor: 'qazana',
					action: 'wp-link-ajax',
					page: 1,
					search: request.term,
					_ajax_linking_nonce: jQuery( '#_ajax_linking_nonce' ).val()
				}, function( data ) {
					cache = data;
					response( data );
				}, 'json' )
					.always( function() {
						// Hide Spinner.
						self.ui.input.prev().hide();
					} );

				last = request.term;
			},
			focus: function( event, ui ) {
				/*
				 * Don't empty the URL input field, when using the arrow keys to
				 * highlight items. See api.jqueryui.com/autocomplete/#event-focus
				 */
				event.preventDefault();
			},
			select: function( event, ui ) {
				self.ui.input.val( ui.item.permalink );
				self.setValue( 'url', ui.item.permalink );
				return false;
			},
			open: function( event  ) {
				jQuery( event.target ).data( 'uiAutocomplete' ).menu.activeMenu.addClass( 'qazana-autocomplete-menu' );
			},
			minLength: 2,
			position: {
				my: 'left top+2'
			}
		} )
		// The `_renderItem` cannot be override via the arguments.
			.autocomplete( 'instance' )._renderItem = function( ul, item ) {
				var fallbackTitle = window.wpLinkL10n ? window.wpLinkL10n.noTitle : '',
					title = item.title ? item.title : fallbackTitle;

				return jQuery( '<li role="option" id="mce-wp-autocomplete-' + item.ID + '">' )
					.append( '<span>' + title + '</span>&nbsp;<span class="qazana-autocomplete-item-info">' + item.info + '</span>' )
					.appendTo( ul );
			};
		},

	onBeforeDestroy: function() {
		if ( this.ui.input.data( 'autocomplete' ) ) {
			this.ui.input.autocomplete( 'destroy' );
		}

		this.$el.remove();
	}
} );

},{"qazana-controls/base-multiple":39}],67:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlWPWidgetItemView;

ControlWPWidgetItemView = ControlBaseDataView.extend( {
	ui: function() {
		var ui = ControlBaseDataView.prototype.ui.apply( this, arguments );

		ui.form = 'form';
		ui.loading = '.wp-widget-form-loading';

		return ui;
	},

	events: function() {
		return {
			'keyup @ui.form :input': 'onFormChanged',
			'change @ui.form :input': 'onFormChanged'
		};
	},

	onFormChanged: function() {
		var idBase = 'widget-' + this.model.get( 'id_base' ),
			settings = this.ui.form.qazanaSerializeObject()[ idBase ].REPLACE_TO_ID;

		this.setValue( settings );
	},

	onReady: function() {
		var self = this;

		qazana.ajax.addRequest( 'editor_get_wp_widget_form', {
			data: {
				// Fake Widget ID
				id: self.model.cid,
				widget_type: self.model.get( 'widget' ),
				data: self.elementSettingsModel.toJSON()
			},
			success: function( data ) {
				self.ui.form.html( data );
				// WP >= 4.8
				if ( wp.textWidgets ) {
					self.ui.form.addClass( 'open' );
					var event = new jQuery.Event( 'widget-added' );
					wp.textWidgets.handleWidgetAdded( event, self.ui.form );
					wp.mediaWidgets.handleWidgetAdded( event, self.ui.form );

					// WP >= 4.9
					if ( wp.customHtmlWidgets ) {
						wp.customHtmlWidgets.handleWidgetAdded( event, self.ui.form );
					}
				}

				qazana.hooks.doAction( 'panel/widgets/' + self.model.get( 'widget' ) + '/controls/wp_widget/loaded', self );
			}
		} );
	}
} );

module.exports = ControlWPWidgetItemView;

},{"qazana-controls/base-data":38}],68:[function(require,module,exports){
var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlWysiwygItemView;

ControlWysiwygItemView = ControlBaseDataView.extend( {

	editor: null,

	ui: function() {
		var ui = ControlBaseDataView.prototype.ui.apply( this, arguments );

		jQuery.extend( ui, {
			inputWrapper: '.qazana-control-input-wrapper'
		} );

		return ui;
	},

	events: function() {
		return _.extend( ControlBaseDataView.prototype.events.apply( this, arguments ), {
			'keyup textarea.qazana-wp-editor': 'onBaseInputChange'
		} );
	},

	// List of buttons to move {buttonToMove: afterButton}
	buttons: {
		addToBasic: {
			underline: 'italic'
		},
		addToAdvanced: {},
		moveToAdvanced: {
			blockquote: 'removeformat',
			alignleft: 'blockquote',
			aligncenter: 'alignleft',
			alignright: 'aligncenter'
		},
		moveToBasic: {},
		removeFromBasic: [ 'unlink', 'wp_more' ],
		removeFromAdvanced: []
	},

	initialize: function() {
		ControlBaseDataView.prototype.initialize.apply( this, arguments );

		var self = this;

		self.editorID = 'qazanawpeditor' + self.cid;

		// Wait a cycle before initializing the editors.
		_.defer( function() {
			// Initialize QuickTags, and set as the default mode.
			quicktags( {
				buttons: 'strong,em,del,link,img,close',
				id: self.editorID
			} );

			if ( qazana.config.rich_editing_enabled ) {
				switchEditors.go( self.editorID, 'tmce' );
			}

			delete QTags.instances[ 0 ];
		} );

		if ( ! qazana.config.rich_editing_enabled ) {
			self.$el.addClass( 'qazana-rich-editing-disabled' );

			return;
		}

		var editorConfig = {
			id: self.editorID,
			selector: '#' + self.editorID,
			setup: function( editor ) {
				self.editor = editor;
			}
		};

		tinyMCEPreInit.mceInit[ self.editorID ] = _.extend( _.clone( tinyMCEPreInit.mceInit.qazanawpeditor ), editorConfig );

		if ( ! qazana.config.tinymceHasCustomConfig ) {
			self.rearrangeButtons();
		}
	},

	applySavedValue: function() {
		if ( ! this.editor ) {
			return;
		}

		var controlValue = this.getControlValue();

		this.editor.setContent( controlValue );

		// Update also the plain textarea
		jQuery( '#' + this.editorID ).val( controlValue );
	},

	saveEditor: function() {
		this.editor.save();

		this.setValue( this.editor.getContent() );
	},

	moveButtons: function( buttonsToMove, from, to ) {
		if ( ! to ) {
			to = from;

			from = null;
		}

		_.each( buttonsToMove, function( afterButton, button ) {
			var afterButtonIndex = to.indexOf( afterButton );

			if ( from ) {
				var buttonIndex = from.indexOf( button );

				if ( -1 === buttonIndex ) {
					throw new ReferenceError( 'Trying to move non-existing button `' + button + '`' );
				}

				from.splice( buttonIndex, 1 );
			}

			if ( -1 === afterButtonIndex ) {
				throw new ReferenceError( 'Trying to move button after non-existing button `' + afterButton + '`' );
			}

			to.splice( afterButtonIndex + 1, 0, button );
		} );
	},

	rearrangeButtons: function() {
		var editorProps = tinyMCEPreInit.mceInit[ this.editorID ],
			editorBasicToolbarButtons = editorProps.toolbar1.split( ',' ),
			editorAdvancedToolbarButtons = editorProps.toolbar2.split( ',' );

		editorBasicToolbarButtons = _.difference( editorBasicToolbarButtons, this.buttons.removeFromBasic );

		editorAdvancedToolbarButtons = _.difference( editorAdvancedToolbarButtons, this.buttons.removeFromAdvanced );

		this.moveButtons( this.buttons.moveToBasic, editorAdvancedToolbarButtons, editorBasicToolbarButtons );

		this.moveButtons( this.buttons.moveToAdvanced, editorBasicToolbarButtons, editorAdvancedToolbarButtons );

		this.moveButtons( this.buttons.addToBasic, editorBasicToolbarButtons );

		this.moveButtons( this.buttons.addToAdvanced, editorAdvancedToolbarButtons );

		editorProps.toolbar1 = editorBasicToolbarButtons.join( ',' );
		editorProps.toolbar2 = editorAdvancedToolbarButtons.join( ',' );
	},

	onReady: function() {
		var self = this;

		var $editor = jQuery( qazana.config.wp_editor.replace( /qazanawpeditor/g, self.editorID ).replace( '%%EDITORCONTENT%%', self.getControlValue() ) );

		self.ui.inputWrapper.html( $editor );

		setTimeout( function() {
			self.editor.on( 'keyup change undo redo SetContent', self.saveEditor.bind( self ) );
		}, 100 );
	},

	onBeforeDestroy: function() {
		// Remove TinyMCE and QuickTags instances
		delete QTags.instances[ this.editorID ];

		if ( ! qazana.config.rich_editing_enabled ) {
			return;
		}

		tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, this.editorID );

		// Cleanup PreInit data
		delete tinyMCEPreInit.mceInit[ this.editorID ];
		delete tinyMCEPreInit.qtInit[ this.editorID ];
	}
} );

module.exports = ControlWysiwygItemView;

},{"qazana-controls/base-data":38}],69:[function(require,module,exports){
/* global QazanaConfig */
var App;

Marionette.TemplateCache.prototype.compileTemplate = function( rawTemplate, options ) {
	options = {
		evaluate: /<#([\s\S]+?)#>/g,
		interpolate: /{{{([\s\S]+?)}}}/g,
		escape: /{{([^}]+?)}}(?!})/g
	};

	return _.template( rawTemplate, options );
};

App = Marionette.Application.extend( {
	previewLoadedOnce: false,
	helpers: require( 'qazana-editor-utils/helpers' ),
	heartbeat: require( 'qazana-editor-utils/heartbeat' ),
	imagesManager: require( 'qazana-editor-utils/images-manager' ),
	debug: require( 'qazana-editor-utils/debug' ),
	schemes: require( 'qazana-editor-utils/schemes' ),
	presetsFactory: require( 'qazana-editor-utils/presets-factory' ),
	templates: require( 'qazana-templates/manager' ),
	ajax: require( 'qazana-editor-utils/ajax' ),
	conditions: require( 'qazana-editor-utils/conditions' ),
	hotKeys: require( 'qazana-utils/hot-keys' ),
	history: require('qazana-extensions/history/assets/js/module'),

	channels: {
		editor: Backbone.Radio.channel( 'QAZANA:editor' ),
		data: Backbone.Radio.channel( 'QAZANA:data' ),
		panelElements: Backbone.Radio.channel( 'QAZANA:panelElements' ),
		dataEditMode: Backbone.Radio.channel( 'QAZANA:editmode' ),
		deviceMode: Backbone.Radio.channel( 'QAZANA:deviceMode' ),
		templates: Backbone.Radio.channel( 'QAZANA:templates' )
	},

	// Exporting modules that can be used externally
	modules: {
		Module: require( 'qazana-utils/module' ),
		components: {
			templateLibrary: {
				views: {
					parts: {
						headerParts: {
							logo: require( 'qazana-templates/views/parts/header-parts/logo' )
						}
					},
					BaseModalLayout: require( 'qazana-templates/views/base-modal-layout' )
				}
			},
			saver: {
				behaviors: {
                    HeaderSaver: require('./components/saver/behaviors/header-saver'),
					FooterSaver: require( './components/saver/behaviors/footer-saver' )
				}
			}
		},
		controls: {
			Animation: require( 'qazana-controls/select2' ),
			Base: require( 'qazana-controls/base' ),
			BaseData: require( 'qazana-controls/base-data' ),
			BaseMultiple: require( 'qazana-controls/base-multiple' ),
			Box_shadow: require( 'qazana-controls/box-shadow' ),
			Button: require( 'qazana-controls/button' ),
			Choose: require( 'qazana-controls/choose' ),
			Code: require( 'qazana-controls/code' ),
			Color: require( 'qazana-controls/color' ),
			Date_time: require( 'qazana-controls/date-time' ),
			Dimensions: require( 'qazana-controls/dimensions' ),
			Font: require( 'qazana-controls/font' ),
			Gallery: require( 'qazana-controls/gallery' ),
			Hover_animation: require( 'qazana-controls/select2' ),
			Icon: require( 'qazana-controls/icon' ),
			Image_dimensions: require( 'qazana-controls/image-dimensions' ),
			Media: require( 'qazana-controls/media' ),
			Number: require( 'qazana-controls/number' ),
			Order: require( 'qazana-controls/order' ),
			Popover_toggle: require( 'qazana-controls/popover-toggle' ),
			Repeater: require( 'qazana-controls/repeater' ),
			RepeaterRow: require( 'qazana-controls/repeater-row' ),
			Section: require( 'qazana-controls/section' ),
			Select: require( 'qazana-controls/select' ),
			Select2: require( 'qazana-controls/select2' ),
			Slider: require( 'qazana-controls/slider' ),
			Structure: require( 'qazana-controls/structure' ),
			Switcher: require( 'qazana-controls/switcher' ),
			Tab: require( 'qazana-controls/tab' ),
			Text_shadow: require( 'qazana-controls/box-shadow' ),
			Url: require( 'qazana-controls/url' ),
			Wp_widget: require( 'qazana-controls/wp_widget' ),
			Wysiwyg: require( 'qazana-controls/wysiwyg' )
		},
		elements: {
			models: {
				BaseSettings: require( 'qazana-elements/models/base-settings' ),
				Element: require( 'qazana-elements/models/element' )
			},
			views: {
				Widget: require( 'qazana-elements/views/widget' )
			}
		},
		layouts: {
			panel: {
				pages: {
					elements: {
						views: {
							Global: require( 'qazana-panel/pages/elements/views/global' ),
							Elements: require( 'qazana-panel/pages/elements/views/elements' )
						}
					},
					menu: {
						Menu: require( 'qazana-panel/pages/menu/menu' )
					}
				}
			}
		},
		views: {
			ControlsStack: require( 'qazana-views/controls-stack' )
		}
	},

	backgroundClickListeners: {
		popover: {
			element: '.qazana-controls-popover',
			ignore: '.qazana-control-popover-toggle-toggle, .qazana-control-popover-toggle-toggle-label, .select2-container'
		},
		tagsList: {
			element: '.qazana-tags-list',
			ignore: '.qazana-control-dynamic-switcher'
		}
	},

	// TODO: Temp modules bc method since 2.0.0
	initModulesBC: function() {
		var bcModules = {
			ControlsStack: this.modules.views.ControlsStack,
			element: {
				Model: this.modules.elements.models.Element
			},
			RepeaterRowView: this.modules.controls.RepeaterRow,
			WidgetView: this.modules.elements.views.Widget,
			panel: {
				Menu: this.modules.layouts.panel.pages.menu.Menu
			},
			saver: {
				headerBehavior: this.modules.components.saver.behaviors.HeaderSaver,
				footerBehavior: this.modules.components.saver.behaviors.FooterSaver
			},
			SettingsModel: this.modules.elements.models.BaseSettings,
			templateLibrary: {
				ElementsCollectionView: this.modules.layouts.panel.pages.elements.views.Elements
			}
		};

		jQuery.extend( this.modules, bcModules );
	},

	userCan: function( capability ) {
		return -1 === this.config.user.restrictions.indexOf( capability );
	},

	_defaultDeviceMode: 'desktop',

	addControlView: function( controlID, ControlView ) {
		this.modules.controls[ qazana.helpers.firstLetterUppercase( controlID ) ] = ControlView;
	},

	checkEnvCompatibility: function() {
		return this.envData.gecko || this.envData.webkit;
	},

	getElementData: function( modelElement ) {
		var elType = modelElement.get( 'elType' );

		if ( 'widget' === elType ) {
			var widgetType = modelElement.get( 'widgetType' );

			if ( ! this.config.widgets[ widgetType ] ) {
				return false;
			}

			return this.config.widgets[ widgetType ];
		}

		if ( ! this.config.elements[ elType ] ) {
			return false;
		}

		return this.config.elements[ elType ];
	},

	getElementControls: function( modelElement ) {
		var self = this,
			elementData = self.getElementData( modelElement );

		if ( ! elementData ) {
			return false;
		}

		var isInner = modelElement.get( 'isInner' ),
			controls = {};

		_.each( elementData.controls, function( controlData, controlKey ) {
			if ( isInner && controlData.hide_in_inner || ! isInner && controlData.hide_in_top ) {
				return;
			}

			controls[ controlKey ] = controlData;
		} );

		return controls;
	},

	mergeControlsSettings: function( controls ) {
		var  self = this;

		_.each( controls, function( controlData, controlKey ) {
			controls[ controlKey ] = jQuery.extend( true, {}, self.config.controls[ controlData.type ], controlData  );
		} );

		return controls;
	},

	getControlView: function( controlID ) {
		var capitalizedControlName = qazana.helpers.firstLetterUppercase( controlID ),
			View = this.modules.controls[ capitalizedControlName ];

		if ( ! View ) {
			var controlData = this.config.controls[ controlID ],
				isUIControl = -1 !== controlData.features.indexOf( 'ui' );

			View = this.modules.controls[ isUIControl ? 'Base' : 'BaseData' ];
		}

		return View;
	},

	getPanelView: function() {
		return this.panel.currentView;
	},

	getPreviewView: function() {
		return this.sections.currentView;
	},

	initEnvData: function() {
		this.envData = _.pick( tinymce.Env, [ 'desktop', 'mac', 'webkit', 'gecko', 'ie', 'opera' ] );
	},

	initComponents: function() {
		var EventManager = require( 'qazana-utils/hooks' ),
			DynamicTags = require( 'qazana-dynamic-tags/manager' ),
			Settings = require( 'qazana-editor/components/settings/settings' ),
			Saver = require( 'qazana-editor/components/saver/manager' ),
			Notifications = require( 'qazana-editor-utils/notifications' );

		this.hooks = new EventManager();

		this.saver = new Saver();

		this.settings = new Settings();

		this.dynamicTags = new DynamicTags();

		this.templates.init();

		this.initDialogsManager();

		this.notifications = new Notifications();

		this.ajax.init();

		this.initHotKeys();

		this.initEnvData();
	},

	initDialogsManager: function() {
		this.dialogsManager = new DialogsManager.Instance();
	},

	initElements: function() {
		var ElementCollection = require( 'qazana-elements/collections/elements' ),
			config = this.config.data;

		// If it's an reload, use the not-saved data
		if ( this.elements ) {
			config = this.elements.toJSON();
		}

		this.elements = new ElementCollection( config );

		this.elementsModel = new Backbone.Model( {
			elements: this.elements
		} );
	},

	initPreview: function() {
		var $ = jQuery;

		this.$previewWrapper = $( '#qazana-preview' );

		this.$previewResponsiveWrapper = $( '#qazana-preview-responsive-wrapper' );

		var previewIframeId = 'qazana-preview-iframe';

		// Make sure the iFrame does not exist.
		if ( ! this.$preview ) {
			this.$preview = $( '<iframe>', {
				id: previewIframeId,
				src: this.config.document.urls.preview,
				allowfullscreen: 1
			} );

			this.$previewResponsiveWrapper.append( this.$preview );
		}

		this.$preview.on( 'load', this.onPreviewLoaded.bind( this ) );
	},

	initFrontend: function() {
		var frontendWindow = this.$preview[0].contentWindow;

		window.qazanaFrontend = frontendWindow.qazanaFrontend;

		frontendWindow.qazana = this;

		qazanaFrontend.init();

		qazanaFrontend.elementsHandler.initHandlers();

		this.trigger( 'frontend:init' );
	},

	initClearPageDialog: function() {
		var self = this,
			dialog;

		self.getClearPageDialog = function() {
			if ( dialog ) {
				return dialog;
			}

			dialog = this.dialogsManager.createWidget( 'confirm', {
				id: 'qazana-clear-page-dialog',
				headerMessage: qazana.translate( 'clear_page' ),
				message: qazana.translate( 'dialog_confirm_clear_page' ),
				position: {
					my: 'center center',
					at: 'center center'
				},
				strings: {
					confirm: qazana.translate( 'delete' ),
					cancel: qazana.translate( 'cancel' )
				},
				onConfirm: function() {
					self.elements.reset();
				}
			} );

			return dialog;
		};
	},

	initHotKeys: function() {
		var keysDictionary = {
			c: 67,
			d: 68,
			del: 46,
			l: 76,
			m: 77,
			p: 80,
			s: 83,
			v: 86
		};

		var $ = jQuery,
			hotKeysHandlers = {},
			hotKeysManager = this.hotKeys;

		hotKeysHandlers[ keysDictionary.del ] = {
			deleteElement: {
				isWorthHandling: function( event ) {
					var isEditorOpen = 'editor' === qazana.getPanelView().getCurrentPageName();

					if ( ! isEditorOpen ) {
						return false;
					}

					var $target = $( event.target );

					if ( $target.is( ':input, .qazana-input' ) ) {
						return false;
					}

					return ! $target.closest( '[contenteditable="true"]' ).length;
				},
				handle: function() {
					qazana.getPanelView().getCurrentPageView().getOption( 'editedElementView' ).removeElement();
				}
			}
		};

		hotKeysHandlers[ keysDictionary.d ] = {
			duplicateElement: {
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event );
				},
				handle: function() {
					var panel = qazana.getPanelView();

					if ( 'editor' !== panel.getCurrentPageName() ) {
						return;
					}

					panel.getCurrentPageView().getOption( 'editedElementView' ).duplicate();
				}
			}
		};

		hotKeysHandlers[ keysDictionary.l ] = {
			showTemplateLibrary: {
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event ) && event.shiftKey;
				},
				handle: function() {
					qazana.templates.startModal();
				}
			}
		};

		hotKeysHandlers[ keysDictionary.m ] = {
			changeDeviceMode: {
				devices: [ 'desktop', 'tablet', 'mobile' ],
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event ) && event.shiftKey;
				},
				handle: function() {
					var currentDeviceMode = qazana.channels.deviceMode.request( 'currentMode' ),
						modeIndex = this.devices.indexOf( currentDeviceMode );

					modeIndex++;

					if ( modeIndex >= this.devices.length ) {
						modeIndex = 0;
					}

					qazana.changeDeviceMode( this.devices[ modeIndex ] );
				}
			}
		};

		hotKeysHandlers[ keysDictionary.p ] = {
			changeEditMode: {
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event );
				},
				handle: function() {
					qazana.getPanelView().modeSwitcher.currentView.toggleMode();
				}
			}
		};

		hotKeysHandlers[ keysDictionary.s ] = {
			saveEditor: {
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event );
				},
				handle: function() {
					qazana.saver.saveDraft();
				}
			}
		};

		hotKeysHandlers[ keysDictionary.c ] = {
			copyElement: {
				isWorthHandling: function( event ) {
					if ( ! hotKeysManager.isControlEvent( event ) ) {
						return false;
					}

					var isEditorOpen = 'editor' === qazana.getPanelView().getCurrentPageName();

					if ( ! isEditorOpen ) {
						return false;
					}

					var frontendWindow = qazanaFrontend.getElements( 'window' ),
						textSelection = getSelection() + frontendWindow.getSelection();

					if ( ! textSelection && qazana.envData.gecko ) {
						textSelection = [ window, frontendWindow ].some( function( window ) {
							var activeElement = window.document.activeElement;

							if ( ! activeElement || -1 === [ 'INPUT', 'TEXTAREA' ].indexOf( activeElement.tagName ) ) {
								return;
							}

							var originalInputType;

							// Some of input types can't retrieve a selection
							if ( 'INPUT' === activeElement.tagName ) {
								originalInputType = activeElement.type;

								activeElement.type = 'text';
							}

							var selection = activeElement.value.substring( activeElement.selectionStart, activeElement.selectionEnd );

							activeElement.type = originalInputType;

							return ! ! selection;
						} );
					}

					return ! textSelection;
				},
				handle: function() {
					qazana.getPanelView().getCurrentPageView().getOption( 'editedElementView' ).copy();
				}
			}
		};

		hotKeysHandlers[ keysDictionary.v ] = {
			pasteElement: {
				isWorthHandling: function( event ) {
					if ( ! hotKeysManager.isControlEvent( event ) ) {
						return false;
					}

					return -1 !== [ 'BODY', 'IFRAME' ].indexOf( document.activeElement.tagName ) && 'BODY' === qazanaFrontend.getElements( 'window' ).document.activeElement.tagName;
				},
				handle: function() {
					var targetElement = qazana.channels.editor.request( 'contextMenu:targetView' );

					if ( ! targetElement ) {
						var panel = qazana.getPanelView();

						if ( 'editor' === panel.getCurrentPageName() ) {
							targetElement = panel.getCurrentPageView().getOption( 'editedElementView' );
						}
					}

					if ( ! targetElement ) {
						targetElement = qazana.getPreviewView();
					}

					if ( targetElement.isPasteEnabled() ) {
						targetElement.paste();
					}
				}
			}
		};

		_.each( hotKeysHandlers, function( handlers, keyCode ) {
			_.each( handlers, function( handler, handlerName ) {
				hotKeysManager.addHotKeyHandler( keyCode, handlerName, handler );
			} );
		} );

		hotKeysManager.bindListener( this.$window );
	},

	initPanel: function() {
		this.addRegions( { panel: require( 'qazana-layouts/panel/panel' ) } );
	},

	initNavigator: function() {
		this.addRegions( { navigator: require( 'qazana-layouts/navigator/navigator' ) } );
	},

	preventClicksInsideEditor: function() {
		this.$previewContents.on( 'submit', function( event ) {
			event.preventDefault();
		} );

		this.$previewContents.on( 'click', function( event ) {
			var $target = jQuery( event.target ),
				editMode = qazana.channels.dataEditMode.request( 'activeMode' ),
				isClickInsideQazana = !! $target.closest( '#qazana, .pen-menu' ).length,
				isTargetInsideDocument = this.contains( $target[0] );

			if ( isClickInsideQazana && 'edit' === editMode || ! isTargetInsideDocument ) {
				return;
			}

			if ( $target.closest( 'a:not(.qazana-clickable)' ).length ) {
				event.preventDefault();
			}

			if ( ! isClickInsideQazana ) {
				var panelView = qazana.getPanelView();

				if ( 'elements' !== panelView.getCurrentPageName() ) {
					panelView.setPage( 'elements' );
				}
			}
		} );
	},

	addBackgroundClickArea: function( element ) {
		element.addEventListener( 'click', this.onBackgroundClick.bind( this ), true );
	},

	addBackgroundClickListener: function( key, listener ) {
		this.backgroundClickListeners[ key ] = listener;
	},

	removeBackgroundClickListener: function( key ) {
		delete this.backgroundClickListeners[ key ];
	},

	showFatalErrorDialog: function( options ) {
		var defaultOptions = {
			id: 'qazana-fatal-error-dialog',
			headerMessage: '',
			message: '',
			position: {
				my: 'center center',
				at: 'center center'
			},
			strings: {
				confirm: qazana.translate( 'learn_more' ),
				cancel: qazana.translate( 'go_back' )
			},
			onConfirm: null,
			onCancel: function() {
				parent.history.go( -1 );
			},
			hide: {
				onBackgroundClick: false,
				onButtonClick: false
			}
		};

		options = jQuery.extend( true, defaultOptions, options );

		this.dialogsManager.createWidget( 'confirm', options ).show();
	},

	checkPageStatus: function() {
		if ( qazana.config.current_revision_id !== qazana.config.document.id ) {
			this.notifications.showToast( {
				message: this.translate( 'working_on_draft_notification' ),
				buttons: [
					{
						name: 'view_revisions',
						text: qazana.translate( 'view_all_revisions' ),
						callback: function() {
							var panel = qazana.getPanelView();

							panel.setPage( 'historyPage' );
							panel.getCurrentPageView().activateTab( 'revisions' );
						}
					}
				]
			} );
		}
	},

	getStorage: function( key ) {
		var qazanaStorage = localStorage.getItem( 'qazana' );

		if ( qazanaStorage ) {
			qazanaStorage = JSON.parse( qazanaStorage );
		} else {
			qazanaStorage = {};
		}

		if ( key ) {
			return qazanaStorage[ key ];
		}

		return qazanaStorage;
	},

	setStorage: function( key, value ) {
		var qazanaStorage = this.getStorage();

		qazanaStorage[ key ] = value;

		localStorage.setItem( 'qazana', JSON.stringify( qazanaStorage ) );
	},

	openLibraryOnStart: function() {
		if ( '#library' === location.hash ) {
			qazana.templates.startModal();

			location.hash = '';
		}
	},

	enterPreviewMode: function( hidePanel ) {
		var $elements = qazanaFrontend.getElements( '$body' );

		if ( hidePanel ) {
			$elements = $elements.add( this.$body );
		}

		$elements
			.removeClass( 'qazana-editor-active' )
			.addClass( 'qazana-editor-preview' );

		this.$previewQazanaEl
			.removeClass( 'qazana-edit-area-active' )
			.addClass( 'qazana-edit-area-preview' );

		if ( hidePanel ) {
			// Handle panel resize
			this.$previewWrapper.css( this.config.is_rtl ? 'right' : 'left', '' );

			this.panel.$el.css( 'width', '' );
		}
	},

	exitPreviewMode: function() {
		qazanaFrontend.getElements( '$body' ).add( this.$body )
			.removeClass( 'qazana-editor-preview' )
			.addClass( 'qazana-editor-active' );

		this.$previewQazanaEl
			.removeClass( 'qazana-edit-area-preview' )
			.addClass( 'qazana-edit-area-active' );
	},

	changeEditMode: function( newMode ) {
		var dataEditMode = qazana.channels.dataEditMode,
			oldEditMode = dataEditMode.request( 'activeMode' );

		dataEditMode.reply( 'activeMode', newMode );

		if ( newMode !== oldEditMode ) {
			dataEditMode.trigger( 'switch', newMode );
		}
	},

	reloadPreview: function() {
		jQuery( '#qazana-preview-loading' ).show();

		this.$preview[0].contentWindow.location.reload( true );
	},

	clearPage: function() {
		this.getClearPageDialog().show();
	},

	changeDeviceMode: function( newDeviceMode ) {
		var oldDeviceMode = this.channels.deviceMode.request( 'currentMode' );

		if ( oldDeviceMode === newDeviceMode ) {
			return;
		}

		this.$body
			.removeClass( 'qazana-device-' + oldDeviceMode )
			.addClass( 'qazana-device-' + newDeviceMode );

		this.channels.deviceMode
			.reply( 'previousMode', oldDeviceMode )
			.reply( 'currentMode', newDeviceMode )
			.trigger( 'change' );
	},

	enqueueTypographyFonts: function() {
		var self = this,
			typographyScheme = this.schemes.getScheme( 'typography' );

		self.helpers.resetEnqueuedFontsCache();

		_.each( typographyScheme.items, function( item ) {
			self.helpers.enqueueFont( item.value.font_family );
		} );
	},

	translate: function( stringKey, templateArgs, i18nStack ) {
		if ( ! i18nStack ) {
			i18nStack = this.config.i18n;
		}

		var string = i18nStack[ stringKey ];

		if ( undefined === string ) {
			string = stringKey;
		}

		if ( templateArgs ) {
			// TODO: bc since 2.0.4
			string = string.replace( /{(\d+)}/g, function( match, number ) {
				return undefined !== templateArgs[ number ] ? templateArgs[ number ] : match;
			} );

			string = string.replace( /%(?:(\d+)\$)?s/g, function( match, number ) {
				if ( ! number ) {
					number = 1;
				}

				number--;

				return undefined !== templateArgs[ number ] ? templateArgs[ number ] : match;
			} );
		}

		return string;
	},

	onStart: function() {
		this.$window = jQuery( window );

		this.$body = jQuery( 'body' );

		NProgress.start();
		NProgress.inc( 0.2 );

		this.config = QazanaConfig;

		Backbone.Radio.DEBUG = false;
		Backbone.Radio.tuneIn( 'QAZANA' );

		this.initModulesBC();

		this.initComponents();

		if ( ! this.checkEnvCompatibility() ) {
			this.onEnvNotCompatible();
		}

		this.channels.dataEditMode.reply( 'activeMode', 'edit' );

		this.listenTo( this.channels.dataEditMode, 'switch', this.onEditModeSwitched );

		this.initClearPageDialog();

		this.addBackgroundClickArea( document );

		this.$window.trigger( 'qazana:init' );

		this.initPreview();

	},

	onPreviewLoaded: function() {
		NProgress.done();

		var previewWindow = this.$preview[0].contentWindow;

		if ( ! previewWindow.qazanaFrontend ) {
			this.onPreviewLoadingError();

			return;
		}

		this.$previewContents = this.$preview.contents();
		this.$previewQazanaEl = this.$previewContents.find( '#qazana' );

		if ( ! this.$previewQazanaEl.length ) {
			this.onPreviewElNotFound();

			return;
		}

		this.initFrontend();

		this.initElements();

		var iframeRegion = new Marionette.Region( {
			// Make sure you get the DOM object out of the jQuery object
			el: this.$previewQazanaEl[0]
		} );

		this.schemes.init();
		this.schemes.printSchemesStyle();

		this.preventClicksInsideEditor();

		this.addBackgroundClickArea( qazanaFrontend.getElements( '$document' )[0] );

		if ( this.previewLoadedOnce ) {
			this.getPanelView().setPage( 'elements', null, { autoFocusSearch: false } );
		} else {
			this.onFirstPreviewLoaded();
		}

		this.initNavigator();

		this.addRegions( {
			sections: iframeRegion
		} );

		var Preview = require( 'qazana-views/preview' );

		this.sections.show( new Preview( { model: this.elementsModel } ) );

		this.$previewContents.children().addClass( 'qazana-html' );

		qazanaFrontend.getElements( '$body' ).addClass( 'qazana-editor-active' ).addClass( 'qazana-page' );

		if ( ! qazana.userCan( 'design' ) ) {
			qazanaFrontend.getElements( '$body' ).addClass( 'qazana-editor-content-only' );
		}

		this.changeDeviceMode( this._defaultDeviceMode );

		jQuery( '#qazana-loading, #qazana-preview-loading' ).fadeOut( 600 );

		_.defer( function() {
			qazanaFrontend.getElements( 'window' ).jQuery.holdReady( false );
		} );

		this.enqueueTypographyFonts();

		this.onEditModeSwitched();

		this.hotKeys.bindListener( qazanaFrontend.getElements( '$window' ) );

		this.trigger( 'preview:loaded' );
	},

	onFirstPreviewLoaded: function() {
		this.initPanel();

		this.heartbeat.init();

		this.checkPageStatus();

		this.openLibraryOnStart();

		this.previewLoadedOnce = true;
	},

	onEditModeSwitched: function() {
		var activeMode = this.channels.dataEditMode.request( 'activeMode' );

		if ( 'edit' === activeMode ) {
			this.exitPreviewMode();
		} else {
			this.enterPreviewMode( 'preview' === activeMode );
		}
	},

	onEnvNotCompatible: function() {
		this.showFatalErrorDialog( {
			headerMessage: this.translate( 'device_incompatible_header' ),
			message: this.translate( 'device_incompatible_message' ),
			strings: {
				confirm: qazana.translate( 'proceed_anyway' )
			},
			hide: {
				onButtonClick: true
			},
			onConfirm: function() {
				this.hide();
			}
		} );
	},

	onPreviewLoadingError: function() {
		this.showFatalErrorDialog( {
			headerMessage: this.translate( 'preview_not_loading_header' ),
			message: this.translate( 'preview_not_loading_message' ),
			onConfirm: function() {
				open( qazana.config.help_preview_error_url, '_blank' );
			}
		} );
	},

	onPreviewElNotFound: function() {
		var args = this.$preview[0].contentWindow.qazanaPreviewErrorArgs;

		if ( ! args ) {
			args = {
				headerMessage: this.translate( 'preview_el_not_found_header' ),
				message: this.translate( 'preview_el_not_found_message' ),
				confirmURL: qazana.config.help_the_content_url
			};
		}

		args.onConfirm = function() {
			open( args.confirmURL, '_blank' );
		};

		this.showFatalErrorDialog( args );
	},

	onBackgroundClick: function( event ) {
		jQuery.each( this.backgroundClickListeners, function() {
			var $clickedTarget = jQuery( event.target );

			// If it's a label that associated with an input
			if ( $clickedTarget[0].control ) {
				$clickedTarget = $clickedTarget.add( $clickedTarget[0].control );
			}

			if ( this.ignore && $clickedTarget.closest( this.ignore ).length ) {
				return;
			}

			if ( this.callback ) {
				this.callback();

				return;
			}

			var $clickedTargetClosestElement = $clickedTarget.closest( this.element );

			jQuery( this.element ).not( $clickedTargetClosestElement ).hide();
		} );
	}
} );

module.exports = ( window.qazana = new App() ).start();

},{"./components/saver/behaviors/footer-saver":7,"./components/saver/behaviors/header-saver":8,"qazana-controls/base":41,"qazana-controls/base-data":38,"qazana-controls/base-multiple":39,"qazana-controls/box-shadow":42,"qazana-controls/button":43,"qazana-controls/choose":44,"qazana-controls/code":45,"qazana-controls/color":46,"qazana-controls/date-time":47,"qazana-controls/dimensions":48,"qazana-controls/font":49,"qazana-controls/gallery":50,"qazana-controls/icon":51,"qazana-controls/image-dimensions":52,"qazana-controls/media":53,"qazana-controls/number":54,"qazana-controls/order":55,"qazana-controls/popover-toggle":56,"qazana-controls/repeater":58,"qazana-controls/repeater-row":57,"qazana-controls/section":59,"qazana-controls/select":60,"qazana-controls/select2":61,"qazana-controls/slider":62,"qazana-controls/structure":63,"qazana-controls/switcher":64,"qazana-controls/tab":65,"qazana-controls/url":66,"qazana-controls/wp_widget":67,"qazana-controls/wysiwyg":68,"qazana-dynamic-tags/manager":2,"qazana-editor-utils/ajax":116,"qazana-editor-utils/conditions":117,"qazana-editor-utils/debug":120,"qazana-editor-utils/heartbeat":121,"qazana-editor-utils/helpers":122,"qazana-editor-utils/images-manager":123,"qazana-editor-utils/notifications":126,"qazana-editor-utils/presets-factory":127,"qazana-editor-utils/schemes":128,"qazana-editor/components/saver/manager":9,"qazana-editor/components/settings/settings":14,"qazana-elements/collections/elements":70,"qazana-elements/models/base-settings":71,"qazana-elements/models/element":73,"qazana-elements/views/widget":83,"qazana-extensions/history/assets/js/module":149,"qazana-layouts/navigator/navigator":88,"qazana-layouts/panel/panel":115,"qazana-panel/pages/elements/views/elements":101,"qazana-panel/pages/elements/views/global":102,"qazana-panel/pages/menu/menu":104,"qazana-templates/manager":17,"qazana-templates/views/base-modal-layout":19,"qazana-templates/views/parts/header-parts/logo":23,"qazana-utils/hooks":137,"qazana-utils/hot-keys":138,"qazana-utils/module":140,"qazana-views/controls-stack":135,"qazana-views/preview":136}],70:[function(require,module,exports){
var ElementModel = require( 'qazana-elements/models/element' );

var ElementsCollection = Backbone.Collection.extend( {
	add: function( models, options, isCorrectSet ) {
		if ( ( ! options || ! options.silent ) && ! isCorrectSet ) {
			throw 'Call Error: Adding model to element collection is allowed only by the dedicated addChildModel() method.';
		}

		return Backbone.Collection.prototype.add.call( this, models, options );
	},

	model: function( attrs, options ) {
		var ModelClass = Backbone.Model;

		if ( attrs.elType ) {
			ModelClass = qazana.hooks.applyFilters( 'element/model', ElementModel, attrs );
		}

		return new ModelClass( attrs, options );
	},

	clone: function() {
		var tempCollection = Backbone.Collection.prototype.clone.apply( this, arguments ),
			newCollection = new ElementsCollection();

		tempCollection.forEach( function( model ) {
			newCollection.add( model.clone(), null, true );
		} );

		return newCollection;
	}
} );

ElementsCollection.prototype.sync = ElementsCollection.prototype.fetch = ElementsCollection.prototype.save = _.noop;

module.exports = ElementsCollection;

},{"qazana-elements/models/element":73}],71:[function(require,module,exports){
var BaseSettingsModel;

BaseSettingsModel = Backbone.Model.extend( {
	options: {},

	initialize: function( data, options ) {
		var self = this;

		// Keep the options for cloning
		self.options = options;

		self.controls = qazana.mergeControlsSettings( options.controls );

		self.validators = {};

		if ( ! self.controls ) {
			return;
		}

		var attrs = data || {},
			defaults = {};

		_.each( self.controls, function( control ) {
			var isUIControl = -1 !== control.features.indexOf( 'ui' );

			if ( isUIControl ) {
				return;
			}
			var controlName = control.name;

			defaults[ controlName ] = control['default'];

			var isDynamicControl = control.dynamic && control.dynamic.active,
				hasDynamicSettings = isDynamicControl && attrs.__dynamic__ && attrs.__dynamic__[ controlName ];

			if ( isDynamicControl && ! hasDynamicSettings && control.dynamic['default'] ) {
				if ( ! attrs.__dynamic__ ) {
					attrs.__dynamic__ = {};
				}

				attrs.__dynamic__[ controlName ] = control.dynamic['default'];

				hasDynamicSettings = true;
			}

			// Check if the value is a plain object ( and not an array )
			var isMultipleControl = jQuery.isPlainObject( control['default'] );

			if ( undefined !== attrs[ controlName ] && isMultipleControl && ! _.isObject( attrs[ controlName ] ) && ! hasDynamicSettings ) {
				qazana.debug.addCustomError(
					new TypeError( 'An invalid argument supplied as multiple control value' ),
					'InvalidElementData',
					'Element `' + ( self.get( 'widgetType' ) || self.get( 'elType' ) ) + '` got <' + attrs[ controlName ] + '> as `' + controlName + '` value. Expected array or object.'
				);

				delete attrs[ controlName ];
			}

			if ( undefined === attrs[ controlName ] ) {
				attrs[ controlName ] = defaults[ controlName ];
			}
		} );

		self.defaults = defaults;

		self.handleRepeaterData( attrs );

		self.set( attrs );
	},

	handleRepeaterData: function( attrs ) {
		_.each( this.controls, function( field ) {
			if ( field.is_repeater ) {
				// TODO: Apply defaults on each field in repeater fields
				if ( ! ( attrs[ field.name ] instanceof Backbone.Collection ) ) {
					attrs[ field.name ] = new Backbone.Collection( attrs[ field.name ], {
						model: function( attrs, options ) {
							options = options || {};

							options.controls = field.fields;

							if ( ! attrs._id ) {
								attrs._id = qazana.helpers.getUniqueID();
							}

							return new BaseSettingsModel( attrs, options );
						}
					} );
				}
			}
		} );
	},

	getFontControls: function() {
		return _.filter( this.getActiveControls(), function( control ) {
			return 'font' === control.type;
		} );
	},

	getStyleControls: function( controls, attributes ) {
		var self = this;

		controls = qazana.helpers.cloneObject( self.getActiveControls( controls, attributes ) );

		var styleControls = [];

		jQuery.each( controls, function() {
			var control = this,
				controlDefaultSettings = qazana.config.controls[ control.type ];

			control = jQuery.extend( {}, controlDefaultSettings, control );

			if ( control.fields ) {
				var styleFields = [];

				self.attributes[ control.name ].each( function( item ) {
					styleFields.push( self.getStyleControls( control.fields, item.attributes ) );
				} );

				control.styleFields = styleFields;
			}

			if ( control.fields || ( control.dynamic && control.dynamic.active ) || self.isStyleControl( control.name, controls ) ) {
				styleControls.push( control );
			}
		} );

		return styleControls;
	},

	isStyleControl: function( attribute, controls ) {
		controls = controls || this.controls;

		var currentControl = _.find( controls, function( control ) {
			return attribute === control.name;
		} );

		return currentControl && ! _.isEmpty( currentControl.selectors );
	},

	getClassControls: function( controls ) {
		controls = controls || this.controls;

		return _.filter( controls, function( control ) {
			return ! _.isUndefined( control.prefix_class );
		} );
	},

	isClassControl: function( attribute ) {
		var currentControl = _.find( this.controls, function( control ) {
			return attribute === control.name;
		} );

		return currentControl && ! _.isUndefined( currentControl.prefix_class );
	},

	getControl: function( id ) {
		return _.find( this.controls, function( control ) {
			return id === control.name;
		} );
	},

	getActiveControls: function( controls, attributes ) {
		var activeControls = {};

		if ( ! controls ) {
			controls = this.controls;
		}

		if ( ! attributes ) {
			attributes = this.attributes;
		}

		_.each( controls, function( control, controlKey ) {
			if ( qazana.helpers.isActiveControl( control, attributes ) ) {
				activeControls[ controlKey ] = control;
			}
		} );

		return activeControls;
	},

	clone: function() {
		return new BaseSettingsModel( qazana.helpers.cloneObject( this.attributes ), qazana.helpers.cloneObject( this.options ) );
	},

	setExternalChange: function( key, value ) {
		var self = this,
			settingsToChange;

		if ( 'object' === typeof key ) {
			settingsToChange = key;
		} else {
			settingsToChange = {};

			settingsToChange[ key ] = value;
		}

		self.set( settingsToChange );

		jQuery.each( settingsToChange, function( changedKey, changedValue ) {
			self.trigger( 'change:external:' + changedKey, changedValue );
		} );
	},

	parseDynamicSettings: function( settings, options, controls ) {
		var self = this;

		settings = qazana.helpers.cloneObject( settings || self.attributes );

		options = options || {};

		controls = controls || this.controls;

		jQuery.each( controls, function() {
			var control = this,
				valueToParse;

			if ( 'repeater' === control.type ) {
				valueToParse = settings[ control.name ];
				valueToParse.forEach( function( value, key ) {
					valueToParse[ key ] = self.parseDynamicSettings( value, options, control.fields );
				} );

				return;
			}

			valueToParse = settings.__dynamic__ && settings.__dynamic__[ control.name ];

			if ( ! valueToParse ) {
				return;
			}

			var dynamicSettings = control.dynamic;

			if ( undefined === dynamicSettings ) {
				dynamicSettings = qazana.config.controls[ control.type ].dynamic;
			}

			if ( ! dynamicSettings || ! dynamicSettings.active ) {
				return;
			}

			var dynamicValue;

			try {
				dynamicValue = qazana.dynamicTags.parseTagsText( valueToParse, dynamicSettings, qazana.dynamicTags.getTagDataContent );
			} catch ( error ) {
				if ( qazana.dynamicTags.CACHE_KEY_NOT_FOUND_ERROR !== error.message ) {
					throw error;
				}

				dynamicValue = '';

				if ( options.onServerRequestStart ) {
					options.onServerRequestStart();
				}

				qazana.dynamicTags.refreshCacheFromServer( function() {
					if ( options.onServerRequestEnd ) {
						options.onServerRequestEnd();
					}
				} );
			}

			if ( dynamicSettings.property ) {
				settings[ control.name ][ dynamicSettings.property ] = dynamicValue;
			} else {
				settings[ control.name ] = dynamicValue;
			}
		} );

		return settings;
	},

	toJSON: function( options ) {
		var data = Backbone.Model.prototype.toJSON.call( this );

		options = options || {};

		delete data.widgetType;
		delete data.elType;
		delete data.isInner;

		_.each( data, function( attribute, key ) {
			if ( attribute && attribute.toJSON ) {
				data[ key ] = attribute.toJSON();
			}
		} );

		if ( options.removeDefault ) {
			var controls = this.controls;

			_.each( data, function( value, key ) {
				var control = controls[ key ];

				if ( control ) {
					// TODO: use `save_default` in text|textarea controls.
					if ( control.save_default || ( ( 'text' === control.type || 'textarea' === control.type ) && data[ key ] ) ) {
						return;
					}

					if ( data[ key ] && 'object' === typeof data[ key ] ) {
						// First check length difference
						if ( Object.keys( data[ key ] ).length !== Object.keys( control[ 'default' ] ).length ) {
							return;
						}

						// If it's equal length, loop over value
						var isEqual = true;

						_.each( data[ key ], function( propertyValue, propertyKey ) {
							if ( data[ key ][ propertyKey ] !== control[ 'default' ][ propertyKey ] ) {
								return isEqual = false;
							}
						} );

						if ( isEqual ) {
							delete data[ key ];
						}
					} else {
						if ( data[ key ] === control[ 'default' ] ) {
							delete data[ key ];
						}
					}
				}
			} );
		}

		return qazana.helpers.cloneObject( data );
	}
} );

module.exports = BaseSettingsModel;

},{}],72:[function(require,module,exports){
var BaseSettingsModel = require( 'qazana-elements/models/base-settings' ),
	ColumnSettingsModel;

ColumnSettingsModel = BaseSettingsModel.extend( {
	defaults: {
		_column_size: 100
	}
} );

module.exports = ColumnSettingsModel;

},{"qazana-elements/models/base-settings":71}],73:[function(require,module,exports){
var BaseSettingsModel = require( 'qazana-elements/models/base-settings' ),
	ColumnSettingsModel = require( 'qazana-elements/models/column-settings' ),
	ElementModel;

ElementModel = Backbone.Model.extend( {
	defaults: {
		id: '',
		elType: '',
		isInner: false,
		settings: {},
		defaultEditSettings: {}
	},

	remoteRender: false,
	_htmlCache: null,
	_jqueryXhr: null,
	renderOnLeave: false,

	initialize: function( options ) {
		var elType = this.get( 'elType' ),
			elements = this.get( 'elements' );

		if ( undefined !== elements ) {
			var ElementsCollection = require( 'qazana-elements/collections/elements' );

			this.set( 'elements', new ElementsCollection( elements ) );
		}

		if ( 'widget' === elType ) {
			this.remoteRender = true;
			this.setHtmlCache( options.htmlCache || '' );
		}

		// No need this variable anymore
		delete options.htmlCache;

		// Make call to remote server as throttle function
		this.renderRemoteServer = _.throttle( this.renderRemoteServer, 1000 );

		this.initSettings();

		this.initEditSettings();

		this.on( {
			destroy: this.onDestroy,
			'editor:close': this.onCloseEditor
		} );
	},

	initSettings: function() {
		var elType = this.get( 'elType' ),
			settings = this.get( 'settings' ),
			settingModels = {
				column: ColumnSettingsModel
			},
			SettingsModel = settingModels[ elType ] || BaseSettingsModel;

		if ( jQuery.isEmptyObject( settings ) ) {
			settings = qazana.helpers.cloneObject( settings );
		}

		if ( 'widget' === elType ) {
			settings.widgetType = this.get( 'widgetType' );
		}

		settings.elType = elType;
		settings.isInner = this.get( 'isInner' );

		settings = new SettingsModel( settings, {
			controls: qazana.getElementControls( this )
		} );

		this.set( 'settings', settings );

		qazanaFrontend.config.elements.data[ this.cid ] = settings;
	},

	initEditSettings: function() {
		var editSettings = new Backbone.Model( this.get( 'defaultEditSettings' ) );

		this.set( 'editSettings', editSettings );

		qazanaFrontend.config.elements.editSettings[ this.cid ] = editSettings;
	},

	setSetting: function( key, value ) {
		var settings = this.get( 'settings' );

		if ( 'object' !== typeof key ) {
			var keyParts = key.split( '.' ),
				isRepeaterKey = 3 === keyParts.length;

			key = keyParts[0];

			if ( isRepeaterKey ) {
				settings = settings.get( key ).models[ keyParts[1] ];

				key = keyParts[2];
			}
		}

		settings.setExternalChange( key, value );
	},

	getSetting: function( key ) {
		var keyParts = key.split( '.' ),
			isRepeaterKey = 3 === keyParts.length,
			settings = this.get( 'settings' );

		key = keyParts[0];

		var value = settings.get( key );

		if ( undefined === value ) {
			return '';
		}

		if ( isRepeaterKey ) {
			value = value.models[ keyParts[1] ].get( keyParts[2] );
		}

		return value;
	},

	setHtmlCache: function( htmlCache ) {
		this._htmlCache = htmlCache;
	},

	getHtmlCache: function() {
		return this._htmlCache;
	},

	getDefaultTitle: function() {
		return qazana.getElementData( this ).title;
	},

	getTitle: function() {
		var title = this.getSetting( '_title' );

		if ( ! title ) {
			title = this.getDefaultTitle();
		}

		return title;
	},

	getIcon: function() {
		return qazana.getElementData( this ).icon;
	},

	createRemoteRenderRequest: function() {
		var data = this.toJSON();

		return qazana.ajax.addRequest( 'render_widget', {
			unique_id: this.cid,
			data: {
				data: data
			},
			success: this.onRemoteGetHtml.bind( this )
		}, true ).jqXhr;
	},

	renderRemoteServer: function() {
		if ( ! this.remoteRender ) {
			return;
		}

		this.renderOnLeave = false;

		this.trigger( 'before:remote:render' );

		if ( this.isRemoteRequestActive() ) {
			this._jqueryXhr.abort();
		}

		this._jqueryXhr = this.createRemoteRenderRequest();
	},

	isRemoteRequestActive: function() {
		return this._jqueryXhr && 4 !== this._jqueryXhr.readyState;
	},

	onRemoteGetHtml: function( data ) {
		this.setHtmlCache( data.render );
		this.trigger( 'remote:render' );
	},

	clone: function() {
		var newModel = new this.constructor( qazana.helpers.cloneObject( this.attributes ) );

		newModel.set( 'id', qazana.helpers.getUniqueID() );

		newModel.setHtmlCache( this.getHtmlCache() );

		var elements = this.get( 'elements' );

		if ( ! _.isEmpty( elements ) ) {
			newModel.set( 'elements', elements.clone() );
		}

		return newModel;
	},

	toJSON: function( options ) {
		options = _.extend( { copyHtmlCache: false }, options );

		// Call parent's toJSON method
		var data = Backbone.Model.prototype.toJSON.call( this );

		_.each( data, function( attribute, key ) {
			if ( attribute && attribute.toJSON ) {
				data[ key ] = attribute.toJSON( options );
			}
		} );

		if ( options.copyHtmlCache ) {
			data.htmlCache = this.getHtmlCache();
		} else {
			delete data.htmlCache;
		}

		return data;
	},

	onCloseEditor: function() {
		if ( this.renderOnLeave ) {
			this.renderRemoteServer();
		}
	},

	onDestroy: function() {
		// Clean the memory for all use instances
		var settings = this.get( 'settings' ),
			elements = this.get( 'elements' );

		if ( undefined !== elements ) {
			_.each( _.clone( elements.models ), function( model ) {
				model.destroy();
			} );
		}

		settings.destroy();
	}

} );

ElementModel.prototype.sync = ElementModel.prototype.fetch = ElementModel.prototype.save = _.noop;

module.exports = ElementModel;

},{"qazana-elements/collections/elements":70,"qazana-elements/models/base-settings":71,"qazana-elements/models/column-settings":72}],74:[function(require,module,exports){
var BaseSettingsModel = require( 'qazana-elements/models/base-settings' ),
	ControlsCSSParser = require( 'qazana-editor-utils/controls-css-parser' ),
	Validator = require( 'qazana-validator/base' ),
	BaseContainer = require( 'qazana-views/base-container' ),
	BaseElementView;

BaseElementView = BaseContainer.extend( {
	tagName: 'div',

	controlsCSSParser: null,

	allowRender: true,

	toggleEditTools: false,

	renderAttributes: {},

	className: function() {
		var classes = 'qazana-element qazana-element-edit-mode ' + this.getElementUniqueID();

		if ( this.toggleEditTools ) {
			classes += ' qazana-element--toggle-edit-tools';
		}

		return classes;
	},

	attributes: function() {
		var type = this.model.get( 'elType' );

		if ( 'widget'  === type ) {
			type = this.model.get( 'widgetType' );
		}

		return {
			'data-id': this.getID(),
			'data-element_type': type
		};
	},

	ui: function() {
		return {
			tools: '> .qazana-element-overlay > .qazana-editor-element-settings',
			editButton: '> .qazana-element-overlay .qazana-editor-element-edit',
			duplicateButton: '> .qazana-element-overlay .qazana-editor-element-duplicate',
			addButton: '> .qazana-element-overlay .qazana-editor-element-add',
			removeButton: '> .qazana-element-overlay .qazana-editor-element-remove'
		};
	},

	behaviors: function() {
		var groups = qazana.hooks.applyFilters( 'elements/' + this.options.model.get( 'elType' ) + '/contextMenuGroups', this.getContextMenuGroups(), this );

		var behaviors = {
			contextMenu: {
				behaviorClass: require( 'qazana-behaviors/context-menu' ),
				groups: groups
			}
		};

		return qazana.hooks.applyFilters( 'elements/base/behaviors', behaviors, this );
	},

	getBehavior: function( name ) {
		return this._behaviors[ Object.keys( this.behaviors() ).indexOf( name ) ];
	},

	events: function() {
		return {
			'mousedown': 'onMouseDown',
			'click @ui.editButton': 'onEditButtonClick',
			'click @ui.duplicateButton': 'onDuplicateButtonClick',
			'click @ui.addButton': 'onAddButtonClick',
			'click @ui.removeButton': 'onRemoveButtonClick'
		};
	},

	getElementType: function() {
		return this.model.get( 'elType' );
	},

	getIDInt: function() {
		return parseInt( this.getID(), 16 );
	},

	getChildType: function() {
		return qazana.helpers.getElementChildType( this.getElementType() );
	},

	getChildView: function( model ) {
		var ChildView,
			elType = model.get( 'elType' );

		if ( 'section' === elType ) {
			ChildView = require( 'qazana-elements/views/section' );
		} else if ( 'column' === elType ) {
			ChildView = require( 'qazana-elements/views/column' );
		} else {
			ChildView = qazana.modules.elements.views.Widget;
		}

		return qazana.hooks.applyFilters( 'element/view', ChildView, model, this );
	},

	// TODO: backward compatibility method since 1.3.0
	templateHelpers: function() {
		var templateHelpers = BaseContainer.prototype.templateHelpers.apply( this, arguments );

		return jQuery.extend( templateHelpers, {
			editModel: this.getEditModel() // @deprecated. Use view.getEditModel() instead.
		} );
	},

	getTemplateType: function() {
		return 'js';
	},

	getEditModel: function() {
		return this.model;
	},

	getContextMenuGroups: function() {
		var elementType = this.options.model.get( 'elType' ),
			controlSign = qazana.envData.mac ? '⌘' : '^';

		return [
			{
				name: 'general',
				actions: [
					{
						name: 'edit',
						icon: 'eicon-edit',
						title: qazana.translate( 'edit_element', [ qazana.helpers.firstLetterUppercase( elementType ) ] ),
						callback: this.options.model.trigger.bind( this.options.model, 'request:edit' )
					}, {
						name: 'duplicate',
						icon: 'eicon-clone',
						title: qazana.translate( 'duplicate' ),
						shortcut: controlSign + '+D',
						callback: this.duplicate.bind( this )
					}
				]
			}, {
				name: 'transfer',
				actions: [
					{
						name: 'copy',
						title: qazana.translate( 'copy' ),
						shortcut: controlSign + '+C',
						callback: this.copy.bind( this )
					}, {
						name: 'paste',
						title: qazana.translate( 'paste' ),
						shortcut: controlSign + '+V',
						callback: this.paste.bind( this ),
						isEnabled: this.isPasteEnabled.bind( this )
					}, {
						name: 'pasteStyle',
						title: qazana.translate( 'paste_style' ),
						callback: this.pasteStyle.bind( this ),
						isEnabled: function() {
							return !! qazana.getStorage( 'transfer' );
						}
					}, {
						name: 'resetStyle',
						title: qazana.translate( 'reset_style' ),
						callback: this.resetStyle.bind( this )
					}
				]
			}, {
				name: 'delete',
				actions: [
					{
						name: 'delete',
						icon: 'eicon-trash',
						title: qazana.translate( 'delete' ),
						shortcut: '⌦',
						callback: this.removeElement.bind( this )
					}
				]
			}
		];
	},

	initialize: function() {
		BaseContainer.prototype.initialize.apply( this, arguments );

		if ( this.collection ) {
			this.listenTo( this.collection, 'add remove reset', this.onCollectionChanged, this );
			this.listenTo( this.collection, 'switch', this.handleElementHover, this );
		}

		var editModel = this.getEditModel();

		this.listenTo( editModel.get( 'settings' ), 'change', this.onSettingsChanged )
			.listenTo( editModel.get( 'editSettings' ), 'change', this.onEditSettingsChanged )
			.listenTo( this.model, 'request:edit', this.onEditRequest )
			.listenTo( this.model, 'request:toggleVisibility', this.toggleVisibility );

		this.initControlsCSSParser();
	},

    handleElementHover: function( ) {

        var self = this;

        var config = {
            class : 'qazana-element-settings-active'
        };

        var hoverConfig = {
            sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)
            interval: 10, // number = milliseconds for onMouseOver polling interval
            timeout: 500, // number = milliseconds delay before onMouseOut
            over: function() {
                self.$el.addClass( config.class );
            },
            out: function() {
                self.$el.removeClass(config.class );
            }
        };

        self.$el.hoverIntent(hoverConfig);

    },

	startTransport: function( type ) {
		qazana.setStorage( 'transfer', {
			type: type,
			elementsType: this.getElementType(),
			elements: [ this.model.toJSON( { copyHtmlCache: true } ) ]
		} );
	},

	copy: function() {
		this.startTransport( 'copy' );
	},

	cut: function() {
		this.startTransport( 'cut' );
	},

	paste: function() {
		this.trigger( 'request:paste' );
	},

	isPasteEnabled: function() {
		var transferData = qazana.getStorage( 'transfer' );

		if ( ! transferData || this.isCollectionFilled() ) {
			return false;
		}

		return this.getElementType() === transferData.elementsType;
	},

	isStyleTransferControl: function( control ) {
		if ( undefined !== control.style_transfer ) {
			return control.style_transfer;
		}

		return 'content' !== control.tab || control.selectors || control.prefix_class;
	},

	duplicate: function() {
		var oldTransport = qazana.getStorage( 'transfer' );

		this.copy();

		this.paste();

		qazana.setStorage( 'transfer', oldTransport );
	},

	pasteStyle: function() {
		var self = this,
			transferData = qazana.getStorage( 'transfer' ),
			sourceElement = transferData.elements[0],
			sourceSettings = sourceElement.settings,
			editModel = self.getEditModel(),
			settings = editModel.get( 'settings' ),
			settingsAttributes = settings.attributes,
			controls = settings.controls,
			diffSettings = {};

		jQuery.each( controls, function( controlName, control ) {
			if ( ! self.isStyleTransferControl( control ) ) {
				return;
			}

			var sourceValue = sourceSettings[ controlName ],
				targetValue = settingsAttributes[ controlName ];

			if ( undefined === sourceValue || undefined === targetValue ) {
				return;
			}

			if ( 'object' === typeof sourceValue ) {
				if ( 'object' !== typeof targetValue ) {
					return;
				}

				var isEqual = true;

				jQuery.each( sourceValue, function( propertyKey ) {
					if ( sourceValue[ propertyKey ] !== targetValue[ propertyKey ] ) {
						return isEqual = false;
					}
				} );

				if ( isEqual ) {
					return;
				}
			} else {
				if ( sourceValue === targetValue ) {
					return;
				}
			}

			var ControlView = qazana.getControlView( control.type );

			if ( ! ControlView.onPasteStyle( control, sourceValue ) ) {
				return;
			}

			diffSettings[ controlName ] = sourceValue;
		} );

		self.allowRender = false;

		qazana.channels.data.trigger( 'element:before:paste:style', editModel );

		editModel.setSetting( diffSettings );

		qazana.channels.data.trigger( 'element:after:paste:style', editModel );

		self.allowRender = true;

		self.renderOnChange();
	},

	resetStyle: function() {
		var self = this,
			editModel = self.getEditModel(),
			controls = editModel.get( 'settings' ).controls,
			defaultValues = {};

		self.allowRender = false;

		qazana.channels.data.trigger( 'element:before:reset:style', editModel );

		jQuery.each( controls, function( controlName, control ) {
			if ( ! self.isStyleTransferControl( control ) ) {
				return;
			}

			defaultValues[ controlName ] = control[ 'default' ];
		} );

		editModel.setSetting( defaultValues );

		qazana.channels.data.trigger( 'element:after:reset:style', editModel );

		self.allowRender = true;

		self.renderOnChange();
	},

	toggleVisibility: function() {
		this.model.set( 'hidden', ! this.model.get( 'hidden' ) );

		this.toggleVisibilityClass();
	},

	toggleVisibilityClass: function() {
		this.$el.toggleClass( 'qazana-edit-hidden', ! ! this.model.get( 'hidden' ) );
	},

	addElementFromPanel: function( options ) {
		options = options || {};

		var elementView = qazana.channels.panelElements.request( 'element:selected' );

		var itemData = {
			elType: elementView.model.get( 'elType' )
		};

		if ( 'widget' === itemData.elType ) {
			itemData.widgetType = elementView.model.get( 'widgetType' );
		} else if ( 'section' === itemData.elType ) {
			itemData.isInner = true;
		} else {
			return;
		}

		var customData = elementView.model.get( 'custom' );

		if ( customData ) {
			jQuery.extend( itemData, customData );
		}

		options.trigger = {
			beforeAdd: 'element:before:add',
			afterAdd: 'element:after:add'
		};

		options.onAfterAdd = function( newModel, newView ) {
			if ( 'section' === newView.getElementType() && newView.isInner() ) {
				newView.addChildElement();
			}
		};

		this.addChildElement( itemData, options );
	},

	addControlValidator: function( controlName, validationCallback ) {
		validationCallback = validationCallback.bind( this );

		var validator = new Validator( { customValidationMethod: validationCallback } ),
			validators = this.getEditModel().get( 'settings' ).validators;

		if ( ! validators[ controlName ] ) {
			validators[ controlName ] = [];
		}

		validators[ controlName ].push( validator );
	},

	addRenderAttribute: function( element, key, value, overwrite ) {
		var self = this;

		if ( 'object' === typeof element ) {
			jQuery.each( element, function( elementKey ) {
				self.addRenderAttribute( elementKey, this, null, overwrite );
			} );

			return self;
		}

		if ( 'object' === typeof key ) {
			jQuery.each( key, function( attributeKey ) {
				self.addRenderAttribute( element, attributeKey, this, overwrite );
			} );

			return self;
		}

		if ( ! self.renderAttributes[ element ] ) {
			self.renderAttributes[ element ] = {};
		}

		if ( ! self.renderAttributes[ element ][ key ] ) {
			self.renderAttributes[ element ][ key ] = [];
		}

		if ( ! Array.isArray( value ) ) {
			value = [ value ];
		}

		if ( overwrite ) {
			self.renderAttributes[ element ][ key ] = value;
		} else {
			self.renderAttributes[ element ][ key ] = self.renderAttributes[ element ][ key ].concat( value );
		}
	},

	getRenderAttributeString: function( element ) {
		if ( ! this.renderAttributes[ element ] ) {
			return '';
		}

		var renderAttributes = this.renderAttributes[ element ],
			attributes = [];

		jQuery.each( renderAttributes, function( attributeKey ) {
			attributes.push( attributeKey + '="' + _.escape( this.join( ' ' ) ) + '"' );
		} );

		return attributes.join( ' ' );
	},

	isInner: function() {
		return !! this.model.get( 'isInner' );
	},

	initControlsCSSParser: function() {
		this.controlsCSSParser = new ControlsCSSParser( {
			id: this.model.cid,
			settingsModel: this.getEditModel().get( 'settings' ),
			dynamicParsing: this.getDynamicParsingSettings()
		} );
	},

	enqueueFonts: function() {
		var editModel = this.getEditModel(),
			settings = editModel.get( 'settings' );

		_.each( settings.getFontControls(), function( control ) {
			var fontFamilyName = editModel.getSetting( control.name );

			if ( _.isEmpty( fontFamilyName ) ) {
				return;
			}

			qazana.helpers.enqueueFont( fontFamilyName );
		} );
	},

	renderStyles: function( settings ) {
		if ( ! settings ) {
			settings = this.getEditModel().get( 'settings' );
		}
		
		var self = this,
			customCSS = settings.get( 'custom_css' ),
			extraCSS = qazana.hooks.applyFilters( 'editor/style/styleText', '', this );
			
		self.controlsCSSParser.stylesheet.empty();

		self.controlsCSSParser.addStyleRules( settings.getStyleControls(), settings.attributes, self.getEditModel().get( 'settings' ).controls, [ /{{ID}}/g, /{{WRAPPER}}/g ], [ self.getID(), '#qazana .' + self.getElementUniqueID() ] );

		self.controlsCSSParser.addStyleToDocument();

		if ( customCSS ) {
			self.controlsCSSParser.elements.$stylesheetElement.append( customCSS.replace( /selector/g, '#qazana .' + self.getElementUniqueID() ) );
		}
		
		if ( extraCSS ) {
			self.controlsCSSParser.elements.$stylesheetElement.append( extraCSS );
		}
	},

	renderCustomClasses: function() {
		var self = this;

		var settings = self.getEditModel().get( 'settings' ),
			classControls = settings.getClassControls();

		// Remove all previous classes
		_.each( classControls, function( control ) {
			var previousClassValue = settings.previous( control.name );

			if ( control.classes_dictionary ) {
				if ( undefined !== control.classes_dictionary[ previousClassValue ] ) {
					previousClassValue = control.classes_dictionary[ previousClassValue ];
				}
			}

			self.$el.removeClass( control.prefix_class + previousClassValue );
		} );

		// Add new classes
		_.each( classControls, function( control ) {
			var value = settings.attributes[ control.name ],
				classValue = value;

			if ( control.classes_dictionary ) {
				if ( undefined !== control.classes_dictionary[ value ] ) {
					classValue = control.classes_dictionary[ value ];
				}
			}

			var isVisible = qazana.helpers.isActiveControl( control, settings.attributes );

			if ( isVisible && ( classValue || 0 === classValue ) ) {
				self.$el.addClass( control.prefix_class + classValue );
			}
		} );

		self.$el.addClass( _.result( self, 'className' ) );

		self.toggleVisibilityClass();
	},

	renderCustomElementID: function() {
		var customElementID = this.getEditModel().get( 'settings' ).get( '_element_id' );

		this.$el.attr( 'id', customElementID );
	},

	getModelForRender: function() {
		return qazana.hooks.applyFilters( 'element/templateHelpers/editModel', this.getEditModel(), this );
	},

	renderUIOnly: function() {
		var editModel = this.getModelForRender();

		this.renderStyles( editModel.get( 'settings' ) );
		this.renderCustomClasses();
		this.renderCustomElementID();
		this.enqueueFonts();
	},

	renderUI: function() {
		this.renderStyles();
		this.renderCustomClasses();
		this.renderCustomElementID();
		this.enqueueFonts();
	},

	runReadyTrigger: function() {
		var self = this;

		_.defer( function() {
			qazanaFrontend.elementsHandler.runReadyTrigger( self.$el );

			if ( ! qazanaFrontend.isEditMode() ) {
				return;
			}

			// In edit mode - handle an external elements which loaded by another elements like shortcode etc.
			self.$el.find( '.qazana-element.qazana-' + self.model.get( 'elType' ) + ':not(.qazana-element-edit-mode)' ).each( function() {
				qazanaFrontend.elementsHandler.runReadyTrigger( jQuery( this ) );
			} );
		} );
	},

	getID: function() {
		return this.model.get( 'id' );
	},

	getElementUniqueID: function() {
		return 'qazana-element-' + this.getID();
	},

	renderOnChange: function( settings ) {
		if ( ! this.allowRender ) {
			return;
		}

		// Make sure is correct model
		if ( settings instanceof BaseSettingsModel ) {
			var hasChanged = settings.hasChanged(),
				isContentChanged = ! hasChanged,
				isRenderRequired = ! hasChanged;

			_.each( settings.changedAttributes(), function( settingValue, settingKey ) {
				var control = settings.getControl( settingKey );

				if ( '_column_size' === settingKey ) {
					isRenderRequired = true;
					return;
				}

				if ( ! control ) {
					isRenderRequired = true;
					isContentChanged = true;
					return;
				}

				if ( 'none' !== control.render_type ) {
					isRenderRequired = true;
				}

				if ( -1 !== [ 'none', 'ui' ].indexOf( control.render_type ) ) {
					return;
				}

				if ( 'template' === control.render_type || ! settings.isStyleControl( settingKey ) && ! settings.isClassControl( settingKey ) && '_element_id' !== settingKey ) {
					isContentChanged = true;
				}
			} );

			if ( ! isRenderRequired ) {
				return;
			}

			if ( ! isContentChanged ) {
				this.renderUI();
				return;
			}
		}

		// Re-render the template
		var templateType = this.getTemplateType(),
			editModel = this.getEditModel();

		if ( 'js' === templateType ) {
			this.getEditModel().setHtmlCache();
			this.render();
			editModel.renderOnLeave = true;
		} else {
			editModel.renderRemoteServer();
		}
	},

	getDynamicParsingSettings: function() {
		var self = this;

		return {
			onServerRequestStart: function() {
				self.$el.addClass( 'qazana-loading' );
			},
			onServerRequestEnd: function() {
				self.render();

				self.$el.removeClass( 'qazana-loading' );
			}
		};
	},

	serializeData: function() {
		var data = BaseContainer.prototype.serializeData.apply( this, arguments );

		data.settings = this.getEditModel().get( 'settings' ).parseDynamicSettings( data.settings, this.getDynamicParsingSettings() );

		return data;
	},

	save: function() {
		var model = this.model;

		qazana.templates.startModal( {
			onReady: function() {
				qazana.templates.getLayout().showSaveTemplateView( model );
			}
		} );
	},

	removeElement: function() {
		qazana.channels.data.trigger( 'element:before:remove', this.model );

		var parent = this._parent;

		parent.isManualRemoving = true;

		this.model.destroy();

		parent.isManualRemoving = false;

		qazana.channels.data.trigger( 'element:after:remove', this.model );
	},

	onBeforeRender: function() {
		this.renderAttributes = {};
	},

	onRender: function() {
		this.renderUI();

		this.runReadyTrigger();

		if ( this.toggleEditTools ) {
			var editButton = this.ui.editButton;

			this.ui.tools.hoverIntent( function() {
				editButton.addClass( 'qazana-active' );
			}, function() {
				editButton.removeClass( 'qazana-active' );
			}, { timeout: 500 } );
		}
	},

	onCollectionChanged: function() {
		qazana.saver.setFlagEditorChange( true );
	},

	onEditSettingsChanged: function( changedModel ) {
		qazana.channels.editor
			.trigger( 'change:editSettings', changedModel, this );
	},

	onSettingsChanged: function( changedModel ) {
		qazana.saver.setFlagEditorChange( true );

		this.renderOnChange( changedModel );
	},

	onEditButtonClick: function() {
		this.model.trigger( 'request:edit' );
	},

	onEditRequest: function() {
		qazana.helpers.scrollToView( this.$el, 200 );

		var activeMode = qazana.channels.dataEditMode.request( 'activeMode' );

		if ( 'edit' !== activeMode ) {
			return;
		}

		qazana.getPanelView().openEditor( this.getEditModel(), this );
	},

	onDuplicateButtonClick: function( event ) {
		event.stopPropagation();

		this.duplicate();
	},

	onRemoveButtonClick: function( event ) {
		event.stopPropagation();

		this.removeElement();
	},

	/* jQuery ui sortable preventing any `mousedown` event above any element, and as a result is preventing the `blur`
	 * event on the currently active element. Therefor, we need to blur the active element manually.
	 */
	onMouseDown: function( event ) {
		if ( jQuery( event.target ).closest( '.qazana-inline-editing' ).length ) {
			return;
		}

		qazanaFrontend.getElements( '$document' )[0].activeElement.blur();
	},

	onDestroy: function() {
		this.controlsCSSParser.removeStyleFromDocument();

		qazana.channels.data.trigger( 'element:destroy', this.model );
	}
} );

module.exports = BaseElementView;

},{"qazana-behaviors/context-menu":75,"qazana-editor-utils/controls-css-parser":119,"qazana-elements/models/base-settings":71,"qazana-elements/views/column":81,"qazana-elements/views/section":82,"qazana-validator/base":36,"qazana-views/base-container":133}],75:[function(require,module,exports){
var ContextMenu = require( 'qazana-editor-utils/context-menu' );

module.exports = Marionette.Behavior.extend( {

	defaults: {
		groups: [],
		eventTargets: [ 'el' ]
	},

	events: function() {
		var events = {};

		if ( ! qazana.userCan( 'design' ) ) {
			return events;
		}

		this.getOption( 'eventTargets' ).forEach( function( eventTarget ) {
			var eventName = 'contextmenu';

			if ( 'el' !== eventTarget ) {
				eventName += ' ' + eventTarget;
			}

			events[ eventName ] = 'onContextMenu';
		} );

		return events;
	},

	initialize: function() {
		this.listenTo( this.view.options.model, 'request:contextmenu', this.onRequestContextMenu );
	},

	initContextMenu: function() {
		var contextMenuGroups = this.getOption( 'groups' ),
			deleteGroup = _.findWhere( contextMenuGroups, { name: 'delete' } ),
			afterGroupIndex = contextMenuGroups.indexOf( deleteGroup );

		if ( -1 === afterGroupIndex ) {
			afterGroupIndex = contextMenuGroups.length;
		}

		contextMenuGroups.splice( afterGroupIndex, 0, {
			name: 'tools',
			actions: [
				{
					name: 'navigator',
					title: qazana.translate( 'navigator' ),
					callback: qazana.navigator.open.bind( qazana.navigator, this.view.model )
				}
			]
		} );

		this.contextMenu = new ContextMenu( {
			groups: contextMenuGroups
		} );

		this.contextMenu.getModal().on( 'hide', this.onContextMenuHide );
	},

	getContextMenu: function() {
		if ( ! this.contextMenu ) {
			this.initContextMenu();
		}

		return this.contextMenu;
	},

	onContextMenu: function( event ) {
		if ( qazana.hotKeys.isControlEvent( event ) ) {
			return;
		}

		var activeMode = qazana.channels.dataEditMode.request( 'activeMode' );

		if ( 'edit' !== activeMode ) {
			return;
		}

		event.preventDefault();

		event.stopPropagation();

		this.getContextMenu().show( event );

		qazana.channels.editor.reply( 'contextMenu:targetView', this.view );
	},

	onRequestContextMenu: function( event ) {
		var modal = this.getContextMenu().getModal(),
			iframe = modal.getSettings( 'iframe' ),
			toolsGroup = _.findWhere( this.contextMenu.getSettings( 'groups' ), { name: 'tools' } );

		toolsGroup.isVisible = false;

		modal.setSettings( 'iframe', null );

		this.onContextMenu( event );

		toolsGroup.isVisible = true;

		modal.setSettings( 'iframe', iframe );
	},

	onContextMenuHide: function() {
		qazana.channels.editor.reply( 'contextMenu:targetView', null );
	},

	onDestroy: function() {
		if ( this.contextMenu ) {
			this.contextMenu.destroy();
		}
	}
} );

},{"qazana-editor-utils/context-menu":118}],76:[function(require,module,exports){
var InlineEditingBehavior;

InlineEditingBehavior = Marionette.Behavior.extend( {
	editing: false,

	$currentEditingArea: null,

	ui: function() {
		return {
			inlineEditingArea: '.' + this.getOption( 'inlineEditingClass' )
		};
	},

	events: function() {
		return {
			'click @ui.inlineEditingArea': 'onInlineEditingClick',
			'input @ui.inlineEditingArea':'onInlineEditingUpdate'
		};
	},

	getEditingSettingKey: function() {
		return this.$currentEditingArea.data().qazanaSettingKey;
	},

	startEditing: function( $element ) {
		var qazanaSettingKey = $element.data().qazanaSettingKey,
			settingKey = qazanaSettingKey,
			keyParts = qazanaSettingKey.split( '.' ),
			isRepeaterKey = 3 === keyParts.length,
			settingsModel = this.view.getEditModel().get( 'settings' );

		if ( isRepeaterKey ) {
			settingsModel = settingsModel.get( keyParts[0] ).models[ keyParts[1] ];

			settingKey = keyParts[2];
		}

		var dynamicSettings = settingsModel.get( '__dynamic__' ),
			isDynamic = dynamicSettings && dynamicSettings[ settingKey ];

		if (
			this.editing ||
			isDynamic ||
			'edit' !== qazana.channels.dataEditMode.request( 'activeMode' ) ||
			this.view.model.isRemoteRequestActive()
		) {
			return;
		}

		this.$currentEditingArea = $element;

		var elementData = this.$currentEditingArea.data(),
			elementDataToolbar = elementData.qazanaInlineEditingToolbar,
			mode = 'advanced' === elementDataToolbar ? 'advanced' : 'basic',
			editModel = this.view.getEditModel(),
			inlineEditingConfig = qazana.config.inlineEditing,
			contentHTML = editModel.getSetting( this.getEditingSettingKey() );

		if ( 'advanced' === mode ) {
			contentHTML = wp.editor.autop( contentHTML );
		}

		/**
		 *  Replace rendered content with unrendered content.
		 *  This way the user can edit the original content, before shortcodes and oEmbeds are fired.
		 */
		this.$currentEditingArea.html( contentHTML );

		var QazanaInlineEditor = qazanaFrontend.getElements( 'window' ).QazanaInlineEditor;

		this.editing = true;

		this.view.allowRender = false;

		// Avoid retrieving of old content (e.g. in case of sorting)
		this.view.model.setHtmlCache( '' );

		this.editor = new QazanaInlineEditor( {
			linksInNewWindow: true,
			stay: false,
			editor: this.$currentEditingArea[0],
			mode: mode,
			list: 'none' === elementDataToolbar ? [] : inlineEditingConfig.toolbar[ elementDataToolbar || 'basic' ],
			cleanAttrs: ['id', 'class', 'name'],
			placeholder: qazana.translate( 'type_here' ) + '...',
			toolbarIconsPrefix: 'eicon-editor-',
			toolbarIconsDictionary: {
				externalLink: {
					className: 'eicon-editor-external-link'
				},
				list: {
					className: 'eicon-editor-list-ul'
				},
				insertOrderedList: {
					className: 'eicon-editor-list-ol'
				},
				insertUnorderedList: {
					className: 'eicon-editor-list-ul'
				},
				createlink: {
					className: 'eicon-editor-link'
				},
				unlink: {
					className: 'eicon-editor-unlink'
				},
				blockquote: {
					className: 'eicon-editor-quote'
				},
				p: {
					className: 'eicon-editor-paragraph'
				},
				pre: {
					className: 'eicon-editor-code'
				}
			}
		} );

		var $menuItems = jQuery( this.editor._menu ).children();

		/**
		 * When the edit area is not focused (on blur) the inline editing is stopped.
		 * In order to prevent blur event when the user clicks on toolbar buttons while editing the
		 * content, we need the prevent their mousedown event. This also prevents the blur event.
		 */
		$menuItems.on( 'mousedown', function( event ) {
			event.preventDefault();
		} );

		this.$currentEditingArea.on( 'blur', this.onInlineEditingBlur.bind( this ) );
	},

	stopEditing: function() {
		this.editing = false;

		this.editor.destroy();

		this.view.allowRender = true;

		/**
		 * Inline editing has several toolbar types (advanced, basic and none). When editing is stopped,
		 * we need to rerender the area. To prevent multiple renderings, we will render only areas that
		 * use advanced toolbars.
		 */
		if ( 'advanced' === this.$currentEditingArea.data().qazanaInlineEditingToolbar ) {
			this.view.getEditModel().renderRemoteServer();
		}
	},

	onInlineEditingClick: function( event ) {
		var self = this,
			$targetElement = jQuery( event.currentTarget );

		/**
		 * When starting inline editing we need to set timeout, this allows other inline items to finish
		 * their operations before focusing new editing area.
		 */
		setTimeout( function() {
			self.startEditing( $targetElement );
		}, 30 );
	},

	onInlineEditingBlur: function() {
		var self = this;

		/**
		 * When exiting inline editing we need to set timeout, to make sure there is no focus on internal
		 * toolbar action. This prevent the blur and allows the user to continue the inline editing.
		 */
		setTimeout( function() {
			var selection = qazanaFrontend.getElements( 'window' ).getSelection(),
				$focusNode = jQuery( selection.focusNode );

			if ( $focusNode.closest( '.pen-input-wrapper' ).length ) {
				return;
			}

			self.stopEditing();
		}, 20 );
	},

	onInlineEditingUpdate: function() {
		this.view.getEditModel().setSetting( this.getEditingSettingKey(), this.editor.getContent() );
	}
} );

module.exports = InlineEditingBehavior;

},{}],77:[function(require,module,exports){
var InnerTabsBehavior;

InnerTabsBehavior = Marionette.Behavior.extend( {

	onRenderCollection: function() {
		this.handleInnerTabs( this.view );
	},

	handleInnerTabs: function( parent ) {
		var closedClass = 'qazana-tab-close',
			activeClass = 'qazana-tab-active',
			tabsWrappers = parent.children.filter( function( view ) {
				return 'tabs' === view.model.get( 'type' );
			} );

			_.each( tabsWrappers, function( view ) {
				view.$el.find( '.qazana-control-content' ).remove();

				var tabsId = view.model.get( 'name' ),
				tabs = parent.children.filter( function( childView ) {
					return ( 'tab' === childView.model.get( 'type' ) && childView.model.get( 'tabs_wrapper' ) === tabsId );
				} );

				_.each( tabs, function( childView, index ) {
					view._addChildView( childView );

					var tabId = childView.model.get( 'name' ),
					controlsUnderTab = parent.children.filter( function( view ) {
						return ( tabId === view.model.get( 'inner_tab' ) );
					} );

					if ( 0 === index ) {
						childView.$el.addClass( activeClass );
					} else {
						_.each( controlsUnderTab, function( view ) {
							view.$el.addClass( closedClass );
						} );
					}
				} );
			} );
	},

	onChildviewControlTabClicked: function( childView ) {
		var closedClass = 'qazana-tab-close',
			activeClass = 'qazana-tab-active',
			tabClicked = childView.model.get( 'name' ),
			childrenUnderTab = this.view.children.filter( function( view ) {
				return ( 'tab' !== view.model.get( 'type' ) && childView.model.get( 'tabs_wrapper' ) === view.model.get( 'tabs_wrapper' ) );
			} ),
			siblingTabs = this.view.children.filter( function( view ) {
				return ( 'tab' === view.model.get( 'type' ) && childView.model.get( 'tabs_wrapper' ) === view.model.get( 'tabs_wrapper' ) );
			} );

			_.each( siblingTabs, function( view ) {
				view.$el.removeClass( activeClass );
			} );

			childView.$el.addClass( activeClass );

			_.each( childrenUnderTab, function( view ) {
				if ( view.model.get( 'inner_tab' ) === tabClicked ) {
					view.$el.removeClass( closedClass );
				} else {
					view.$el.addClass( closedClass );
				}
			} );

			qazana.getPanelView().updateScrollbar();
	}
} );

module.exports = InnerTabsBehavior;

},{}],78:[function(require,module,exports){
var ResizableBehavior;

ResizableBehavior = Marionette.Behavior.extend( {
	defaults: {
		handles: qazana.config.is_rtl ? 'w' : 'e'
	},

	events: {
		resizestart: 'onResizeStart',
		resizestop: 'onResizeStop',
		resize: 'onResize'
	},

	initialize: function() {
		Marionette.Behavior.prototype.initialize.apply( this, arguments );

		this.listenTo( qazana.channels.dataEditMode, 'switch', this.onEditModeSwitched );
	},

	active: function() {
		if ( ! qazana.userCan( 'design' ) ) {
			return;
		}
		this.deactivate();

		var options = _.clone( this.options );

		delete options.behaviorClass;

		var $childViewContainer = this.getChildViewContainer(),
			defaultResizableOptions = {},
			resizableOptions = _.extend( defaultResizableOptions, options );

		$childViewContainer.resizable( resizableOptions );
	},

	deactivate: function() {
		if ( this.getChildViewContainer().resizable( 'instance' ) ) {
			this.getChildViewContainer().resizable( 'destroy' );
		}
	},

	onEditModeSwitched: function( activeMode ) {
		if ( 'edit' === activeMode ) {
			this.active();
		} else {
			this.deactivate();
		}
	},

	onRender: function() {
		var self = this;

		_.defer( function() {
			self.onEditModeSwitched( qazana.channels.dataEditMode.request( 'activeMode' ) );
		} );
	},

	onDestroy: function() {
		this.deactivate();
	},

	onResizeStart: function( event ) {
		event.stopPropagation();

		this.view.$el.data( 'originalWidth', this.view.el.getBoundingClientRect().width );

		this.view.triggerMethod( 'request:resize:start', event );
	},

	onResizeStop: function( event ) {
		event.stopPropagation();

		this.view.triggerMethod( 'request:resize:stop' );
	},

	onResize: function( event, ui ) {
		event.stopPropagation();

		this.view.triggerMethod( 'request:resize', ui, event );
	},

	getChildViewContainer: function() {
		return this.$el;
	}
} );

module.exports = ResizableBehavior;

},{}],79:[function(require,module,exports){
var SortableBehavior;

SortableBehavior = Marionette.Behavior.extend( {
	defaults: {
		elChildType: 'widget'
	},

	events: {
		'sortstart': 'onSortStart',
		'sortreceive': 'onSortReceive',
		'sortupdate': 'onSortUpdate',
		'sortover': 'onSortOver',
		'sortout': 'onSortOut'
	},

	initialize: function() {
		this.listenTo( qazana.channels.dataEditMode, 'switch', this.onEditModeSwitched )
			.listenTo( qazana.channels.deviceMode, 'change', this.onDeviceModeChange )
			.listenTo( this.view.options.model, 'request:sort:start', this.startSort )
			.listenTo( this.view.options.model, 'request:sort:update', this.updateSort )
			.listenTo( this.view.options.model, 'request:sort:receive', this.receiveSort );
	},

	onEditModeSwitched: function( activeMode ) {
		if ( 'edit' === activeMode ) {
			this.activate();
		} else {
			this.deactivate();
		}
	},

	onDeviceModeChange: function() {
		var deviceMode = qazana.channels.deviceMode.request( 'currentMode' );

		if ( 'desktop' === deviceMode ) {
			this.activate();
		} else {
			this.deactivate();
		}
	},

	onRender: function() {
		var self = this;

		_.defer( function() {
			self.onEditModeSwitched( qazana.channels.dataEditMode.request( 'activeMode' ) );
		} );
	},

	onDestroy: function() {
		this.deactivate();
	},

	activate: function() {
		if ( ! qazana.userCan( 'design' ) ) {
			return;
		}
		if ( this.getChildViewContainer().sortable( 'instance' ) ) {
			return;
		}

		var $childViewContainer = this.getChildViewContainer(),
			defaultSortableOptions = {
				connectWith: $childViewContainer.selector,
				placeholder: 'qazana-sortable-placeholder qazana-' + this.getOption( 'elChildType' ) + '-placeholder',
				cursorAt: {
					top: 20,
					left: 25
				},
				helper: this._getSortableHelper.bind( this ),
				cancel: 'input, textarea, button, select, option, .qazana-inline-editing, .qazana-tab-title'

			},
			sortableOptions = _.extend( defaultSortableOptions, this.view.getSortableOptions() );

		$childViewContainer.sortable( sortableOptions );
	},

	_getSortableHelper: function( event, $item ) {
		var model = this.view.collection.get( {
			cid: $item.data( 'model-cid' )
		} );

		return '<div style="height: 84px; width: 125px;" class="qazana-sortable-helper qazana-sortable-helper-' + model.get( 'elType' ) + '"><div class="icon"><i class="' + model.getIcon() + '"></i></div><div class="qazana-element-title-wrapper"><div class="title">' + model.getTitle() + '</div></div></div>';
	},

	getChildViewContainer: function() {
		return this.view.getChildViewContainer( this.view );
	},

	deactivate: function() {
		var childViewContainer = this.getChildViewContainer();

		if ( childViewContainer.sortable( 'instance' ) ) {
			childViewContainer.sortable( 'destroy' );
		}
	},

	startSort: function( event, ui ) {
		event.stopPropagation();

		var model = this.view.collection.get( {
			cid: ui.item.data( 'model-cid' )
		} );

		qazana.channels.data
			.reply( 'dragging:model', model )
			.reply( 'dragging:parent:view', this.view )
			.trigger( 'drag:start', model )
			.trigger( model.get( 'elType' ) + ':drag:start' );
	},

	updateSort: function( ui ) {
		var model = qazana.channels.data.request( 'dragging:model' ),
			$childElement = ui.item,
			collection = this.view.collection,
			newIndex = $childElement.parent().children().index( $childElement ),
			child = this.view.children.findByModelCid( model.cid );

		this.view.addChildElement( model, {
			at: newIndex,
			trigger: {
				beforeAdd: 'drag:before:update',
				afterAdd: 'drag:after:update'
			},
			onBeforeAdd: function() {
				child._isRendering = true;

				collection.remove( model );
			}
		} );

		qazana.saver.setFlagEditorChange( true );
	},

	receiveSort: function( event, ui ) {
		event.stopPropagation();

		if ( this.view.isCollectionFilled() ) {
			jQuery( ui.sender ).sortable( 'cancel' );

			return;
		}

		var model = qazana.channels.data.request( 'dragging:model' ),
			draggedElType = model.get( 'elType' ),
			draggedIsInnerSection = 'section' === draggedElType && model.get( 'isInner' ),
			targetIsInnerColumn = 'column' === this.view.getElementType() && this.view.isInner();

		if ( draggedIsInnerSection && targetIsInnerColumn ) {
			jQuery( ui.sender ).sortable( 'cancel' );

			return;
		}

		var newIndex = ui.item.index(),
			modelData = model.toJSON( { copyHtmlCache: true } );

		this.view.addChildElement( modelData, {
			at: newIndex,
			trigger: {
				beforeAdd: 'drag:before:update',
				afterAdd: 'drag:after:update'
			},
			onAfterAdd: function() {
				var senderSection = qazana.channels.data.request( 'dragging:parent:view' );

				senderSection.isManualRemoving = true;

				model.destroy();

				senderSection.isManualRemoving = false;
			}
		} );
	},

	onSortStart: function( event, ui ) {
		if ( 'column' === this.options.elChildType ) {
			var uiData = ui.item.data( 'sortableItem' ),
				uiItems = uiData.items,
				itemHeight = 0;

			uiItems.forEach( function( item ) {
				if ( item.item[0] === ui.item[0] ) {
					itemHeight = item.height;
					return false;
				}
			} );

			ui.placeholder.height( itemHeight );
		}

		this.startSort( event, ui );
	},

	onSortOver: function( event ) {
		event.stopPropagation();

		var model = qazana.channels.data.request( 'dragging:model' );

		jQuery( event.target )
			.addClass( 'qazana-draggable-over' )
			.attr( {
				'data-dragged-element': model.get( 'elType' ),
				'data-dragged-is-inner': model.get( 'isInner' )
			} );

		this.$el.addClass( 'qazana-dragging-on-child' );
	},

	onSortOut: function( event ) {
		event.stopPropagation();

		jQuery( event.target )
			.removeClass( 'qazana-draggable-over' )
			.removeAttr( 'data-dragged-element data-dragged-is-inner' );

		this.$el.removeClass( 'qazana-dragging-on-child' );
	},

	onSortReceive: function( event, ui ) {
		this.receiveSort( event, ui );
	},

	onSortUpdate: function( event, ui ) {
		event.stopPropagation();

		if ( ! this.el.contains( ui.item[0] ) ) {
			return;
		}

		this.updateSort( ui );
	},

	onAddChild: function( view ) {
		view.$el.attr( 'data-model-cid', view.model.cid );
	}
} );

module.exports = SortableBehavior;

},{}],80:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-empty-preview',

	className: 'qazana-empty-view',

	events: {
		'click': 'onClickAdd'
	},

	behaviors: function() {
		return {
			contextMenu: {
				behaviorClass: require( 'qazana-behaviors/context-menu' ),
				groups: this.getContextMenuGroups()
			}
		};
	},

	getContextMenuGroups: function() {
		return [
			{
				name: 'general',
				actions: [
					{
						name: 'paste',
						title: qazana.translate( 'paste' ),
						callback: this.paste.bind( this ),
						isEnabled: this.isPasteEnabled.bind( this )
					}
				]
			}
		];
	},

	paste: function() {
		var self = this,
			elements = qazana.getStorage( 'transfer' ).elements,
			index = 0;

		elements.forEach( function( item ) {
			self._parent.addChildElement( item, { at: index, clone: true } );

			index++;
		} );
	},

	isPasteEnabled: function() {
		var transferData = qazana.getStorage( 'transfer' );

		if ( ! transferData ) {
			return false;
		}

		if ( 'section' === transferData.elementsType ) {
			return transferData.elements[0].isInner && ! this._parent.isInner();
		}

		return 'widget' === transferData.elementsType;
	},

	onClickAdd: function() {
		qazana.getPanelView().setPage( 'elements' );
	}
} );

},{"qazana-behaviors/context-menu":75}],81:[function(require,module,exports){
var BaseElementView = require( 'qazana-elements/views/base' ),
	ColumnEmptyView = require( 'qazana-elements/views/column-empty' ),
	ColumnView;

ColumnView = BaseElementView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-column-content' ),

	emptyView: ColumnEmptyView,

	childViewContainer: '> .qazana-column-wrap > .qazana-widget-wrap',

	toggleEditTools: true,

	behaviors: function() {
		var behaviors = BaseElementView.prototype.behaviors.apply( this, arguments );

		_.extend( behaviors, {
			Sortable: {
				behaviorClass: require( 'qazana-behaviors/sortable' ),
				elChildType: 'widget'
			},
			Resizable: {
				behaviorClass: require( 'qazana-behaviors/resizable' )
			}
		} );

		return qazana.hooks.applyFilters( 'elements/column/behaviors', behaviors, this );
	},

	className: function() {
		var classes = BaseElementView.prototype.className.apply( this, arguments ),
			type = this.isInner() ? 'inner' : 'top';

		return classes + ' qazana-column qazana-' + type + '-column';
	},

	tagName: function() {
		return this.model.getSetting( 'html_tag' ) || 'div';
	},

	ui: function() {
		var ui = BaseElementView.prototype.ui.apply( this, arguments );

		ui.columnInner = '> .qazana-column-wrap';

		ui.percentsTooltip = '> .qazana-element-overlay .qazana-column-percents-tooltip';

		return ui;
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		this.addControlValidator( '_inline_size', this.onEditorInlineSizeInputChange );
	},

	getContextMenuGroups: function() {
		var groups = BaseElementView.prototype.getContextMenuGroups.apply( this, arguments ),
			generalGroupIndex = groups.indexOf( _.findWhere( groups, { name: 'general' } ) );

		groups.splice( generalGroupIndex + 1, 0, {
			name: 'addNew',
			actions: [
				{
					name: 'addNew',
					title: qazana.translate( 'new_column' ),
					callback: this.addNewColumn.bind( this )
				}
			]
		} );

		return groups;
	},

	isDroppingAllowed: function() {
		var elementView = qazana.channels.panelElements.request( 'element:selected' );

		if ( ! elementView ) {
			return false;
		}

		var elType = elementView.model.get( 'elType' );

		if ( 'section' === elType ) {
			return ! this.isInner();
		}

		return 'widget' === elType;
	},

	getPercentsForDisplay: function() {
		var inlineSize = +this.model.getSetting( '_inline_size' ) || this.getPercentSize();

		return inlineSize.toFixed( 1 ) + '%';
	},

	changeSizeUI: function() {
		var self = this,
			columnSize = self.model.getSetting( '_column_size' );

		self.$el.attr( 'data-col', columnSize );

		_.defer( function() { // Wait for the column size to be applied
			if ( self.ui.percentsTooltip ) {
				self.ui.percentsTooltip.text( self.getPercentsForDisplay() );
			}
		} );
	},

	getPercentSize: function( size ) {
		if ( ! size ) {
			size = this.el.getBoundingClientRect().width;
		}

		return +( size / this.$el.parent().width() * 100 ).toFixed( 3 );
	},

	getSortableOptions: function() {
		return {
			connectWith: '.qazana-widget-wrap',
			items: '> .qazana-element'
		};
	},

	changeChildContainerClasses: function() {
		var emptyClass = 'qazana-element-empty',
			populatedClass = 'qazana-element-populated';

		if ( this.collection.isEmpty() ) {
			this.ui.columnInner.removeClass( populatedClass ).addClass( emptyClass );
		} else {
			this.ui.columnInner.removeClass( emptyClass ).addClass( populatedClass );
		}
	},

	addNewColumn: function() {
		this.trigger( 'request:add:new' );
	},

	// Events
	onCollectionChanged: function() {
		BaseElementView.prototype.onCollectionChanged.apply( this, arguments );

		this.changeChildContainerClasses();
	},

	onRender: function() {
		var self = this;

		BaseElementView.prototype.onRender.apply( self, arguments );

		self.changeChildContainerClasses();

		self.changeSizeUI();

		self.$el.html5Droppable( {
			items: ' > .qazana-column-wrap > .qazana-widget-wrap > .qazana-element, >.qazana-column-wrap > .qazana-widget-wrap > .qazana-empty-view > .qazana-first-add',
			axis: [ 'vertical' ],
			groups: [ 'qazana-element' ],
			isDroppingAllowed: self.isDroppingAllowed.bind( self ),
			currentElementClass: 'qazana-html5dnd-current-element',
			placeholderClass: 'qazana-sortable-placeholder qazana-widget-placeholder',
			hasDraggingOnChildClass: 'qazana-dragging-on-child',
			onDropping: function( side, event ) {
				event.stopPropagation();

				var newIndex = jQuery( this ).index();

				if ( 'bottom' === side ) {
					newIndex++;
				}

				self.addElementFromPanel( { at: newIndex } );
			}
		} );
	},

	onSettingsChanged: function( settings ) {
		BaseElementView.prototype.onSettingsChanged.apply( this, arguments );

		var changedAttributes = settings.changedAttributes();

		if ( '_column_size' in changedAttributes || '_inline_size' in changedAttributes ) {
			this.changeSizeUI();
		}
	},

	onEditorInlineSizeInputChange: function( newValue, oldValue ) {
		var errors = [],
			columnSize = this.model.getSetting( '_column_size' );

		// If there's only one column
		if ( 100 === columnSize ) {
			errors.push( 'Could not resize one column' );

			return errors;
		}

		if ( ! oldValue ) {
			oldValue = columnSize;
		}

		try {
			this._parent.resizeChild( this, +oldValue, +newValue );
		} catch ( e ) {
			if ( e.message === this._parent.errors.columnWidthTooLarge ) {
				errors.push( e.message );
			}
		}

		return errors;
	},

	onAddButtonClick: function( event ) {
		event.stopPropagation();

		this.addNewColumn();
	}
} );

module.exports = ColumnView;

},{"qazana-behaviors/resizable":78,"qazana-behaviors/sortable":79,"qazana-elements/views/base":74,"qazana-elements/views/column-empty":80}],82:[function(require,module,exports){
var BaseElementView = require( 'qazana-elements/views/base' ),
	AddSectionView = require( 'qazana-views/add-section/inline' ),
	SectionView;

SectionView = BaseElementView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-section-content' ),

	addSectionView: null,

	className: function() {
		var classes = BaseElementView.prototype.className.apply( this, arguments ),
			type = this.isInner() ? 'inner' : 'top';

		return classes + ' qazana-section qazana-' + type + '-section';
	},

	tagName: function() {
		return this.model.getSetting( 'html_tag' ) || 'section';
	},

	childViewContainer: '> .qazana-container > .qazana-row',

	behaviors: function() {
		var behaviors = BaseElementView.prototype.behaviors.apply( this, arguments );

		_.extend( behaviors, {
			Sortable: {
				behaviorClass: require( 'qazana-behaviors/sortable' ),
				elChildType: 'column'
			}
		} );

		return qazana.hooks.applyFilters( 'elements/section/behaviors', behaviors, this );
	},

	errors: {
		columnWidthTooLarge: 'New column width is too large',
		columnWidthTooSmall: 'New column width is too small'
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		this.listenTo( this.collection, 'add remove reset', this._checkIsFull );

		this._checkIsEmpty();
	},

	getContextMenuGroups: function() {
		var groups = BaseElementView.prototype.getContextMenuGroups.apply( this, arguments ),
			transferGroupIndex = groups.indexOf( _.findWhere( groups, { name: 'transfer' } ) );

		groups.splice( transferGroupIndex + 1, 0, {
			name: 'save',
			actions: [
				{
					name: 'save',
					title: qazana.translate( 'save_as_block' ),
					callback: this.save.bind( this )
				}
			]
		} );

		return groups;
	},

	addChildModel: function( model, options ) {
		var isModelInstance = model instanceof Backbone.Model,
			isInner = this.isInner();

		if ( isModelInstance ) {
			model.set( 'isInner', isInner );
		} else {
			model.isInner = isInner;
		}

		return BaseElementView.prototype.addChildModel.apply( this, arguments );
	},

	getSortableOptions: function() {
		var sectionConnectClass = this.isInner() ? '.qazana-inner-section' : '.qazana-top-section';

		return {
			connectWith: sectionConnectClass + ' > .qazana-container > .qazana-row',
			handle: '> .qazana-element-overlay .qazana-editor-element-edit',
			items: '> .qazana-column',
			forcePlaceholderSize: true,
			tolerance: 'pointer'
		};
	},

	getColumnPercentSize: function( element, size ) {
		return +( size / element.parent().width() * 100 ).toFixed( 3 );
	},

	getDefaultStructure: function() {
		return this.collection.length + '0';
	},

	getStructure: function() {
		return this.model.getSetting( 'structure' );
	},

	setStructure: function( structure ) {
		var parsedStructure = qazana.presetsFactory.getParsedStructure( structure );

		if ( +parsedStructure.columnsCount !== this.collection.length ) {
			throw new TypeError( 'The provided structure doesn\'t match the columns count.' );
		}

		this.model.setSetting( 'structure', structure );
	},

	redefineLayout: function() {
		var preset = qazana.presetsFactory.getPresetByStructure( this.getStructure() );

		this.collection.each( function( model, index ) {
			model.setSetting( '_column_size', preset.preset[ index ] );
			model.setSetting( '_inline_size', null );
		} );
	},

	resetLayout: function() {
		this.setStructure( this.getDefaultStructure() );
	},

	resetColumnsCustomSize: function() {
		this.collection.each( function( model ) {
			model.setSetting( '_inline_size', null );
		} );
	},

	isCollectionFilled: function() {
		var MAX_SIZE = 10,
			columnsCount = this.collection.length;

		return ( MAX_SIZE <= columnsCount );
	},

	_checkIsFull: function() {
		this.$el.toggleClass( 'qazana-section-filled', this.isCollectionFilled() );
	},

	_checkIsEmpty: function() {
		if ( ! this.collection.length && ! this.model.get( 'allowEmpty' ) ) {
			this.addChildElement( null, { edit: false } );
		}
	},

	getColumnAt: function( index ) {
		var model = this.collection.at( index );

		return model ? this.children.findByModelCid( model.cid ) : null;
	},

	getNextColumn: function( columnView ) {
		return this.getColumnAt( this.collection.indexOf( columnView.model ) + 1 );
	},

	getPreviousColumn: function( columnView ) {
		return this.getColumnAt( this.collection.indexOf( columnView.model ) - 1 );
	},

	showChildrenPercentsTooltip: function( columnView, nextColumnView ) {
		columnView.ui.percentsTooltip.show();

		columnView.ui.percentsTooltip.attr( 'data-side', qazana.config.is_rtl ? 'right' : 'left' );

		nextColumnView.ui.percentsTooltip.show();

		nextColumnView.ui.percentsTooltip.attr( 'data-side', qazana.config.is_rtl ? 'left' : 'right' );
	},

	hideChildrenPercentsTooltip: function( columnView, nextColumnView ) {
		columnView.ui.percentsTooltip.hide();

		nextColumnView.ui.percentsTooltip.hide();
	},

	resizeChild: function( childView, currentSize, newSize ) {
		var nextChildView = this.getNextColumn( childView ) || this.getPreviousColumn( childView );

		if ( ! nextChildView ) {
			throw new ReferenceError( 'There is not any next column' );
		}

		var minColumnSize = 2,
			$nextElement = nextChildView.$el,
			nextElementCurrentSize = +nextChildView.model.getSetting( '_inline_size' ) || this.getColumnPercentSize( $nextElement, $nextElement[0].getBoundingClientRect().width ),
			nextElementNewSize = +( currentSize + nextElementCurrentSize - newSize ).toFixed( 3 );

		if ( nextElementNewSize < minColumnSize ) {
			throw new RangeError( this.errors.columnWidthTooLarge );
		}

		if ( newSize < minColumnSize ) {
			throw new RangeError( this.errors.columnWidthTooSmall );
		}

		nextChildView.model.setSetting( '_inline_size', nextElementNewSize );

		return true;
	},

	destroyAddSectionView: function() {
		if ( this.addSectionView && ! this.addSectionView.isDestroyed ) {
			this.addSectionView.destroy();
		}
	},

	onRender: function() {
		BaseElementView.prototype.onRender.apply( this, arguments );

		this._checkIsFull();
	},

	onSettingsChanged: function( settingsModel ) {
		BaseElementView.prototype.onSettingsChanged.apply( this, arguments );

		if ( settingsModel.changed.structure ) {
			this.redefineLayout();
		}
	},

	onAddButtonClick: function() {
		if ( this.addSectionView && ! this.addSectionView.isDestroyed ) {
			this.addSectionView.fadeToDeath();

			return;
		}

		var myIndex = this.model.collection.indexOf( this.model ),
			addSectionView = new AddSectionView( {
				at: myIndex
			} );

		addSectionView.render();

		this.$el.before( addSectionView.$el );

		addSectionView.$el.hide();

		// Delaying the slide down for slow-render browsers (such as FF)
		setTimeout( function() {
			addSectionView.$el.slideDown();
		} );

		this.addSectionView = addSectionView;
	},

	onAddChild: function() {
		if ( ! this.isBuffering && ! this.model.get( 'allowEmpty' ) ) {
			// Reset the layout just when we have really add/remove element.
			this.resetLayout();
		}
	},

	onRemoveChild: function() {
		if ( ! this.isManualRemoving ) {
			return;
		}

		// If it's the last column, please create new one.
		this._checkIsEmpty();

		this.resetLayout();
	},

	onChildviewRequestResizeStart: function( columnView ) {
		var nextColumnView = this.getNextColumn( columnView );

		if ( ! nextColumnView ) {
			return;
		}

		this.showChildrenPercentsTooltip( columnView, nextColumnView );

		var $iframes = columnView.$el.find( 'iframe' ).add( nextColumnView.$el.find( 'iframe' ) );

		qazana.helpers.disableElementEvents( $iframes );
	},

	onChildviewRequestResizeStop: function( columnView ) {
		var nextColumnView = this.getNextColumn( columnView );

		if ( ! nextColumnView ) {
			return;
		}

		this.hideChildrenPercentsTooltip( columnView, nextColumnView );

		var $iframes = columnView.$el.find( 'iframe' ).add( nextColumnView.$el.find( 'iframe' ) );

		qazana.helpers.enableElementEvents( $iframes );
	},

	onChildviewRequestResize: function( columnView, ui ) {
		// Get current column details
		var currentSize = +columnView.model.getSetting( '_inline_size' ) || this.getColumnPercentSize( columnView.$el, columnView.$el.data( 'originalWidth' ) );

		ui.element.css( {
			width: '',
			left: 'initial' // Fix for RTL resizing
		} );

		var newSize = this.getColumnPercentSize( ui.element, ui.size.width );

		try {
			this.resizeChild( columnView, currentSize, newSize );
		} catch ( e ) {
			return;
		}

		columnView.model.setSetting( '_inline_size', newSize );
	},

	onDestroy: function() {
		BaseElementView.prototype.onDestroy.apply( this, arguments );

		this.destroyAddSectionView();
	}
} );

module.exports = SectionView;

},{"qazana-behaviors/sortable":79,"qazana-elements/views/base":74,"qazana-views/add-section/inline":132}],83:[function(require,module,exports){
var BaseElementView = require( 'qazana-elements/views/base' ),
	WidgetView;

WidgetView = BaseElementView.extend( {
	_templateType: null,

	toggleEditTools: true,

	getTemplate: function() {
		var editModel = this.getEditModel();

		if ( 'remote' !== this.getTemplateType() ) {
			return Marionette.TemplateCache.get( '#tmpl-qazana-' + editModel.get( 'widgetType' ) + '-content' );
		} else {
			return _.template( '' );
		}
	},

	className: function() {
		var baseClasses = BaseElementView.prototype.className.apply( this, arguments );

		return baseClasses + ' qazana-widget ' + qazana.getElementData( this.getEditModel() ).html_wrapper_class;
	},

	events: function() {
		var events = BaseElementView.prototype.events.apply( this, arguments );

		events.click = 'onClickEdit';

		return events;
	},

	behaviors: function() {
		var behaviors = BaseElementView.prototype.behaviors.apply( this, arguments );

		_.extend( behaviors, {
			InlineEditing: {
				behaviorClass: require( 'qazana-behaviors/inline-editing' ),
				inlineEditingClass: 'qazana-inline-editing'
			}
		} );

		return qazana.hooks.applyFilters( 'elements/widget/behaviors', behaviors, this );
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		var editModel = this.getEditModel();

		editModel.on( {
			'before:remote:render': this.onModelBeforeRemoteRender.bind( this ),
			'remote:render': this.onModelRemoteRender.bind( this )
		} );

		if ( 'remote' === this.getTemplateType() && ! this.getEditModel().getHtmlCache() ) {
			editModel.renderRemoteServer();
		}

		var onRenderMethod = this.onRender;

		this.render = _.throttle( this.render, 300 );

		this.onRender = function() {
			_.defer( onRenderMethod.bind( this ) );
		};
	},

	getContextMenuGroups: function() {
		var groups = BaseElementView.prototype.getContextMenuGroups.apply( this, arguments ),
			transferGroupIndex = groups.indexOf( _.findWhere( groups, { name: 'transfer' } ) );

		groups.splice( transferGroupIndex + 1, 0, {
			name: 'save',
			actions: [
				{
					name: 'save',
					title: qazana.translate( 'save_as_global' ),
					shortcut: jQuery( '<i>', { 'class': 'eicon-pro-icon' } )
				}
			]
		} );

		return groups;
	},

	render: function() {
		if ( this.model.isRemoteRequestActive() ) {
			this.$el.addClass( 'qazana-element' );
			return;
		}

		Marionette.CompositeView.prototype.render.apply( this, arguments );
	},

	getTemplateType: function() {
		if ( null === this._templateType ) {
			var editModel = this.getEditModel(),
				$template = jQuery( '#tmpl-qazana-' + editModel.get( 'widgetType' ) + '-content' );

			this._templateType = $template.length ? 'js' : 'remote';
		}

		return this._templateType;
	},

	getHTMLContent: function( html ) {
		var htmlCache = this.getEditModel().getHtmlCache();

		return htmlCache || html;
	},

	attachElContent: function( html ) {
		var self = this,
			htmlContent = self.getHTMLContent( html );

		_.defer( function() {
			qazanaFrontend.getElements( 'window' ).jQuery( self.el ).html( htmlContent );

			self.bindUIElements(); // Build again the UI elements since the content attached just now
		} );

		return this;
	},

	addInlineEditingAttributes: function( key, toolbar ) {
		this.addRenderAttribute( key, {
			'class': 'qazana-inline-editing',
			'data-qazana-setting-key': key
		} );

		if ( toolbar ) {
			this.addRenderAttribute( key, {
				'data-qazana-inline-editing-toolbar': toolbar
			} );
		}
	},

	getRepeaterSettingKey: function( settingKey, repeaterKey, repeaterItemIndex ) {
		return [ repeaterKey, repeaterItemIndex, settingKey ].join( '.' );
	},

	onModelBeforeRemoteRender: function() {
		this.$el.addClass( 'qazana-loading' );
	},

	onBeforeDestroy: function() {
		// Remove old style from the DOM.
		qazana.$previewContents.find( '#qazana-style-' + this.model.cid ).remove();
	},

	onModelRemoteRender: function() {
		if ( this.isDestroyed ) {
			return;
		}

		this.$el.removeClass( 'qazana-loading' );
		this.render();
    },
    
    alterClass : function ( self, removals, additions ) {
        
        if ( removals.indexOf( '*' ) === -1 ) {
            // Use native jQuery methods if there is no wildcard matching
            self.removeClass( removals );
            return !additions ? self : self.addClass( additions );
        }
    
        var patt = new RegExp( '\\s' + 
                removals.
                    replace( /\*/g, '[A-Za-z0-9-_]+' ).
                    split( ' ' ).
                    join( '\\s|\\s' ) + 
                '\\s', 'g' );
    
        self.each( function ( i, it ) {
            var cn = ' ' + it.className + ' ';
            while ( patt.test( cn ) ) {
                cn = cn.replace( patt, ' ' );
            }
            it.className = $.trim( cn );
        });
    
        return !additions ? self : self.addClass( additions );
    },

	onRender: function() {
        var self = this;

		BaseElementView.prototype.onRender.apply( self, arguments );

	    var editModel = self.getEditModel(),
            skinType = editModel.getSetting( '_skin' ) || 'default';
            
        self.alterClass( self.$el, editModel.get( 'widgetType' ) + '-*', editModel.get( 'widgetType' ) + '-skin-' + skinType  );
	},

	onClickEdit: function() {
		this.model.trigger( 'request:edit' );
	}
} );

module.exports = WidgetView;

},{"qazana-behaviors/inline-editing":76,"qazana-elements/views/base":74}],84:[function(require,module,exports){
var EditModeItemView;

EditModeItemView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-mode-switcher-content',

	id: 'qazana-mode-switcher-inner',

	ui: {
		previewButton: '#qazana-mode-switcher-preview-input',
		previewLabel: '#qazana-mode-switcher-preview',
		previewLabelA11y: '#qazana-mode-switcher-preview .qazana-screen-only'
	},

	events: {
		'change @ui.previewButton': 'onPreviewButtonChange'
	},

	initialize: function() {
		this.listenTo( qazana.channels.dataEditMode, 'switch', this.onEditModeChanged );
	},

	getCurrentMode: function() {
		return this.ui.previewButton.is( ':checked' ) ? 'preview' : 'edit';
	},

	setMode: function( mode ) {
		this.ui.previewButton
			.prop( 'checked', 'preview' === mode )
			.trigger( 'change' );
	},

	toggleMode: function() {
		this.setMode( this.ui.previewButton.prop( 'checked' ) ? 'edit' : 'preview' );
	},

	onRender: function() {
		this.onEditModeChanged();
	},

	onPreviewButtonChange: function() {
		qazana.changeEditMode( this.getCurrentMode() );
	},

	onEditModeChanged: function() {
		var activeMode = qazana.channels.dataEditMode.request( 'activeMode' ),
			title = qazana.translate( 'preview' === activeMode ? 'back_to_editor' : 'preview' );

		this.ui.previewLabel.attr( 'title', title );
		this.ui.previewLabelA11y.text( title );
	}
} );

module.exports = EditModeItemView;

},{}],85:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-navigator__elements--empty',

	className: 'qazana-empty-view',

	onRender: function() {
		this.$el.css( 'padding-' + ( qazana.config.is_rtl ? 'right' : 'left' ), this.getOption( 'indent' ) );
	}
} );

},{}],86:[function(require,module,exports){
module.exports = Marionette.CompositeView.extend( {
	template: '#tmpl-qazana-navigator__elements',

	childViewContainer: '.qazana-navigator__elements',

	ui: {
		item: '> .qazana-navigator__item',
		title: '> .qazana-navigator__item .qazana-navigator__element__title',
		toggle: '> .qazana-navigator__item > .qazana-navigator__element__toggle',
		toggleList: '> .qazana-navigator__item > .qazana-navigator__element__list-toggle',
		elements: '> .qazana-navigator__elements'
	},

	events: {
		'contextmenu': 'onContextMenu',
		'click @ui.item': 'onItemClick',
		'click @ui.toggle': 'onToggleClick',
		'click @ui.toggleList': 'onToggleListClick',
		'dblclick @ui.title': 'onTitleDoubleClick',
		'keydown @ui.title': 'onTitleKeyDown',
		'sortstart @ui.elements': 'onSortStart',
		'sortover @ui.elements': 'onSortOver',
		'sortout @ui.elements': 'onSortOut',
		'sortstop @ui.elements': 'onSortStop',
		'sortupdate @ui.elements': 'onSortUpdate',
		'sortreceive @ui.elements': 'onSortReceive'
	},

	getEmptyView: function() {
		if ( this.isRoot() ) {
			return require( 'qazana-layouts/navigator/root-empty' );
		}

		if ( this.hasChildren() ) {
			return require( 'qazana-layouts/navigator/element-empty' );
		}

		return null;
	},

	childViewOptions: function() {
		return {
			indent: this.getIndent() + 10
		};
	},

	className: function() {
		var classes = 'qazana-navigator__element',
			elType = this.model.get( 'elType' );

		if ( elType ) {
			classes += ' qazana-navigator__element-' + elType;
		}

		if ( this.hasChildren() ) {
			classes += ' qazana-navigator__element--has-children';
		}

		return classes;
	},

	attributes: function() {
		return {
			'data-model-cid': this.model.cid
		};
	},

	templateHelpers: function() {
		var helpers = {};

		if ( ! this.isRoot() ) {
			helpers.title = this.model.getTitle();

			helpers.icon = 'section' === this.model.get( 'elType' ) ? '' : this.model.getIcon();
		}

		return helpers;
	},

	initialize: function() {
		this.collection = this.model.get( 'elements' );

		this.listenTo( this.model, 'request:edit', this.onEditRequest )
			.listenTo( this.model, 'change', this.onModelChange );
	},

	getIndent: function() {
		return this.getOption( 'indent' ) || 0;
	},

	isRoot: function() {
		return ! this.model.get( 'elType' );
	},

	hasChildren: function() {
		return 'widget' !== this.model.get( 'elType' );
	},

	toggleList: function( state, callback ) {
		if ( ! this.hasChildren() || this.isRoot() ) {
			return;
		}

		var isActive = this.ui.item.hasClass( 'qazana-active' );

		if ( isActive === state ) {
			return;
		}

		this.ui.item.toggleClass( 'qazana-active', state );

		var slideMethod = 'slideToggle';

		if ( undefined !== state ) {
			slideMethod = 'slide' + ( state ? 'Down' : 'Up' );
		}

		this.ui.elements[ slideMethod ]( 300, callback );
	},

	toggleHiddenClass: function() {
		this.$el.toggleClass( 'qazana-navigator__element--hidden', !! this.model.get( 'hidden' ) );
	},

	recursiveChildInvoke: function() {
		var args = Array.prototype.slice.call( arguments ),
			method = args.slice( 0, 1 ),
			restArgs = args.slice( 1 );

		this[ method ].apply( this, restArgs );

		this.children.each( function( child ) {
			if ( ! ( child instanceof module.exports ) ) {
				return;
			}

			child.recursiveChildInvoke.apply( child, args );
		} );
	},

	recursiveParentInvoke: function() {
		var args = Array.prototype.slice.call( arguments ),
			method = args.slice( 0, 1 ),
			restArgs = args.slice( 1 );

		if ( ! ( this._parent instanceof module.exports ) ) {
			return;
		}

		this._parent[ method ].apply( this._parent, restArgs );

		this._parent.recursiveParentInvoke.apply( this._parent, args );
	},

	recursiveChildAgreement: function() {
		var args = Array.prototype.slice.call( arguments ),
			method = args.slice( 0, 1 ),
			restArgs = args.slice( 1 );

		if ( ! this[ method ].apply( this, restArgs ) ) {
			return false;
		}

		var hasAgreement = true;

		// Using jQuery loop to allow break
		jQuery.each( this.children._views, function() {
			if ( ! ( this instanceof module.exports ) ) {
				return;
			}

			if ( ! this.recursiveChildAgreement.apply( this, args ) ) {
				return hasAgreement = false;
			}
		} );

		return hasAgreement;
	},

	activateMouseInteraction: function() {
		this.$el.on( {
			mouseenter: this.onMouseEnter.bind( this ),
			mouseleave: this.onMouseLeave.bind( this )
		} );
	},

	deactivateMouseInteraction: function() {
		this.$el.off( 'mouseenter mouseleave' );
	},

	dragShouldBeIgnored: function( draggedModel ) {
		var childTypes = qazana.helpers.getElementChildType( this.model.get( 'elType' ) ),
			draggedElType = draggedModel.get( 'elType' );

		if ( 'section' === draggedElType && ! draggedModel.get( 'isInner' ) ) {
			return true;
		}

		return ! childTypes || -1 === childTypes.indexOf( draggedModel.get( 'elType' ) );
	},

	addEditingClass: function() {
		this.ui.item.addClass( 'qazana-editing' );
	},

	removeEditingClass: function() {
		this.ui.item.removeClass( 'qazana-editing' );
	},

	enterTitleEditing: function() {
		this.ui.title.attr( 'contenteditable', true ).focus();

		qazana.addBackgroundClickListener( 'navigator', {
			ignore: this.ui.title,
			callback: this.exitTitleEditing.bind( this )
		} );
	},

	exitTitleEditing: function() {
		this.ui.title.attr( 'contenteditable', false );

		var newTitle = this.ui.title.text().trim(),
			settings = this.model.get( 'settings' );

		if ( newTitle ) {
			settings.set( '_title', newTitle, { silent: true } );
		} else {
			settings.unset( '_title', { silent: true } );

			this.ui.title.text( this.model.getDefaultTitle() );
		}

		qazana.saver.setFlagEditorChange( true );

		qazana.removeBackgroundClickListener( 'navigator' );
	},

	onRender: function() {
		var self = this;

		self.ui.elements.sortable( {
			items: '> .qazana-navigator__element',
			placeholder: 'ui-sortable-placeholder',
			axis: 'y',
			forcePlaceholderSize: true,
			connectWith: '.qazana-navigator__element-' + self.model.get( 'elType' ) + ' ' + self.ui.elements.selector,
			cancel: '[contenteditable="true"]'
		} );

		this.ui.item.css( 'padding-' + ( qazana.config.is_rtl ? 'right' : 'left' ), this.getIndent() );

		this.toggleHiddenClass();
	},

	onModelChange: function() {
		if ( undefined !== this.model.changed.hidden ) {
			this.toggleHiddenClass();
		}
	},

	onItemClick: function() {
		this.model.trigger( 'request:edit' );
	},

	onToggleClick: function( event ) {
		event.stopPropagation();

		this.model.trigger( 'request:toggleVisibility' );
	},

	onTitleDoubleClick: function() {
		this.enterTitleEditing();
	},

	onTitleKeyDown: function( event ) {
		var ENTER_KEY = 13;

		if ( ENTER_KEY === event.which ) {
			event.preventDefault();

			this.exitTitleEditing();
		}
	},

	onToggleListClick: function( event ) {
		event.stopPropagation();

		this.toggleList();
	},

	onSortStart: function( event, ui ) {
		this.model.trigger( 'request:sort:start', event, ui );

		qazana.navigator.getLayout().activateElementsMouseInteraction();
	},

	onSortStop: function() {
		qazana.navigator.getLayout().deactivateElementsMouseInteraction();
	},

	onSortOver: function( event ) {
		event.stopPropagation();

		this.$el.addClass( 'qazana-dragging-on-child' );
	},

	onSortOut: function( event ) {
		event.stopPropagation();

		this.$el.removeClass( 'qazana-dragging-on-child' );
	},

	onSortUpdate: function( event, ui ) {
		event.stopPropagation();

		if ( ! this.el.contains( ui.item[0] ) ) {
			return;
		}

		this.model.trigger( 'request:sort:update', ui );
	},

	onSortReceive: function( event, ui ) {
		this.model.trigger( 'request:sort:receive', event, ui );
	},

	onMouseEnter: function( event ) {
		event.stopPropagation();

		var self = this;

		var dragShouldBeIgnored = this.recursiveChildAgreement( 'dragShouldBeIgnored', qazana.channels.data.request( 'dragging:model' ) );

		if ( dragShouldBeIgnored ) {
			return;
		}

		self.autoExpandTimeout = setTimeout( function() {
			self.toggleList( true, function() {
				self.ui.elements.sortable( 'refreshPositions' );
			} );
		}, 500 );
	},

	onMouseLeave: function( event ) {
		event.stopPropagation();

		clearTimeout( this.autoExpandTimeout );
	},

	onContextMenu: function( event ) {
		this.model.trigger( 'request:contextmenu', event );
	},

	onEditRequest: function() {
		this.recursiveParentInvoke( 'toggleList', true );

		qazana.navigator.getLayout().elements.currentView.recursiveChildInvoke( 'removeEditingClass' );

		this.addEditingClass();

		qazana.helpers.scrollToView( this.$el, 400, qazana.navigator.getLayout().elements.$el );
	}
} );

},{"qazana-layouts/navigator/element-empty":85,"qazana-layouts/navigator/root-empty":89}],87:[function(require,module,exports){
module.exports = Marionette.LayoutView.extend( {
	template: '#tmpl-qazana-navigator',

	id: 'qazana-navigator__inner',

	ui: {
		toggleAll: '#qazana-navigator__toggle-all',
		close: '#qazana-navigator__close'
	},

	events: {
		'click @ui.toggleAll': 'toggleAll',
		'click @ui.close': 'onCloseClick'
	},

	regions: {
		elements: '#qazana-navigator__elements'
	},

	toggleAll: function() {
		var state = 'expand' === this.ui.toggleAll.data( 'qazana-action' ),
			classes = [ 'eicon-collapse', 'eicon-expand' ];

		this.ui.toggleAll
			.data( 'qazana-action', state ? 'collapse' : 'expand' )
			.removeClass( classes[ +state ] )
			.addClass( classes[ +! state ] );

		this.elements.currentView.recursiveChildInvoke( 'toggleList', state );
	},

	activateElementsMouseInteraction: function() {
		this.elements.currentView.recursiveChildInvoke( 'activateMouseInteraction' );
	},

	deactivateElementsMouseInteraction: function() {
		this.elements.currentView.recursiveChildInvoke( 'deactivateMouseInteraction' );
	},

	onShow: function() {
		var ElementsView = require( 'qazana-layouts/navigator/element' );

		this.elements.show( new ElementsView( {
			model: qazana.elementsModel
		} ) );
	},

	onCloseClick: function() {
		qazana.navigator.close();
	}
} );

},{"qazana-layouts/navigator/element":86}],88:[function(require,module,exports){
module.exports = Marionette.Region.extend( {
	el: '#qazana-navigator',

	isDocked: false,

	isDraggingNeedsStop: false,

	opened: false,

	storage: {
		visible: true,
		size: {
			width: '',
			height: '',
			top: '',
			bottom: '',
			right: '',
			left: ''
		},
		dockedSize: {
			width: 250
		}
	},

	constructor: function() {
		Marionette.Region.prototype.constructor.apply( this, arguments );

		this.ensurePosition = this.ensurePosition.bind( this );

		var savedStorage = qazana.getStorage( 'navigator' );

		if ( savedStorage ) {
			this.storage = savedStorage;
		}

		if ( this.storage.visible ) {
			this.open();
		}
	},

	getLayout: function() {
		return this.currentView;
	},

	getDraggableOptions: function() {
		return {
			iframeFix: true,
			handle: '#qazana-navigator__header',
			snap: 'body',
			snapMode: 'inner',
			drag: this.onDrag.bind( this ),
			stop: this.onDragStop.bind( this )
		};
	},

	getResizableOptions: function() {
		var self = this;

		return {
			handles: 'all',
			containment: 'document',
			minWidth: 150,
			maxWidth: 500,
			minHeight: 210,
			start: function() {
				qazana.$previewWrapper.addClass( 'ui-resizable-resizing' );
			},
			stop: function() {
				qazana.$previewWrapper.removeClass( 'ui-resizable-resizing' );

				if ( self.isDocked ) {
					self.saveDockedSize();
				} else {
					self.saveSize();
				}
			}
		};
	},

	beforeFirstOpen: function() {
		var NavigatorLayoutView = require( 'qazana-layouts/navigator/layout' );

		this.show( new NavigatorLayoutView() );

		this.$el.draggable( this.getDraggableOptions() );

		this.$el.resizable( this.getResizableOptions() );
	},

	open: function( model ) {
		if ( ! this.opened ) {
			this.beforeFirstOpen();

			this.opened = true;
		}

		this.$el.show();

		if ( this.storage.docked ) {
			this.dock();
		} else {
			this.setSize();
		}

		if ( model ) {
			model.trigger( 'request:edit' );
		}

		this.saveStorage( 'visible', true );

		this.ensurePosition();

		qazana.$window.on( 'resize', this.ensurePosition );
	},

	close: function() {
		this.$el.hide();

		if ( this.isDocked ) {
			this.undock( true );
		}

		this.saveStorage( 'visible', false );

		qazana.$window.off( 'resize', this.ensurePosition );
	},

	isSnapping: function() {
		var draggableInstance = this.$el.draggable( 'instance' ),
			snapElements = draggableInstance.snapElements;

		return snapElements.some( function( element ) {
			return element.snapping;
		} );
	},

	dock: function() {
		qazana.$body.addClass( 'qazana-navigator-docked' );

		var side = qazana.config.is_rtl ? 'left' : 'right',
			dockedWidth = this.storage.dockedSize.width,
			resizableOptions = this.getResizableOptions();

		this.$el.css( {
			width: dockedWidth,
			height: '',
			top: '',
			bottom: '',
			left: '',
			right: ''
		} );

		qazana.$previewWrapper.css( side, dockedWidth );

		this.$el.resizable( 'destroy' );

		resizableOptions.handles = qazana.config.is_rtl ? 'e' : 'w';

		resizableOptions.resize = function( event, ui ) {
			qazana.$previewWrapper.css( side, ui.size.width );
		};

		this.$el.resizable( resizableOptions );

		this.isDocked = true;

		this.saveStorage( 'docked', true );
	},

	undock: function( silent ) {
		qazana.$body.removeClass( 'qazana-navigator-docked' );

		qazana.$previewWrapper.css( qazana.config.is_rtl ? 'left' : 'right', '' );

		this.setSize();

		this.$el.resizable( 'destroy' );

		this.$el.resizable( this.getResizableOptions() );

		this.isDocked = false;

		if ( ! silent ) {
			this.saveStorage( 'docked', false );
		}
	},

	saveStorage: function( key, value ) {
		this.storage[ key ] = value;

		qazana.setStorage( 'navigator', this.storage );
	},

	saveSize: function() {
		this.saveStorage( 'size', qazana.helpers.getElementInlineStyle( this.$el, [ 'width', 'height', 'top', 'bottom', 'right', 'left' ] ) );
	},

	saveDockedSize: function() {
		this.saveStorage( 'dockedSize', qazana.helpers.getElementInlineStyle( this.$el, [ 'width' ] ) );
	},

	setSize: function() {
		if ( this.storage.size ) {
			this.$el.css( this.storage.size );
		}
	},

	ensurePosition: function() {
		if ( this.isDocked ) {
			return;
		}

		var offset = this.$el.offset();

		if ( offset.left > innerWidth ) {
			this.$el.css({
				left: '',
				right: ''
			} );
		}

		if ( offset.top > innerHeight ) {
			this.$el.css( {
				top: '',
				bottom: ''
			} );
		}
	},

	onDrag: function( event, ui ) {
		if ( this.isDraggingNeedsStop ) {
			return false;
		}

		if ( this.isDocked ) {
			if ( ui.position.left === ui.originalPosition.left ) {
				if ( ui.position.top !== ui.originalPosition.top ) {
					return false;
				}
			} else {
				this.undock();
			}

			return;
		}

		if ( this.isSnapping() ) {
			var elementRight = ui.position.left + this.$el.outerWidth();

			if ( elementRight >= innerWidth ) {
				this.dock();

				this.isDraggingNeedsStop = true;

				return false;
			}
		}
	},

	onDragStop: function() {
		this.isDraggingNeedsStop = false;

		if ( ! this.isDocked ) {
			this.saveSize();
		}
	}
} );

},{"qazana-layouts/navigator/layout":87}],89:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-navigator__root--empty',

	className: 'qazana-nerd-box'
} );

},{}],90:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-footer-content',

	tagName: 'nav',

	id: 'qazana-panel-footer-tools',

	possibleRotateModes: [ 'portrait', 'landscape' ],

	ui: {
		menuButtons: '.qazana-panel-footer-tool',
		settings: '#qazana-panel-footer-settings',
		deviceModeIcon: '#qazana-panel-footer-responsive > i',
		deviceModeButtons: '#qazana-panel-footer-responsive .qazana-panel-footer-sub-menu-item',
		saveTemplate: '#qazana-panel-saver-menu-save-template',
		history: '#qazana-panel-footer-history'
	},

	events: {
		'click @ui.settings': 'onClickSettings',
		'click @ui.deviceModeButtons': 'onClickResponsiveButtons',
		'click @ui.saveTemplate': 'onClickSaveTemplate',
		'click @ui.history': 'onClickHistory'
	},

	behaviors: function() {
		var behaviors = {
			saver: {
				behaviorClass: qazana.modules.components.saver.behaviors.FooterSaver
			}
		};

		return qazana.hooks.applyFilters( 'panel/footer/behaviors', behaviors, this );
	},

	initialize: function() {
		this.listenTo( qazana.channels.deviceMode, 'change', this.onDeviceModeChange );
	},

	getDeviceModeButton: function( deviceMode ) {
		return this.ui.deviceModeButtons.filter( '[data-device-mode="' + deviceMode + '"]' );
	},

	onPanelClick: function( event ) {
		var $target = jQuery( event.target ),
			isClickInsideOfTool = $target.closest( '.qazana-panel-footer-sub-menu-wrapper' ).length;

		if ( isClickInsideOfTool ) {
			return;
		}

		var $tool = $target.closest( '.qazana-panel-footer-tool' ),
			isClosedTool = $tool.length && ! $tool.hasClass( 'qazana-open' );

		this.ui.menuButtons.filter( ':not(.qazana-leave-open)' ).removeClass( 'qazana-open' );

		if ( isClosedTool ) {
			$tool.addClass( 'qazana-open' );
		}
	},

	onClickSettings: function() {
		var self = this;

		if ( 'page_settings' !== qazana.getPanelView().getCurrentPageName() ) {
			qazana.getPanelView().setPage( 'page_settings' );

			qazana.getPanelView().getCurrentPageView().once( 'destroy', function() {
				self.ui.settings.removeClass( 'qazana-open' );
			} );
		}
	},

	onDeviceModeChange: function() {
		var previousDeviceMode = qazana.channels.deviceMode.request( 'previousMode' ),
			currentDeviceMode = qazana.channels.deviceMode.request( 'currentMode' );

		this.getDeviceModeButton( previousDeviceMode ).removeClass( 'active' );

		this.getDeviceModeButton( currentDeviceMode ).addClass( 'active' );

		// Change the footer icon
		this.ui.deviceModeIcon.removeClass( 'eicon-device-' + previousDeviceMode ).addClass( 'eicon-device-' + currentDeviceMode );
	},

	onClickResponsiveButtons: function( event ) {
		var $clickedButton = this.$( event.currentTarget ),
			newDeviceMode = $clickedButton.data( 'device-mode' );

		qazana.changeDeviceMode( newDeviceMode );
	},

	onClickSaveTemplate: function() {
		qazana.templates.startModal( {
			onReady: function() {
				qazana.templates.getLayout().showSaveTemplateView();
			}
		} );
	},

	onClickHistory: function() {
		if ( 'historyPage' !== qazana.getPanelView().getCurrentPageName() ) {
			qazana.getPanelView().setPage( 'historyPage' );
		}
	},

	onRender: function() {
		var self = this;

		_.defer( function() {
			qazana.getPanelView().$el.on( 'click', self.onPanelClick.bind( self ) );
		} );
	}
} );

},{}],91:[function(require,module,exports){
var PanelHeaderItemView;

PanelHeaderItemView = Marionette.ItemView.extend({
    template: '#tmpl-qazana-panel-header-content',

    id: 'qazana-panel-header',

    ui: {
        menuButton: '#qazana-panel-header-menu-button',
        menuButtons: '.qazana-panel-header-tool',
        menuIcon: '#qazana-panel-header-menu-button i',
        title: '#qazana-panel-header-title',
        addButton: '#qazana-panel-header-add-button',
        saveTemplate: '#qazana-panel-header-saver-button-save-template'
    },

    events: {
        'click @ui.addButton': 'onClickAdd',
        'click @ui.menuButton': 'onClickMenu',
        'click @ui.saveTemplate': 'onClickSaveTemplate',
    },

    behaviors: function () {
        var behaviors = {
            saver: {
                behaviorClass: qazana.modules.components.saver.behaviors.HeaderSaver
            }
        };

        return qazana.hooks.applyFilters('panel/header/behaviors', behaviors, this);
    },

    onPanelClick: function (event) {
        var $target = jQuery(event.target),
            isClickInsideOfTool = $target.closest('.qazana-panel-header-sub-menu-wrapper').length;

        if (isClickInsideOfTool) {
            return;
        }

        var $tool = $target.closest('.qazana-panel-header-tool'),
            isClosedTool = $tool.length && !$tool.hasClass('qazana-open');

        this.ui.menuButtons.filter(':not(.qazana-leave-open)').removeClass('qazana-open');

        if (isClosedTool) {
            $tool.addClass('qazana-open');
        }
    },

    onClickSettings: function () {
        var self = this;

        if ('page_settings' !== qazana.getPanelView().getCurrentPageName()) {
            qazana.getPanelView().setPage('page_settings');

            qazana.getPanelView().getCurrentPageView().once('destroy', function () {
                self.ui.settings.removeClass('qazana-open');
            });
        }
    },

    setTitle: function (title) {
        this.ui.title.html(title);
    },

    onClickAdd: function () {
        qazana.getPanelView().setPage('elements');
    },

    onClickSaveTemplate: function () {
        qazana.templates.startModal({
            onReady: function () {
                qazana.templates.getLayout().showSaveTemplateView();
            }
        });
    },

    onClickMenu: function () {
        var panel = qazana.getPanelView(),
            currentPanelPageName = panel.getCurrentPageName(),
            nextPage = 'menu' === currentPanelPageName ? 'elements' : 'menu';

        if ('menu' === nextPage) {
            var arrowClass = 'eicon-arrow-' + (qazana.config.is_rtl ? 'right' : 'left');

            this.ui.menuIcon.removeClass('eicon-menu-bar').addClass(arrowClass);
        }

        panel.setPage(nextPage);
    },

    onRender: function () {
        var self = this;

        _.defer(function () {
            qazana.getPanelView().$el.on('click', self.onPanelClick.bind(self));
        });
    }
});

module.exports = PanelHeaderItemView;
},{}],92:[function(require,module,exports){
var EditModeItemView = require( 'qazana-layouts/edit-mode' ),
	PanelLayoutView;

PanelLayoutView = Marionette.LayoutView.extend( {
	template: '#tmpl-qazana-panel',

	id: 'qazana-panel-inner',

	regions: {
		content: '#qazana-panel-content-wrapper',
		header: '#qazana-panel-header-wrapper',
		footer: '#qazana-panel-footer',
		modeSwitcher: '#qazana-mode-switcher'
	},

	pages: {},

	childEvents: {
		'click:add': function() {
			this.setPage( 'elements' );
		},
		'editor:destroy': function() {
			this.setPage( 'elements', null, { autoFocusSearch: false } );
		}
	},

	currentPageName: null,

	currentPageView: null,

	_isScrollbarInitialized: false,

	initialize: function() {
		this.initPages();
	},

	buildPages: function() {
		var pages = {
			elements: {
				view: require( 'qazana-panel/pages/elements/elements' ),
				title: '<img src="' + qazana.config.assets_url + 'images/logo-panel.svg">'
			},
			editor: {
				view: require( 'qazana-panel/pages/editor' )
			},
			menu: {
				view: qazana.modules.layouts.panel.pages.menu.Menu,
				title: '<img src="' + qazana.config.assets_url + 'images/logo-panel.svg">'
			},
			colorScheme: {
				view: require( 'qazana-panel/pages/schemes/colors' )
			},
			typographyScheme: {
				view: require( 'qazana-panel/pages/schemes/typography' )
			},
			colorPickerScheme: {
				view: require( 'qazana-panel/pages/schemes/color-picker' )
			}
		};

		var schemesTypes = Object.keys( qazana.schemes.getSchemes() ),
			disabledSchemes = _.difference( schemesTypes, qazana.schemes.getEnabledSchemesTypes() );

		_.each( disabledSchemes, function( schemeType ) {
			var scheme  = qazana.schemes.getScheme( schemeType );

			pages[ schemeType + 'Scheme' ].view = require( 'qazana-panel/pages/schemes/disabled' ).extend( {
				disabledTitle: scheme.disabled_title
			} );
		} );

		return pages;
	},

	initPages: function() {
		var pages;

		this.getPages = function( page ) {
			if ( ! pages ) {
				pages = this.buildPages();
			}

			return page ? pages[ page ] : pages;
		};

		this.addPage = function( pageName, pageData ) {
			if ( ! pages ) {
				pages = this.buildPages();
			}

			pages[ pageName ] = pageData;
		};
	},

	getHeaderView: function() {
		return this.getChildView( 'header' );
	},

	getFooterView: function() {
		return this.getChildView( 'footer' );
	},

	getCurrentPageName: function() {
		return this.currentPageName;
	},

	getCurrentPageView: function() {
		return this.currentPageView;
	},

	setPage: function( page, title, viewOptions ) {
		if ( 'elements' === page && ! qazana.userCan( 'design' ) ) {
			var pages = this.getPages();
			if ( pages.hasOwnProperty( 'page_settings' ) ) {
				page = 'page_settings';
			}
		}
		var pageData = this.getPages( page );

		if ( ! pageData ) {
			throw new ReferenceError( 'Qazana panel doesn\'t have page named \'' + page + '\'' );
		}

		if ( pageData.options ) {
			viewOptions = _.extend( pageData.options, viewOptions );
		}

		var View = pageData.view;

		if ( pageData.getView ) {
			View = pageData.getView();
		}

		this.currentPageName = page;

		this.currentPageView = new View( viewOptions );

		this.showChildView( 'content', this.currentPageView );

		this.getHeaderView().setTitle( title || pageData.title );

		this
			.trigger( 'set:page', this.currentPageView )
			.trigger( 'set:page:' + page, this.currentPageView );
	},

	openEditor: function( model, view ) {
		var currentPageName = this.getCurrentPageName();

		if ( 'editor' === currentPageName ) {
			var currentPageView = this.getCurrentPageView(),
				currentEditableModel = currentPageView.model;

			if ( currentEditableModel === model ) {
				return;
			}
		}

		var elementData = qazana.getElementData( model );

		this.setPage( 'editor', qazana.translate( 'edit_element', [ elementData.title ] ), {
			model: model,
			controls: qazana.getElementControls( model ),
			editedElementView: view
		} );

		var action = 'panel/open_editor/' + model.get( 'elType' );

		// Example: panel/open_editor/widget
		qazana.hooks.doAction( action, this, model, view );

		// Example: panel/open_editor/widget/heading
		qazana.hooks.doAction( action + '/' + model.get( 'widgetType' ), this, model, view );
	},

	onBeforeShow: function() {
		var PanelFooterItemView = require( 'qazana-layouts/panel/footer' ),
			PanelHeaderItemView = require( 'qazana-layouts/panel/header' );

		// Edit Mode
		this.showChildView( 'modeSwitcher', new EditModeItemView() );

		// Header
		this.showChildView( 'header', new PanelHeaderItemView() );

		// Footer
		this.showChildView( 'footer', new PanelFooterItemView() );

		// Added Editor events
		this.updateScrollbar = _.throttle( this.updateScrollbar, 100 );

		this.getRegion( 'content' )
			.on( 'before:show', this.onEditorBeforeShow.bind( this ) )
			.on( 'empty', this.onEditorEmpty.bind( this ) )
			.on( 'show', this.updateScrollbar.bind( this ) );

		// Set default page to elements
		this.setPage( 'elements' );
	},

	onEditorBeforeShow: function() {
		_.defer( this.updateScrollbar.bind( this ) );
	},

	onEditorEmpty: function() {
		this.updateScrollbar();
	},

	updateScrollbar: function() {
		var $panel = this.content.$el;

		if ( ! this._isScrollbarInitialized ) {
			$panel.perfectScrollbar();
			this._isScrollbarInitialized = true;

			return;
		}

		$panel.perfectScrollbar( 'update' );
	}
} );

module.exports = PanelLayoutView;

},{"qazana-layouts/edit-mode":84,"qazana-layouts/panel/footer":90,"qazana-layouts/panel/header":91,"qazana-panel/pages/editor":93,"qazana-panel/pages/elements/elements":96,"qazana-panel/pages/schemes/color-picker":108,"qazana-panel/pages/schemes/colors":109,"qazana-panel/pages/schemes/disabled":110,"qazana-panel/pages/schemes/typography":114}],93:[function(require,module,exports){
var ControlsStack = require( 'qazana-views/controls-stack' ),
	EditorView;

EditorView = ControlsStack.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-editor-content' ),

	id: 'qazana-panel-page-editor',

	childViewContainer: '#qazana-controls',

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model.get( 'settings' ),
			elementEditSettings: this.model.get( 'editSettings' )
		};
	},

	openActiveSection: function() {
		ControlsStack.prototype.openActiveSection.apply( this, arguments );

		qazana.channels.editor.trigger( 'section:activated', this.activeSection, this );
	},

	isVisibleSectionControl: function( sectionControlModel ) {
		return ControlsStack.prototype.isVisibleSectionControl.apply( this, arguments ) && qazana.helpers.isActiveControl( sectionControlModel, this.model.get( 'settings' ).attributes );
	},

	scrollToEditedElement: function() {
		qazana.helpers.scrollToView( this.getOption( 'editedElementView' ).$el );
	},

	getControlView: function( name ) {
		return this.children.findByModelCid( this.getControlModel( name ).cid );
	},

	getControlModel: function( name ) {
		return this.collection.findWhere( { name: name } );
	},

	onDestroy: function() {
		var editedElementView = this.getOption( 'editedElementView' );

		if ( editedElementView ) {
			editedElementView.$el.removeClass( 'qazana-element-editable' );
		}

		this.model.trigger( 'editor:close' );

		this.triggerMethod( 'editor:destroy' );
	},

	onRender: function() {
		var editedElementView = this.getOption( 'editedElementView' );

		if ( editedElementView ) {
			editedElementView.$el.addClass( 'qazana-element-editable' );
		}
	},

	onDeviceModeChange: function() {
		ControlsStack.prototype.onDeviceModeChange.apply( this, arguments );

		this.scrollToEditedElement();
	},

	onChildviewSettingsChange: function( childView ) {
		var editedElementView = this.getOption( 'editedElementView' ),
			editedElementType = editedElementView.model.get( 'elType' );

		if ( 'widget' === editedElementType ) {
			editedElementType = editedElementView.model.get( 'widgetType' );
		}

		qazana.channels.editor
			.trigger( 'change', childView, editedElementView )
			.trigger( 'change:' + editedElementType, childView, editedElementView )
			.trigger( 'change:' + editedElementType + ':' + childView.model.get( 'name' ), childView, editedElementView );
	}
} );

module.exports = EditorView;

},{"qazana-views/controls-stack":135}],94:[function(require,module,exports){
var PanelElementsCategory = require( '../models/element' ),
	PanelElementsCategoriesCollection;

PanelElementsCategoriesCollection = Backbone.Collection.extend( {
	model: PanelElementsCategory
} );

module.exports = PanelElementsCategoriesCollection;

},{"../models/element":97}],95:[function(require,module,exports){
var PanelElementsElementModel = require( '../models/element' ),
	PanelElementsElementsCollection;

PanelElementsElementsCollection = Backbone.Collection.extend( {
	model: PanelElementsElementModel/*,
	comparator: 'title'*/
} );

module.exports = PanelElementsElementsCollection;

},{"../models/element":97}],96:[function(require,module,exports){
var PanelElementsCategoriesCollection = require( './collections/categories' ),
	PanelElementsElementsCollection = require( './collections/elements' ),
	PanelElementsCategoriesView = require( './views/categories' ),
	PanelElementsElementsView = qazana.modules.layouts.panel.pages.elements.views.Elements,
	PanelElementsSearchView = require( './views/search' ),
	PanelElementsGlobalView = require( './views/global' ),
	PanelElementsLayoutView;

PanelElementsLayoutView = Marionette.LayoutView.extend( {
	template: '#tmpl-qazana-panel-elements',

	options: {
		autoFocusSearch: true
	},

	regions: {
		elements: '#qazana-panel-elements-wrapper',
		search: '#qazana-panel-elements-search-area'
	},

	ui: {
		tabs: '.qazana-panel-navigation-tab'
	},

	events: {
		'click @ui.tabs': 'onTabClick'
	},

	regionViews: {},

	elementsCollection: null,

	categoriesCollection: null,

	initialize: function() {
		this.listenTo( qazana.channels.panelElements, 'element:selected', this.destroy );

		this.initElementsCollection();

		this.initCategoriesCollection();

		this.initRegionViews();
	},

	initRegionViews: function() {
		var regionViews = {
			elements: {
				region: this.elements,
				view: PanelElementsElementsView,
				options: { collection: this.elementsCollection }
			},
			categories: {
				region: this.elements,
				view: PanelElementsCategoriesView,
				options: { collection: this.categoriesCollection }
			},
			search: {
				region: this.search,
				view: PanelElementsSearchView
			},
			global: {
				region: this.elements,
				view: PanelElementsGlobalView
			}
		};

		this.regionViews = qazana.hooks.applyFilters( 'panel/elements/regionViews', regionViews );
	},

	initElementsCollection: function() {
		var elementsCollection = new PanelElementsElementsCollection(),
			sectionConfig = qazana.config.elements.section;

		elementsCollection.add( {
			title: qazana.translate( 'inner_section' ),
			elType: 'section',
			categories: [ 'basic' ],
			icon: sectionConfig.icon
		} );

		// TODO: Change the array from server syntax, and no need each loop for initialize
		_.each( qazana.config.widgets, function( widget ) {
			if ( ! widget.show_in_panel ) {
				return;
			}

			elementsCollection.add( {
				title: widget.title,
				elType: widget.elType,
				categories: widget.categories,
				keywords: widget.keywords,
				icon: widget.icon,
				widgetType: widget.widget_type,
				custom: widget.custom
			} );
		} );

		this.elementsCollection = elementsCollection;
	},

	initCategoriesCollection: function() {
		var categories = {};

		this.elementsCollection.each( function( element ) {
			_.each( element.get( 'categories' ), function( category ) {
				if ( ! categories[ category ] ) {
					categories[ category ] = [];
				}

				categories[ category ].push( element );
			} );
		} );

		var categoriesCollection = new PanelElementsCategoriesCollection();

		_.each( qazana.config.document.panel.elements_categories, function( categoryConfig, categoryName ) {
			if ( ! categories[ categoryName ] ) {
				return;
			}

			// Set defaults.
			if ( 'undefined' === typeof categoryConfig.active ) {
				categoryConfig.active = true;
			}

			if ( 'undefined' === typeof categoryConfig.icon ) {
				categoryConfig.icon = 'font';
			}

			categoriesCollection.add( {
				name: categoryName,
				title: categoryConfig.title,
				icon: categoryConfig.icon,
				defaultActive: categoryConfig.active,
				items: categories[ categoryName ]
			} );
		} );

		this.categoriesCollection = categoriesCollection;
	},

	activateTab: function( tabName ) {
		this.ui.tabs
			.removeClass( 'qazana-active' )
			.filter( '[data-view="' + tabName + '"]' )
			.addClass( 'qazana-active' );

		this.showView( tabName );
	},

	showView: function( viewName ) {
		var viewDetails = this.regionViews[ viewName ],
			options = viewDetails.options || {};

		viewDetails.region.show( new viewDetails.view( options ) );
	},

	clearSearchInput: function() {
		this.getChildView( 'search' ).clearInput();
	},

	changeFilter: function( filterValue ) {
		qazana.channels.panelElements
			.reply( 'filter:value', filterValue )
			.trigger( 'filter:change' );
	},

	clearFilters: function() {
		this.changeFilter( null );
		this.clearSearchInput();
	},

	focusSearch: function() {
		this.search.currentView.ui.input.focus();
	},

	onChildviewChildrenRender: function() {
		qazana.getPanelView().updateScrollbar();
	},

	onChildviewSearchChangeInput: function( child ) {
		this.changeFilter( child.ui.input.val(), 'search' );
	},

	onDestroy: function() {
		qazana.channels.panelElements.reply( 'filter:value', null );
	},

	onShow: function() {
		this.showView( 'categories' );

		this.showView( 'search' );

		if ( this.options.autoFocusSearch ) {
			setTimeout( this.focusSearch.bind( this ) );
		}
	},

	onTabClick: function( event ) {
		this.activateTab( event.currentTarget.dataset.view );
	}
} );

module.exports = PanelElementsLayoutView;

},{"./collections/categories":94,"./collections/elements":95,"./views/categories":98,"./views/global":102,"./views/search":103}],97:[function(require,module,exports){
var PanelElementsElementModel;

PanelElementsElementModel = Backbone.Model.extend( {
	defaults: {
		title: '',
		categories: [],
		keywords: [],
		icon: '',
		elType: 'widget',
		widgetType: ''
	}
} );

module.exports = PanelElementsElementModel;

},{}],98:[function(require,module,exports){
var PanelElementsCategoryView = require( './category' ),
	PanelElementsCategoriesView;

PanelElementsCategoriesView = Marionette.CompositeView.extend( {
	template: '#tmpl-qazana-panel-categories',

	childView: PanelElementsCategoryView,

	childViewContainer: '#qazana-panel-categories',

	id: 'qazana-panel-elements-categories',

	initialize: function() {
		this.listenTo( qazana.channels.panelElements, 'filter:change', this.onPanelElementsFilterChange );
	},

	onPanelElementsFilterChange: function() {
		if ( qazana.channels.panelElements.request( 'filter:value' ) ) {
			qazana.getPanelView().getCurrentPageView().showView( 'elements' );
		}
	}
} );

module.exports = PanelElementsCategoriesView;

},{"./category":99}],99:[function(require,module,exports){
var PanelElementsElementsCollection = require( '../collections/elements' ),
	PanelElementsCategoryView;

PanelElementsCategoryView = Marionette.CompositeView.extend( {
	template: '#tmpl-qazana-panel-elements-category',

	className: 'qazana-panel-category',

	ui: {
		title: '.qazana-panel-category-title',
		items: '.qazana-panel-category-items'
	},

	events: {
		'click @ui.title': 'onTitleClick'
	},

	id: function() {
		return 'qazana-panel-category-' + this.model.get( 'name' );
	},

	childView: require( 'qazana-panel/pages/elements/views/element' ),

	childViewContainer: '.qazana-panel-category-items',

	initialize: function() {
		this.collection = new PanelElementsElementsCollection( this.model.get( 'items' ) );
	},

	onRender: function() {
		var isActive = qazana.channels.panelElements.request( 'category:' + this.model.get( 'name' ) + ':active' );

		if ( undefined === isActive ) {
			isActive = this.model.get( 'defaultActive' );
		}

		if ( isActive ) {
			this.$el.addClass( 'qazana-active' );

			this.ui.items.show();
		}
	},

	onTitleClick: function() {
		var $items = this.ui.items,
			activeClass = 'qazana-active',
			isActive = this.$el.hasClass( activeClass ),
			slideFn = isActive ? 'slideUp' : 'slideDown';

		qazana.channels.panelElements.reply( 'category:' + this.model.get( 'name' ) + ':active', ! isActive );

		this.$el.toggleClass( activeClass, ! isActive );

		$items[ slideFn ]( 300, function() {
			qazana.getPanelView().updateScrollbar();
		} );
	}
} );

module.exports = PanelElementsCategoryView;

},{"../collections/elements":95,"qazana-panel/pages/elements/views/element":100}],100:[function(require,module,exports){
var PanelElementsElementView;

PanelElementsElementView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-element-library-element',

	className: 'qazana-element-wrapper',

	onRender: function() {
		var self = this;
		if ( ! qazana.userCan( 'design' ) ) {
			return;
		}

		this.$el.html5Draggable( {

			onDragStart: function() {
				qazana.channels.panelElements
					.reply( 'element:selected', self )
					.trigger( 'element:drag:start' );
			},

			onDragEnd: function() {
				qazana.channels.panelElements.trigger( 'element:drag:end' );
			},

			groups: [ 'qazana-element' ]
		} );
	}
} );

module.exports = PanelElementsElementView;

},{}],101:[function(require,module,exports){
var PanelElementsElementsView;

PanelElementsElementsView = Marionette.CollectionView.extend( {
	childView: require( 'qazana-panel/pages/elements/views/element' ),

	id: 'qazana-panel-elements',

	initialize: function() {
		this.listenTo( qazana.channels.panelElements, 'filter:change', this.onFilterChanged );
	},

	filter: function( childModel ) {
		var filterValue = qazana.channels.panelElements.request( 'filter:value' );

		if ( ! filterValue ) {
			return true;
		}

		if ( -1 !== childModel.get( 'title' ).toLowerCase().indexOf( filterValue.toLowerCase() ) ) {
			return true;
		}

		return _.any( childModel.get( 'keywords' ), function( keyword ) {
			return ( -1 !== keyword.toLowerCase().indexOf( filterValue.toLowerCase() ) );
		} );
	},

	onFilterChanged: function() {
		var filterValue = qazana.channels.panelElements.request( 'filter:value' );

		if ( ! filterValue ) {
			this.onFilterEmpty();
		}

		this._renderChildren();

		this.triggerMethod( 'children:render' );
	},

	onFilterEmpty: function() {
		qazana.getPanelView().getCurrentPageView().showView( 'categories' );
	}
} );

module.exports = PanelElementsElementsView;

},{"qazana-panel/pages/elements/views/element":100}],102:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-global',

	id: 'qazana-panel-global',

	initialize: function() {
		qazana.getPanelView().getCurrentPageView().search.reset();
	},

	onDestroy: function() {
		var panel = qazana.getPanelView();

		if ( 'elements' === panel.getCurrentPageName() ) {
			setTimeout( function() {
				var elementsPageView = panel.getCurrentPageView();

				if ( ! elementsPageView.search.currentView ) {
					elementsPageView.showView( 'search' );
				}
			} );
		}
	}
} );

},{}],103:[function(require,module,exports){
var PanelElementsSearchView;

PanelElementsSearchView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-element-search',

	id: 'qazana-panel-elements-search-wrapper',

	ui: {
		input: 'input'
	},

	events: {
		'input @ui.input': 'onInputChanged'
	},

	clearInput: function() {
		this.ui.input.val( '' );
	},

	onInputChanged: function( event ) {
		var ESC_KEY = 27;

		if ( ESC_KEY === event.keyCode ) {
			this.clearInput();
		}

		this.triggerMethod( 'search:change:input' );
	}
} );

module.exports = PanelElementsSearchView;

},{}],104:[function(require,module,exports){
var PanelMenuGroupView = require( 'qazana-panel/pages/menu/views/group' ),
	PanelMenuPageView;

PanelMenuPageView = Marionette.CompositeView.extend( {
	id: 'qazana-panel-page-menu',

	template: '#tmpl-qazana-panel-menu',

	childView: PanelMenuGroupView,

	childViewContainer: '#qazana-panel-page-menu-content',

	initialize: function() {
		this.collection = PanelMenuPageView.getGroups();
	},

	onDestroy: function() {
		var arrowClass = 'eicon-arrow-' + ( qazana.config.is_rtl ? 'right' : 'left' );

		qazana.panel.currentView.getHeaderView().ui.menuIcon.removeClass( arrowClass ).addClass( 'eicon-menu-bar' );
	}
}, {
	groups: null,

	initGroups: function() {
		var menus = [];

        if (qazana.config.user.is_administrator) {
            menus = [{
                    name: 'style',
                    title: qazana.translate('global_style'),
                    items: [{
                            name: 'global-colors',
                            icon: 'fa fa-paint-brush',
                            title: qazana.translate('global_colors'),
                            type: 'page',
                            pageName: 'colorScheme'
                        },
                        {
                            name: 'global-fonts',
                            icon: 'fa fa-font',
                            title: qazana.translate('global_fonts'),
                            type: 'page',
                            pageName: 'typographyScheme'
                        },
                        {
                            name: 'color-picker',
                            icon: 'fa fa-eyedropper',
                            title: qazana.translate('color_picker'),
                            type: 'page',
                            pageName: 'colorPickerScheme'
                        },
                        {
                            name: 'clear-page',
                            icon: 'fa fa-eraser',
                            title: qazana.translate('clear_page'),
                            callback: function () {
                                qazana.clearPage();
                            }
                        }
                    ]
                },
                {
                    name: 'settings',
                    title: qazana.translate('settings'),
                    items: [{
                            name: 'qazana-settings',
                            icon: 'fa fa-cogs',
                            title: qazana.translate('qazana_settings'),
                            type: 'link',
                            link: qazana.config.settings_page_link,
                            newTab: true
                        },
                        {
                            name: 'about-qazana',
                            icon: 'fa fa-info-circle',
                            title: qazana.translate('about_qazana'),
                            type: 'link',
                            link: qazana.config.qazana_site,
                            newTab: true
                        }
                    ]
                }
            ];
        }

		this.groups = new Backbone.Collection( menus );
	},

	getGroups: function() {
		if ( ! this.groups ) {
			this.initGroups();
		}

		return this.groups;
	},

	addItem: function( itemData, groupName, before ) {
		var group = this.getGroups().findWhere( { name: groupName } );

		if ( ! group ) {
			return;
		}

		var items = group.get( 'items' ),
			beforeItem;

		if ( before ) {
			beforeItem = _.findWhere( items, { name: before } );
		}

		if ( beforeItem ) {
			items.splice( items.indexOf( beforeItem ), 0, itemData );
		} else {
			items.push( itemData );
		}

	}
} );

module.exports = PanelMenuPageView;

},{"qazana-panel/pages/menu/views/group":105}],105:[function(require,module,exports){
var PanelMenuItemView = require( 'qazana-panel/pages/menu/views/item' );

module.exports = Marionette.CompositeView.extend( {
	template: '#tmpl-qazana-panel-menu-group',

	className: 'qazana-panel-menu-group',

	childView: PanelMenuItemView,

	childViewContainer: '.qazana-panel-menu-items',

	initialize: function() {
		this.collection = new Backbone.Collection( this.model.get( 'items' ) );
	},

	onChildviewClick: function( childView ) {
		var menuItemType = childView.model.get( 'type' );

		switch ( menuItemType ) {
			case 'page':
				var pageName = childView.model.get( 'pageName' ),
					pageTitle = childView.model.get( 'title' );

				qazana.getPanelView().setPage( pageName, pageTitle );

				break;

			case 'link':
				var link = childView.model.get( 'link' ),
					isNewTab = childView.model.get( 'newTab' );

				if ( isNewTab ) {
					open( link, '_blank' );
				} else {
					location.href = childView.model.get( 'link' );
				}

				break;

			default:
				var callback = childView.model.get( 'callback' );

				if ( _.isFunction( callback ) ) {
					callback.call( childView );
				}
		}
	}
} );

},{"qazana-panel/pages/menu/views/item":106}],106:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-menu-item',

	className: 'qazana-panel-menu-item',

	triggers: {
		click: 'click'
	}
} );

},{}],107:[function(require,module,exports){
var childViewTypes = {
		color: require( 'qazana-panel/pages/schemes/items/color' ),
		typography: require( 'qazana-panel/pages/schemes/items/typography' )
	},
	PanelSchemeBaseView;

PanelSchemeBaseView = Marionette.CompositeView.extend( {
	id: function() {
		return 'qazana-panel-scheme-' + this.getType();
	},

	className: function() {
		return 'qazana-panel-scheme qazana-panel-scheme-' + this.getUIType();
	},

	childViewContainer: '.qazana-panel-scheme-items',

	getTemplate: function() {
		return Marionette.TemplateCache.get( '#tmpl-qazana-panel-schemes-' + this.getType() );
	},

	getChildView: function() {
		return childViewTypes[ this.getUIType() ];
	},

	getUIType: function() {
		return this.getType();
	},

	ui: function() {
		return {
			saveButton: '.qazana-panel-scheme-save .qazana-button',
			discardButton: '.qazana-panel-scheme-discard .qazana-button',
			resetButton: '.qazana-panel-scheme-reset .qazana-button'
		};
	},

	events: function() {
		return {
			'click @ui.saveButton': 'saveScheme',
			'click @ui.discardButton': 'discardScheme',
			'click @ui.resetButton': 'setDefaultScheme'
		};
	},

	initialize: function() {
		this.model = new Backbone.Model();

		this.resetScheme();
	},

	getType: function() {},

	getScheme: function() {
		return qazana.schemes.getScheme( this.getType() );
	},

	changeChildrenUIValues: function( schemeItems ) {
		var self = this;

		_.each( schemeItems, function( value, key ) {
			var model = self.collection.findWhere( { key: key } ),
				childView = self.children.findByModelCid( model.cid );

			childView.changeUIValue( value );
		} );
	},

	discardScheme: function() {
		qazana.schemes.resetSchemes( this.getType() );

		this.onSchemeChange();

		this.ui.saveButton.prop( 'disabled', true );

		this._renderChildren();
	},

	setSchemeValue: function( key, value ) {
		qazana.schemes.setSchemeValue( this.getType(), key, value );

		this.onSchemeChange();
	},

	saveScheme: function() {
		qazana.schemes.saveScheme( this.getType() );

		this.ui.saveButton.prop( 'disabled', true );

		this.resetScheme();

		this._renderChildren();
	},

	setDefaultScheme: function() {
		var defaultScheme = qazana.config.default_schemes[ this.getType() ].items;

		this.changeChildrenUIValues( defaultScheme );
	},

	resetItems: function() {
		this.model.set( 'items', this.getScheme().items );
	},

	resetCollection: function() {
		var self = this,
			items = self.model.get( 'items' );

		self.collection = new Backbone.Collection();

		_.each( items, function( item, key ) {
			item.type = self.getType();
			item.key = key;

			self.collection.add( item );
		} );
	},

	resetScheme: function() {
		this.resetItems();
		this.resetCollection();
	},

	onSchemeChange: function() {
		qazana.schemes.printSchemesStyle();
	},

	onChildviewValueChange: function( childView, newValue ) {
		this.ui.saveButton.removeProp( 'disabled' );

		this.setSchemeValue( childView.model.get( 'key' ), newValue );
	}
} );

module.exports = PanelSchemeBaseView;

},{"qazana-panel/pages/schemes/items/color":112,"qazana-panel/pages/schemes/items/typography":113}],108:[function(require,module,exports){
var PanelSchemeColorsView = require( 'qazana-panel/pages/schemes/colors' ),
	PanelSchemeColorPickerView;

PanelSchemeColorPickerView = PanelSchemeColorsView.extend( {
	getType: function() {
		return 'color-picker';
	},

	getUIType: function() {
		return 'color';
	},

	onSchemeChange: function() {},

	getViewComparator: function() {
		return this.orderView;
	},

	orderView: function( model ) {
		return qazana.helpers.getColorPickerPaletteIndex( model.get( 'key' ) );
	}
} );

module.exports = PanelSchemeColorPickerView;

},{"qazana-panel/pages/schemes/colors":109}],109:[function(require,module,exports){
var PanelSchemeBaseView = require( 'qazana-panel/pages/schemes/base' ),
	PanelSchemeColorsView;

PanelSchemeColorsView = PanelSchemeBaseView.extend( {
	ui: function() {
		var ui = PanelSchemeBaseView.prototype.ui.apply( this, arguments );

		ui.systemSchemes = '.qazana-panel-scheme-color-system-scheme';

		return ui;
	},

	events: function() {
		var events = PanelSchemeBaseView.prototype.events.apply( this, arguments );

		events[ 'click @ui.systemSchemes' ] = 'onSystemSchemeClick';

		return events;
	},

	getType: function() {
		return 'color';
	},

	onSystemSchemeClick: function( event ) {
		var $schemeClicked = jQuery( event.currentTarget ),
			schemeName = $schemeClicked.data( 'schemeName' ),
			scheme = qazana.config.system_schemes[ this.getType() ][ schemeName ].items;

		this.changeChildrenUIValues( scheme );
	}
} );

module.exports = PanelSchemeColorsView;

},{"qazana-panel/pages/schemes/base":107}],110:[function(require,module,exports){
var PanelSchemeDisabledView;

PanelSchemeDisabledView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-schemes-disabled',

	id: 'qazana-panel-schemes-disabled',

	className: 'qazana-nerd-box',

	disabledTitle: '',

	templateHelpers: function() {
		return {
			disabledTitle: this.disabledTitle
		};
	}
} );

module.exports = PanelSchemeDisabledView;

},{}],111:[function(require,module,exports){
var PanelSchemeItemView;

PanelSchemeItemView = Marionette.ItemView.extend( {
	getTemplate: function() {
		return Marionette.TemplateCache.get( '#tmpl-qazana-panel-scheme-' + this.getUIType() + '-item' );
	},

	className: function() {
		return 'qazana-panel-scheme-item';
	}
} );

module.exports = PanelSchemeItemView;

},{}],112:[function(require,module,exports){
var PanelSchemeItemView = require( 'qazana-panel/pages/schemes/items/base' ),
	PanelSchemeColorView;

PanelSchemeColorView = PanelSchemeItemView.extend( {
	getUIType: function() {
		return 'color';
	},

	ui: {
		input: '.qazana-panel-scheme-color-value'
	},

	changeUIValue: function( newValue ) {
		this.ui.input.wpColorPicker( 'color', newValue );
	},

	onBeforeDestroy: function() {
		if ( this.ui.input.wpColorPicker( 'instance' ) ) {
			this.ui.input.wpColorPicker( 'close' );
		}
	},

	onRender: function() {
		var self = this;

		qazana.helpers.wpColorPicker( self.ui.input, {
			change: function( event, ui ) {
				self.triggerMethod( 'value:change', ui.color.toString() );
			}
		} );
	}
} );

module.exports = PanelSchemeColorView;

},{"qazana-panel/pages/schemes/items/base":111}],113:[function(require,module,exports){
var PanelSchemeItemView = require( 'qazana-panel/pages/schemes/items/base' ),
	PanelSchemeTypographyView;

PanelSchemeTypographyView = PanelSchemeItemView.extend( {
	getUIType: function() {
		return 'typography';
	},

	className: function() {
		var classes = PanelSchemeItemView.prototype.className.apply( this, arguments );

		return classes + ' qazana-panel-box';
	},

	ui: {
		heading: '.qazana-panel-heading',
		allFields: '.qazana-panel-scheme-typography-item-field',
		inputFields: 'input.qazana-panel-scheme-typography-item-field',
		selectFields: 'select.qazana-panel-scheme-typography-item-field',
		selectFamilyFields: 'select.qazana-panel-scheme-typography-item-field[name="font_family"]'
	},

	events: {
		'input @ui.inputFields': 'onFieldChange',
		'change @ui.selectFields': 'onFieldChange',
		'click @ui.heading': 'toggleVisibility'
	},

	onRender: function() {
		var self = this;

		this.ui.inputFields.add( this.ui.selectFields ).each( function() {
			var $this = jQuery( this ),
				name = $this.attr( 'name' ),
				value = self.model.get( 'value' )[ name ];

			$this.val( value );
		} );

		this.ui.selectFamilyFields.select2( {
			dir: qazana.config.is_rtl ? 'rtl' : 'ltr'
		} );
	},

	toggleVisibility: function() {
		this.$el.toggleClass( 'qazana-open' );
	},

	changeUIValue: function( newValue ) {
		this.ui.allFields.each( function() {
			var $this = jQuery( this ),
				thisName = $this.attr( 'name' ),
				newFieldValue = newValue[ thisName ];

			$this.val( newFieldValue ).trigger( 'change' );
		} );
	},

	onFieldChange: function( event ) {
		var $select = this.$( event.currentTarget ),
			currentValue = qazana.schemes.getSchemeValue( 'typography', this.model.get( 'key' ) ).value,
			fieldKey = $select.attr( 'name' );

		currentValue[ fieldKey ] = $select.val();

		if ( 'font_family' === fieldKey && ! _.isEmpty( currentValue[ fieldKey ] ) ) {
			qazana.helpers.enqueueFont( currentValue[ fieldKey ] );
		}

		this.triggerMethod( 'value:change', currentValue );
	}
} );

module.exports = PanelSchemeTypographyView;

},{"qazana-panel/pages/schemes/items/base":111}],114:[function(require,module,exports){
var PanelSchemeBaseView = require( 'qazana-panel/pages/schemes/base' ),
	PanelSchemeTypographyView;

PanelSchemeTypographyView = PanelSchemeBaseView.extend( {
	getType: function() {
		return 'typography';
	}
} );

module.exports = PanelSchemeTypographyView;

},{"qazana-panel/pages/schemes/base":107}],115:[function(require,module,exports){
module.exports = Marionette.Region.extend( {
	el: '#qazana-panel',

	constructor: function() {
		Marionette.Region.prototype.constructor.apply( this, arguments );

		var PanelLayoutView = require( 'qazana-layouts/panel/layout' );

		this.show( new PanelLayoutView() );

		this.resizable();
	},

	resizable: function() {
		var side = qazana.config.is_rtl ? 'right' : 'left';

		this.$el.resizable( {
			handles: qazana.config.is_rtl ? 'w' : 'e',
			minWidth: 200,
			maxWidth: 680,
			start: function() {
				qazana.$previewWrapper.addClass( 'ui-resizable-resizing' );
			},
			stop: function() {
				qazana.$previewWrapper.removeClass( 'ui-resizable-resizing' );

				qazana.getPanelView().updateScrollbar();
			},
			resize: function( event, ui ) {
				qazana.$previewWrapper.css( side, ui.size.width );
			}
		} );
	}
} );

},{"qazana-layouts/panel/layout":92}],116:[function(require,module,exports){
var Ajax;

Ajax = {
	config: {},
	requests: {},
	cache: {},

	initConfig: function() {
		this.config = {
			ajaxParams: {
				type: 'POST',
				url: qazana.config.ajaxurl,
				data: {}
			},
			actionPrefix: 'qazana_'
		};
	},

	init: function() {
		this.initConfig();

		this.debounceSendBatch = _.debounce( this.sendBatch.bind( this ), 500 );
	},

	getCacheKey: function( request ) {
		return JSON.stringify( {
			unique_id: request.unique_id,
			data: request.data
		} );
	},

	loadObjects: function( options ) {
		var self = this,
			dataCollection = {},
			deferredArray = [];

		if ( options.before ) {
			options.before();
		}

		options.ids.forEach( function( objectId ) {
			deferredArray.push( self.load( {
				action: options.action,
				unique_id: options.data.unique_id + objectId,
				data: jQuery.extend( { id: objectId }, options.data )
			} ).done( function( data ) {
				dataCollection = jQuery.extend( dataCollection, data );
			}) );
		} );

		jQuery.when.apply( jQuery, deferredArray ).done( function() {
			options.success( dataCollection );
		} );
	},

	load: function( request ) {
		var self = this;
		if ( ! request.unique_id ) {
			request.unique_id = request.action;
		}

		if ( request.before ) {
			request.before();
		}

		var deferred,
			cacheKey = self.getCacheKey( request );

		if ( _.has( self.cache, cacheKey ) ) {
			deferred = jQuery.Deferred()
				.done( request.success )
				.resolve( self.cache[ cacheKey ] );
		} else {
			deferred = self.addRequest( request.action, {
				data: request.data,
				unique_id: request.unique_id,
				success: function( data ) {
					self.cache[ cacheKey ] = data;
				}
			} ).done( request.success );
		}

		return deferred;
	},

	addRequest: function( action, options, immediately ) {
		options = options || {};

		if ( ! options.unique_id ) {
			options.unique_id = action;
		}

		options.deferred = jQuery.Deferred().done( options.success ).fail( options.error ).always( options.complete );

		var request = {
			action: action,
			options: options
		};

		if ( immediately ) {
			var requests = {};
			requests[ options.unique_id ] = request;
			options.deferred.jqXhr = this.sendBatch( requests );
		} else {
			this.requests[ options.unique_id ] = request;
			this.debounceSendBatch();
		}

		return options.deferred;
	},

	sendBatch: function( requests ) {
		var actions = {};

		if ( ! requests ) {
			requests = this.requests;

			// Empty for next batch.
			this.requests = {};
		}

		_( requests ).each( function( request, id ) {
			actions[ id ] = {
				action: request.action,
				data: request.options.data
			};
		} );

		return this.send( 'ajax', {
			data: {
				actions: JSON.stringify( actions )
			},
			success: function( data ) {
				_.each( data.responses, function( response, id ) {
					var options = requests[ id ].options;
					if ( options ) {
						if ( response.success ) {
							options.deferred.resolve( response.data );
						} else if ( ! response.success ) {
							options.deferred.reject( response.data );
						}
					}
				} );
			},
			error: function( data ) {
				_.each( requests, function( args ) {
					if ( args.options ) {
						args.options.deferred.reject( data );
					}
				} );
			}
		} );
	},

	send: function( action, options ) {
		var self = this,
			ajaxParams = qazana.helpers.cloneObject( this.config.ajaxParams );

		options = options || {};

		action = this.config.actionPrefix + action;

		jQuery.extend( ajaxParams, options );

		if ( ajaxParams.data instanceof FormData ) {
			ajaxParams.data.append( 'action', action );
			ajaxParams.data.append( '_nonce', qazana.config.nonce );
			ajaxParams.data.append( 'editor_post_id', qazana.config.document.id );

		} else {
			ajaxParams.data.action = action;
			ajaxParams.data._nonce = qazana.config.nonce;
			ajaxParams.data.editor_post_id = qazana.config.document.id;
		}

		var successCallback = ajaxParams.success,
			errorCallback = ajaxParams.error;

		if ( successCallback || errorCallback ) {
			ajaxParams.success = function( response ) {
				if ( response.success && successCallback ) {
					successCallback( response.data );
				}

				if ( ( ! response.success ) && errorCallback ) {
					errorCallback( response.data );
				}
			};

			if ( errorCallback ) {
				ajaxParams.error = function( data ) {
					errorCallback( data );
				};
			} else {
				ajaxParams.error = function( XMLHttpRequest ) {
					if ( 0 === XMLHttpRequest.readyState && 'abort' === XMLHttpRequest.statusText ) {
						return;
					}

					var message = self.createErrorMessage( XMLHttpRequest );

					qazana.notifications.showToast( {
						message: message
					} );
				};
			}
		}

		return jQuery.ajax( ajaxParams );
	},

	createErrorMessage: function( XMLHttpRequest ) {
		var message;
		if ( 4 === XMLHttpRequest.readyState ) {
			message = qazana.translate( 'server_error' );
			if ( 200 !== XMLHttpRequest.status ) {
				message += ' (' + XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText + ')';
			}
		} else if ( 0 === XMLHttpRequest.readyState ) {
			message = qazana.translate( 'server_connection_lost' );
		} else {
			message = qazana.translate( 'unknown_error' );
		}

		return message + '.';
	}
};

module.exports = Ajax;

},{}],117:[function(require,module,exports){
var Conditions;

Conditions = function() {
	var self = this;

	this.compare = function( leftValue, rightValue, operator ) {
		switch ( operator ) {
			/* jshint ignore:start */
			case '==':
				return leftValue == rightValue;
			case '!=':
				return leftValue != rightValue;
			/* jshint ignore:end */
			case '!==':
				return leftValue !== rightValue;
			case 'in':
				return -1 !== rightValue.indexOf( leftValue );
			case '!in':
				return -1 === rightValue.indexOf( leftValue );
			case 'contains':
				return -1 !== leftValue.indexOf( rightValue );
			case '!contains':
				return -1 === leftValue.indexOf( rightValue );
			case '<':
				return leftValue < rightValue;
			case '<=':
				return leftValue <= rightValue;
			case '>':
				return leftValue > rightValue;
			case '>=':
				return leftValue >= rightValue;
			default:
				return leftValue === rightValue;
		}
	};

	this.check = function( conditions, comparisonObject ) {
		var isOrCondition = 'or' === conditions.relation,
			conditionSucceed = ! isOrCondition;

		jQuery.each( conditions.terms, function() {
			var term = this,
				comparisonResult;

			if ( term.terms ) {
				comparisonResult = self.check( term, comparisonObject );
			} else {
				var parsedName = term.name.match( /(\w+)(?:\[(\w+)])?/ ),
					value = comparisonObject[ parsedName[ 1 ] ];

				if ( parsedName[ 2 ] ) {
					value = value[ parsedName[ 2 ] ];
				}

				comparisonResult = self.compare( value, term.value, term.operator );
			}

			if ( isOrCondition ) {
				if ( comparisonResult ) {
					conditionSucceed = true;
				}

				return ! comparisonResult;
			}

			if ( ! comparisonResult ) {
				return conditionSucceed = false;
			}
		} );

		return conditionSucceed;
	};
};

module.exports = new Conditions();

},{}],118:[function(require,module,exports){
var Module = require( 'qazana-utils/module' ),
	ContextMenu;

ContextMenu = Module.extend( {

	getDefaultSettings: function() {
		return {
			actions: {},
			classes: {
				list: 'qazana-context-menu-list',
				group: 'qazana-context-menu-list__group',
				groupPrefix: 'qazana-context-menu-list__group-',
				item: 'qazana-context-menu-list__item',
				itemTypePrefix: 'qazana-context-menu-list__item-',
				itemTitle: 'qazana-context-menu-list__item__title',
				itemShortcut: 'qazana-context-menu-list__item__shortcut',
				iconShortcut: 'qazana-context-menu-list__item__icon',
				itemDisabled: 'qazana-context-menu-list__item--disabled',
				divider: 'qazana-context-menu-list__divider',
				hidden: 'qazana-hidden'
			}
		};
	},

	buildActionItem: function( action ) {
		var self = this,
			classes = self.getSettings( 'classes' ),
			$item = jQuery( '<div>', { 'class': classes.item + ' ' + classes.itemTypePrefix + action.name } ),
			$itemTitle = jQuery( '<div>', { 'class': classes.itemTitle } ).text( action.title ),
			$itemIcon = jQuery( '<div>', { 'class': classes.iconShortcut } );

		if ( action.icon ) {
			$itemIcon.html( jQuery( '<i>', { 'class': action.icon } ) );
		}

		$item.append( $itemIcon, $itemTitle );

		if ( action.shortcut ) {
			var $itemShortcut = jQuery( '<div>', { 'class': classes.itemShortcut } ).html( action.shortcut );

			$item.append( $itemShortcut );
		}

		if ( action.callback ) {
			$item.on( 'click', function() {
				self.runAction( action );
			} );
		}

		action.$item = $item;

		return $item;
	},

	buildActionsList: function() {
		var self = this,
			classes = self.getSettings( 'classes' ),
			groups = self.getSettings( 'groups' ),
			$list = jQuery( '<div>', { 'class': classes.list } );

		groups.forEach( function( group ) {
			var $group = jQuery( '<div>', { 'class': classes.group + ' ' + classes.groupPrefix + group.name } );

			group.actions.forEach( function( action ) {
				$group.append( self.buildActionItem( action ) );
			} );

			$list.append( $group );

			group.$item = $group;
		} );

		return $list;
	},

	toggleGroupVisibility: function( group, state ) {
		group.$item.toggleClass( this.getSettings( 'classes.hidden' ), ! state );
	},

	toggleActionVisibility: function( action, state ) {
		action.$item.toggleClass( this.getSettings( 'classes.hidden' ), ! state );
	},

	toggleActionUsability: function( action, state ) {
		action.$item.toggleClass( this.getSettings( 'classes.itemDisabled' ), ! state );
	},

	isActionEnabled: function( action ) {
		if ( ! action.callback && ! action.groups ) {
			return false;
		}

		return action.isEnabled ? action.isEnabled() : true;
	},

	runAction: function( action ) {
		if ( ! this.isActionEnabled( action ) ) {
			return;
		}

		action.callback();

		this.getModal().hide();
	},

	initModal: function() {
		var modal;

		this.getModal = function() {
			if ( ! modal ) {
				modal = qazana.dialogsManager.createWidget( 'simple', {
					className: 'qazana-context-menu',
					message: this.buildActionsList(),
					iframe: qazana.$preview,
					effects: {
						hide: 'hide',
						show: 'show'
					},
					hide: {
						onOutsideContextMenu: true
					},
					position: {
						my: ( qazana.config.is_rtl ? 'right' : 'left' ) + ' top',
						collision: 'fit'
					}
				} );
			}

			return modal;
		};
	},

	show: function( event ) {
		var self = this,
			modal = self.getModal();

		modal.setSettings( 'position', {
			of: event
		} );

		self.getSettings( 'groups' ).forEach( function( group ) {
			var isGroupVisible = false !== group.isVisible;

			self.toggleGroupVisibility( group, isGroupVisible );

			if ( isGroupVisible ) {
				group.actions.forEach( function( action ) {
					var isActionVisible = false !== action.isVisible;

					self.toggleActionVisibility( action, isActionVisible );

					if ( isActionVisible ) {
						self.toggleActionUsability( action, self.isActionEnabled( action ) );
					}
				} );
			}
		} );

		modal.show();
	},

	destroy: function() {
		this.getModal().destroy();
	},

	onInit: function() {
		this.initModal();
	}
} );

module.exports = ContextMenu;

},{"qazana-utils/module":140}],119:[function(require,module,exports){
var ViewModule = require( 'qazana-utils/view-module' ),
	Stylesheet = require( 'qazana-editor-utils/stylesheet' ),
	ControlsCSSParser;

ControlsCSSParser = ViewModule.extend( {
	stylesheet: null,

	getDefaultSettings: function() {
		return {
			id: 0,
			settingsModel: null,
			dynamicParsing: {}
		};
	},

	getDefaultElements: function() {
		return {
			$stylesheetElement: jQuery( '<style>', { id: 'qazana-style-' + this.getSettings( 'id' ) } )
		};
	},

	initStylesheet: function() {
		var breakpoints = qazanaFrontend.config.breakpoints;

		this.stylesheet = new Stylesheet();

		this.stylesheet
			.addDevice( 'mobile', 0 )
			.addDevice( 'tablet', breakpoints.md )
			.addDevice( 'desktop', breakpoints.lg );
	},

	addStyleRules: function( styleControls, values, controls, placeholders, replacements ) {
		var self = this,
			dynamicParsedValues = self.getSettings( 'settingsModel' ).parseDynamicSettings( values, self.getSettings( 'dynamicParsing' ), styleControls );

		_.each( styleControls, function( control ) {
			if ( control.styleFields && control.styleFields.length ) {
				self.addRepeaterControlsStyleRules( values[ control.name ], control.styleFields, controls, placeholders, replacements );
			}

			if ( control.dynamic && control.dynamic.active && values.__dynamic__ && values.__dynamic__[ control.name ] ) {
				self.addDynamicControlStyleRules( values.__dynamic__[ control.name ], control );
			}

			if ( ! control.selectors ) {
				return;
			}

			self.addControlStyleRules( control, dynamicParsedValues, controls, placeholders, replacements );
		} );
	},

	addControlStyleRules: function( control, values, controls, placeholders, replacements ) {
		var self = this;

		ControlsCSSParser.addControlStyleRules( self.stylesheet, control, controls, function( control ) {
			return self.getStyleControlValue( control, values );
		}, placeholders, replacements );
	},

	getStyleControlValue: function( control, values ) {
		var value = values[ control.name ];

		if ( control.selectors_dictionary ) {
			value = control.selectors_dictionary[ value ] || value;
		}

		if ( ! _.isNumber( value ) && _.isEmpty( value ) ) {
			return;
		}

		return value;
	},

	addRepeaterControlsStyleRules: function( repeaterValues, repeaterControlsItems, controls, placeholders, replacements ) {
		var self = this;

		repeaterControlsItems.forEach( function( item, index ) {
			var itemModel = repeaterValues.models[ index ];

			self.addStyleRules(
				item,
				itemModel.attributes,
				controls,
				placeholders.concat( [ '{{CURRENT_ITEM}}' ] ),
				replacements.concat( [ '.qazana-repeater-item-' + itemModel.get( '_id' ) ] )
			);
		} );
	},

	addDynamicControlStyleRules: function( value, control ) {
		var self = this;

		qazana.dynamicTags.parseTagsText( value, control.dynamic, function( id, name, settings ) {
			var tag = qazana.dynamicTags.createTag( id, name, settings );

			if ( ! tag ) {
				return;
			}

			var tagSettingsModel = tag.model,
				styleControls = tagSettingsModel.getStyleControls();

			if ( ! styleControls.length ) {
				return;
			}

			self.addStyleRules( tagSettingsModel.getStyleControls(), tagSettingsModel.attributes, tagSettingsModel.controls, [ '{{WRAPPER}}' ], [ '#qazana-tag-' + id ] );
		} );
	},

	addStyleToDocument: function() {
		qazana.$previewContents.find( 'head' ).append( this.elements.$stylesheetElement );

		this.elements.$stylesheetElement.text( this.stylesheet );
	},

	removeStyleFromDocument: function() {
		this.elements.$stylesheetElement.remove();
	},

	onInit: function() {
		ViewModule.prototype.onInit.apply( this, arguments );

		this.initStylesheet();
	}
} );

ControlsCSSParser.addControlStyleRules = function( stylesheet, control, controls, valueCallback, placeholders, replacements ) {
	var value = valueCallback( control );

	if ( undefined === value ) {
		return;
	}

	_.each( control.selectors, function( cssProperty, selector ) {
		var outputCssProperty;

		try {
			outputCssProperty = cssProperty.replace( /{{(?:([^.}]+)\.)?([^}]*)}}/g, function( originalPhrase, controlName, placeholder ) {
				var parserControl = control,
					valueToInsert = value;

				if ( controlName ) {
					parserControl = _.findWhere( controls, { name: controlName } );

					if ( ! parserControl ) {
						return '';
					}

					valueToInsert = valueCallback( parserControl );
				}

				var parsedValue = qazana.getControlView( parserControl.type ).getStyleValue( placeholder.toLowerCase(), valueToInsert );

				if ( '' === parsedValue ) {
					throw '';
				}

				return parsedValue;
			} );
		} catch ( e ) {
			return;
		}

		if ( _.isEmpty( outputCssProperty ) ) {
			return;
		}

		var devicePattern = /^(?:\([^)]+\)){1,2}/,
			deviceRules = selector.match( devicePattern ),
			query = {};

		if ( deviceRules ) {
			deviceRules = deviceRules[0];

			selector = selector.replace( devicePattern, '' );

			var pureDevicePattern = /\(([^)]+)\)/g,
				pureDeviceRules = [],
				matches;

			while ( matches = pureDevicePattern.exec( deviceRules ) ) {
				pureDeviceRules.push( matches[1] );
			}

			_.each( pureDeviceRules, function( deviceRule ) {
				if ( 'desktop' === deviceRule ) {
					return;
				}

				var device = deviceRule.replace( /\+$/, '' ),
					endPoint = device === deviceRule ? 'max' : 'min';

				query[ endPoint ] = device;
			} );
		}

		_.each( placeholders, function( placeholder, index ) {
			// Check if it's a RegExp
			var regexp = placeholder.source ? placeholder.source : placeholder,
				placeholderPattern = new RegExp( regexp, 'g' );

			selector = selector.replace( placeholderPattern, replacements[ index ] );
		} );

		if ( ! Object.keys( query ).length && control.responsive ) {
			query = _.pick( qazana.helpers.cloneObject( control.responsive ), [ 'min', 'max' ] );

			if ( 'desktop' === query.max ) {
				delete query.max;
			}
		}

		stylesheet.addRules( selector, outputCssProperty, query );
	} );
};

module.exports = ControlsCSSParser;

},{"qazana-editor-utils/stylesheet":129,"qazana-utils/view-module":141}],120:[function(require,module,exports){
var Debug = function() {
	var self = this,
		errorStack = [],
		settings = {},
		elements = {};

	var initSettings = function() {
		settings = {
			debounceDelay: 500,
			urlsToWatch: [
				'qazana/assets'
			]
		};
	};

	var initElements = function() {
		elements.$window = jQuery( window );
	};

	var onError = function( event ) {
		var originalEvent = event.originalEvent,
			error = originalEvent.error;

		if ( ! error ) {
			return;
		}

		var isInWatchList = false,
			urlsToWatch = settings.urlsToWatch;

		jQuery.each( urlsToWatch, function() {
			if ( -1 !== error.stack.indexOf( this ) ) {
				isInWatchList = true;

				return false;
			}
		} );

		if ( ! isInWatchList ) {
			return;
		}

		self.addError( {
			type: error.name,
			message: error.message,
			url: originalEvent.filename,
			line: originalEvent.lineno,
			column: originalEvent.colno
		} );
	};

	var bindEvents = function() {
		elements.$window.on( 'error', onError );
	};

	var init = function() {
		initSettings();

		initElements();

		bindEvents();

		self.sendErrors = _.debounce( self.sendErrors, settings.debounceDelay );
	};

	this.addURLToWatch = function( url ) {
		settings.urlsToWatch.push( url );
	};

	this.addCustomError = function( error, category, tag ) {
		var errorInfo = {
			type: error.name,
			message: error.message,
			url: error.fileName || error.sourceURL,
			line: error.lineNumber || error.line,
			column: error.columnNumber || error.column,
			customFields: {
				category: category || 'general',
				tag: tag
			}
		};

		if ( ! errorInfo.url ) {
			var stackInfo =  error.stack.match( /\n {4}at (.*?(?=:(\d+):(\d+)))/ );

			if ( stackInfo ) {
				errorInfo.url = stackInfo[1];
				errorInfo.line = stackInfo[2];
				errorInfo.column = stackInfo[3];
			}
		}

		this.addError( errorInfo );
	};

	this.addError = function( errorParams ) {
		var defaultParams = {
			type: 'Error',
			timestamp: Math.floor( new Date().getTime() / 1000 ),
			message: null,
			url: null,
			line: null,
			column: null,
			customFields: {}
		};

		errorStack.push( jQuery.extend( true, defaultParams, errorParams ) );

		self.sendErrors();
	};

	this.sendErrors = function() {
		// Avoid recursions on errors in ajax
		elements.$window.off( 'error', onError );

		jQuery.ajax( {
			url: QazanaConfig.ajaxurl,
			method: 'POST',
			data: {
				action: 'qazana_debug_log',
				data: errorStack
			},
			success: function() {
				errorStack = [];

				// Restore error handler
				elements.$window.on( 'error', onError );
			}
		} );
	};

	init();
};

module.exports = new Debug();

},{}],121:[function(require,module,exports){
var heartbeat;

heartbeat = {

	init: function() {
		var modal;

		this.getModal = function() {
			if ( ! modal ) {
				modal = this.initModal();
			}

			return modal;
		};

		jQuery( document ).on( {
			'heartbeat-send': function( event, data ) {
				data.qazana_post_lock = {
					post_ID: qazana.config.document.id
				};
			},
			'heartbeat-tick': function( event, response ) {
				if ( response.locked_user ) {
					if ( qazana.saver.isEditorChanged() ) {
						qazana.saver.saveEditor( {
							status: 'autosave'
						} );
					}

					heartbeat.showLockMessage( response.locked_user );
				} else {
					heartbeat.getModal().hide();
				}

				qazana.config.nonce = response.qazanaNonce;
			},
			'heartbeat-tick.wp-refresh-nonces': function( event, response ) {
				var nonces = response['qazana-refresh-nonces'];

				if ( nonces ) {
					if ( nonces.heartbeatNonce ) {
						qazana.config.nonce = nonces.qazanaNonce;
					}

					if ( nonces.heartbeatNonce ) {
						window.heartbeatSettings.nonce = nonces.heartbeatNonce;
					}
				}
			}
		} );

		if ( qazana.config.locked_user ) {
			heartbeat.showLockMessage( qazana.config.locked_user );
		}
	},

	initModal: function() {
		var modal = qazana.dialogsManager.createWidget( 'lightbox', {
			headerMessage: qazana.translate( 'take_over' )
		} );

		modal.addButton( {
			name: 'go_back',
			text: qazana.translate( 'go_back' ),
			callback: function() {
				parent.history.go( -1 );
			}
		} );

		modal.addButton( {
			name: 'take_over',
			text: qazana.translate( 'take_over' ),
			callback: function() {
				wp.heartbeat.enqueue( 'qazana_force_post_lock', true );
				wp.heartbeat.connectNow();
			}
		} );

		return modal;
	},

	showLockMessage: function( lockedUser ) {
		var modal = heartbeat.getModal();

		modal
			.setMessage( qazana.translate( 'dialog_user_taken_over', [ lockedUser ] ) )
		    .show();
	}
};

module.exports = heartbeat;

},{}],122:[function(require,module,exports){
var helpers;

helpers = {
	_enqueuedFonts: [],

	elementsHierarchy: {
		section: {
			column: {
				widget: null,
				section: null
			}
		}
	},

	enqueueFont: function( font ) {
		if ( -1 !== this._enqueuedFonts.indexOf( font ) ) {
			return;
		}

		var fontType = qazana.config.controls.font.options[ font ],
			fontUrl,

			subsets = {
				'ru_RU': 'cyrillic',
				'uk': 'cyrillic',
				'bg_BG': 'cyrillic',
				'vi': 'vietnamese',
				'el': 'greek',
				'he_IL': 'hebrew'
			};

		switch ( fontType ) {
			case 'googlefonts' :
				fontUrl = 'https://fonts.googleapis.com/css?family=' + font + ':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';

				if ( subsets[ qazana.config.locale ] ) {
					fontUrl += '&subset=' + subsets[ qazana.config.locale ];
				}

				break;

			case 'earlyaccess' :
				var fontLowerString = font.replace( /\s+/g, '' ).toLowerCase();
				fontUrl = 'https://fonts.googleapis.com/earlyaccess/' + fontLowerString + '.css';
				break;
		}

		if ( ! _.isEmpty( fontUrl ) ) {
			qazana.$previewContents.find( 'link:last' ).after( '<link href="' + fontUrl + '" rel="stylesheet" type="text/css">' );
		}

		this._enqueuedFonts.push( font );

		qazana.channels.editor.trigger( 'font:insertion', fontType, font );
	},

	resetEnqueuedFontsCache: function() {
		this._enqueuedFonts = [];
	},

	getElementChildType: function( elementType, container ) {
		if ( ! container ) {
			container = this.elementsHierarchy;
		}

		if ( undefined !== container[ elementType ] ) {

			if ( jQuery.isPlainObject( container[ elementType ] ) ) {
				return Object.keys( container[ elementType ] );
			}

			return null;
		}

		for ( var type in container ) {

			if ( ! container.hasOwnProperty( type ) ) {
				continue;
			}

			if ( ! jQuery.isPlainObject( container[ type ] ) ) {
				continue;
			}

			var result = this.getElementChildType( elementType, container[ type ] );

			if ( result ) {
				return result;
			}
		}

		return null;
	},

	getUniqueID: function() {
		return Math.random().toString( 16 ).substr( 2, 7 );
	},

	/*
	 * @deprecated 2.0.0
	 */
	stringReplaceAll: function( string, replaces ) {
		var re = new RegExp( Object.keys( replaces ).join( '|' ), 'gi' );

		return string.replace( re, function( matched ) {
			return replaces[ matched ];
		} );
	},

	getYoutubeIDFromURL: function( url ) {
		var videoIDParts = url.match( /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/ );

		return videoIDParts && videoIDParts[1];
	},

	ytVidId : function ( url ) {
 		var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
 		return (url.match(p)) ? RegExp.$1 : false;
  	},

    isActiveControl: function( controlModel, values ) {
		var condition,
			conditions;

		// TODO: Better way to get this?
		if ( _.isFunction( controlModel.get ) ) {
			condition = controlModel.get( 'condition' );
			conditions = controlModel.get( 'conditions' );
		} else {
			condition = controlModel.condition;
			conditions = controlModel.conditions;
		}

		// Multiple conditions with relations.
		if ( conditions ) {
			return qazana.conditions.check( conditions, values );
		}

		if ( _.isEmpty( condition ) ) {
			return true;
		}

		var hasFields = _.filter( condition, function( conditionValue, conditionName ) {
			var conditionNameParts = conditionName.match( /([a-z_0-9]+)(?:\[([a-z_]+)])?(!?)$/i ),
				conditionRealName = conditionNameParts[1],
				conditionSubKey = conditionNameParts[2],
				isNegativeCondition = !! conditionNameParts[3],
				controlValue = values[ conditionRealName ];

			if ( values.__dynamic__ && values.__dynamic__[ conditionRealName ] ) {
				controlValue = values.__dynamic__[ conditionRealName ];
			}

			if ( undefined === controlValue ) {
				return true;
			}

			if ( conditionSubKey && 'object' === typeof controlValue ) {
				controlValue = controlValue[ conditionSubKey ];
			}

			// If it's a non empty array - check if the conditionValue contains the controlValue,
			// If the controlValue is a non empty array - check if the controlValue contains the conditionValue
			// otherwise check if they are equal. ( and give the ability to check if the value is an empty array )
			var isContains;

			if ( _.isArray( conditionValue ) && ! _.isEmpty( conditionValue ) ) {
				isContains = _.contains( conditionValue, controlValue );
			} else if ( _.isArray( controlValue ) && ! _.isEmpty( controlValue ) ) {
				isContains = _.contains( controlValue, conditionValue );
			} else {
				isContains = _.isEqual( conditionValue, controlValue );
			}

			return isNegativeCondition ? isContains : ! isContains;
		} );

		return _.isEmpty( hasFields );
	},

	cloneObject: function( object ) {
		return JSON.parse( JSON.stringify( object ) );
	},

	firstLetterUppercase: function( string ) {
		return string[0].toUpperCase() + string.slice( 1 );
	},

	disableElementEvents: function( $element ) {
		$element.each( function() {
			var currentPointerEvents = this.style.pointerEvents;

			if ( 'none' === currentPointerEvents ) {
				return;
			}

			jQuery( this )
				.data( 'backup-pointer-events', currentPointerEvents )
				.css( 'pointer-events', 'none' );
		} );
	},

	enableElementEvents: function( $element ) {
		$element.each( function() {
			var $this = jQuery( this ),
				backupPointerEvents = $this.data( 'backup-pointer-events' );

			if ( undefined === backupPointerEvents ) {
				return;
			}

			$this
				.removeData( 'backup-pointer-events' )
				.css( 'pointer-events', backupPointerEvents );
		} );
	},

	getColorPickerPaletteIndex: function( paletteKey ) {
		return [ '7', '8', '1', '5', '2', '3', '6', '4' ].indexOf( paletteKey );
	},

	wpColorPicker: function( $element, options ) {
		var self = this,
			colorPickerScheme = qazana.schemes.getScheme( 'color-picker' ),
			items = _.sortBy( colorPickerScheme.items, function( item ) {
				return self.getColorPickerPaletteIndex( item.key );
			} ),
			defaultOptions = {
				width: window.innerWidth >= 1440 ? 271 : 251,
				palettes: _.pluck( items, 'value' )
			};

		if ( options ) {
			_.extend( defaultOptions, options );
		}

		return $element.wpColorPicker( defaultOptions );
	},

	isInViewport: function( element, html ) {
		var rect = element.getBoundingClientRect();
		html = html || document.documentElement;
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= ( window.innerHeight || html.clientHeight ) &&
			rect.right <= ( window.innerWidth || html.clientWidth )
		);
	},

	scrollToView: function( $element, timeout, $parent ) {
		if ( undefined === timeout ) {
			timeout = 500;
		}

		var $scrolled = $parent,
			$qazanaFrontendWindow = qazanaFrontend.getElements( '$window' );

		if ( ! $parent ) {
			$parent = $qazanaFrontendWindow;

			$scrolled = qazana.$previewContents.find( 'html, body' );
		}

		setTimeout( function() {
			var parentHeight = $parent.height(),
				parentScrollTop = $parent.scrollTop(),
				elementTop = $parent === $qazanaFrontendWindow ? $element.offset().top : $element[0].offsetTop,
				topToCheck = elementTop - parentScrollTop;

			if ( topToCheck > 0 && topToCheck < parentHeight ) {
				return;
			}

			var scrolling = elementTop - parentHeight / 2;

			$scrolled.stop( true ).animate( { scrollTop: scrolling }, 1000 );
		}, timeout );
	},

	getElementInlineStyle: function( $element, properties ) {
		var style = {},
			elementStyle = $element[0].style;

		properties.forEach( function( property ) {
			style[ property ] = undefined !== elementStyle[ property ] ? elementStyle[ property ] : '';
		} );

		return style;
	},

	cssWithBackup: function( $element, backupState, rules ) {
		var cssBackup = this.getElementInlineStyle( $element, Object.keys( rules ) );

		$element
			.data( 'css-backup-' + backupState, cssBackup )
			.css( rules );
	},

	recoverCSSBackup: function( $element, backupState ) {
		var backupKey = 'css-backup-' + backupState;

		$element.css( $element.data( backupKey ) );

		$element.removeData( backupKey );
	},

	compareVersions: function( versionA, versionB, operator ) {
		var prepareVersion = function( version ) {
			version = version + '';

			return version.replace( /[^\d.]+/, '.-1.' );
		};

		versionA  = prepareVersion( versionA );
		versionB = prepareVersion( versionB );

		if ( versionA === versionB ) {
			return ! operator || /^={2,3}$/.test( operator );
		}

		var versionAParts = versionA.split( '.' ).map( Number ),
			versionBParts = versionB.split( '.' ).map( Number ),
			longestVersionParts = Math.max( versionAParts.length, versionBParts.length );

		for ( var i = 0; i < longestVersionParts; i++ ) {
			var valueA = versionAParts[ i ] || 0,
				valueB = versionBParts[ i ] || 0;

			if ( valueA !== valueB ) {
				return this.conditions.compare( valueA, valueB, operator );
			}
		}
	}
};

module.exports = helpers;

},{}],123:[function(require,module,exports){
var ImagesManager;

ImagesManager = function() {
	var self = this;

	var cache = {};

	var debounceDelay = 300;

	var registeredItems = [];

	var getNormalizedSize = function( image ) {
		var size,
			imageSize = image.size;

		if ( 'custom' === imageSize ) {
			var customDimension = image.dimension;

			if ( customDimension.width || customDimension.height ) {
				size = 'custom_' + customDimension.width + 'x' + customDimension.height;
			} else {
				return 'full';
			}
		} else {
			size = imageSize;
		}

		return size;
	};

	self.onceTriggerChange = _.once( function( model ) {
		setTimeout( function() {
			model.get( 'settings' ).trigger( 'change', model.get( 'settings' ) );
		}, 700 );
	} );

	self.getImageUrl = function( image ) {
		// Register for AJAX checking
		self.registerItem( image );

		var imageUrl = self.getItem( image );

		// If it's not in cache, like a new dropped widget or a custom size - get from settings
		if ( ! imageUrl ) {

			if ( 'custom' === image.size ) {

				if ( qazana.getPanelView() && 'editor' === qazana.getPanelView().getCurrentPageName() && image.model ) {
					// Trigger change again, so it's will load from the cache
					self.onceTriggerChange( image.model );
				}

				return;
			}

			// If it's a new dropped widget
			imageUrl = image.url;
		}

		return imageUrl;
	};

	self.getItem = function( image ) {
		var size = getNormalizedSize( image ),
			id =  image.id;

		if ( ! size ) {
			return false;
		}

		if ( cache[ id ] && cache[ id ][ size ] ) {
			return cache[ id ][ size ];
		}

		return false;
	};

	self.registerItem = function( image ) {
		if ( '' === image.id ) {
			// It's a new dropped widget
			return;
		}

		if ( self.getItem( image ) ) {
			// It's already in cache
			return;
		}

		registeredItems.push( image );

		self.debounceGetRemoteItems();
	};

	self.getRemoteItems = function() {
		var requestedItems = [],
		registeredItemsLength = Object.keys( registeredItems ).length,
			image,
			index;

		// It's one item, so we can render it from remote server
		if ( 0 === registeredItemsLength ) {
			return;
		} else if ( 1 === registeredItemsLength ) {
			image = registeredItems[ Object.keys( registeredItems )[0] ];

			if ( image && image.model ) {
				image.model.renderRemoteServer();
				return;
			}
		}

		for ( index in registeredItems ) {
			image = registeredItems[ index ];

			var size = getNormalizedSize( image ),
				id = image.id,
				isFirstTime = ! cache[ id ] || 0 === Object.keys( cache[ id ] ).length;

			requestedItems.push( {
				id: id,
				size: size,
				is_first_time: isFirstTime
			} );
		}

		qazana.ajax.send(
			'get_images_details', {
				data: {
					items: requestedItems
				},
				success: function( data ) {
					var id,
						size;

					for ( id in data ) {
						if ( ! cache[ id ] ) {
							cache[ id ] = {};
						}

						for ( size in data[ id ] ) {
							cache[ id ][ size ] = data[ id ][ size ];
						}
					}
					registeredItems = [];
				}
			}
		);
	};

	self.debounceGetRemoteItems = _.debounce( self.getRemoteItems, debounceDelay );
};

module.exports = new ImagesManager();

},{}],124:[function(require,module,exports){
/**
 * HTML5 - Drag and Drop
 */
;(function( $ ) {

	var hasFullDataTransferSupport = function( event ) {
		try {
			event.originalEvent.dataTransfer.setData( 'test', 'test' );

			event.originalEvent.dataTransfer.clearData( 'test' );

			return true;
		} catch ( e ) {
			return false;
		}
	};

	var Draggable = function( userSettings ) {
		var self = this,
			settings = {},
			elementsCache = {},
			defaultSettings = {
				element: '',
				groups: null,
				onDragStart: null,
				onDragEnd: null
			};

		var initSettings = function() {
			$.extend( true, settings, defaultSettings, userSettings );
		};

		var initElementsCache = function() {
			elementsCache.$element = $( settings.element );
		};

		var buildElements = function() {
			elementsCache.$element.attr( 'draggable', true );
		};

		var onDragEnd = function( event ) {
			if ( $.isFunction( settings.onDragEnd ) ) {
				settings.onDragEnd.call( elementsCache.$element, event, self );
			}
		};

		var onDragStart = function( event ) {
			var groups = settings.groups || [],
				dataContainer = {
					groups: groups
				};

			if ( hasFullDataTransferSupport( event ) ) {
				event.originalEvent.dataTransfer.setData( JSON.stringify( dataContainer ), true );
			}

			if ( $.isFunction( settings.onDragStart ) ) {
				settings.onDragStart.call( elementsCache.$element, event, self );
			}
		};

		var attachEvents = function() {
			elementsCache.$element
				.on( 'dragstart', onDragStart )
				.on( 'dragend', onDragEnd );
		};

		var init = function() {
			initSettings();

			initElementsCache();

			buildElements();

			attachEvents();
		};

		this.destroy = function() {
			elementsCache.$element.off( 'dragstart', onDragStart );

			elementsCache.$element.removeAttr( 'draggable' );
		};

		init();
	};

	var Droppable = function( userSettings ) {
		var self = this,
			settings = {},
			elementsCache = {},
			currentElement,
			currentSide,
			defaultSettings = {
				element: '',
				items: '>',
				horizontalSensitivity: '10%',
				axis: [ 'vertical', 'horizontal' ],
				placeholder: true,
				currentElementClass: 'html5dnd-current-element',
				placeholderClass: 'html5dnd-placeholder',
				hasDraggingOnChildClass: 'html5dnd-has-dragging-on-child',
				groups: null,
				isDroppingAllowed: null,
				onDragEnter: null,
				onDragging: null,
				onDropping: null,
				onDragLeave: null
			};

		var initSettings = function() {
			$.extend( settings, defaultSettings, userSettings );
		};

		var initElementsCache = function() {
			elementsCache.$element = $( settings.element );

			elementsCache.$placeholder = $( '<div>', { 'class': settings.placeholderClass } );
		};

		var hasHorizontalDetection = function() {
			return -1 !== settings.axis.indexOf( 'horizontal' );
		};

		var hasVerticalDetection = function() {
			return -1 !== settings.axis.indexOf( 'vertical' );
		};

		var checkHorizontal = function( offsetX, elementWidth ) {
			var isPercentValue,
				sensitivity;

			if ( ! hasHorizontalDetection() ) {
				return false;
			}

			if ( ! hasVerticalDetection() ) {
				return offsetX > elementWidth / 2 ? 'right' : 'left';
			}

			sensitivity = settings.horizontalSensitivity.match( /\d+/ );

			if ( ! sensitivity ) {
				return false;
			}

			sensitivity = sensitivity[0];

			isPercentValue = /%$/.test( settings.horizontalSensitivity );

			if ( isPercentValue ) {
				sensitivity = elementWidth / sensitivity;
			}

			if ( offsetX > elementWidth - sensitivity ) {
				return 'right';
			} else if ( offsetX < sensitivity ) {
				return 'left';
			}

			return false;
		};

		var setSide = function( event ) {
			var $element = $( currentElement ),
				elementHeight = $element.outerHeight() - elementsCache.$placeholder.outerHeight(),
				elementWidth = $element.outerWidth();

			event = event.originalEvent;

			if ( currentSide = checkHorizontal( event.offsetX, elementWidth ) ) {
				return;
			}

			if ( ! hasVerticalDetection() ) {
				currentSide = null;

				return;
			}

			var elementPosition = currentElement.getBoundingClientRect();

			currentSide = event.clientY > elementPosition.top + elementHeight / 2 ? 'bottom' : 'top';
		};

		var insertPlaceholder = function() {
			if ( ! settings.placeholder ) {
				return;
			}

			var insertMethod = 'top' === currentSide ? 'prependTo' : 'appendTo';

			elementsCache.$placeholder[ insertMethod ]( currentElement );
		};

		var isDroppingAllowed = function( event ) {
			var dataTransferTypes,
				draggableGroups,
				isGroupMatch,
				isDroppingAllowed;

			if ( settings.groups && hasFullDataTransferSupport( event ) ) {
				dataTransferTypes = event.originalEvent.dataTransfer.types;

				isGroupMatch = false;

				dataTransferTypes = Array.prototype.slice.apply( dataTransferTypes ); // Convert to array, since Firefox hold it as DOMStringList

				dataTransferTypes.forEach( function( type ) {
					try {
						draggableGroups = JSON.parse( type );

						if ( ! draggableGroups.groups.slice ) {
							return;
						}

						settings.groups.forEach( function( groupName ) {

							if ( -1 !== draggableGroups.groups.indexOf( groupName ) ) {
								isGroupMatch = true;

								return false; // stops the forEach from extra loops
							}
						} );
					} catch ( e ) {
					}
				} );

				if ( ! isGroupMatch ) {
					return false;
				}
			}

			if ( $.isFunction( settings.isDroppingAllowed ) ) {

				isDroppingAllowed = settings.isDroppingAllowed.call( currentElement, currentSide, event, self );

				if ( ! isDroppingAllowed ) {
					return false;
				}
			}

			return true;
		};

		var onDragEnter = function( event ) {
			event.stopPropagation();

			if ( currentElement ) {
				return;
			}

			currentElement = this;

			elementsCache.$element.parents().each( function() {
				var droppableInstance = $( this ).data( 'html5Droppable' );

				if ( ! droppableInstance ) {
					return;
				}

				droppableInstance.doDragLeave();
			} );

			setSide( event );

			if ( ! isDroppingAllowed( event ) ) {
				return;
			}

			insertPlaceholder();

			elementsCache.$element.addClass( settings.hasDraggingOnChildClass );

			$( currentElement ).addClass( settings.currentElementClass );

			if ( $.isFunction( settings.onDragEnter ) ) {
				settings.onDragEnter.call( currentElement, currentSide, event, self );
			}
		};

		var onDragOver = function( event ) {
			event.stopPropagation();

			if ( ! currentElement ) {
				onDragEnter.call( this, event );
			}

			var oldSide = currentSide;

			setSide( event );

			if ( ! isDroppingAllowed( event ) ) {
				return;
			}

			event.preventDefault();

			if ( oldSide !== currentSide ) {
				insertPlaceholder();
			}

			if ( $.isFunction( settings.onDragging ) ) {
				settings.onDragging.call( this, currentSide, event, self );
			}
		};

		var onDragLeave = function( event ) {
			var elementPosition = this.getBoundingClientRect();

			if ( 'dragleave' === event.type && ! (
				event.clientX < elementPosition.left ||
				event.clientX >= elementPosition.right ||
				event.clientY < elementPosition.top ||
				event.clientY >= elementPosition.bottom
			) ) {
				return;
			}

			$( currentElement ).removeClass( settings.currentElementClass );

			self.doDragLeave();
		};

		var onDrop = function( event ) {
			setSide( event );

			if ( ! isDroppingAllowed( event ) ) {
				return;
			}

			event.preventDefault();

			if ( $.isFunction( settings.onDropping ) ) {
				settings.onDropping.call( this, currentSide, event, self );
			}
		};

		var attachEvents = function() {
			elementsCache.$element
				.on( 'dragenter', settings.items, onDragEnter )
				.on( 'dragover', settings.items, onDragOver )
				.on( 'drop', settings.items, onDrop )
				.on( 'dragleave drop', settings.items, onDragLeave );
		};

		var init = function() {
			initSettings();

			initElementsCache();

			attachEvents();
		};

		this.doDragLeave = function() {
			if ( settings.placeholder ) {
				elementsCache.$placeholder.remove();
			}

			elementsCache.$element.removeClass( settings.hasDraggingOnChildClass );

			if ( $.isFunction( settings.onDragLeave ) ) {
				settings.onDragLeave.call( currentElement, event, self );
			}

			currentElement = currentSide = null;
		};

		this.destroy = function() {
			elementsCache.$element
				.off( 'dragenter', settings.items, onDragEnter )
				.off( 'dragover', settings.items, onDragOver )
				.off( 'drop', settings.items, onDrop )
				.off( 'dragleave drop', settings.items, onDragLeave );
		};

		init();
	};

	var plugins = {
		html5Draggable: Draggable,
		html5Droppable: Droppable
	};

	$.each( plugins, function( pluginName, Plugin ) {
		$.fn[ pluginName ] = function( options ) {
			options = options || {};

			this.each( function() {
				var instance = $.data( this, pluginName ),
					hasInstance = instance instanceof Plugin;

				if ( hasInstance ) {

					if ( 'destroy' === options ) {

						instance.destroy();

						$.removeData( this, pluginName );
					}

					return;
				}

				options.element = this;

				$.data( this, pluginName, new Plugin( options ) );
			} );

			return this;
		};
	} );
})( jQuery );

},{}],125:[function(require,module,exports){
/*!
 * jQuery Serialize Object v1.0.1
 */
(function( $ ) {
	$.fn.qazanaSerializeObject = function() {
		var serializedArray = this.serializeArray(),
			data = {};

		var parseObject = function( dataContainer, key, value ) {
			var isArrayKey = /^[^\[\]]+\[]/.test( key ),
				isObjectKey = /^[^\[\]]+\[[^\[\]]+]/.test( key ),
				keyName = key.replace( /\[.*/, '' );

			if ( isArrayKey ) {
				if ( ! dataContainer[ keyName ] ) {
					dataContainer[ keyName ] = [];
				}
			} else {
				if ( ! isObjectKey ) {
					if ( dataContainer.push ) {
						dataContainer.push( value );
					} else {
						dataContainer[ keyName ] = value;
					}

					return;
				}

				if ( ! dataContainer[ keyName ] ) {
					dataContainer[ keyName ] = {};
				}
			}

			var nextKeys = key.match( /\[[^\[\]]*]/g );

			nextKeys[ 0 ] = nextKeys[ 0 ].replace( /\[|]/g, '' );

			return parseObject( dataContainer[ keyName ], nextKeys.join( '' ), value );
		};

		$.each( serializedArray, function() {
			parseObject( data, this.name, this.value );
		} );
		return data;
	};
})( jQuery );

},{}],126:[function(require,module,exports){
var Module = require( 'qazana-utils/module' );

module.exports = Module.extend( {
	initToast: function() {
		var toast = qazana.dialogsManager.createWidget( 'buttons', {
			id: 'qazana-toast',
			position: {
				my: 'center bottom',
				at: 'center bottom-10',
				of: '#qazana-panel-content-wrapper',
				autoRefresh: true
			},
			hide: {
				onClick: true,
				auto: true,
				autoDelay: 10000
			},
			effects: {
				show: function() {
					var $widget = toast.getElements( 'widget' );

					$widget.show();

					toast.refreshPosition();

					var top = parseInt( $widget.css( 'top' ), 10 );

					$widget
						.hide()
						.css( 'top', top + 100 );

					$widget.animate( {
						opacity: 'show',
						height: 'show',
						paddingBottom: 'show',
						paddingTop: 'show',
						top: top
					}, {
						easing: 'linear',
						duration: 300
					} );
				},
				hide: function() {
					var $widget = toast.getElements( 'widget' ),
						top = parseInt( $widget.css( 'top' ), 10 );

					$widget.animate( {
						opacity: 'hide',
						height: 'hide',
						paddingBottom: 'hide',
						paddingTop: 'hide',
						top: top + 100
					}, {
						easing: 'linear',
						duration: 300
					} );
				}
			},
			button: {
				tag: 'div'
			}
		} );

		this.getToast = function() {
			return toast;
		};
	},

	showToast: function( options ) {
		var toast = this.getToast();

		toast.setMessage( options.message );

		toast.getElements( 'buttonsWrapper' ).empty();

		if ( options.buttons ) {
			options.buttons.forEach( function( button ) {
				toast.addButton( button );
			} );
		}

		toast.show();
	},

	onInit: function() {
		this.initToast();
	}
} );

},{"qazana-utils/module":140}],127:[function(require,module,exports){
var presetsFactory;

presetsFactory = {

	getPresetsDictionary: function() {
		return {
			11: 100 / 9,
			12: 100 / 8,
			14: 100 / 7,
			16: 100 / 6,
			33: 100 / 3,
			66: 2 / 3 * 100,
			83: 5 / 6 * 100
		};
	},

	getAbsolutePresetValues: function( preset ) {
		var clonedPreset = qazana.helpers.cloneObject( preset ),
			presetDictionary = this.getPresetsDictionary();

		_.each( clonedPreset, function( unitValue, unitIndex ) {
			if ( presetDictionary[ unitValue ] ) {
				clonedPreset[ unitIndex ] = presetDictionary[ unitValue ];
			}
		} );

		return clonedPreset;
	},

	getPresets: function( columnsCount, presetIndex ) {
		var presets = qazana.helpers.cloneObject( qazana.config.elements.section.presets );

		if ( columnsCount ) {
			presets = presets[ columnsCount ];
		}

		if ( presetIndex ) {
			presets = presets[ presetIndex ];
		}

		return presets;
	},

	getPresetByStructure: function( structure ) {
		var parsedStructure = this.getParsedStructure( structure );

		return this.getPresets( parsedStructure.columnsCount, parsedStructure.presetIndex );
	},

	getParsedStructure: function( structure ) {
		structure += ''; // Make sure this is a string

		return {
			columnsCount: structure.slice( 0, -1 ),
			presetIndex: structure.substr( -1 )
		};
	},

	getPresetSVG: function( preset, svgWidth, svgHeight, separatorWidth ) {
		svgWidth = svgWidth || 100;
		svgHeight = svgHeight || 50;
		separatorWidth = separatorWidth || 2;

		var absolutePresetValues = this.getAbsolutePresetValues( preset ),
			presetSVGPath = this._generatePresetSVGPath( absolutePresetValues, svgWidth, svgHeight, separatorWidth );

		return this._createSVGPreset( presetSVGPath, svgWidth, svgHeight );
	},

	_createSVGPreset: function( presetPath, svgWidth, svgHeight ) {
		var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );

		svg.setAttributeNS( 'http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink' );
		svg.setAttribute( 'viewBox', '0 0 ' + svgWidth + ' ' + svgHeight );

		var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );

		path.setAttribute( 'd', presetPath );

		svg.appendChild( path );

		return svg;
	},

	_generatePresetSVGPath: function( preset, svgWidth, svgHeight, separatorWidth ) {
		var DRAW_SIZE = svgWidth - separatorWidth * ( preset.length - 1 );

		var xPointer = 0,
			dOutput = '';

		for ( var i = 0; i < preset.length; i++ ) {
			if ( i ) {
				dOutput += ' ';
			}

			var increment = preset[ i ] / 100 * DRAW_SIZE;

			xPointer += increment;

			dOutput += 'M' + ( +xPointer.toFixed( 4 ) ) + ',0';

			dOutput += 'V' + svgHeight;

			dOutput += 'H' + ( +( xPointer - increment ).toFixed( 4 ) );

			dOutput += 'V0Z';

			xPointer += separatorWidth;
		}

		return dOutput;
	}
};

module.exports = presetsFactory;

},{}],128:[function(require,module,exports){
var Schemes,
	Stylesheet = require( 'qazana-editor-utils/stylesheet' ),
	ControlsCSSParser = require( 'qazana-editor-utils/controls-css-parser' );

Schemes = function() {
	var self = this,
		stylesheet = new Stylesheet(),
		schemes = {},
		settings = {
			selectorWrapperPrefix: '.qazana-widget-'
		},
		elements = {};

	var buildUI = function() {
		elements.$previewHead.append( elements.$style );
	};

	var initElements = function() {
		elements.$style = jQuery( '<style>', {
			id: 'qazana-style-scheme'
		});

		elements.$previewHead = qazana.$previewContents.find( 'head' );
	};

	var initSchemes = function() {
		schemes = qazana.helpers.cloneObject( qazana.config.schemes.items );
	};

	var fetchControlStyles = function( control, controlsStack, widgetType ) {
		ControlsCSSParser.addControlStyleRules( stylesheet, control, controlsStack, function( control ) {
			return self.getSchemeValue( control.scheme.type, control.scheme.value, control.scheme.key ).value;
		}, [ '{{WRAPPER}}' ], [ settings.selectorWrapperPrefix + widgetType ] );
	};

	var fetchWidgetControlsStyles = function( widget ) {
		var widgetSchemeControls = self.getWidgetSchemeControls( widget );

		_.each( widgetSchemeControls, function( control ) {
			fetchControlStyles( control, widgetSchemeControls, widget.widget_type );
		} );
	};

	var fetchAllWidgetsSchemesStyle = function() {
		_.each( qazana.config.widgets, function( widget ) {
			fetchWidgetControlsStyles(  widget  );
		} );
	};

	this.init = function() {
		initElements();
		buildUI();
		initSchemes();

		return self;
	};

	this.getWidgetSchemeControls = function( widget ) {
		return _.filter( widget.controls, function( control ) {
			return _.isObject( control.scheme );
		} );
	};

	this.getSchemes = function() {
		return schemes;
	};

	this.getEnabledSchemesTypes = function() {
		return qazana.config.schemes.enabled_schemes;
	};

	this.getScheme = function( schemeType ) {
		return schemes[ schemeType ];
	};

	this.getSchemeValue = function( schemeType, value, key ) {
		if ( this.getEnabledSchemesTypes().indexOf( schemeType ) < 0 ) {
			return false;
		}

		var scheme = self.getScheme( schemeType ),
			schemeValue = scheme.items[ value ];

		if ( key && _.isObject( schemeValue ) ) {
			var clonedSchemeValue = qazana.helpers.cloneObject( schemeValue );

			clonedSchemeValue.value = schemeValue.value[ key ];

			return clonedSchemeValue;
		}

		return schemeValue;
	};

	this.printSchemesStyle = function() {
		stylesheet.empty();

		fetchAllWidgetsSchemesStyle();

		elements.$style.text( stylesheet );
	};

	this.resetSchemes = function( schemeName ) {
		schemes[ schemeName ] = qazana.helpers.cloneObject( qazana.config.schemes.items[ schemeName ] );
	};

	this.saveScheme = function( schemeName ) {
		qazana.config.schemes.items[ schemeName ].items = qazana.helpers.cloneObject( schemes[ schemeName ].items );

		var itemsToSave = {};

		_.each( schemes[ schemeName ].items, function( item, key ) {
			itemsToSave[ key ] = item.value;
		} );

		NProgress.start();

		qazana.ajax.send( 'apply_scheme', {
			data: {
				scheme_name: schemeName,
				data: JSON.stringify( itemsToSave )
			},
			success: function() {
				NProgress.done();
			}
		} );
	};

	this.setSchemeValue = function( schemeName, itemKey, value ) {
		schemes[ schemeName ].items[ itemKey ].value = value;
	};
};

module.exports = new Schemes();

},{"qazana-editor-utils/controls-css-parser":119,"qazana-editor-utils/stylesheet":129}],129:[function(require,module,exports){
( function( $ ) {

	var Stylesheet = function() {
		var self = this,
			rules = {},
			rawCSS = {},
			devices = {};

		var getDeviceMaxValue = function( deviceName ) {
			var deviceNames = Object.keys( devices ),
				deviceNameIndex = deviceNames.indexOf( deviceName ),
				nextIndex = deviceNameIndex + 1;

			if ( nextIndex >= deviceNames.length ) {
				throw new RangeError( 'Max value for this device is out of range.' );
			}

			return devices[ deviceNames[ nextIndex ] ] - 1;
		};

		var queryToHash = function( query ) {
			var hash = [];

			$.each( query, function( endPoint ) {
				hash.push( endPoint + '_' + this );
			} );

			return hash.join( '-' );
		};

		var hashToQuery = function( hash ) {
			var query = {};

			hash = hash.split( '-' ).filter( String );

			hash.forEach( function( singleQuery ) {
				var queryParts = singleQuery.split( '_' ),
					endPoint = queryParts[0],
					deviceName = queryParts[1];

				query[ endPoint ] = 'max' === endPoint ? getDeviceMaxValue( deviceName ) : devices[ deviceName ];
			} );

			return query;
		};

		var addQueryHash = function( queryHash ) {
			rules[ queryHash ] = {};

			var hashes = Object.keys( rules );

			if ( hashes.length < 2 ) {
				return;
			}

			// Sort the devices from narrowest to widest
			hashes.sort( function( a, b ) {
				if ( 'all' === a ) {
					return -1;
				}

				if ( 'all' === b ) {
					return 1;
				}

				var aQuery = hashToQuery( a ),
					bQuery = hashToQuery( b );

				return bQuery.max - aQuery.max;
			} );

			var sortedRules = {};

			hashes.forEach( function( deviceName ) {
				sortedRules[ deviceName ] = rules[ deviceName ];
			} );

			rules = sortedRules;
		};

		var getQueryHashStyleFormat = function( queryHash ) {
			var query = hashToQuery( queryHash ),
				styleFormat = [];

			$.each( query, function( endPoint ) {
				styleFormat.push( '(' + endPoint + '-width:' + this + 'px)' );
			} );

			return '@media' + styleFormat.join( ' and ' );
		};

		this.addDevice = function( deviceName, deviceValue ) {
			devices[ deviceName ] = deviceValue;

			var deviceNames = Object.keys( devices );

			if ( deviceNames.length < 2 ) {
				return self;
			}

			// Sort the devices from narrowest to widest
			deviceNames.sort( function( a, b ) {
				return devices[ a ] - devices[ b ];
			} );

			var sortedDevices = {};

			deviceNames.forEach( function( deviceName ) {
				sortedDevices[ deviceName ] = devices[ deviceName ];
			} );

			devices = sortedDevices;

			return self;
		};

		this.addRawCSS = function( key, css ) {
			rawCSS[ key ] = css;
		};

		this.addRules = function( selector, styleRules, query ) {
			var queryHash = 'all';

			if ( ! _.isEmpty( query ) ) {
				queryHash = queryToHash( query );
			}

			if ( ! rules[ queryHash ] ) {
				addQueryHash( queryHash );
			}

			if ( ! styleRules ) {
				var parsedRules = selector.match( /[^{]+\{[^}]+}/g );

				$.each( parsedRules, function() {
					var parsedRule = this.match( /([^{]+)\{([^}]+)}/ );

					if ( parsedRule ) {
						self.addRules( parsedRule[1].trim(), parsedRule[2].trim(), query );
					}
				} );

				return;
			}

			if ( ! rules[ queryHash ][ selector ] ) {
				rules[ queryHash ][ selector ] = {};
			}

			if ( 'string' === typeof styleRules ) {
				styleRules = styleRules.split( ';' ).filter( String );

				var orderedRules = {};

				try {
					$.each( styleRules, function() {
						var property = this.split( /:(.*)?/ );

						orderedRules[ property[0].trim() ] = property[1].trim().replace( ';', '' );
					} );
				} catch ( error ) { // At least one of the properties is incorrect
					return;
				}

				styleRules = orderedRules;
			}

			$.extend( rules[ queryHash ][ selector ], styleRules );

			return self;
		};

		this.getRules = function() {
			return rules;
		};

		this.empty = function() {
			rules = {};
			rawCSS = {};
		};

		this.toString = function() {
			var styleText = '';

			$.each( rules, function( queryHash ) {
				var deviceText = Stylesheet.parseRules( this );

				if ( 'all' !== queryHash ) {
					deviceText = getQueryHashStyleFormat( queryHash ) + '{' + deviceText + '}';
				}

				styleText += deviceText;
			} );

			$.each( rawCSS, function() {
				styleText += this;
			} );

			return styleText;
		};
	};

	Stylesheet.parseRules = function( rules ) {
		var parsedRules = '';

		$.each( rules, function( selector ) {
			var selectorContent = Stylesheet.parseProperties( this );

			if ( selectorContent ) {
				parsedRules += selector + '{' + selectorContent + '}';
			}
		} );

		return parsedRules;
	};

	Stylesheet.parseProperties = function( properties ) {
		var parsedProperties = '';

		$.each( properties, function( propertyKey ) {
			if ( this ) {
				parsedProperties += propertyKey + ':' + this + ';';
			}
		} );

		return parsedProperties;
	};

	module.exports = Stylesheet;
} )( jQuery );

},{}],130:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-add-section' ),

	attributes: {
		'data-view': 'choose-action'
	},

	ui: {
		addNewSection: '.qazana-add-new-section',
		closeButton: '.qazana-add-section-close',
		addSectionButton: '.qazana-add-section-button',
		addTemplateButton: '.qazana-add-template-button',
		selectPreset: '.qazana-select-preset',
		presets: '.qazana-preset'
	},

	events: {
		'click @ui.addSectionButton': 'onAddSectionButtonClick',
		'click @ui.addTemplateButton': 'onAddTemplateButtonClick',
		'click @ui.closeButton': 'onCloseButtonClick',
		'click @ui.presets': 'onPresetSelected'
	},

	behaviors: function() {
		return {
			contextMenu: {
				behaviorClass: require( 'qazana-behaviors/context-menu' ),
				groups: this.getContextMenuGroups()
			}
		};
	},

	className: function() {
		return 'qazana-add-section qazana-visible-desktop';
	},

	addSection: function( properties, options ) {
		return qazana.getPreviewView().addChildElement( properties, jQuery.extend( {}, this.options, options ) );
	},

	setView: function( view ) {
		this.$el.attr( 'data-view', view );
	},

	showSelectPresets: function() {
		this.setView( 'select-preset' );
	},

	closeSelectPresets: function() {
		this.setView( 'choose-action' );
	},

	getTemplatesModalOptions: function() {
		return {
			importOptions: {
				at: this.getOption( 'at' )
			}
		};
	},

	getContextMenuGroups: function() {
		var hasContent = function() {
			return qazana.elements.length > 0;
		};

		return [
			{
				name: 'paste',
				actions: [
					{
						name: 'paste',
						title: qazana.translate( 'paste' ),
						callback: this.paste.bind( this ),
						isEnabled: this.isPasteEnabled.bind( this )
					}
				]
			}, {
				name: 'content',
				actions: [
					{
						name: 'copy_all_content',
						title: qazana.translate( 'copy_all_content' ),
						callback: this.copy.bind( this ),
						isEnabled: hasContent
					}, {
						name: 'delete_all_content',
						title: qazana.translate( 'delete_all_content' ),
						callback: qazana.clearPage.bind( qazana ),
						isEnabled: hasContent
					}
				]
			}
		];
	},

	copy: function() {
		qazana.getPreviewView().copy();
	},

	paste: function() {
		qazana.getPreviewView().paste( this.getOption( 'at' ) );
	},

	isPasteEnabled: function() {
		return qazana.getStorage( 'transfer' );
	},

	onAddSectionButtonClick: function() {
		this.showSelectPresets();
	},

	onAddTemplateButtonClick: function() {
		qazana.templates.startModal( this.getTemplatesModalOptions() );
	},

	onRender: function() {
		this.$el.html5Droppable( {
			axis: [ 'vertical' ],
			groups: [ 'qazana-element' ],
			placeholder: false,
			currentElementClass: 'qazana-html5dnd-current-element',
			hasDraggingOnChildClass: 'qazana-dragging-on-child',
			onDropping: this.onDropping.bind( this )
		} );
	},

	onPresetSelected: function( event ) {
		this.closeSelectPresets();

		var selectedStructure = event.currentTarget.dataset.structure,
			parsedStructure = qazana.presetsFactory.getParsedStructure( selectedStructure ),
			elements = [],
			loopIndex;

		for ( loopIndex = 0; loopIndex < parsedStructure.columnsCount; loopIndex++ ) {
			elements.push( {
				id: qazana.helpers.getUniqueID(),
				elType: 'column',
				settings: {},
				elements: []
			} );
		}

		qazana.channels.data.trigger( 'element:before:add', {
			elType: 'section'
		} );

		var newSection = this.addSection( { elements: elements } );

		newSection.setStructure( selectedStructure );

		qazana.channels.data.trigger( 'element:after:add' );
	},

	onDropping: function() {
		qazana.channels.data.trigger( 'section:before:drop' );

		this.addSection().addElementFromPanel();

		qazana.channels.data.trigger( 'section:after:drop' );
	}
} );

},{"qazana-behaviors/context-menu":75}],131:[function(require,module,exports){
var BaseAddSectionView = require( 'qazana-views/add-section/base' );

module.exports = BaseAddSectionView.extend( {
	id: 'qazana-add-new-section',

	onCloseButtonClick: function() {
		this.closeSelectPresets();
	}
} );

},{"qazana-views/add-section/base":130}],132:[function(require,module,exports){
var BaseAddSectionView = require( 'qazana-views/add-section/base' );

module.exports = BaseAddSectionView.extend( {

	className: function() {
		return BaseAddSectionView.prototype.className.apply( this, arguments ) + ' qazana-add-section-inline';
	},

	fadeToDeath: function() {
		var self = this;

		self.$el.slideUp( function() {
			self.destroy();
		} );
	},

	paste: function() {
		BaseAddSectionView.prototype.paste.apply( this, arguments );

		this.destroy();
	},

	onCloseButtonClick: function() {
		this.fadeToDeath();
	},

	onPresetSelected: function() {
		BaseAddSectionView.prototype.onPresetSelected.apply( this, arguments );

		this.destroy();
	},

	onAddTemplateButtonClick: function() {
		BaseAddSectionView.prototype.onAddTemplateButtonClick.apply( this, arguments );

		this.destroy();
	},

	onDropping: function() {
		BaseAddSectionView.prototype.onDropping.apply( this, arguments );

		this.destroy();
	}
} );

},{"qazana-views/add-section/base":130}],133:[function(require,module,exports){
module.exports = Marionette.CompositeView.extend( {

	templateHelpers: function() {
		return {
			view: this
		};
	},

	getBehavior: function( name ) {
		return this._behaviors[ Object.keys( this.behaviors() ).indexOf( name ) ];
	},

	initialize: function() {
		this.collection = this.model.get( 'elements' );
	},

	addChildModel: function( model, options ) {
		return this.collection.add( model, options, true );
	},

	addChildElement: function( data, options ) {
		if ( this.isCollectionFilled() ) {
			return;
		}

		options = jQuery.extend( {
			trigger: false,
			edit: true,
			onBeforeAdd: null,
			onAfterAdd: null
		}, options );

		var childTypes = this.getChildType(),
			newItem,
			elType;

		if ( data instanceof Backbone.Model ) {
			newItem = data;

			elType = newItem.get( 'elType' );
		} else {
			newItem = {
				id: qazana.helpers.getUniqueID(),
				elType: childTypes[0],
				settings: {},
				elements: []
			};

			if ( data ) {
				jQuery.extend( newItem, data );
			}

			elType = newItem.elType;
		}

		if ( -1 === childTypes.indexOf( elType ) ) {
			return this.children.last().addChildElement( newItem, options );
		}

		if ( options.clone ) {
			newItem = this.cloneItem( newItem );
		}

		if ( options.trigger ) {
			qazana.channels.data.trigger( options.trigger.beforeAdd, newItem );
		}

		if ( options.onBeforeAdd ) {
			options.onBeforeAdd();
		}

		var newModel = this.addChildModel( newItem, { at: options.at } ),
			newView = this.children.findByModel( newModel );

		if ( options.onAfterAdd ) {
			options.onAfterAdd( newModel, newView );
		}

		if ( options.trigger ) {
			qazana.channels.data.trigger( options.trigger.afterAdd, newItem );
		}

		if ( options.edit ) {
			newModel.trigger( 'request:edit' );
		}

		return newView;
	},

	cloneItem: function( item ) {
		var self = this;

		if ( item instanceof Backbone.Model ) {
			return item.clone();
		}

		item.id = qazana.helpers.getUniqueID();

		item.elements.forEach( function( childItem, index ) {
			item.elements[ index ] = self.cloneItem( childItem );
		} );

		return item;
	},

	isCollectionFilled: function() {
		return false;
	},

	onChildviewRequestAddNew: function( childView ) {
		this.addChildElement( {}, {
			at: childView.$el.index() + 1,
			trigger: {
				beforeAdd: 'element:before:add',
				afterAdd: 'element:after:add'
			}
		} );
	},

	onChildviewRequestPaste: function( childView ) {
		var self = this;

		if ( self.isCollectionFilled() ) {
			return;
		}

		var elements = qazana.getStorage( 'transfer' ).elements,
			index = self.collection.indexOf( childView.model );

		qazana.channels.data.trigger( 'element:before:add', elements[0] );

		elements.forEach( function( item ) {
			index++;

			self.addChildElement( item, { at: index, clone: true } );
		} );

		qazana.channels.data.trigger( 'element:after:add', elements[0] );
	}
} );

},{}],134:[function(require,module,exports){
var SectionView = require( 'qazana-elements/views/section' ),
	BaseContainer = require( 'qazana-views/base-container' ),
	BaseSectionsContainerView;

BaseSectionsContainerView = BaseContainer.extend( {
	childView: SectionView,

	behaviors: function() {
		var behaviors = {
			Sortable: {
				behaviorClass: require( 'qazana-behaviors/sortable' ),
				elChildType: 'section'
			}
		};

		return qazana.hooks.applyFilters( 'elements/base-section-container/behaviors', behaviors, this );
	},

	getSortableOptions: function() {
		return {
			handle: '> .qazana-element-overlay .qazana-editor-element-edit',
			items: '> .qazana-section'
		};
	},

	getChildType: function() {
		return [ 'section' ];
	},

	initialize: function() {
		BaseContainer.prototype.initialize.apply( this, arguments );

		this
			.listenTo( this.collection, 'add remove reset', this.onCollectionChanged )
			.listenTo( qazana.channels.panelElements, 'element:drag:start', this.onPanelElementDragStart )
			.listenTo( qazana.channels.panelElements, 'element:drag:end', this.onPanelElementDragEnd );
	},

	onCollectionChanged: function() {
		qazana.saver.setFlagEditorChange( true );
	},

	onPanelElementDragStart: function() {
		qazana.helpers.disableElementEvents( this.$el.find( 'iframe' ) );
	},

	onPanelElementDragEnd: function() {
		qazana.helpers.enableElementEvents( this.$el.find( 'iframe' ) );
	}
} );

module.exports = BaseSectionsContainerView;

},{"qazana-behaviors/sortable":79,"qazana-elements/views/section":82,"qazana-views/base-container":133}],135:[function(require,module,exports){
var ControlsStack;

ControlsStack = Marionette.CompositeView.extend( {
	className: 'qazana-panel-controls-stack',

	classes: {
		popover: 'qazana-controls-popover'
	},

	activeTab: null,

	activeSection: null,

	templateHelpers: function() {
		return {
			elementData: qazana.getElementData( this.model )
		};
	},

	ui: function() {
		return {
			tabs: '.qazana-panel-navigation-tab',
			reloadButton: '.qazana-update-preview-button'
		};
	},

	events: function() {
		return {
			'click @ui.tabs': 'onClickTabControl',
			'click @ui.reloadButton': 'onReloadButtonClick'
		};
	},

	modelEvents: {
		'destroy': 'onModelDestroy'
	},

	behaviors: {
		HandleInnerTabs: {
			behaviorClass: require( 'qazana-behaviors/inner-tabs' )
		}
	},

	initialize: function() {
		this.initCollection();

		this.listenTo( qazana.channels.deviceMode, 'change', this.onDeviceModeChange );
	},

	initCollection: function() {
		this.collection = new Backbone.Collection( _.values( qazana.mergeControlsSettings( this.getOption( 'controls' ) ) ) );
	},

	filter: function( controlModel ) {
		if ( controlModel.get( 'tab' ) !== this.activeTab ) {
			return false;
		}

		if ( 'section' === controlModel.get( 'type' ) ) {
			return true;
		}

		var section = controlModel.get( 'section' );

		return ! section || section === this.activeSection;
	},

	isVisibleSectionControl: function( sectionControlModel ) {
		return this.activeTab === sectionControlModel.get( 'tab' );
	},

	activateTab: function( tabName ) {
		this.activeTab = tabName;

		this.ui.tabs
			.removeClass( 'qazana-active' )
			.filter( '[data-tab="' + tabName + '"]' )
			.addClass( 'qazana-active' );

		this.activateFirstSection();
	},

	activateSection: function( sectionName ) {
		this.activeSection = sectionName;
	},

	activateFirstSection: function() {
		var self = this;

		var sectionControls = self.collection.filter( function( controlModel ) {
			return 'section' === controlModel.get( 'type' ) && self.isVisibleSectionControl( controlModel );
		} );

		if ( ! sectionControls[0] ) {
			return;
		}

		var preActivatedSection = sectionControls.filter( function( controlModel ) {
			return self.activeSection === controlModel.get( 'name' );
		} );

		if ( preActivatedSection[0] ) {
			return;
		}

		self.activateSection( sectionControls[0].get( 'name' ) );
	},

	getChildView: function( item ) {
		var controlType = item.get( 'type' );

		return qazana.getControlView( controlType );
	},

	handlePopovers: function() {
		var self = this,
			popoverStarted = false,
			$popover;

		self.removePopovers();

		self.children.each( function( child ) {
			if ( popoverStarted ) {
				$popover.append( child.$el );
			}

			var popover = child.model.get( 'popover' );

			if ( ! popover ) {
				return;
			}

			if ( popover.start ) {
				popoverStarted = true;

				$popover = jQuery( '<div>', { 'class': self.classes.popover } );

				child.$el.before( $popover );

				$popover.append( child.$el );
			}

			if ( popover.end ) {
				popoverStarted = false;
			}
		} );
	},

	removePopovers: function() {
		this.$el.find( '.' + this.classes.popover ).remove();
	},

	openActiveSection: function() {
		var activeSection = this.activeSection,
			activeSectionView = this.children.filter( function( view ) {
				return activeSection === view.model.get( 'name' );
			} );

		if ( activeSectionView[0] ) {
			activeSectionView[0].$el.addClass( 'qazana-open' );
		}
	},

	onRenderCollection: function() {
		this.openActiveSection();

		this.handlePopovers();
	},

	onRenderTemplate: function() {
		this.activateTab( this.activeTab || this.ui.tabs.eq( 0 ).data( 'tab' ) );
	},

	onModelDestroy: function() {
		this.destroy();
	},

	onClickTabControl: function( event ) {
		event.preventDefault();

		var $tab = this.$( event.currentTarget ),
			tabName = $tab.data( 'tab' );

		if ( this.activeTab === tabName ) {
			return;
		}

		this.activateTab( tabName );

		this._renderChildren();
	},

	onReloadButtonClick: function() {
		qazana.reloadPreview();
	},

	onDeviceModeChange: function() {
		this.$el.removeClass( 'qazana-responsive-switchers-open' );
	},

	onChildviewControlSectionClicked: function( childView ) {
		var isSectionOpen = childView.$el.hasClass( 'qazana-open' );

		this.activateSection( isSectionOpen ? null : childView.model.get( 'name' ) );

		this._renderChildren();
	},

	onChildviewResponsiveSwitcherClick: function( childView, device ) {
		if ( 'desktop' === device ) {
			this.$el.toggleClass( 'qazana-responsive-switchers-open' );
		}
	}
} );

module.exports = ControlsStack;

},{"qazana-behaviors/inner-tabs":77}],136:[function(require,module,exports){
var BaseSectionsContainerView = require( 'qazana-views/base-sections-container' ),
	AddSectionView = require( 'qazana-views/add-section/independent' ),
	Preview;

Preview = BaseSectionsContainerView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-preview' ),

	className: 'qazana-inner',

	childViewContainer: '.qazana-section-wrap',

	behaviors: function() {
		var parentBehaviors = BaseSectionsContainerView.prototype.behaviors.apply( this, arguments ),
			behaviors = {
				contextMenu: {
					behaviorClass: require( 'qazana-behaviors/context-menu' ),
					groups: this.getContextMenuGroups()
				}
			};

		return jQuery.extend( parentBehaviors, behaviors );
	},

	getContextMenuGroups: function() {
		var hasContent = function() {
			return qazana.elements.length > 0;
		};

		return [
			{
				name: 'paste',
				actions: [
					{
						name: 'paste',
						title: qazana.translate( 'paste' ),
						callback: this.paste.bind( this ),
						isEnabled: this.isPasteEnabled.bind( this )
					}
				]
			}, {
				name: 'content',
				actions: [
					{
						name: 'copy_all_content',
						title: qazana.translate( 'copy_all_content' ),
						callback: this.copy.bind( this ),
						isEnabled: hasContent
					}, {
						name: 'delete_all_content',
						title: qazana.translate( 'delete_all_content' ),
						callback: qazana.clearPage.bind( qazana ),
						isEnabled: hasContent
					}
				]
			}
		];
	},

	copy: function() {
		qazana.setStorage( 'transfer', {
			type: 'copy',
			elementsType: 'section',
			elements: qazana.elements.toJSON( { copyHtmlCache: true } )
		} );
	},

	paste: function( atIndex ) {
		var self = this,
			transferData = qazana.getStorage( 'transfer' ),
			section,
			index = undefined !== atIndex ? atIndex : this.collection.length;

		qazana.channels.data.trigger( 'element:before:add', transferData.elements[0] );

		if ( 'section' === transferData.elementsType ) {
			transferData.elements.forEach( function( element ) {
				self.addChildElement( element, {
					at: index,
					edit: false,
					clone: true
				} );

				index++;
			} );
		} else if ( 'column' === transferData.elementsType ) {
			section = self.addChildElement( { allowEmpty: true }, { at: atIndex } );

			section.model.unset( 'allowEmpty' );

			index = 0;

			transferData.elements.forEach( function( element ) {
				section.addChildElement( element, {
					at: index,
					clone: true
				} );

				index++;
			} );

			section.redefineLayout();
		} else {
			section = self.addChildElement( null, { at: atIndex } );

			index = 0;

			transferData.elements.forEach( function( element ) {
				section.addChildElement( element, {
					at: index,
					clone: true
				} );

				index++;
			} );
		}

		qazana.channels.data.trigger( 'element:after:add', transferData.elements[0] );
	},

	isPasteEnabled: function() {
		return qazana.getStorage( 'transfer' );
	},

	onRender: function() {
		if ( ! qazana.userCan( 'design' ) ) {
			return;
		}
		var addNewSectionView = new AddSectionView();

		addNewSectionView.render();

		this.$el.append( addNewSectionView.$el );
	}
} );

module.exports = Preview;

},{"qazana-behaviors/context-menu":75,"qazana-views/add-section/independent":131,"qazana-views/base-sections-container":134}],137:[function(require,module,exports){
'use strict';

/**
 * Handles managing all events for whatever you plug it into. Priorities for hooks are based on lowest to highest in
 * that, lowest priority hooks are fired first.
 */
var EventManager = function() {
	var slice = Array.prototype.slice,
		MethodsAvailable;

	/**
	 * Contains the hooks that get registered with this EventManager. The array for storage utilizes a "flat"
	 * object literal such that looking up the hook utilizes the native object literal hash.
	 */
	var STORAGE = {
		actions: {},
		filters: {}
	};

	/**
	 * Removes the specified hook by resetting the value of it.
	 *
	 * @param type Type of hook, either 'actions' or 'filters'
	 * @param hook The hook (namespace.identifier) to remove
	 *
	 * @private
	 */
	function _removeHook( type, hook, callback, context ) {
		var handlers, handler, i;

		if ( ! STORAGE[ type ][ hook ] ) {
			return;
		}
		if ( ! callback ) {
			STORAGE[ type ][ hook ] = [];
		} else {
			handlers = STORAGE[ type ][ hook ];
			if ( ! context ) {
				for ( i = handlers.length; i--; ) {
					if ( handlers[ i ].callback === callback ) {
						handlers.splice( i, 1 );
					}
				}
			} else {
				for ( i = handlers.length; i--; ) {
					handler = handlers[ i ];
					if ( handler.callback === callback && handler.context === context ) {
						handlers.splice( i, 1 );
					}
				}
			}
		}
	}

	/**
	 * Use an insert sort for keeping our hooks organized based on priority. This function is ridiculously faster
	 * than bubble sort, etc: http://jsperf.com/javascript-sort
	 *
	 * @param hooks The custom array containing all of the appropriate hooks to perform an insert sort on.
	 * @private
	 */
	function _hookInsertSort( hooks ) {
		var tmpHook, j, prevHook;
		for ( var i = 1, len = hooks.length; i < len; i++ ) {
			tmpHook = hooks[ i ];
			j = i;
			while ( ( prevHook = hooks[ j - 1 ] ) && prevHook.priority > tmpHook.priority ) {
				hooks[ j ] = hooks[ j - 1 ];
				--j;
			}
			hooks[ j ] = tmpHook;
		}

		return hooks;
	}

	/**
	 * Adds the hook to the appropriate storage container
	 *
	 * @param type 'actions' or 'filters'
	 * @param hook The hook (namespace.identifier) to add to our event manager
	 * @param callback The function that will be called when the hook is executed.
	 * @param priority The priority of this hook. Must be an integer.
	 * @param [context] A value to be used for this
	 * @private
	 */
	function _addHook( type, hook, callback, priority, context ) {
		var hookObject = {
			callback: callback,
			priority: priority,
			context: context
		};

		// Utilize 'prop itself' : http://jsperf.com/hasownproperty-vs-in-vs-undefined/19
		var hooks = STORAGE[ type ][ hook ];
		if ( hooks ) {
			// TEMP FIX BUG
			var hasSameCallback = false;
			jQuery.each( hooks, function() {
				if ( this.callback === callback ) {
					hasSameCallback = true;
					return false;
				}
			} );

			if ( hasSameCallback ) {
				return;
			}
			// END TEMP FIX BUG

			hooks.push( hookObject );
			hooks = _hookInsertSort( hooks );
		} else {
			hooks = [ hookObject ];
		}

		STORAGE[ type ][ hook ] = hooks;
	}

	/**
	 * Runs the specified hook. If it is an action, the value is not modified but if it is a filter, it is.
	 *
	 * @param type 'actions' or 'filters'
	 * @param hook The hook ( namespace.identifier ) to be ran.
	 * @param args Arguments to pass to the action/filter. If it's a filter, args is actually a single parameter.
	 * @private
	 */
	function _runHook( type, hook, args ) {
		var handlers = STORAGE[ type ][ hook ], i, len;

		if ( ! handlers ) {
			return ( 'filters' === type ) ? args[ 0 ] : false;
		}

		len = handlers.length;
		if ( 'filters' === type ) {
			for ( i = 0; i < len; i++ ) {
				args[ 0 ] = handlers[ i ].callback.apply( handlers[ i ].context, args );
			}
		} else {
			for ( i = 0; i < len; i++ ) {
				handlers[ i ].callback.apply( handlers[ i ].context, args );
			}
		}

		return ( 'filters' === type ) ? args[ 0 ] : true;
	}

	/**
	 * Adds an action to the event manager.
	 *
	 * @param action Must contain namespace.identifier
	 * @param callback Must be a valid callback function before this action is added
	 * @param [priority=10] Used to control when the function is executed in relation to other callbacks bound to the same hook
	 * @param [context] Supply a value to be used for this
	 */
	function addAction( action, callback, priority, context ) {
		if ( 'string' === typeof action && 'function' === typeof callback ) {
			priority = parseInt( ( priority || 10 ), 10 );
			_addHook( 'actions', action, callback, priority, context );
		}

		return MethodsAvailable;
	}

	/**
	 * Performs an action if it exists. You can pass as many arguments as you want to this function; the only rule is
	 * that the first argument must always be the action.
	 */
	function doAction( /* action, arg1, arg2, ... */ ) {
		var args = slice.call( arguments );
		var action = args.shift();

		if ( 'string' === typeof action ) {
			_runHook( 'actions', action, args );
		}

		return MethodsAvailable;
	}

	/**
	 * Removes the specified action if it contains a namespace.identifier & exists.
	 *
	 * @param action The action to remove
	 * @param [callback] Callback function to remove
	 */
	function removeAction( action, callback ) {
		if ( 'string' === typeof action ) {
			_removeHook( 'actions', action, callback );
		}

		return MethodsAvailable;
	}

	/**
	 * Adds a filter to the event manager.
	 *
	 * @param filter Must contain namespace.identifier
	 * @param callback Must be a valid callback function before this action is added
	 * @param [priority=10] Used to control when the function is executed in relation to other callbacks bound to the same hook
	 * @param [context] Supply a value to be used for this
	 */
	function addFilter( filter, callback, priority, context ) {
		if ( 'string' === typeof filter && 'function' === typeof callback ) {
			priority = parseInt( ( priority || 10 ), 10 );
			_addHook( 'filters', filter, callback, priority, context );
		}

		return MethodsAvailable;
	}

	/**
	 * Performs a filter if it exists. You should only ever pass 1 argument to be filtered. The only rule is that
	 * the first argument must always be the filter.
	 */
	function applyFilters( /* filter, filtered arg, arg2, ... */ ) {
		var args = slice.call( arguments );
		var filter = args.shift();

		if ( 'string' === typeof filter ) {
			return _runHook( 'filters', filter, args );
		}

		return MethodsAvailable;
	}

	/**
	 * Removes the specified filter if it contains a namespace.identifier & exists.
	 *
	 * @param filter The action to remove
	 * @param [callback] Callback function to remove
	 */
	function removeFilter( filter, callback ) {
		if ( 'string' === typeof filter ) {
			_removeHook( 'filters', filter, callback );
		}

		return MethodsAvailable;
	}

	/**
	 * Maintain a reference to the object scope so our public methods never get confusing.
	 */
	MethodsAvailable = {
		removeFilter: removeFilter,
		applyFilters: applyFilters,
		addFilter: addFilter,
		removeAction: removeAction,
		doAction: doAction,
		addAction: addAction
	};

	// return all of the publicly available methods
	return MethodsAvailable;
};

module.exports = EventManager;

},{}],138:[function(require,module,exports){
var HotKeys = function() {
	var hotKeysHandlers = {};

	var applyHotKey = function( event ) {
		var handlers = hotKeysHandlers[ event.which ];

		if ( ! handlers ) {
			return;
		}

		jQuery.each( handlers, function() {
			var handler = this;

			if ( handler.isWorthHandling && ! handler.isWorthHandling( event ) ) {
				return;
			}

			// Fix for some keyboard sources that consider alt key as ctrl key
			if ( ! handler.allowAltKey && event.altKey ) {
				return;
			}

			event.preventDefault();

			handler.handle( event );
		} );
	};

	this.isControlEvent = function( event ) {
		return event[ qazana.envData.mac ? 'metaKey' : 'ctrlKey' ];
	};

	this.addHotKeyHandler = function( keyCode, handlerName, handler ) {
		if ( ! hotKeysHandlers[ keyCode ] ) {
			hotKeysHandlers[ keyCode ] = {};
		}

		hotKeysHandlers[ keyCode ][ handlerName ] = handler;
	};

	this.bindListener = function( $listener ) {
		$listener.on( 'keydown', applyHotKey );
	};
};

module.exports = new HotKeys();

},{}],139:[function(require,module,exports){
var ViewModule = require( './view-module' );

module.exports = ViewModule.extend( {

	getDefaultSettings: function() {
		return {
			container: null,
			items: null,
			columnsCount: 3,
			verticalSpaceBetween: 30
		};
	},

	getDefaultElements: function() {
		return {
			$container: jQuery( this.getSettings( 'container' ) ),
			$items: jQuery( this.getSettings( 'items' ) )
		};
	},

	run: function() {
		var heights = [],
			distanceFromTop = this.elements.$container.position().top,
			settings = this.getSettings(),
			columnsCount = settings.columnsCount;

		distanceFromTop += parseInt( this.elements.$container.css( 'margin-top' ), 10 );

		this.elements.$items.each( function( index ) {
			var row = Math.floor( index / columnsCount ),
				$item = jQuery( this ),
				itemHeight = $item[0].getBoundingClientRect().height + settings.verticalSpaceBetween;

			if ( row ) {
				var itemPosition = $item.position(),
                    indexAtRow = index % columnsCount,
                    pullHeight = itemPosition.top - distanceFromTop - heights[ indexAtRow ];

				pullHeight -= parseInt( $item.css( 'margin-top' ), 10 );

				pullHeight *= -1;

				$item.css( 'margin-top', pullHeight + 'px' );

                heights[ indexAtRow ] += itemHeight;
			} else {
				heights.push( itemHeight );
			}
		} );
	}
} );

},{"./view-module":141}],140:[function(require,module,exports){
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
		if ( 'object' === typeof eventName ) {
			$.each( eventName, function( singleEventName ) {
				self.on( singleEventName, this );
			} );

			return self;
		}

		var eventNames = eventName.split( ' ' );

		eventNames.forEach( function( singleEventName ) {
			if ( ! events[ singleEventName ] ) {
				events[ singleEventName ] = [];
			}

			events[ singleEventName ].push( callback );
		} );

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
			return self;
		}

		$.each( callbacks, function( index, callback ) {
			callback.apply( self, params );
		} );

		return self;
	};

    this.getDeviceName = function() {
        if ( jQuery('body').hasClass( 'mobile' ) ) {
            return 'mobile';
        } else if ( jQuery('body').hasClass( 'tablet' ) ) {
            return 'tablet';
        }
        return '';
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

},{}],141:[function(require,module,exports){
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

},{"qazana-utils/module":140}],142:[function(require,module,exports){
module.exports = Marionette.Behavior.extend( {
	listenerAttached: false,

	// use beforeRender that runs after the collection is exist
	onBeforeRender: function() {
		if ( this.view.collection && ! this.listenerAttached ) {
			this.view.collection
				.on( 'update', this.saveCollectionHistory, this )
				.on( 'reset', this.onDeleteAllContent, this );
			this.listenerAttached = true;
		}
	},

	onDeleteAllContent: function( collection, event ) {
		if ( ! qazana.history.history.getActive() ) {
			// On Redo the History Listener is not active - stop here for better performance.
			return;
		}

		var modelsJSON = [];

		_.each( event.previousModels, function( model ) {
			modelsJSON.push( model.toJSON( { copyHtmlCache: true } ) );
		} );

		var historyItem = {
			type: 'remove',
			elementType: 'section',
			title: qazana.translate( 'all_content' ),
			history: {
				behavior: this,
				collection: event.previousModels,
				event: event,
				models: modelsJSON
			}
		};

		qazana.history.history.addItem( historyItem );
	},

	saveCollectionHistory: function( collection, event ) {
		if ( ! qazana.history.history.getActive() ) {
			// On Redo the History Listener is not active - stop here for better performance.
			return;
		}

		var historyItem,
			models,
			firstModel,
			type;

		if ( event.add ) {
			models = event.changes.added;
			firstModel = models[0];
			type = 'add';
		} else {
			models = event.changes.removed;
			firstModel = models[0];
			type = 'remove';
		}

		var title = qazana.history.history.getModelLabel( firstModel );

		// If it's an unknown model - don't save
		if ( ! title ) {
			return;
		}

		var modelsJSON = [];

		_.each( models, function( model ) {
			modelsJSON.push( model.toJSON( { copyHtmlCache: true } ) );
		} );

		historyItem = {
			type: type,
			elementType: firstModel.get( 'elType' ),
			elementID: firstModel.get( 'id' ),
			title: title,
			history: {
				behavior: this,
				collection: collection,
				event: event,
				models: modelsJSON
			}
		};

		qazana.history.history.addItem( historyItem );
	},

	add: function( models, toView, position ) {
		if ( 'section' === models[0].elType ) {
			_.each( models, function( model ) {
				model.allowEmpty = true;
			} );
		}

		toView.addChildModel( models, { at: position, silent: 0 } );
	},

	remove: function( models, fromCollection ) {
		fromCollection.remove( models, { silent: 0 } );
	},

	restore: function( historyItem, isRedo ) {
		var	type = historyItem.get( 'type' ),
			history = historyItem.get( 'history' ),
			didAction = false,
			behavior;

		// Find the new behavior and work with him
		if ( history.behavior.view.model ) {
			var modelID = history.behavior.view.model.get( 'id' ),
				view = qazana.history.history.findView( modelID );
			if ( view ) {
				behavior = view.getBehavior( 'CollectionHistory' );
			}
		}

		// Container or new Elements - Doesn't have a new behavior
		if ( ! behavior ) {
			behavior = history.behavior;
		}

		// Stop listen to undo actions
		behavior.view.collection.off( 'update', behavior.saveCollectionHistory );

		switch ( type ) {
			case 'add':
				if ( isRedo ) {
					this.add( history.models, behavior.view, history.event.index );
				} else {
					this.remove( history.models, behavior.view.collection );
				}

				didAction = true;
				break;
			case 'remove':
				if ( isRedo ) {
					this.remove( history.models, behavior.view.collection );
				} else {
					this.add( history.models, behavior.view, history.event.index );
				}

				didAction = true;
				break;
		}

		// Listen again
		behavior.view.collection.on( 'update', behavior.saveCollectionHistory, history.behavior );

		return didAction;
	}
} );


},{}],143:[function(require,module,exports){
var ItemModel = require( './item' );

module.exports = Backbone.Collection.extend( {
	model: ItemModel
} );

},{"./item":146}],144:[function(require,module,exports){
module.exports = Marionette.Behavior.extend( {
	oldValues: [],

	listenerAttached: false,

	initialize: function() {
		this.lazySaveTextHistory = _.debounce( this.saveTextHistory.bind( this ), 800 );
	},

	// use beforeRender that runs after the settingsModel is exist
	onBeforeRender: function() {
		if ( ! this.listenerAttached ) {
			this.listenTo( this.view.getEditModel().get( 'settings' ), 'change', this.saveHistory );
			this.listenerAttached = true;
		}
	},

	saveTextHistory: function( model, changed, control ) {
		var changedAttributes = {},
			currentValue = model.get( control.name ),
			newValue;

		if ( currentValue instanceof Backbone.Collection ) {
			// Deep clone.
			newValue = currentValue.toJSON();
		} else {
			newValue = currentValue;
		}

		changedAttributes[ control.name ] = {
			old: this.oldValues[ control.name ],
			'new': newValue
		};

		var historyItem = {
			type: 'change',
			elementType: 'control',
			title: qazana.history.history.getModelLabel( model ),
			subTitle: control.label,
			history: {
				behavior: this,
				changed: changedAttributes,
				model: this.view.getEditModel().toJSON()
			}
		};

		qazana.history.history.addItem( historyItem );

		delete this.oldValues[ control.name ];
	},

	saveHistory: function( model, options ) {
		if ( ! qazana.history.history.getActive() ) {
			return;
		}

		var self = this,
			changed = Object.keys( model.changed ),
			control = model.controls[ changed[0] ];

		if ( ! control && options && options.control ) {
			control = options.control;
		}

		if ( ! changed.length || ! control ) {
			return;
		}

		if ( 1 === changed.length ) {
			if ( _.isUndefined( self.oldValues[ control.name ] ) ) {
				self.oldValues[ control.name ] = model.previous( control.name );
			}

			if ( qazana.history.history.isItemStarted() ) {
				// Do not delay the execution
				self.saveTextHistory( model, changed, control );
			} else {
				self.lazySaveTextHistory( model, changed, control );
			}

			return;
		}

		var changedAttributes = {};

		_.each( changed, function( controlName ) {
			changedAttributes[ controlName ] = {
				old: model.previous( controlName ),
				'new': model.get( controlName )
			};
		} );

		var historyItem = {
			type: 'change',
			elementType: 'control',
			title: qazana.history.history.getModelLabel( model ),
			history: {
				behavior: this,
				changed: changedAttributes,
				model: this.view.getEditModel().toJSON()
			}
		};

		if ( 1 === changed.length ) {
			historyItem.subTitle = control.label;
		}

		qazana.history.history.addItem( historyItem );
	},

	restore: function( historyItem, isRedo ) {
		var	history = historyItem.get( 'history' ),
			modelID = history.model.id,
			view = qazana.history.history.findView( modelID );

		if ( ! view ) {
			return;
		}

		var model = view.getEditModel ? view.getEditModel() : view.model,
			settings = model.get( 'settings' ),
			behavior = view.getBehavior( 'ElementHistory' );

		// Stop listen to restore actions
		behavior.stopListening( settings, 'change', this.saveHistory );

		var restoredValues = {};
		_.each( history.changed, function( values, key ) {
			if ( isRedo ) {
				restoredValues[ key ] = values['new'];
			} else {
				restoredValues[ key ] = values.old;
			}
		} );

		// Set at once.
		settings.setExternalChange( restoredValues );

		historyItem.set( 'status', isRedo ? 'not_applied' : 'applied' );

		// Listen again
		behavior.listenTo( settings, 'change', this.saveHistory );
	}
} );

},{}],145:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-history-no-items',
	id: 'qazana-panel-history-no-items',
	className: 'qazana-panel-nerd-box'
} );

},{}],146:[function(require,module,exports){
module.exports = Backbone.Model.extend( {
	defaults: {
		id: 0,
		type: '',
		elementType: '',
		status: 'not_applied',
		title: '',
		subTitle: '',
		action: '',
		history: {}
	},

	initialize: function() {
		this.set( 'items', new Backbone.Collection() );
	}
} );

},{}],147:[function(require,module,exports){
var HistoryCollection = require( './collection' ),
	HistoryItem = require( './item' ),
	ElementHistoryBehavior = require( './element-behavior' ),
	CollectionHistoryBehavior = require( './collection-behavior' );

var	Manager = function() {
	var self = this,
		currentItemID = null,
		items = new HistoryCollection(),
		editorSaved = false,
		active = true;

	var translations = {
		add: qazana.translate( 'added' ),
		remove: qazana.translate( 'removed' ),
		change: qazana.translate( 'edited' ),
		move: qazana.translate( 'moved' ),
		paste_style: qazana.translate( 'style_pasted' ),
		reset_style: qazana.translate( 'style_reset' )
	};

	var addBehaviors = function( behaviors ) {
		behaviors.ElementHistory = {
			behaviorClass: ElementHistoryBehavior
		};

		behaviors.CollectionHistory = {
			behaviorClass: CollectionHistoryBehavior
		};

		return behaviors;
	};

	var addCollectionBehavior = function( behaviors ) {
		behaviors.CollectionHistory = {
			behaviorClass: CollectionHistoryBehavior
		};

		return behaviors;
	};

	var getActionLabel = function( itemData ) {
		if ( translations[ itemData.type ] ) {
			return translations[ itemData.type ];
		}

		return itemData.type;
	};

	var navigate = function( isRedo ) {
		var currentItem = items.find( function( model ) {
				return 'not_applied' ===  model.get( 'status' );
			} ),
			currentItemIndex = items.indexOf( currentItem ),
			requiredIndex = isRedo ? currentItemIndex - 1 : currentItemIndex + 1;

		if ( ( ! isRedo && ! currentItem ) || requiredIndex < 0  || requiredIndex >= items.length ) {
			return;
		}

		self.doItem( requiredIndex );
	};

	var addHotKeys = function() {
		var H_KEY = 72,
			Y_KEY = 89,
			Z_KEY = 90;

		qazana.hotKeys.addHotKeyHandler( H_KEY, 'showHistoryPage', {
			isWorthHandling: function( event ) {
				return qazana.hotKeys.isControlEvent( event ) && event.shiftKey;
			},
			handle: function() {
				qazana.getPanelView().setPage( 'historyPage' );
			}
		} );

		var navigationWorthHandling = function( event ) {
			return items.length && qazana.hotKeys.isControlEvent( event ) && ! jQuery( event.target ).is( 'input, textarea, [contenteditable=true]' );
		};

		qazana.hotKeys.addHotKeyHandler( Y_KEY, 'historyNavigationRedo', {
			isWorthHandling: navigationWorthHandling,
			handle: function( event ) {
				navigate( true );
			}
		} );

		qazana.hotKeys.addHotKeyHandler( Z_KEY, 'historyNavigation', {
			isWorthHandling: navigationWorthHandling,
			handle: function( event ) {
				navigate( event.shiftKey );
			}
		} );
	};

	var onPanelSave = function() {
		if ( items.length >= 2 ) {
			// Check if it's a save after made changes, `items.length - 1` is the `Editing Started Item
			var firstEditItem = items.at( items.length - 2 );
			editorSaved = ( 'not_applied' === firstEditItem.get( 'status' ) );
		}
	};

	var init = function() {
		addHotKeys();

		qazana.hooks.addFilter( 'elements/base/behaviors', addBehaviors );
		qazana.hooks.addFilter( 'elements/base-section-container/behaviors', addCollectionBehavior );

		qazana.channels.data
			.on( 'drag:before:update', self.startMovingItem )
			.on( 'drag:after:update', self.endItem )

			.on( 'element:before:add', self.startAddElement )
			.on( 'element:after:add', self.endItem )

			.on( 'element:before:remove', self.startRemoveElement )
			.on( 'element:after:remove', self.endItem )

			.on( 'element:before:paste:style', self.startPasteStyle )
			.on( 'element:after:paste:style', self.endItem )

			.on( 'element:before:reset:style', self.startResetStyle )
			.on( 'element:after:reset:style', self.endItem )

			.on( 'section:before:drop', self.startDropElement )
			.on( 'section:after:drop', self.endItem )

			.on( 'template:before:insert', self.startInsertTemplate )
			.on( 'template:after:insert', self.endItem );

		qazana.channels.editor.on( 'saved', onPanelSave );
	};

	this.setActive = function( value ) {
		active = value;
	};

	this.getActive = function() {
		return active;
	};

	this.getItems = function() {
		return items;
	};

	this.startItem = function( itemData ) {
		currentItemID = this.addItem( itemData );
	};

	this.endItem = function() {
		currentItemID = null;
	};

	this.isItemStarted = function() {
		return null !== currentItemID;
	};

	this.addItem = function( itemData ) {
		if ( ! this.getActive() ) {
			return;
		}

		if ( ! items.length ) {
			items.add( {
				status: 'not_applied',
				title: qazana.translate( 'editing_started' ),
				subTitle: '',
				action: '',
				editing_started: true
			} );
		}

		// Remove old applied items from top of list
		while ( items.length && 'applied' === items.first().get( 'status' ) ) {
			items.shift();
		}

		var id = currentItemID ? currentItemID : new Date().getTime();

		var	currentItem = items.findWhere( {
			id: id
		} );

		if ( ! currentItem ) {
			currentItem = new HistoryItem( {
				id: id,
				title: itemData.title,
				subTitle: itemData.subTitle,
				action: getActionLabel( itemData ),
				type: itemData.type,
				elementType: itemData.elementType
			} );

			self.startItemTitle = '';
			self.startItemAction = '';
		}

		var position = 0;

		// Temp fix. On move a column - insert the `remove` subItem before the section changes subItem.
		// In a multi columns section - the structure has been changed,
		// In a one column section - it's filled with an empty column,
		// The order is important for the `redoItem`, that needed to change the section first
		// and only after that - to remove the column.
		if ( 'column' === itemData.elementType && 'remove' === itemData.type && 'column' === currentItem.get( 'elementType' ) ) {
			position = 1;
		}

		currentItem.get( 'items' ).add( itemData, { at: position } );

		items.add( currentItem, { at: 0 } );

		var panel = qazana.getPanelView();

		if ( 'historyPage' === panel.getCurrentPageName() ) {
			panel.getCurrentPageView().render();
		}

		return id;
	};

	this.doItem = function( index ) {
		// Don't track while restoring the item
		this.setActive( false );

		var item = items.at( index );

		if ( 'not_applied' === item.get( 'status' ) ) {
			this.undoItem( index );
		} else {
			this.redoItem( index );
		}

		this.setActive( true );

		var panel = qazana.getPanelView(),
			panelPage = panel.getCurrentPageView(),
			viewToScroll;

		if ( 'editor' === panel.getCurrentPageName() ) {
			if ( panelPage.getOption( 'editedElementView' ).isDestroyed ) {
				// If the the element isn't exist - show the history panel
				panel.setPage( 'historyPage' );
			} else {
				// If element exist - render again, maybe the settings has been changed
				viewToScroll = panelPage.getOption( 'editedElementView' );
			}
		} else {
			if ( 'historyPage' === panel.getCurrentPageName() ) {
				panelPage.render();
			}

			// Try scroll to affected element.
			if ( item instanceof Backbone.Model && item.get( 'items' ).length  ) {
				var oldView = item.get( 'items' ).first().get( 'history' ).behavior.view;
				if ( oldView.model ) {
					viewToScroll = self.findView( oldView.model.get( 'id' ) ) ;
				}
			}
		}

		if ( viewToScroll && ! qazana.helpers.isInViewport( viewToScroll.$el[0], qazana.$previewContents.find( 'html' )[0] ) ) {
			qazana.helpers.scrollToView( viewToScroll );
		}

		if ( item.get( 'editing_started' ) ) {
			if ( ! editorSaved ) {
				qazana.saver.setFlagEditorChange( false );
			}
		}
	};

	this.undoItem = function( index ) {
		var item;

		for ( var stepNum = 0; stepNum < index; stepNum++ ) {
			item = items.at( stepNum );

			if ( 'not_applied' === item.get( 'status' ) ) {
				item.get( 'items' ).each( function( subItem ) {
					var history = subItem.get( 'history' );

					if ( history ) { /* type duplicate first items hasn't history */
						history.behavior.restore( subItem );
					}
				} );

				item.set( 'status', 'applied' );
			}
		}
	};

	this.redoItem = function( index ) {
		for ( var stepNum = items.length - 1; stepNum >= index; stepNum-- ) {
			var item = items.at( stepNum );

			if ( 'applied' === item.get( 'status' ) ) {
				var reversedSubItems = _.toArray( item.get( 'items' ).models ).reverse();

				_( reversedSubItems ).each( function( subItem ) {
					var history = subItem.get( 'history' );

					if ( history ) { /* type duplicate first items hasn't history */
						history.behavior.restore( subItem, true );
					}
				} );

				item.set( 'status', 'not_applied' );
			}
		}
	};

	this.getModelLabel = function( model ) {
		if ( ! ( model instanceof Backbone.Model ) ) {
			model = new Backbone.Model( model );
		}

		return qazana.getElementData( model ).title;
	};

	this.findView = function( modelID, views ) {
		var self = this,
			founded = false;

		if ( ! views ) {
			views = qazana.getPreviewView().children;
		}

		_.each( views._views, function( view ) {
			if ( founded ) {
				return;
			}
			// Widget global used getEditModel
			var model = view.getEditModel ? view.getEditModel() : view.model;

			if ( modelID === model.get( 'id' ) ) {
				founded = view;
			} else if ( view.children && view.children.length ) {
				founded = self.findView( modelID, view.children );
			}
		} );

		return founded;
	};

	this.startMovingItem = function( model ) {
		qazana.history.history.startItem( {
			type: 'move',
			title: self.getModelLabel( model ),
			elementType: model.elType || model.get( 'elType' )
		} );
	};

	this.startInsertTemplate = function( model ) {
		qazana.history.history.startItem( {
			type: 'add',
			title: qazana.translate( 'template' ),
			subTitle: model.get( 'title' ),
			elementType: 'template'
		} );
	};

	this.startDropElement = function() {
		var elementView = qazana.channels.panelElements.request( 'element:selected' );
		qazana.history.history.startItem( {
			type: 'add',
			title: self.getModelLabel( elementView.model ),
			elementType: elementView.model.get( 'widgetType' ) || elementView.model.get( 'elType' )
		} );
	};

	this.startAddElement = function( model ) {
		qazana.history.history.startItem( {
			type: 'add',
			title: self.getModelLabel( model ),
			elementType: model.elType
		} );
	};

	this.startPasteStyle = function( model ) {
		qazana.history.history.startItem( {
			type: 'paste_style',
			title: self.getModelLabel( model ),
			elementType: model.get( 'elType' )
		} );
	};

	this.startResetStyle = function( model ) {
		qazana.history.history.startItem( {
			type: 'reset_style',
			title: self.getModelLabel( model ),
			elementType: model.get( 'elType' )
		} );
	};

	this.startRemoveElement = function( model ) {
		qazana.history.history.startItem( {
			type: 'remove',
			title: self.getModelLabel( model ),
			elementType: model.get( 'elType' )
		} );
	};

	init();
};

module.exports = new Manager();

},{"./collection":143,"./collection-behavior":142,"./element-behavior":144,"./item":146}],148:[function(require,module,exports){
module.exports = Marionette.CompositeView.extend( {
	id: 'qazana-panel-history',

	template: '#tmpl-qazana-panel-history-tab',

	childView: Marionette.ItemView.extend( {
		template: '#tmpl-qazana-panel-history-item',
		ui: {
			item: '.qazana-history-item'
		},
		triggers: {
			'click @ui.item': 'item:click'
		}
	} ),

	childViewContainer: '#qazana-history-list',

	currentItem: null,

	onRender: function() {
		var self = this;

		_.defer( function() {
			// Set current item - the first not applied item
			if ( self.children.length ) {
				var currentItem = self.collection.find( function( model ) {
						return 'not_applied' ===  model.get( 'status' );
					} ),
					currentView = self.children.findByModel( currentItem );

				self.updateCurrentItem( currentView.$el );
			}
		} );
	},

	updateCurrentItem: function( element ) {
		var currentItemClass = 'qazana-history-item-current';

		if ( this.currentItem ) {
			this.currentItem.removeClass( currentItemClass );
		}

		this.currentItem = element;

		this.currentItem.addClass( currentItemClass );
	},

	onChildviewItemClick: function( childView, event ) {
		if ( childView.$el === this.currentItem ) {
			return;
		}

		var collection = event.model.collection,
			itemIndex = collection.findIndex( event.model );

		qazana.history.history.doItem( itemIndex );

		this.updateCurrentItem( childView.$el );

		if ( ! this.isDestroyed ) {
			this.render();
		}
	}
} );

},{}],149:[function(require,module,exports){
var HistoryPageView = require( './panel-page' ),
	Manager;

Manager = function() {
	var self = this;

	var addPanelPage = function() {
		qazana.getPanelView().addPage( 'historyPage', {
			view: HistoryPageView,
			title: qazana.translate( 'history' )
		} );
	};

	var init = function() {
		qazana.on( 'preview:loaded', addPanelPage );

		self.history = require( './history/manager' );

		self.revisions = require( './revisions/manager' );

		self.revisions.init();
	};

	jQuery( window ).on( 'qazana:init', init );
};

module.exports = new Manager();

},{"./history/manager":147,"./panel-page":150,"./revisions/manager":153}],150:[function(require,module,exports){
var TabHistoryView = require( './history/panel-tab' ),
	TabHistoryEmpty = require( './history/empty' ),
	TabRevisionsView = require( './revisions/panel-tab' ),
	TabRevisionsEmpty = require( './revisions/empty' );

module.exports = Marionette.LayoutView.extend( {
	template: '#tmpl-qazana-panel-history-page',

	regions: {
		content: '#qazana-panel-history-content'
	},

	ui: {
		tabs: '.qazana-panel-navigation-tab'
	},

	events: {
		'click @ui.tabs': 'onTabClick'
	},

	regionViews: {},

	currentTab: null,

	initialize: function() {
		this.initRegionViews();
	},

	initRegionViews: function() {
		var historyItems = qazana.history.history.getItems(),
			revisionsItems = qazana.history.revisions.getItems();

		this.regionViews  = {
			history: {
				region: this.content,
				view: function() {
					if ( historyItems.length ) {
						return TabHistoryView;
					}

					return TabHistoryEmpty;
				},
				options: {
					collection: historyItems
				}
			},
			revisions: {
				region: this.content,
				view: function() {
					if ( revisionsItems.length ) {
						return TabRevisionsView;
					}

					return TabRevisionsEmpty;
				},

				options: {
					collection: revisionsItems
				}
			}
		};
	},

	activateTab: function( tabName ) {
		this.ui.tabs
			.removeClass( 'qazana-active' )
			.filter( '[data-view="' + tabName + '"]' )
			.addClass( 'qazana-active' );

		this.showView( tabName );
	},

	getCurrentTab: function() {
		return this.currentTab;
	},

	showView: function( viewName ) {
		var viewDetails = this.regionViews[ viewName ],
			options = viewDetails.options || {},
			View = viewDetails.view;

		if ( 'function' === typeof View ) {
			View = viewDetails.view();
		}

		options.viewName = viewName;
		this.currentTab = new View( options );

		viewDetails.region.show( this.currentTab );
	},

	onRender: function() {
		this.showView( 'history' );
	},

	onTabClick: function( event ) {
		this.activateTab( event.currentTarget.dataset.view );
	},

	onDestroy: function() {
		qazana.getPanelView().getFooterView().ui.history.removeClass( 'qazana-open' );
	}
} );

},{"./history/empty":145,"./history/panel-tab":148,"./revisions/empty":152,"./revisions/panel-tab":155}],151:[function(require,module,exports){
var RevisionModel = require( './model' );

module.exports = Backbone.Collection.extend( {
	model: RevisionModel,
	comparator: function( model ) {
		return -model.get( 'timestamp' );
	}
} );

},{"./model":154}],152:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-revisions-no-revisions',
	id: 'qazana-panel-revisions-no-revisions',
	className: 'qazana-panel-nerd-box'
} );

},{}],153:[function(require,module,exports){
var RevisionsCollection = require( './collection' ),
	RevisionsManager;

RevisionsManager = function() {
	var self = this,
		revisions;

	this.getItems = function() {
		return revisions;
	};

	var onEditorSaved = function( data ) {
		if ( data.latest_revisions ) {
			self.addRevisions( data.latest_revisions );
		}

		if ( data.revisions_ids ) {
			var revisionsToKeep = revisions.filter( function( revision ) {
				return -1 !== data.revisions_ids.indexOf( revision.get( 'id' ) );
			} );

			revisions.reset( revisionsToKeep );
		}
	};

	var attachEvents = function() {
		qazana.channels.editor.on( 'saved', onEditorSaved );
	};

	var addHotKeys = function() {
		var UP_ARROW_KEY = 38,
			DOWN_ARROW_KEY = 40;

		var navigationHandler = {
			isWorthHandling: function() {
				var panel = qazana.getPanelView();

				if ( 'historyPage' !== panel.getCurrentPageName() ) {
					return false;
				}

				var revisionsTab = panel.getCurrentPageView().getCurrentTab();

				return revisionsTab.currentPreviewId && revisionsTab.currentPreviewItem && revisionsTab.children.length > 1;
			},
			handle: function( event ) {
				qazana.getPanelView().getCurrentPageView().getCurrentTab().navigate( UP_ARROW_KEY === event.which );
			}
		};

		qazana.hotKeys.addHotKeyHandler( UP_ARROW_KEY, 'revisionNavigation', navigationHandler );

		qazana.hotKeys.addHotKeyHandler( DOWN_ARROW_KEY, 'revisionNavigation', navigationHandler );
	};

	this.setEditorData = function( data ) {
		var collection = qazana.getRegion( 'sections' ).currentView.collection;

		// Don't track in history.
		qazana.history.history.setActive( false );
		collection.reset( data );
		qazana.history.history.setActive( true );
	};

	this.getRevisionDataAsync = function( id, options ) {
		_.extend( options, {
			data: {
				id: id
			}
		} );

		return qazana.ajax.send( 'get_revision_data', options );
	};

	this.addRevisions = function( items ) {
		items.forEach( function( item ) {
			var existedModel = revisions.findWhere( {
				id: item.id
			} );

			if ( existedModel ) {
				revisions.remove( existedModel );
			}

			revisions.add( item );
		} );
	};

	this.deleteRevision = function( revisionModel, options ) {
		var params = {
			data: {
				id: revisionModel.get( 'id' )
			},
			success: function() {
				if ( options.success ) {
					options.success();
				}

				revisionModel.destroy();

				if ( ! revisions.length ) {
					var panel = qazana.getPanelView();
					if ( 'historyPage' === panel.getCurrentPageName() ) {
						panel.getCurrentPageView().activateTab( 'revisions' );
					}
				}
			}
		};

		if ( options.error ) {
			params.error = options.error;
		}

		qazana.ajax.send( 'delete_revision', params );
	};

	this.init = function() {
		revisions = new RevisionsCollection( qazana.config.revisions );

		attachEvents();

		addHotKeys();
	};
};

module.exports = new RevisionsManager();

},{"./collection":151}],154:[function(require,module,exports){
var RevisionModel;

RevisionModel = Backbone.Model.extend();

RevisionModel.prototype.sync = function() {
	return null;
};

module.exports = RevisionModel;

},{}],155:[function(require,module,exports){
module.exports = Marionette.CompositeView.extend( {
	id: 'qazana-panel-revisions',

	template: '#tmpl-qazana-panel-revisions',

	childView: require( './view' ),

	childViewContainer: '#qazana-revisions-list',

	ui: {
		discard: '.qazana-panel-scheme-discard .qazana-button',
		apply: '.qazana-panel-scheme-save .qazana-button'
	},

	events: {
		'click @ui.discard': 'onDiscardClick',
		'click @ui.apply': 'onApplyClick'
	},

	isRevisionApplied: false,

	jqueryXhr: null,

	currentPreviewId: null,

	currentPreviewItem: null,

	initialize: function() {
		this.listenTo( qazana.channels.editor, 'saved', this.onEditorSaved );
		this.currentPreviewId = qazana.config.current_revision_id;
	},

	getRevisionViewData: function( revisionView ) {
		var self = this;

		this.jqueryXhr = qazana.history.revisions.getRevisionDataAsync( revisionView.model.get( 'id' ), {
			success: function( data ) {
				qazana.history.revisions.setEditorData( data.elements );
				qazana.settings.page.model.set( data.settings );

				self.setRevisionsButtonsActive( true );

				self.jqueryXhr = null;

				revisionView.$el.removeClass( 'qazana-revision-item-loading' );

				self.enterReviewMode();
			},
			error: function() {
				revisionView.$el.removeClass( 'qazana-revision-item-loading' );

				if ( 'abort' === self.jqueryXhr.statusText ) {
					return;
				}

				self.currentPreviewItem = null;

				self.currentPreviewId = null;

				alert( 'An error occurred' );
			}
		} );
	},

	setRevisionsButtonsActive: function( active ) {
		this.ui.apply.add( this.ui.discard ).prop( 'disabled', ! active );
	},

	deleteRevision: function( revisionView ) {
		var self = this;

		revisionView.$el.addClass( 'qazana-revision-item-loading' );

		qazana.history.revisions.deleteRevision( revisionView.model, {
			success: function() {
				if ( revisionView.model.get( 'id' ) === self.currentPreviewId ) {
					self.onDiscardClick();
				}

				self.currentPreviewId = null;
			},
			error: function() {
				revisionView.$el.removeClass( 'qazana-revision-item-loading' );

				alert( 'An error occurred' );
			}
		} );
	},

	enterReviewMode: function() {
		qazana.changeEditMode( 'review' );
	},

	exitReviewMode: function() {
		qazana.changeEditMode( 'edit' );
	},

	navigate: function( reverse ) {
		var currentPreviewItemIndex = this.collection.indexOf( this.currentPreviewItem.model ),
			requiredIndex = reverse ? currentPreviewItemIndex - 1 : currentPreviewItemIndex + 1;

		if ( requiredIndex < 0 ) {
			requiredIndex = this.collection.length - 1;
		}

		if ( requiredIndex >= this.collection.length ) {
			requiredIndex = 0;
		}

		this.children.findByIndex( requiredIndex ).ui.detailsArea.trigger( 'click' );
	},

	onEditorSaved: function() {
		this.exitReviewMode();

		this.setRevisionsButtonsActive( false );

		this.currentPreviewId = qazana.config.current_revision_id;
	},

	onApplyClick: function() {
		qazana.saver.setFlagEditorChange( true );

		qazana.saver.saveAutoSave();

		this.isRevisionApplied = true;

		this.currentPreviewId = null;

		qazana.history.history.getItems().reset();
	},

	onDiscardClick: function() {
		qazana.history.revisions.setEditorData( qazana.config.data );

		qazana.saver.setFlagEditorChange( this.isRevisionApplied );

		this.isRevisionApplied = false;

		this.setRevisionsButtonsActive( false );

		this.currentPreviewId = null;

		this.exitReviewMode();

		if ( this.currentPreviewItem ) {
			this.currentPreviewItem.$el.removeClass( 'qazana-revision-current-preview' );
		}
	},

	onDestroy: function() {
		if ( this.currentPreviewId && this.currentPreviewId !== qazana.config.current_revision_id ) {
			this.onDiscardClick();
		}
	},

	onRenderCollection: function() {
		if ( ! this.currentPreviewId ) {
			return;
		}

		var currentPreviewModel = this.collection.findWhere({ id: this.currentPreviewId });

		// Ensure the model is exist and not deleted during a save.
		if ( currentPreviewModel ) {
			this.currentPreviewItem = this.children.findByModelCid( currentPreviewModel.cid );
			this.currentPreviewItem.$el.addClass( 'qazana-revision-current-preview' );
		}
	},

	onChildviewDetailsAreaClick: function( childView ) {
		var self = this,
			revisionID = childView.model.get( 'id' );

		if ( revisionID === self.currentPreviewId ) {
			return;
		}

		if ( this.jqueryXhr ) {
			this.jqueryXhr.abort();
		}

		if ( self.currentPreviewItem ) {
			self.currentPreviewItem.$el.removeClass( 'qazana-revision-current-preview' );
		}

		childView.$el.addClass( 'qazana-revision-current-preview qazana-revision-item-loading' );

		if ( qazana.saver.isEditorChanged() && null === self.currentPreviewId ) {
			qazana.saver.saveEditor( {
				status: 'autosave',
				onSuccess: function() {
					self.getRevisionViewData( childView );
				}
			} );
		} else {
			self.getRevisionViewData( childView );
		}

		self.currentPreviewItem = childView;

		self.currentPreviewId = revisionID;
	},

	onChildviewDeleteClick: function( childView ) {
		var self = this,
			type = childView.model.get( 'type' );

		var removeDialog = qazana.dialogsManager.createWidget( 'confirm', {
			message: qazana.translate( 'dialog_confirm_delete', [ type ] ),
			headerMessage: qazana.translate( 'delete_element', [ type ] ),
			strings: {
				confirm: qazana.translate( 'delete' ),
				cancel: qazana.translate( 'cancel' )
			},
			defaultOption: 'confirm',
			onConfirm: function() {
				self.deleteRevision( childView );
			}
		} );

		removeDialog.show();
	}
} );

},{"./view":156}],156:[function(require,module,exports){
module.exports =  Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-revisions-revision-item',

	className: 'qazana-revision-item',

	ui: {
		detailsArea: '.qazana-revision-item__details',
		deleteButton: '.qazana-revision-item__tools-delete'
	},

	triggers: {
		'click @ui.detailsArea': 'detailsArea:click',
		'click @ui.deleteButton': 'delete:click'
	}
} );

},{}]},{},[124,125,69])
//# sourceMappingURL=editor.js.map
