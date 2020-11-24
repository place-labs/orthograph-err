const core = require('@actions/core');
const { context } = require('@actions/github');

const annotate = require('./annotate');
const linter   = require('./linter');
const { path } = require('./inputs');

async function run() {
  try {
    const results = await core.group('Running linter', async () => {
      core.info(`Checking files matching ${path}`);

      const results = await linter.run(path);

      const output = linter.engine.formatResults(results);
      core.info(output);

      return results;
    });

    await core.group('Applying annotations', async () => {
      let sha = context.sha
      // PR's require check status to be linked to head commit SHA, whereas
      // context.sha refers to the associated merge commit.
      if (context.eventName == 'pull_request') {
        sha = context.payload.pull_request.head.sha
      }
      core.info(`Adding inline annotations to ${context.repo.repo}@${sha}`);

      const response = await annotate(context.repo, sha, results);
      core.debug(JSON.stringify(response, null, 2));
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
