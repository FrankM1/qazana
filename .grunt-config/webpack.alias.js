const path = require( 'path' );

module.exports = {
	resolve: {
		alias: {
			'qazana-editor': path.resolve( __dirname, '../assets/dev/js/editor' ),
            'qazana-behaviors': path.resolve( __dirname, '../assets/dev/js/editor/elements/views/behaviors' ),
            'qazana-regions': path.resolve( __dirname, '../assets/dev/js/editor/regions' ),
            'qazana-controls': path.resolve( __dirname, '../assets/dev/js/editor/controls' ),
            'qazana-elements': path.resolve( __dirname, '../assets/dev/js/editor/elements' ),
            'qazana-views': path.resolve( __dirname, '../assets/dev/js/editor/views' ),
            'qazana-editor-utils': path.resolve( __dirname, '../assets/dev/js/editor/utils' ),
            'qazana-panel': path.resolve( __dirname, '../assets/dev/js/editor/regions/panel' ),
            'qazana-templates': path.resolve( __dirname, '../assets/dev/js/editor/components/template-library' ),
            'qazana-dynamic-tags': path.resolve( __dirname, '../assets/dev/js/editor/components/dynamic-tags' ),
            'qazana-frontend': path.resolve( __dirname, '../assets/dev/js/frontend' ),
            'qazana-revisions': path.resolve( __dirname, '../assets/dev/js/editor/components/revisions' ),
            'qazana-validator': path.resolve( __dirname, '../assets/dev/js/editor/components/validator' ),
            'qazana-utils': path.resolve( __dirname, '../assets/dev/js/utils' ),
            'qazana-admin': path.resolve( __dirname, '../assets/dev/js/admin' ),
            'qazana-extensions': path.resolve(__dirname, '../includes/extensions')
		},
	},
};
