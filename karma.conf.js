module.exports = function (config) {
    config.set({
      frameworks: ["jasmine", "@angular-devkit/build-angular"],
      plugins: [
        require("karma-jasmine"),
        require("karma-chrome-launcher"),
        require("karma-jasmine-html-reporter"),
        require("karma-coverage"),
        require("karma-mocha-reporter"),
        require("@angular-devkit/build-angular/plugins/karma"),
      ],
      reporters: ["progress", "kjhtml", "mocha"],
      coverageReporter: {
        dir: require("path").join(__dirname, "./reports/coverage"),
        subdir: ".",
        reporters: [
          { type: "html" }, // Generiert HTML-Bericht für die Coverage
          { type: "text-summary" }, // Konsolen-Zusammenfassung
        ],
      },
      singleRun: true,
      restartOnFileChange: true,
    });
  };
  