import copydir from 'copy-dir';
import fs from 'fs';
import {Liquid} from 'liquidjs';

export default function(grunt) {

  const config = prop => {
    grunt.config.requires(prop);
    return grunt.config(prop);
  }; // config

  const subtask = (msg) => new Promise(function(resolve, reject) {
    grunt.verbose.write(msg.trim() + '...');
    resolve();
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-run');

  // Project configuration.
  grunt.initConfig({
    gaius: {
      package: grunt.file.readJSON('./package.json'),
      dist: {
        base: "dist",
        current: 'gaius@<%= gaius.package.version %>',
        latest: 'gaius@latest',
      },
      templates: {
        "dist-index": "dist-index.liquid",
      },
    },
    'gh-pages': {
      dist: {
        options: {
          base: '<%= gaius.dist.base %>',
          add: true,
          message: 'Auto-generated commit for <%= gaius.dist.current %>.'
        },
        src: '**/*'
      }
    },
    run: {
      test: {
        exec: 'mocha --reporter mochawesome --reporter-options "quiet=true,reportDir=<%= gaius.dist.base %>/<%= gaius.dist.current %>/tests,reportFilename=index.html,reportTitle=gaius@<%= gaius.package.version %>"',
      },
      docs: {
        exec: 'jsdoc -c jsdoc.config.json -d <%= gaius.dist.base %>/<%= gaius.dist.current %>/docs',
      },
    },
    mkdir: {
      dist: {
        options: {
          create: [
            '<%= gaius.dist.base %>/<%= gaius.dist.current %>',
            '<%= gaius.dist.base %>/<%= gaius.dist.latest %>',
          ],
        },
      },
    },
    clean: [
      '<%= gaius.dist.base %>',
    ],
  });

  grunt.registerTask('dist-copy-latest', 'Copy the current /gaius@version directory into dist/gaius@latest.', function() {
    grunt.task.requires(['run:test', 'run:docs']);
    let base = grunt.config('gaius.dist.base');
    let current = grunt.config('gaius.dist.current');
    let latest = grunt.config('gaius.dist.latest');
    copydir.sync(`${base}/${current}`, `${base}/${latest}`);
    grunt.log.ok(`copied ${base}/${current} to ${base}/${latest}`);
  });

  grunt.registerTask('gaius-dist-index', 'Create the gaius dist/index.html file.', function() {
    grunt.task.requires('mkdir:dist');
    let done = this.async();
    let error = e => {
      grunt.log.error(e);
      done();
    };
    let template_file = config('gaius.templates.dist-index');
    let dist_base = config("gaius.dist.base");
    let dist_index = `${dist_base}/index.html`;
    let engine = new Liquid();
    subtask(`read ${template_file}`)
      .then(() => fs.readFileSync(template_file, 'utf8'))
      .then(template => engine.parseAndRender(template, {pkg: grunt.config('gaius.package')}))
      .then(output => fs.writeFileSync(dist_index, output, 'utf8'))
      .then(() => grunt.verbose.ok())
      .then(done)
      .catch(error);
  });

  grunt.registerTask('default', [
    "clean",
    'mkdir:dist',
    'run:test',
    'run:docs',
    'dist-copy-latest',
    'gaius-dist-index',
  ]);

  grunt.registerTask('dist', [
    'default',
    'gh-pages:dist',
  ]);

}
