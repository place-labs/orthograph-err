const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('@actions/glob');
const TextLintEngine = require("textlint").TextLintEngine;

async function getFiles() {
  let path = core.getInput('path', { required: true });
  let globber = await glob.create(path);
  return globber.glob();
}

async function lint(files) {
  let engine = new TextLintEngine();
  let results = await engine.executeOnFiles(files);
  if (engine.isErrorResults(results)) {
    let output = engine.formatResults(results);
    core.setFailed(output);
  }
}

try {
  let files = getFiles();
  lint(files);
} catch (error) {
  core.setFailed(error.message);
}
