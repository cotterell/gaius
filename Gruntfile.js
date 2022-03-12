module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-run');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    pkg_dist: 'dist',
    pkg_current: '<%= pkg_dist %>/<%= pkg.name %>@<%= pkg.version %>',
    pkg_latest: '<%= pkg_dist %>/<%= pkg.name %>@latest',
    'gh-pages': {
      dist: {
        options: {
          base: '<%= pkg_dist %>',
          add: true,
          message: 'Auto-generated commit for <%= pkg.name %>@<%= pkg.version %>.'
        },
        src: '**/*'
      }
    },
    run: {
      test: {
        exec: 'mocha --reporter mochawesome --reporter-options "quiet=true,reportDir=<%= pkg_current %>/tests,reportFilename=index.html,reportTitle=<%= pkg.name %>@<%= pkg.version %>"',
      },
      docs: {
        exec: 'jsdoc -c jsdoc.config.js -d <%= pkg_current %>/docs',
      },
    },
    mkdir: {
      dist: {
        options: {
          create: ['<%= pkg_current %>', '<%= pkg_latest %>']
        }
      }
    },
    nyc: {
      test: {
        options: {
          reporter: ['html', 'text'],
          reportDir: '<%= pkg_current %>/coverage'
        },
        cmd: false,
        args: ['mocha', '--reporter', 'mochawesome', '--reporter-options', 'quiet=true,reportDir=<%= pkg_current %>/tests,reportFilename=index.html']
      }
    }
  });

  grunt.registerTask('dist-copy-latest', 'Copy the current dist/gaius@version directory into dist/gaius@latest.', function() {
    grunt.config.requires('pkg_current');
    grunt.config.requires('pkg_latest');
    //grunt.task.requires(['nyc:test', 'run:docs']);
    grunt.task.requires(['run:test', 'run:docs']);
    const copydir = require('copy-dir');
    const pkg_current = grunt.config('pkg_current');
    const pkg_latest = grunt.config('pkg_latest');
    copydir.sync(pkg_current, pkg_latest);
    grunt.log.ok(`copied ${pkg_current} to ${pkg_latest}`);
  });

  grunt.registerTask('dist-index', 'Create the dist/index.html file.', function() {
    grunt.config.requires('pkg_dist');
    grunt.task.requires('mkdir:dist');
    const fs = require('fs');
    const md = require('markdown-it')();
    const pkg_dist = grunt.config('pkg_dist');
    const pkg_dist_index = `${pkg_dist}/index.html`;
    template = fs.readFileSync('dist.md.tpl', 'utf8');
    grunt.log.ok('read dist.md.tpl');
    fs.writeFileSync(pkg_dist_index, md.render(template), 'utf8');
    grunt.log.ok(`created ${pkg_dist_index} from dist.md.tpl`);
  });

  grunt.registerTask('dist', [
    'mkdir:dist',
    'run:test',
    'run:docs',
    'dist-copy-latest',
    'dist-index',
    'gh-pages:dist']
  );

  grunt.registerTask('default', []);

};
