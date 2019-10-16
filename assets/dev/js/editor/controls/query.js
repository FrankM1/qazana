var ControlSelect2ItemView = require( 'qazana-controls/select2' );

module.exports = ControlSelect2ItemView.extend( {
    isTitlesReceived: false,

    getSelect2Options: function() {
        var self = this;

        return {
            ajax: {
                transport: function( params, success, failure ) {
                    var data = {
                        q: params.data.q,
                        filter_type: self.model.get( 'filter_type' ),
                        object_type: self.model.get( 'object_type' ),
                    };

                    return qazana.ajax.send( 'panel_posts_control_filter_autocomplete', {
                        data: data,
                        success: success,
                        error: failure,
                    } );
                },
                data: function( params ) {
                    return {
                        q: params.term,
                        page: params.page,
                    };
                },
                cache: true,
            },
            escapeMarkup: function( response ) {
                return response;
            },
            minimumInputLength: 2,
        };
    },

    getValueTitles: function() {
        var self = this,
            value = self.getControlValue(),
            filterType = self.model.get( 'filter_type' );

        if ( ! value || ! filterType ) {
            return;
        }

        var data = {
            filter_type: filterType,
            object_type: self.model.get( 'object_type' ),
            value: value,
        };

        var request = qazana.ajax.send( 'panel_posts_control_value_titles', { data: data } );

        request.then( function( response ) {
            self.isTitlesReceived = true;

            self.model.set( 'options', response.data );

            self.render();
        } );
    },

    onReady: function() {
        qazana.modules.controls.Select2.prototype.onReady.apply( this, arguments );

        if ( ! this.isTitlesReceived ) {
            this.getValueTitles();
        }
    },
} );
