const path   = require('path');
const core   = require('@actions/core');
const github = require('@actions/github');
const glob   = require('@actions/glob');

const TextLintEngine = require("textlint").TextLintEngine;

async function getFiles() {
  let workspace = process.env['GITHUB_WORKSPACE'];
  let globPath  = core.getInput('path', { required: true });
  let globber   = await glob.create(path.resolve(workspace, globPath));
  return globber.glob();
}

async function lint(files) {
  let engine  = new TextLintEngine();
  let results = await engine.executeOnFiles(files);

  if (engine.isErrorResults(results)) {
    let output = engine.formatResults(results);
    core.setFailed(output);
  }
}

async function run() {
  try {
    let files = await getFiles();
    core.warning(files);
    lint(files);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
