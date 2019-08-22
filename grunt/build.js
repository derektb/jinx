var _ = require('underscore');
var twizeModuleAliases = {
	  "Story": './src/base/story.js'
	, "Passage": './src/base/passage.js'

	, "Twize": './src/twize/main/twize.js'
	, "Wand": './src/twize/main/wand.js'
	, "Effects": './src/twize/main/effects.js'
	, "Settings": './src/twize/main/settings.js'
	, "Debug": './src/twize/main/debug.js'

	, "Panel": './src/twize/panel/panel.js'

	, "PanelArt": './src/twize/panel/art/panelart.js'
	, "ArtAsset": './src/twize/panel/art/artasset.js'

	, "Sequence": './src/twize/panel/sequence/sequence.js'
	, "Seqel": './src/twize/panel/sequence/seqel.js'

	, "PanelRenderer": './src/twize/panel/renderer/panelrenderer.js'
	, "ShadowPanel": './src/twize/panel/renderer/shadowpanel.js'
	, "ShadowLayer": './src/twize/panel/renderer/shadowlayer.js'
	, "ShadowAsset": './src/twize/panel/renderer/shadowasset.js'
	, "AssetAnimation": './src/twize/panel/renderer/asset-animation.js'
	, "StepAnimation": './src/twize/panel/renderer/step-animation.js'
}

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-bump');

	grunt.config.merge({
		browserify: {
			default: {
				files: {
					'build/twize.js': 'src/index.js',
					'build/tests.js': 'test-data/tests/**/*.js'
				},
				options: {
					browserifyOptions: {
						debug: true,
						detectGlobals: false
					},
					alias: twizeModuleAliases,
					watch: true,
					transform: [
						['babelify', { presets: ["env"] }]
					]
				}
			},
			release: {
				files: {
					'build/twize.js': 'src/index.js'
				},
				options: {
					browserifyOptions: {
						debug: false,
						detectGlobals: false
					},
					alias: twizeModuleAliases,
					transform: [
						['uglifyify', { global: true }],
						['babelify', { presets: ["env"] }]
					]
				}
			}
		},

		cssmin: {
			default: {
				files: {
					'build/twize.css': 'src/**/*.css'
				},
				expand: true
			}
		},

		watch: {
			default: {
				files: ['src/**/*.*','test-data/**/*.*'],
				tasks: ['build:dev'],
				options: {
					interrupt: false,
					spawn: false,
					debounceDelay: 1000
				}
			},
			tdd: {
				files: ['src/**/*.*','test-data/**/*.*'],
				tasks: ['build:tdd']
			},
			css: {
				files: 'src/**/*.css',
				tasks: ['cssmin']
			},
			template: {
				files: 'src/index.html',
				tasks: ['html']
			}
		}
	});

	grunt.registerTask('html:test', function() {
		var template = _.template(grunt.file.read('src/base/index.html'));
		var testPassages = _.template(grunt.file.read('test-data/passages.html'))
		var name = grunt.file.read('test-data/name.txt');
		var buildVersion = grunt.file.readJSON('package.json').version;

		var testData = {
			name: name,
			userStylesheet: grunt.file.read('test-data/user-stylesheet.css'),
			userScript: grunt.file.read('test-data/user-script.js'),
			passageData: grunt.file.readJSON('test-data/testPassages.json'),
			timestamp: timestamp('full'),
			buildVersion: buildVersion
		};

		// process test passages to create body content
		_(testData.passageData.passages).each(function(p) {
			var bodyContent;
			if (_(p.content).isArray()) {
				bodyContent = _.map(p.content, function(line) {
			    // escape < and >
			    return line.replace("<","&lt;").replace(">","&gt;");
			  }).join("\n");
			} else if (_(p.content).isString()) {
				var loadedBodyPath = 'test-data/testPassageSrc/'+p.content;
				var loadedBody = _.escape(grunt.file.read(loadedBodyPath));
				if (!loadedBody) grunt.log.write("Warning: Could not load '"+loadedBodyPath+"' from passage '"+p.name+"'");
				bodyContent = loadedBody;
			} else {
				grunt.log.write("Warning: Could not produce passage body content for passage '"+p.name+"'");
			}

			p.passageBody = bodyContent;
		});

		testPassages = testPassages(testData);

		var mainData = {
			name: name,
			storyFormatScript: '<script src="twize.js"></script>',
			storyFormatStylesheet: '<link rel="stylesheet" href="twize.css">',
			passages: testPassages
		};

		grunt.file.write('build/format-test.html', template(mainData));
	});


	grunt.registerTask('html:release', function() {
		var template = _.template(grunt.file.read('src/base/index.html'));

		var data = {
			name: '{{STORY_NAME}}',
			passages: '{{STORY_DATA}}',
			storyFormatScript: '<script>' + grunt.file.read('build/twize.js') + '</script>',
			storyFormatStylesheet: '<style>' + grunt.file.read('build/twize.css') + '</style>'
		};

		grunt.file.write('build/format.html', template(data));
	});

	grunt.registerTask('timestamp', function() {
		var date, hours, meridian, minutes, seconds, stamp;

		date = new Date()
		hours = date.getHours() % 12;
		minutes = date.getMinutes().toString();
			minutes = minutes.toString().length == 1 ? "0" + minutes : minutes;
		seconds = date.getSeconds().toString();
			seconds = seconds.toString().length == 1 ? "0" + seconds : seconds;
		meridian = (date.getHours() - 12 > 0) ? "PM" : "AM";

		stamp = "Build completed at " + timestamp("time");

		grunt.log.write(stamp);
		return stamp;
	})

	grunt.registerTask('build', ['browserify:default', 'cssmin', 'html:test']);
	grunt.registerTask('build:dev', ['browserify:default', 'cssmin', 'bump:prerelease', 'html:test']);
	grunt.registerTask('build:tdd', ['browserify:default']);
	grunt.registerTask('build:release', ['browserify:release', 'cssmin', 'bump', 'html:release']);
	grunt.registerTask('default', ['build']);
	grunt.registerTask('dev', ['build:dev', 'watch']);
	grunt.registerTask('dev:tdd', ['build:tdd', 'watch:tdd']);
};

function timestamp(opts) {
	var date, year, month, dayNum, dayName, hours, meridian, minutes, seconds, stamp;
	var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
	var days = ['SUN','MON','TUE','WED','THU','FRI','SAT']

	date = new Date()
	year = date.getFullYear()
	month = months[date.getMonth()];
	dayNum = date.getDate();
	dayName = days[date.getDay()]
	meridian = (Math.floor(date.getHours()/2)) ? "PM" : "AM";
	hours = date.getHours() % 12;
		hours = (hours == 0) ? 12 : hours;
	minutes = date.getMinutes().toString();
		minutes = minutes.toString().length == 1 ? "0" + minutes : minutes;
	seconds = date.getSeconds().toString();
		seconds = seconds.toString().length == 1 ? "0" + seconds : seconds;

	function theTime() {
		return hours + ":" + minutes + ":" + seconds + " " + meridian;
	}
	function theDate()
	{
		return dayName + " " + dayNum + ' ' + month + ' ' + year
	}

	if(opts == 'time') {
		return theTime();
	} else if(opts == 'date') {
		return theDate();
	} else if(opts == 'full') {
		return theDate() + ', ' + theTime();
	}
}
