const { setFailed } = require('@actions/core');
const { context }   = require('@actions/github');

const annotate = require('./annotate');
const linter   = require('./linter');
const { path } = require('./inputs');

async function run() {
  try {
    const results  = await linter.run(path);
    const response = await annotate(context.repo, context.sha, results);
  } catch (error) {
    setFailed(error.message);
  }
}

run();
