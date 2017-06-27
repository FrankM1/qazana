var BaseElementView = require( 'qazana-views/base-element' ),
	WidgetView;

WidgetView = BaseElementView.extend( {
	_templateType: null,

	getTemplate: function() {
		var editModel = this.getEditModel();

		if ( 'remote' !== this.getTemplateType() ) {
			return Marionette.TemplateCache.get( '#tmpl-qazana-' + editModel.get( 'elType' ) + '-' + editModel.get( 'widgetType' ) + '-content' );
		} else {
			return _.template( '' );
		}
	},

	className: function() {
		return BaseElementView.prototype.className.apply( this, arguments ) + ' qazana-widget';
	},

	events: function() {
		var events = BaseElementView.prototype.events.apply( this, arguments );

		events.click = 'onClickEdit';

		return events;
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		var editModel = this.getEditModel();

		if ( 'remote' === this.getTemplateType() && ! this.getEditModel().getHtmlCache() ) {
			editModel.renderRemoteServer();
		}

		editModel.on( {
			'before:remote:render': _.bind( this.onModelBeforeRemoteRender, this ),
			'remote:render': _.bind( this.onModelRemoteRender, this )
		} );
	},

	getTemplateType: function() {
		if ( null === this._templateType ) {
			var editModel = this.getEditModel(),
				$template = Backbone.$( '#tmpl-qazana-' + editModel.get( 'elType' ) + '-' + editModel.get( 'widgetType' ) + '-content' );

			this._templateType = $template.length ? 'js' : 'remote';
		}

		return this._templateType;
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

	getHTMLContent: function( html ) {
		var htmlCache = this.getEditModel().getHtmlCache();

		return htmlCache || html;
	},

	attachElContent: function( html ) {
		var htmlContent = this.getHTMLContent( html ),
			el = this.$el[0];

		_.defer( function() {
			qazanaFrontend.getScopeWindow().jQuery( el ).html( htmlContent );
		} );

		return this;
	},

	onRender: function() {
        var self = this,
	        editModel = self.getEditModel(),
	        skinType = editModel.getSetting( '_skin' ) || 'default';

        self.$el
	        .attr( 'data-element_type', editModel.get( 'widgetType' ) + '.' + skinType )
            .removeClass( 'qazana-widget-empty' )
	        .addClass( 'qazana-widget-' + editModel.get( 'widgetType' ) + ' qazana-widget-can-edit' )
            .children( '.qazana-widget-empty-icon' )
            .remove();

        self.$el.imagesLoaded().always( function() {
            setTimeout( function() {
                if ( 1 > self.$el.height() ) {
                    self.$el.addClass( 'qazana-widget-empty' );

                    // TODO: REMOVE THIS !!
                    // TEMP CODING !!
                    self.$el.append( '<i class="qazana-widget-empty-icon ' + editModel.getIcon() + '"></i>' );
                }
            }, 200 );
            // Is element empty?
        } );

        self.handleElementHover();

	},

    handleElementHover: function( ) {

        var self = this,
            config = {
                class : 'qazana-widget-settings-active'
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

} );

module.exports = WidgetView;
