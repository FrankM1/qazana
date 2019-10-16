var BaseElementView = require( 'qazana-elements/views/base' ),
	WidgetView;

WidgetView = BaseElementView.extend( {
	_templateType: null,

	toggleEditTools: true,

	getTemplate: function() {
		var editModel = this.getEditModel();

		if ( 'remote' !== this.getTemplateType() ) {
			return Marionette.TemplateCache.get( '#tmpl-qazana-' + editModel.get( 'widgetType' ) + '-content' );
		}
		return _.template( '' );
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
				inlineEditingClass: 'qazana-inline-editing',
			},
		} );

		return qazana.hooks.applyFilters( 'elements/widget/behaviors', behaviors, this );
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		var editModel = this.getEditModel();

		editModel.on( {
			'before:remote:render': this.onModelBeforeRemoteRender.bind( this ),
			'remote:render': this.onModelRemoteRender.bind( this ),
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

	render: function() {
		if ( this.model.isRemoteRequestActive() ) {
			this.handleEmptyWidget();
			this.$el.addClass( 'qazana-element' );
			return;
		}

		Marionette.CompositeView.prototype.render.apply( this, arguments );
	},

	handleEmptyWidget: function() {
		// TODO: REMOVE THIS !!
		// TEMP CODING !!
		this.$el
			.addClass( 'qazana-widget-empty' )
			.append( '<i class="qazana-widget-empty-icon ' + this.getEditModel().getIcon() + '"></i>' );
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
			class: 'qazana-inline-editing',
			'data-qazana-setting-key': key,
		} );

		if ( toolbar ) {
			this.addRenderAttribute( key, {
				'data-qazana-inline-editing-toolbar': toolbar,
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

    alterClass: function( self, removals, additions ) {
        if ( -1 === removals.indexOf( '*' ) ) {
            // Use native jQuery methods if there is no wildcard matching
            self.removeClass( removals );
            return ! additions ? self : self.addClass( additions );
        }

        var patt = new RegExp( '\\s' +
                removals.
                    replace( /\*/g, '[A-Za-z0-9-_]+' ).
                    split( ' ' ).
                    join( '\\s|\\s' ) +
                '\\s', 'g' );

        self.each( function( i, it ) {
            var cn = ' ' + it.className + ' ';
            while ( patt.test( cn ) ) {
                cn = cn.replace( patt, ' ' );
            }
            it.className = $.trim( cn );
        } );

        return ! additions ? self : self.addClass( additions );
    },

	onRender: function() {
		var self = this;

		BaseElementView.prototype.onRender.apply( self, arguments );

		var editModel = self.getEditModel(),
			skinType = editModel.getSetting( '_skin' ) || 'default';

		self.$el
			.attr( 'data-element_type', editModel.get( 'widgetType' ) + '.' + skinType )
			.removeClass( 'qazana-widget-empty' )
			.children( '.qazana-widget-empty-icon' )
			.remove();

		// TODO: Find better way to detect if all images are loaded
		self.$el.imagesLoaded().always( function() {
			setTimeout( function() {
				if ( 1 > self.$el.height() ) {
					self.handleEmptyWidget();
				}
			}, 200 );
			// Is element empty?
		} );

        self.alterClass( self.$el, editModel.get( 'widgetType' ) + '-*', editModel.get( 'widgetType' ) + '-skin-' + skinType );
	},

	onClickEdit: function() {
		this.model.trigger( 'request:edit' );
	},
} );

module.exports = WidgetView;
