const core = require('@actions/core');

const annotate = require('./annotate');
const context  = require('./context');
const inputs   = require('./inputs');
const linter   = require('./linter');

async function run() {
  try {
    const rules = linter.engine.textlintrcDescriptor.rule.descriptors.map(descriptor => descriptor.id);
    console.log(rules);

    const results = await linter.run(inputs.path);
    const runId   = await context.getRunId();
    await annotate(context.repo, runId, results);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
