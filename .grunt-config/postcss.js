/**
 * Grunt postcss task config
 * @package Qazana
 */
module.exports = {
	dev: {
		options: {
			map: true,

			processors: [
				require( 'autoprefixer' )( {
					browsers: 'last 10 versions'
				} )
			]
		},
		files: [ {
			src: [
				'assets/css/*.css',
				'!assets/css/*.min.css'
			]
		},
		{
			src: [
				'includes/extensions/**/*.css',
				'!includes/extensions/**/*.min.css'
			]
		} ]
	},
	minify: {
		options: {
			processors: [
				require( 'autoprefixer' )( {
					browsers: 'last 10 versions'
				} ),
				require( 'cssnano' )( {
					reduceIdents: false
				} )
			]
		},
		files: [ {
			expand: true,
			src: [
				'assets/css/*.css',
				'!assets/css/*.min.css'
			],
			ext: '.min.css'
		},
		{
			expand: true,
			src: [
				'includes/extensions/**/*.css',
				'!includes/extensions/**/*.min.css'
			],
			ext: '.min.css'
		} ]
	}
};
