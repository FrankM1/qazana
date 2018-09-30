module.exports = {
	plugin_main: {
        src: ['qazana.php', 'includes/plugin.php'],
		overwrite: true,
		replacements: [{
		        from: /this->version = '.*?'/g,
		        to: 'this->version = \'<%= pkg.version %>\''
		    },
		    {
		        from: /Version: \d{1,1}\.\d{1,2}\.\d{1,2}/g,
		        to: 'Version: <%= pkg.version %>'
		    }
		]
	},

	readme: {
		src: [ 'readme.txt' ],
		overwrite: true,
		replacements: [
			{
				from: /Stable tag: \d{1,1}\.\d{1,2}\.\d{1,2}/g,
				to: 'Stable tag: <%= pkg.version %>'
			}
		]
	},

	packageFile: {
		src: [ 'package.json' ],
		overwrite: true,
		replacements: [
			{
				from: /prev_stable_version": ".*?"/g,
				to: 'prev_stable_version": "<%= grunt.config.get( \'prev_stable_version\' ) %>"'
			}
		]
	}
};
