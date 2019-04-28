const nodesass = require('node-sass');
const path = require("path");

const sass = {
	dist: {
		options: {
            implementation: nodesass,
			sourceMap: true,
            includePaths: [ 'assets/dev/scss', 'node_modules' ],
		},
		files: [
			{
				expand: true,
				cwd: 'assets/dev/scss/direction',
				src: '*.scss',
				dest: 'assets/css',
				ext: '.css',
			},
			{
				expand: true,
				cwd: 'includes/extensions',
				dest: 'includes/extensions',
				src: ['**/*.scss'],
				ext: '.css',
			},
		],
	},
};

module.exports = sass;
