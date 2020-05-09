const { TextLintEngine } = require("textlint");

const engine = new TextLintEngine();

const lint = path => engine.executeOnFiles([path]);

module.exports = lint;
