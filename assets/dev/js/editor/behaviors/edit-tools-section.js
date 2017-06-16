var EditToolsBehavior;

EditToolsBehavior = Marionette.Behavior.extend( {

    config : {
        class : 'builder-section-tools-active'
    },

    initialize: function() {
        this.listenTo( builder.channels.dataEditMode, 'switch', this.onEditModeSwitched );
    },

    onEditModeSwitched: function() {
        var activeMode = builder.channels.dataEditMode.request( 'activeMode' );
        this.view.$el.removeClass( this.config.class, 'edit' === activeMode );
    },

    handleSectionHover: function() {

        var $this = this;

        var hoverConfig = {
            sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)
            interval: 10, // number = milliseconds for onMouseOver polling interval
            timeout: 500, // number = milliseconds delay before onMouseOut
            over: function() {
                $this.view.$el.addClass( $this.config.class );
            },
            out: function() {
                $this.view.$el.removeClass( $this.config.class );
            }
        };

        $this.view.$el.hoverIntent(hoverConfig);

    },

    onRender: function() {
        this.onEditModeSwitched();
        this.handleSectionHover();
    }
} );

module.exports = EditToolsBehavior;
