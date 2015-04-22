module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      src: {
        main: 'PathOfSource',
        test: 'unit_tests/spec'
      },
      bin: {
        coverage: 'bin/coverage'
      }
    },

    jasmine: {
      myApp: {
        src: '<%= meta.src.main %>/**/*.js',
        options: {
          specs: '<%= meta.src.test %>/**/*spec.js',
          vendor: [
            "lib/js/jquery.js", // Path to external libs on which our code is depenedent like jQuey
            "lib/js/parsley.js"
          ]
        }
      },

      coverage: {
        src: ['<%= meta.src.main %>/**/*.js'],
        options: {
          specs: ['<%= meta.src.test %>/**/*spec.js'],
          vendor: [
            "lib/js/jquery.js",
            "lib/js/parsley.js"
          ],
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: '<%= meta.bin.coverage %>/coverage.json',
            report: [
              {type: 'html', options: {dir: '<%= meta.bin.coverage %>'}},
              {type: 'text-summary'}
            ]
          }
        }
      }
    },

    clean: {
      coverage: ['bin/coverage']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['jasmine:myApp', 'jasmine:coverage']);

};
