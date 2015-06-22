module.exports = function (grunt) {
  'use strict';
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    sass: {
      dev: {
        options: {
          includePaths: [
            //'node_modules/normalize.css/',
            //'node_modules/flexboxgrid/dist/',
            //'node_modules/slick-carousel/slick',
            'src/scss/',
            'src/scss/base/',
            'src/scss/layout/',
            'src/scss/module/',
            'src/scss/utils/'
          ],
          outputStyle: 'nested'
        },
        files: {
          "src/css/style.css": "src/scss/index.scss"
        }
      }
    },

    autoprefixer: {
      dev: {
        options: {
          browsers: ['last 1 version']
        },
        files: [{
          src: 'src/css/style.css'
        }]
      }
    },

    jade: {
      dev: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'src/jade/',
          src: ['*.jade'],
          dest: 'src/',
          ext: '.html'
        }]
      }
    },

    concat: {
      dev: {
        options: {
          separator: ';\n'
        },
        src: [
          //'node_modules/jquery/dist/jquery.js',
          //'node_modules/slick-carousel/slick/slick.js',
          //'node_modules/isotope-layout/dist/isotope.pkgd.js',
          'src/js/dev/*.js'
        ],
        dest: 'src/js/main.js'
      }
    },

    browserSync: {
      default_options: {
        bsFiles: {
          src: [
            "src/*.html",
            "src/css/*.css",
            "src/js/*.js"
          ]
        },
        options: {
          watchTask: true,
          port: 3008,
          notify: false,
          injectChanges: true,
          open: true,
          ui: false,
          //reloadDelay: 200,
          browser: "chromium-browser",
          server: {
            baseDir: "src"
          }
        }
      }
    },

//SVG

    svgmin: {
      options: {
        plugins: [
          {removeViewBox: false},
          {removeUselessStrokeAndFill: true},
          {removeMetadata: false}
        ]
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: 'src/img/svg/',
            src: ['*.svg'],
            dest: 'src/img/svgmin/',
            ext: '.min.svg'
          }
        ]
      }
    },

    svgstore: {
      options: {
        cleanup: ['fill', 'stroke'],
        inheritviewbox: true,
        prefix: 'icon-',
        svg: {
          xmlns: 'http://www.w3.org/2000/svg',
          style: "display: none;"
        }
      },
      dev: {
        files: {
          'src/img/sprite.svg': ['src/img/svgmin/*.min.svg']
        }
      }
    },

//CSSCOMB

    csscomb: {
      dev: {
        options: {
          config: '.csscomb.json'
        },
        files: [{
          expand: true,
          cwd: 'src/scss',
          src: ['**/*.scss',
                '!**/_utils.scss',
                '!**/_vars.scss',
                '!**/_module.scss'
               ],
          dest: 'src/scss/',
          ext: '.scss'
        }]
      }
    },

//UNCSS

    uncss: {
      dist: {
        options: {
          ignore: ['#added_at_runtime', '.created_by_jQuery']
        },
        files: {
          'src/css/style.css': ['src/index.html']
        }
      }
    },

//WATCH

    watch: {
      sass: {
        files: "src/scss/**/*.scss",
        tasks: ['sass:dev', 'autoprefixer']
      },
      jade: {
        files: "src/jade/**/*.jade",
        tasks: ['jade']
      },
      js: {
        files: 'src/js/dev/index.js',
        tasks: ['concat']
      },
      svg: {
        files: 'src/img/svg/*.svg',
        tasks: ['newer:svgmin', 'svgstore']
      }
    },

//BUILD TASKS

    clean: {
      build: {
        src: ["build"]
      },
      svg: {
        src: ["src/img/svgmin"]
      }
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: [
              '**',
              '!**/js/dev/**',
              '!**/scss/**',
              '!**/jade/**',
              '!**/svg*/**'
            ],
            dest: 'build/'
          }
        ]
      }
    },

    cssmin: {
      build: {
        files: {
          'build/css/style.css': ['build/css/style.css']
        }
      }
    },

    htmlmin: {
      build: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        files: {
          'build/index.html': 'build/index.html'
        }
      }
    },

    uglify: {
      build: {
        files: {'build/js/main.js': 'build/js/main.js'}
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'build/img/'
        }]
      }
    },

//PUBLISH ON GITHUB PAGES

    'gh-pages': {
      options: {
        base: 'build'
      },
      src: ['**']
    }
  });


  grunt.registerTask('comb', ['newer:csscomb']);
  
  grunt.registerTask('svg', [
    'clean:svg',
    'svgmin',
    'svgstore'
  ]);
  
  grunt.registerTask('build', [
    'comb',
    'clean:build',
    'copy',
    'cssmin',
    'htmlmin',
    'uglify',
    'imagemin'
  ]);
  
  grunt.registerTask('default', [
    'browserSync',
    'watch'
  ]);
};
