module.exports = function(grunt) {
	grunt.config.merge({
		eslint: {
			target: ['src/**/*.js', 'test-data/**/*.js'],
			options: {}
		}
	});

	grunt.registerTask('lint', ['eslint']);
};
