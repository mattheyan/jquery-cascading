module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            src: {
                options: {
                    jshintrc: '.jshintrc',
                },
                files: {
                    src: ["jquery.cascading.js"]
                }
            }
        }
    });

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks("grunt-contrib-jshint");

    // Load the plugin that provides qunit headless browser testing.
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Default task(s).
    grunt.registerTask("default", ["jshint:src"]);

};