const { TextLintEngine } = require("textlint");

const engine = new TextLintEngine();

const run = path => engine.executeOnFiles([path]);

module.exports = { engine, run };
