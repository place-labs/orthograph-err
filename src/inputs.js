const { getInput } = require('@actions/core');

const inputs = {
  path:  getInput('path',       { required: true }),
  token: getInput('gh-token',   { required: true }),
  name:  getInput('check-name', { required: true }),
}

module.exports = inputs;
