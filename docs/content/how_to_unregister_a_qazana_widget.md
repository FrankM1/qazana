#How to Unregister a Qazana Widget

Qazana comes with several widgets by default and you many need to remove one or more. Here is how.
First you need to know the widget name. I'll use the widget called 'video' as an example

	add_filter( 'qazana/widgets/widget_filenames', 'custom_qazana_unregister_widget' );

    function custom_qazana_unregister_widget( $widgets ) {

        if ( ( $key = array_search( 'video', $widgets ) ) !== false ) { // Use the widget name here
		    unset( $widgets[$key] );
		}

        return $widgets;
    }

If what you need to do is override a widget with new settings or style, we recommend writing an extension instead. See [How to write an extension for Qazana.