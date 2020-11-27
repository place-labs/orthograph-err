const { relative } = require('path');
const { rules }    = require('./linter');
const { checks }   = require('./github');

// TexLint message severity -> GitHub annotation level
const levels = ['notice', 'warning', 'failure'];

// If range information is available, extract an end column for the annotation.
// This is a bit of a hack to work around some issues in the message format.
// See https://github.com/textlint/textlint/issues/564
const endColumn = (message) => {
  let col = message.column
  if (message.fix) {
    const [start, end] = message.fix.range;
    col += (end - start);
  }
  return col;
}

// TextLintMessage -> GitHub annotation object
const messageToAnnotation = (path, message) => ({
  path,
  start_line:       message.line,
  end_line:         message.line,
  start_column:     message.column,
  end_column:       endColumn(message),
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

const conclusion = annotations => {
  if (annotations.length > 0) {
    if (annotations.some(ann => ann.annotation_level == 'failure')) {
      return 'failure';
    } else {
      return 'neutral';
    }
  } else {
    return 'success';
  }
}

const createCheck = (repo, head_sha, name, annotations) =>
  checks.create({
    ...repo,
    head_sha,
    name,
    status: 'completed',
    conclusion: conclusion(annotations),
    output: {
      title: `TextLint [${name}]`,
      summary: 'Linter results',
      annotations,
    },
  });

const annotate = (repo, sha, results) => {
  const annotations = results.flatMap(resultToAnnotations);

  const requests = rules.map(rule => (
    createCheck(repo, sha, rule, annotations.filter(ann => ann.title == rule))
  ));

  return Promise.all(requests);
};

module.exports = annotate;
