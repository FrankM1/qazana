var PanelHeaderItemView;

PanelHeaderItemView = Marionette.ItemView.extend( {
    template: '#tmpl-builder-panel-header',

    id: 'builder-panel-header',

    ui: {
        menuButton: '#builder-panel-header-menu-button',
        menuDropButton: '#builder-panel-header-nav-button',
        title: '#builder-panel-header-title',
        addButton: '#builder-panel-header-add-button',
        buttonSave: '#builder-panel-header-save',
        buttonSaveButton: '#builder-panel-header-save .builder-button'
    },

    events: {
        'click @ui.addButton': 'onClickAdd',
        'click @ui.menuButton': 'onClickMenu',
        'click @ui.menuDropButton': 'onClickMenuDrop',
        'click @ui.buttonSave': 'onClickButtonSave',
        'click @ui.buttonPublish': 'onClickButtonPublish'
    },

    initialize: function() {
        this._initDialog();
        this.onClickMenuDrop();

        this.listenTo( builder.channels.editor, 'change', this.onEditorChanged )
			.listenTo( builder.channels.deviceMode, 'change', this.onDeviceModeChange );
    },

    _initDialog: function() {
        var dialog;

        this.getDialog = function() {
            if ( ! dialog ) {
                var $ = Backbone.$,
                    $dialogMessage = $( '<div>', {
                        'class': 'builder-dialog-message'
                    } ),
                    $messageIcon = $( '<i>', {
                        'class': 'fa fa-check-circle'
                    } ),
                    $messageText = $( '<div>', {
                        'class': 'builder-dialog-message-text'
                    } ).text( builder.translate( 'saved' ) );

                $dialogMessage.append( $messageIcon, $messageText );

                dialog = builder.dialogsManager.createWidget( 'popup', {
                    hide: {
                        delay: 1500
                    }
                } );

                dialog.setMessage( $dialogMessage );
            }

            return dialog;
        };
    },

    _publishBuilder: function() {
        var self = this;

        var options = {
            status: 'publish',
            onSuccess: function() {
                self.getDialog().show();
                self.ui.buttonSaveButton.removeClass( 'builder-button-state' );
                NProgress.done();
            }
        };

        self.ui.buttonSaveButton.addClass( 'builder-button-state' );

        NProgress.start();

        builder.saveEditor( options );
    },

    _saveBuilderDraft: function() {
        builder.saveEditor();
    },

    setTitle: function( title ) {
        this.ui.title.html( title );
    },

    onClickAdd: function() {
        builder.getPanelView().setPage( 'elements' );
    },

    onClickMenu: function() {
        var panel = builder.getPanelView(),
            currentPanelPageName = panel.getCurrentPageName(),
            nextPage = 'menu' === currentPanelPageName ? 'elements' : 'menu';

        panel.setPage( nextPage );
    },

    onClickMenuDrop: function() {

        var $ = Backbone.$;

        // Delay showing of main nav with hoverIntent
        $( 'ul.builder-panel-header-nav > li' ).hoverIntent(
            function() { $( this ).addClass( 'builder-menu-hover' ); },
            function() { $( this ).removeClass( 'builder-menu-hover' ); }
        );
    },

    onEditorChanged: function() {
        this.ui.buttonSave.toggleClass( 'builder-save-active', builder.isEditorChanged() );
    },

    onClickButtonSave: function() {
        //this._saveBuilderDraft();
        this._publishBuilder();
    },

    onClickButtonPublish: function( event ) {
        // Prevent click on save button
        event.stopPropagation();

        this._publishBuilder();
    }

} );

module.exports = PanelHeaderItemView;
