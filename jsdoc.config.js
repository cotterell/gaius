'use strict';

module.exports = {
  markdown: {
    idInHeadings: true,
  },
  opts: {
    encoding: "utf8",               // same as -e utf8
    destination: "./docs",          // same as -d ./docs
    recurse: true,                  // same as -r
    readme: "./README.md",
  },
  plugins: [
    "plugins/markdown",
  ],
  source: {
    include: [
      "./src",
    ],
    includePattern: ".+\\.js(doc|x)?$",
    excludePattern: "(^|\\/|\\\\)_"
  },
  sourceType: "module",
  tags: {
    allowUnknownTags: true,
    dictionaries: [
      "jsdoc",
      "closure",
    ],
  },
  templates: {
    default: {
      layoutFile: "./jsdoc.layout.tpl",
      outputSourceFiles: false,
    },
  },
};
