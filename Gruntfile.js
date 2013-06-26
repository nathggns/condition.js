module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
        banner: '/*!\n' +
            ' * <%= pkg.title || pkg.name %> v<%= pkg.version %>\n' +
            '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
            ' * Built on <%= grunt.template.today("yyyy-mm-dd") %> \n' +
            ' */\n'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= concat.options.banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', 'src/**/*.js', 'test/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          console: true,
          module: true,
          window: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['mochacli', 'jshint', 'concat', 'uglify']
    },
    mochacli: {
      options: {
        require: ['should'],
        bail: true
      },
      all: ['test/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.registerTask('test', ['jshint', 'mochacli']);
  grunt.registerTask('default', ['mochacli', 'jshint', 'concat', 'uglify']);
};