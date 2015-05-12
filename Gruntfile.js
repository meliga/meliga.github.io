module.exports = function(grunt) {

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    open : {
      dev: {
        path: 'http://localhost:1919'
      }
    },

    connect: {
      server: {
        options: {
          port: 1919,
          base: 'dist',
          livereload: true
        }
      }
    },

    copy: {
      img: {
        files: [
          {expand: true, flatten: true, src: [
			'src/img/**/*',
		], dest: 'dist/static/img/', filter: 'isFile'}
        ]
      },
      fonts: {
        files: [
          {expand: true, flatten: true, src: [
			'bower_components/font-awesome/fonts/*',
			'bower_components/bootstrap/dist/fonts/*'
		], dest: 'dist/static/fonts/', filter: 'isFile'}
        ]
      },
      html: {
            files: [
                {expand: true, flatten: true, src: ['src/html/**/*.html'], dest: 'dist/', filter: 'isFile'}
            ]
      },
      css: {
            files: [
                {expand: true, flatten: true, src: ['bower_components/**/*.min.css'], dest: 'dist/static/css/', filter: 'isFile'}
            ]
      },
      js: {
            files: [
                {expand: true, flatten: true, src: [
                  'bower_components/**/*.min.js*',
                  'src/js/*.min.js*'
                  ], dest: 'dist/static/js/', filter: 'isFile'}
            ]
      }
    },

    exec: {
      bower_update: {
        cmd: 'bower update'
      },
    },

    clean: {
      fonts: ["dist/static/fonts"]
    },

    // see: https://github.com/gruntjs/grunt-contrib-uglify
    uglify: {
      min: {
          files: grunt.file.expandMapping(
              'src/js/*[^min].js',
              '',
              {rename: function(dest,path){console.log(dest, path);return path.replace('.js', '.min.js');}
              })
      }
    },

    // see: https://github.com/gruntjs/grunt-contrib-compass
    compass: {
      options: {
          sassDir: 'src/scss',
          cssDir: 'dist/static/css',
          fontsDir: 'src/fonts',
          imagesDir: 'src/img',
          relativeAssets: false,
          assetCacheBuster: false,
          outputStyle: 'compressed',
          raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
          options: {
              environment: 'production'
          }
      },
      server: {
          options: {
              // debugInfo: true
          }
      }
    },

    htmlmin: {
        dev: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            files:[
                {
                  expand: true,
                  cwd: 'src/html',
                  src: ['**/*.html'],
                  dest: 'dist/'
                },
            ]
        }
    },

    watch: {
        compass: {
            files: ['src/scss/*.{scss,sass}'],
            tasks: ['compass:server']
        },
        uglify: {
            files: ['src/js/*[^min].js'],
            tasks: ['uglify:min', 'copy:js']
        },
        htmlmin: {
            files: ['src/html/*.html'],
            tasks: ['htmlmin']

        },
        livereload: {
            files: ['dist/*', 'dist/**/*'],
            options: { livereload: true }
        }
    }

  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('fonts', ['clean:fonts','copy:fonts']);
  grunt.registerTask('default', ['exec:bower_update','compass', 'copy', 'connect','open','watch']);
  grunt.registerTask('build', ['exec:bower_update','sass:build']);
}
