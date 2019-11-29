var _ = require('underscore');
const moduleAliases = {
	  "Story": './src/base/story.js'
	, "Passage": './src/base/passage.js'

  , "Utils": './src/jinx/main/utils.js'

	, "Jinx": './src/jinx/main/jinx.js'
  	, "Wand": './src/jinx/main/wand.js'
  	, "Effects": './src/jinx/main/effects.js'
  	, "Settings": './src/jinx/main/settings.js'
  	, "Debug": './src/jinx/main/debug.js'

	, "Panel": './src/jinx/panel/panel.js'
  	, "PanelArt": './src/jinx/panel/art/panelart.js'
  	, "ArtAsset": './src/jinx/panel/art/artasset.js'

  	, "Sequence": './src/jinx/panel/sequence/sequence.js'
  	, "Seqel": './src/jinx/panel/sequence/seqel.js'
  	, "StepData": './src/jinx/panel/sequence/step-data.js'
  	, "StepCreator": './src/jinx/panel/sequence/step-creator.js'

    , "PanelRenderer": './src/jinx/panel/renderer/panelrenderer.js'
      , "ShadowPanel": './src/jinx/panel/renderer/shadowpanel.js'
      	, "ShadowLayer": './src/jinx/panel/renderer/shadowpanel/shadowlayer.js'
      	, "ShadowAsset": './src/jinx/panel/renderer/shadowpanel/shadowasset.js'
    	, "StepAnimation": './src/jinx/panel/renderer/step-animation.js'
        , "AssetAnimation": './src/jinx/panel/renderer/step-animation/asset-animation.js'

    , "PanelDestination": './src/jinx/panel/destination/paneldestination.js'
}

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-bump');

	grunt.config.merge({
		browserify: {
			default: {
				files: {
					'build/jinx.js': 'src/index.js',
					'build/tests.js': 'test-data/tests/**/*.js'
				},
				options: {
					browserifyOptions: {
						debug: true,
						detectGlobals: false
					},
					alias: moduleAliases,
					watch: true,
					transform: [
						['babelify', { presets: ["env"] }]
					]
				}
			},
			release: {
				files: {
					'build/jinx.js': 'src/index.js'
				},
				options: {
					browserifyOptions: {
						debug: false,
						detectGlobals: false
					},
					alias: moduleAliases,
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
					'build/jinx.css': 'src/**/*.css'
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
			storyFormatScript: '<script src="jinx.js"></script>',
			storyFormatStylesheet: '<link rel="stylesheet" href="jinx.css">',
			passages: testPassages
		};

		grunt.file.write('build/format-test.html', template(mainData));
	});


	grunt.registerTask('html:release', function() {
		var template = _.template(grunt.file.read('src/base/index.html'));

		var data = {
			name: '{{STORY_NAME}}',
			passages: '{{STORY_DATA}}',
			storyFormatScript: '<script>' + grunt.file.read('build/jinx.js') + '</script>',
			storyFormatStylesheet: '<style>' + grunt.file.read('build/jinx.css') + '</style>'
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
	grunt.registerTask('build:dev', ['bump:prerelease', 'browserify:default', 'cssmin', 'html:test']);
	grunt.registerTask('build:tdd', ['browserify:default']);
	grunt.registerTask('build:prerelease', ['browserify:default', 'cssmin', 'html:release']);
	grunt.registerTask('build:release', ['bump', 'browserify:release', 'cssmin', 'html:release']);
	grunt.registerTask('default', ['build']);
	grunt.registerTask('dev', ['watch']);
	grunt.registerTask('dev:tdd', ['watch:tdd']);
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
