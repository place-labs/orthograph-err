const { relative } = require('path');
const checks = require('./checks');

// TexLint message severity -> GitHub annotation level
const levels = ['notice', 'warning', 'failure'];

// TextLintMessage -> GitHub annotation object
const messageToAnnotation = (path, message) => ({
  path,
  start_line:       message.line,
  end_line:         message.line,
  start_column:     message.column,
  end_column:       message.column,
  annotation_level: levels[message.severity],
  message:          message.message,
  title:            message.ruleId,
});

const workspace = process.env.GITHUB_WORKSPACE;

// TextLintResult -> [GitHub annotations]
const resultToAnnotations = result => {
  const path = relative(workspace, result.filePath);
  const toAnnotation = message => messageToAnnotation(path, message);
  return result.messages.map(toAnnotation);
}

const annotate = (repo, check_run_id, results) =>
  checks.update({
    ...repo,
    check_run_id,
    output: {
      title: 'Textlint',
      summary: 'Linter results',
      annotations: results.flatMap(resultToAnnotations),
    },
  });

module.exports = annotate;
