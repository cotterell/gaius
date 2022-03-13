module.exports = function(grunt) {

  const copydir = require('copy-dir');
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const fs = require('fs');
  const liquidjs = (...args) => import('liquidjs').then(liquidjs => new liquidjs.Liquid(...args));
  const pkg = grunt.file.readJSON('./package.json');

  const data = {
    pkg: pkg,
    npm: {},
  };

  const config = prop => {
    grunt.config.requires(prop);
    return grunt.config(prop);
  }; // config

  grunt.loadNpmTasks('grunt-babel');
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
        current: '<%= gaius.dist.base %>/gaius@<%= gaius.package.version %>',
        latest: '<%= gaius.dist.base %>/gaius@latest',
      },
      templates: {
        "dist-index": "dist.liquid",
      },
    },
    pkg: pkg,
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
    babel: {
      options: {
        minified: true,
        sourceMap: true,
        presets: [
          [
            "@babel/preset-env",
            {
              bugfixes: true,
              useBuiltIns: "usage",
              corejs: 3,
            },
          ],
        ],
        plugins: [
          [
            "@babel/plugin-transform-regenerator",
            {
              regenerator: true,
              corejs: 3,
            },
          ],
        ],
        only: ["./src"],
      },
      dist: {
        files: {
          "<%= pkg_current %>/gaius.js": "src/gaius.js",
          "dist/gaius.js": "src/gaius.js",
        },
        parser: "@babel/eslint-parser",
      },
    },
    clean: [
      'dist',
    ],
  });

  grunt.registerTask('download-registry', 'Download npm registry.', function() {
    let done = this.async();
    let url = "https://registry.npmjs.org/gaius";
    let error = e => {
      grunt.log.error(e);
      done();
    };
    fetch(url).then(res => {
      grunt.log.ok(`fetched ${url}`);
      res.json().then(json => {
        grunt.log.ok(`parsed JSON response`);
        data.npm = json;
        done();
      }).catch(error);
    }).catch(error);
  });

  grunt.registerTask('dist-copy-latest', 'Copy the current dist/gaius@version directory into dist/gaius@latest.', function() {
    grunt.config.requires('pkg_current');
    grunt.config.requires('pkg_latest');
    //grunt.task.requires(['nyc:test', 'run:docs']);
    grunt.task.requires(['babel', 'run:test', 'run:docs']);
    const pkg_current = grunt.config('pkg_current');
    const pkg_latest = grunt.config('pkg_latest');
    copydir.sync(pkg_current, pkg_latest);
    grunt.log.ok(`copied ${pkg_current} to ${pkg_latest}`);
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
    liquidjs().then(engine => {
      grunt.log.ok('loaded liquidjs engine');
      let template = fs.readFileSync(template_file, 'utf8');
      grunt.log.ok(`read ${template_file}`);
      engine.parseAndRender(template, {pkg: pkg})
        .then(output => {
          grunt.log.ok(`parsed ${template_file}`);
          fs.writeFileSync(dist_index, output, 'utf8');
          grunt.log.ok(`saved to ${dist_index}`);
          done();
        }).catch(error);
    }).catch(error);
  });

  grunt.registerTask('dist', [
    "clean",
    'mkdir:dist',
    'babel',
    'run:test',
    'run:docs',
    'dist-copy-latest',
    'gaius-dist-index',
    'gh-pages:dist',
  ]);

  grunt.registerTask('default', []);

};
