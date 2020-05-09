const { TextLintEngine } = require("textlint");

const engine = new TextLintEngine();

const rules = engine.textlintrcDescriptor.rule.descriptors.map(d => d.id);

const run = path => engine.executeOnFiles([path]);

module.exports = { engine, rules, run };
