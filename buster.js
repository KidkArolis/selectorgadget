var config = module.exports;

config["Layer.chrome"] = {
  rootPath: ".",
  environment: "browser",
  sources: [
    "lib/**/*.*",
    "vendors/**/*.*"
  ],
  libs: [
    "vendors/require.js"
  ],
  tests: [
    "test/**/*_test.js"
  ],
  extensions: [require("buster-amd")]
};