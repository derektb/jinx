module.exports = function (grunt)
{
	require('jit-grunt')(grunt);
	grunt.initConfig({
		bump: {
	    options: {
	      files: ['package.json'],
	      commit: false,
				createTag: false,
	      push: false
	    }
	  },
	});
	grunt.loadTasks('grunt/');
};
