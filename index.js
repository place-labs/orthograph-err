const core   = require('@actions/core');
const github = require('@actions/github');
const TextLintEngine = require("textlint").TextLintEngine;

function getFiles() {
  let path = core.getInput('path', { required: true });
  return [path];
}

async function lint(files) {
  let engine  = new TextLintEngine();
  let results = await engine.executeOnFiles(files);

  if (engine.isErrorResults(results)) {
    let output = engine.formatResults(results);
    core.setFailed(output);
  }

  return results;
}

function updateChecks(results) {
  let context = github.context;
  console.log(context);
  /*github.check.update({
    ...context.repo,
    
  });*/
}

async function run() {
  try {
    let files  = getFiles();
    let result = await lint(files);
    updateChecks(result);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
