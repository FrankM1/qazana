/**
 * Grunt webpack task config
 * @package Qazana
 */
const path = require( 'path' );

const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );
const aliasList = require('./webpack.alias.js').resolve;

const moduleRules = {
	rules: [
		{
			enforce: 'pre',
			test: /\.js$/,
			exclude: /node_modules/,
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
			exclude: /node_modules/,
			use: [
				{
					loader: 'babel-loader',
					query: {
						presets: [ '@wordpress/default' ],
						plugins: [
							[ '@wordpress/babel-plugin-import-jsx-pragma' ],
							[ '@babel/plugin-transform-react-jsx', {
								'pragmaFrag': 'React.Fragment',
							} ],
							[ '@babel/plugin-proposal-class-properties' ],
							[ '@babel/plugin-transform-runtime' ],
							[ '@babel/plugin-transform-modules-commonjs' ],
							[ '@babel/plugin-proposal-optional-chaining' ],
						],
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
