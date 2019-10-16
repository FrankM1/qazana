var ViewModule = require( '../../utils/view-module' ),
    NotificationsModule;

NotificationsModule = ViewModule.extend( {

    // here's the HTML that is temporarily inserted into the page;
    html: function( msg, classes ) {
        return jQuery( '<div id="qazana-global-alert" class="qazana-alert qazana-alert-message ' + classes + '">' + msg + '</div>' );
    },

    // insert the HTML - content is loading;
    add: function( $obj, msg, classes ) {
        var $html = this.html( msg, classes );
        $html.hide();
        $obj.after( $html );
        $html.fadeIn();
    },

    // Show the HTML - content has loaded;
    show: function( msg, classes ) {
        this.add( jQuery( 'body' ), msg, classes );
    },

    // remove the HTML - content has loaded;
    hide: function() {
        jQuery( '#qazana-global-alert' ).remove();
    },

    onInit: function() {
		ViewModule.prototype.onInit.apply( this, arguments );
	},

} );

module.exports = NotificationsModule;
