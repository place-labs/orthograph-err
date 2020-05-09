const { setFailed } = require('@actions/core');
const { context }   = require('@actions/github');

const annotate = require('./annotate');
const linter   = require('./linter');
const { path } = require('./inputs');

async function run() {
  try {
    const results  = await linter.run(path);
    const head_sha = context.payload.after;
    const response = await annotate(context.repo, head_sha, results);
  } catch (error) {
    setFailed(error.message);
  }
}

run();
