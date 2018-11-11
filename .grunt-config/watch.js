/**
 * Grunt watch task config
 * @package Qazana
 */
const watch = {
	styles: {
		files: [
			'assets/dev/scss/**/*.scss',
			'includes/extensions/**/*.scss',
			'!assets/dev/scss/frontend/breakpoints/proxy.scss'
		],
		tasks: [ 'styles:true' ],
		options: {
			spawn: false,
			livereload: true
		}
	},
};

module.exports = watch;
