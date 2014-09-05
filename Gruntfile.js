/**
 * Utilises the following:
 * https://www.npmjs.org/package/grunt-contrib-sass
 * https://www.npmjs.org/package/grunt-contrib-uglify
 * https://www.npmjs.org/package/node-bourbon
 * https://www.npmjs.org/package/time-grunt
 * https://www.npmjs.org/package/grunt-contrib-jshint
 * https://www.npmjs.org/package/grunt-notify
 * https://www.npmjs.org/package/grunt-contrib-watch
 */

module.exports = function(grunt) {

  var sassFilesRoot = 'assets/css/_src';

  var sassSrcFile = sassFilesRoot + '/parallaks.scss';
  var sassDevTarget = 'assets/css/parallaks.css';
  var sassDistTarget = 'assets/css/parallaks.min.css';

  // Which JS files to merge. Put them in the order that they should be merged.

  var jsSrcRoot = 'assets/js/_src';

  var jsSrcFiles = [
    jsSrcRoot + '/Parallaks.jquery.js'
  ];

  // Where JS should be written to
  var jsDevTarget = 'assets/js/Parallaks.jquery.js';
  var jsDistTarget = 'assets/js/Parallaks.jquery.min.js';

  /*
   * ----------------------------
   */

  var devSassFiles = {};
  devSassFiles[sassDevTarget] = sassSrcFile;

  var distSassFiles = {};
  distSassFiles[sassDistTarget] = sassSrcFile;

  var devJsFiles = {};
  devJsFiles[jsDevTarget] = jsSrcFiles;

  var distJsFiles = {};
  distJsFiles[jsDistTarget] = jsSrcFiles;

  require('time-grunt')(grunt);

  grunt.initConfig({
    jshint: {
      dev: ['Gruntfile.js', jsSrcRoot + '/*.js',]
    },
    sass: {
      dist: {
        files: distSassFiles,
        options: {
          loadPath : require('node-bourbon').includePaths,
          style    : 'compressed'
        }
      },
      dev: {
        files: devSassFiles,
        options: {
          loadPath  : require('node-bourbon').includePaths,
          sourcemap : true,
          style     : 'expanded'
        }
      }
    },
    uglify: {
      dist: {
        files: distJsFiles,
        options: {
          mangle    : true,
          compress  : {
            drop_console : true // Remove console.*
          }
        }
      }
    },
    concat: {
      dev: {
        src: jsSrcFiles,
        dest: jsDevTarget
      }
    },
    notify: {
      sass: {
        options: {
          message : 'Sass task completed.'
        }
      },
      concat: {
        options: {
          message : 'Concat task completed.'
        }
      }
    },
    watch: {
      sass: {
        files: [
          sassFilesRoot + '/**/*.scss'
        ],
        tasks: ['sass:dev', 'notify:sass']
      },
      js: {
        files : jsSrcFiles,
        tasks : ['jshint:dev', 'concat:dev', 'notify:concat']
      },
      grunt: {
        files : ['Gruntfile.js']
      }/*,
      livereload: {
        // Browser live reloading
        // https://github.com/gruntjs/grunt-contrib-watch#live-reloading
        files: [sassDevTarget,jsDevTarget],
        options: {
          livereload: true
        }
      }*/
    }
  });

  // Loads all required tasks
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);

  grunt.registerTask('dist', ['sass:dist', 'uglify:dist']);

};