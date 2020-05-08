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
function annotator(context, token) {
  const api   = new github.GitHub(token);
  const check = process.env.GITHUB_RUN_ID

  const level = ['notice', 'warning', 'failure'];

  return (result) => {
    console.log(`check_id: ${check}`);
    console.log(result);

    api.checks.update({
      ...context.repo,
      check_run_id: check,
      output: {
        title: 'Textlint',
        summary: 'Linter results',
        annotations: result.messages.map(message => ({
          path:             result.filePath,
          start_line:       message.line,
          end_line:         message.line,
          start_column:     message.column,
          end_column:       message.column,
          annotation_level: level[message.severity],
          message:          message.message,
          title:            message.ruleId,
        })),
      },
    });
  }
}

async function run() {
  try {
    const path  = core.getInput('path', { required: true });
    const token = core.getInput('gh_token', { required: true });

    const [results, err] = await lint(path);

    if (err) {
      core.setFailed('Proofreading issues found');
    }

    if (results.length > 0) {
      const annotate = annotator(github.context, token);
      await Promise.all(results.map(annotate));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
