/**
 * Grunt usebanner task config
 * @package Qazana
 */
module.exports = {
	dist: {
		options: {
			banner: '<%= banner %>'
		},
		files: {
			src: [
				'assets/js/*.js',
				'assets/css/*.css'
			]
		}
	}
};
