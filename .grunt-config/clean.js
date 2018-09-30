/**
 * Grunt clean task config
 * @package Qazana
 */
module.exports = {
	//Clean up build folder
	main: [
		'build'
	],
	qunit: [
		'tests/qunit/index.html',
		'tests/qunit/preview.html'
	]
};
