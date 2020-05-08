const {relative} = require('path');
const core = require('@actions/core');
const github = require('@actions/github');
const {TextLintEngine} = require("textlint");

/**
 * Run Textlint over a file (or glob pattern). Returns a list of TextLintResult
 * and a flag for if any of these are erros.
 */
async function lint(path) {
  const engine  = new TextLintEngine();
  const results = await engine.executeOnFiles([path]);
  const has_err = engine.isErrorResults(results);
  return [results, has_err];
}

/**
 * Builds a annotator for the current context. The return function accepts a
 * single TextLintResult and publishes this as a set of annotations against the
 * associated files on Github.
 */
async function annotator(context, token, name) {
  const api = new github.GitHub(token);

  const check = await api.checks.listForRef({
    ...context.repo,
    ref: context.ref
  }).then(response => (
    response.data.check_runs.find(check => (
      check.name == name &&
      check.head_sha == context.sha
    ))
  ));

  const workspace = process.env.GITHUB_WORKSPACE;

  const level = ['notice', 'warning', 'failure'];

  return (result) => {
    api.checks.update({
      ...context.repo,
      check_run_id: check.id,
      output: {
        title: 'Textlint',
        summary: 'Linter results',
        annotations: result.messages.map(message => ({
          path:             relative(workspace, result.filePath),
          start_line:       message.line,
          end_line:         message.line,
          start_column:     message.column,
          end_column:       message.column,
          annotation_level: level[message.severity],
          message:          message.message,
          title:            message.ruleId,
        })),
      },
    }).then(console.log);
  }
}

async function run() {
  try {
    const path  = core.getInput('path', { required: true });
    const token = core.getInput('gh-token', { required: true });
    const name  = core.getInput('check-name', { required: true });

    const [results, err] = await lint(path);

    if (err) {
      core.setFailed('Proofreading issues found');
    }

    if (results.length > 0) {
      const annotate = await annotator(github.context, token, name);
      await Promise.all(results.map(annotate));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
