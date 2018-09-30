/**
 * Grunt release task config
 * @package Qazana
 */
module.exports = {
	options: {
		bump: false,
		npm: false,
		commit: false,
		tagName: 'v<%= version %>',
		commitMessage: 'released v<%= version %>',
		tagMessage: 'Tagged as v<%= version %>'
	}
};
