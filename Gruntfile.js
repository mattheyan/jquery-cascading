module.exports = function(grunt) {

    var srcJavaScriptFiles = ["jquery.cascading.js"];

  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            src: {
                options: {
                    jshintrc: ".jshintrc",
                },
                files: {
                    src: srcJavaScriptFiles
                }
            }
        },
        watch: {
            scripts: {
                files: srcJavaScriptFiles,
                tasks: ["jshint"]
            }
        }
    });

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks("grunt-contrib-jshint");

    // Load the plugin that provides file watching capabilities.
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Default task(s).
    grunt.registerTask("default", ["jshint:src"]);

};