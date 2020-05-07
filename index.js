const core = require('@actions/core');
const github = require('@actions/github');
const {TextLintEngine} = require("textlint");

function getFiles() {
  let path = core.getInput('path', { required: true });
  return [path];
}

async function lint(files) {
  let engine = new TextLintEngine();
  let results = await engine.executeOnFiles(files);
  if (engine.isErrorResults(results)) {
    let output = engine.formatResults(results);
    core.setFailed(output);
  }
  return results;
}

function annotate(annotations) {
  github.checks.update({
    ...github.context.repo(),
    check_run_id: process.env.GITHUB_RUN_ID,
    output: {
      title: 'Textlint',
      summary: 'Linter results',
      annotations: annotations,
    }
  });
}

const level = {
  0: 'notice',
  1: 'warning',
  2: 'failure'
}

function updateChecks(results) {
  results.map((result) => {
    annotate(result.messages.map((message) => {
      ({
        path: result.filePath,
        start_line: message.line,
        end_line: message.line,
        start_column: message.column,
        end_column: message.column,
        annotation_level: level[message.severity],
        message: message.message,
        title: message.ruleID,
      })
    }));
  });
}

async function run() {
  try {
    let files = getFiles();
    let result = await lint(files);
    Promise.all(updateChecks(result));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
