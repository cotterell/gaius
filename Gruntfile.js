module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-gh-pages');
  // grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-simple-nyc');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    pkg_dist: '<%= pkg.name %>@<%= pkg.version %>',
    'gh-pages': {
      options: {
        base: '<%= pkg_dist %>',
        message: 'Auto-generated commit for <%= pkg_dist %>.'
      },
      src: '**/*'
    },
    run: {
      docs: {
        exec: 'documentation build src/** -f html -o <%= pkg_dist %>/docs'
      }
    },
    mkdir: {
      dist: {
        options: {
          create: ['<%= pkg_dist %>']
        }
      }
    },
    nyc: {
      test: {
        options: {
          reporter: ['html', 'text'],
          reportDir: '<%= pkg_dist %>/coverage'
        },
        cmd: false,
        args: ['mocha', '--reporter', 'mochawesome', '--reporter-options', 'quiet=true,reportDir=<%= pkg_dist %>/tests']
      }
    }
  });

  grunt.registerTask('dist', ['mkdir:dist', 'nyc:test', 'run:docs']);

};
