/**
 * Grunt webpack task config
 * @package Qazana
 */
const path = require( 'path' );

const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );

const aliasList = {
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
	}
};

const moduleRules = {
	rules: [
		{
			enforce: 'pre',
			test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'eslint-loader',
            options: {
                fix: true
            }
			//options: {
			//	failOnError: true,
			//}
		},
		{
			test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
			use: [
				{
					loader: 'babel-loader',
					query: {
                        presets: [['@babel/preset-env', { modules: false }]],
					},
				},
			],
		},
	],
};

const entry = {
	'editor': [
		path.resolve( __dirname, '../assets/dev/js/editor/utils/jquery-serialize-object.js' ),
		path.resolve( __dirname, '../assets/dev/js/editor/utils/jquery-html5-dnd.js' ),
		path.resolve( __dirname, '../assets/dev/js/editor/editor.js' ),
	],
	'admin': path.resolve( __dirname, '../assets/dev/js/admin/admin.js' ),
	'admin-feedback': path.resolve( __dirname, '../assets/dev/js/admin/admin-feedback.js' ),
	'gutenberg': path.resolve( __dirname, '../assets/dev/js/admin/gutenberg.js' ),
	'new-template': path.resolve( __dirname, '../assets/dev/js/admin/new-template/new-template.js' ),
	'frontend': path.resolve( __dirname, '../assets/dev/js/frontend/frontend.js' ),
};

const webpackConfig = {
	target: 'web',
	context: __dirname,
	devtool: 'source-map',
	mode: 'development',
	output: {
		path: path.resolve( __dirname, '../assets/js' ),
		filename: '[name].js',
		devtoolModuleFilenameTemplate: '../[resource]'
	},
	module: moduleRules,
	resolve: aliasList,
	entry: entry,
	watch: true,
};

const webpackProductionConfig = {
	target: 'web',
	context: __dirname,
	devtool: 'source-map',
	mode: 'production',
	output: {
		path: path.resolve( __dirname, '../assets/js' ),
		filename: '[name].js'
	},
	module: moduleRules,
	resolve: aliasList,
	entry: {},
	performance: { hints: false },
	optimization: {
		minimize: true,
		minimizer: [
			new UglifyJsPlugin( {
				include: /\.min\.js$/
			} ),
		],
	},
};

// Add minified entry points
for ( const entryPoint in entry ) {
	webpackProductionConfig.entry[ entryPoint ] = entry[ entryPoint ];
	webpackProductionConfig.entry[ entryPoint + '.min' ] = entry[ entryPoint ];
}

const gruntWebpackConfig = {
	development: webpackConfig,
	production: webpackProductionConfig
};

module.exports = gruntWebpackConfig;
