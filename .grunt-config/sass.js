const nodesass = require('node-sass');

const sass = {
	dist: {
		options: {
            implementation: nodesass,
			sourceMap: true,
			includePaths: ['assets/dev/scss'],
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
