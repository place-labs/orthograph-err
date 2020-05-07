const core = require('@actions/core');
const github = require('@actions/github');

try {
  const payload = JSON.stringify(github.context.payload);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
