const core = require('@actions/core');
const { context }   = require('@actions/github');

const annotate = require('./annotate');
const linter   = require('./linter');
const { path } = require('./inputs');

async function run() {
  try {
    core.startGroup('Running linter');
    core.info(`Checking files in ${path}`);
    const results  = await linter.run(path);
    core.info('Done');
    core.debug(results);
    core.endGroup();

    core.startGroup('Annotating results');
    core.info(`Adding inline annotations to ${context.repo.repo}#${context.sha}`);
    const response = await annotate(context.repo, context.sha, results);
    core.info('Done');
    core.debug(response);
    core.endGroup();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
