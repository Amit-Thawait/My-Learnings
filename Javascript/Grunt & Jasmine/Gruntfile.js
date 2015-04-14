module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      myApp: {
        src: 'PathOfSource/**/*.js',
        options: {
          specs: 'spec/**/*spec.js',
          vendor: [
            "lib/jquery.js" // Path to external libs on which our code is depenedent like jQuey
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', ['jasmine:myApp']);

};
