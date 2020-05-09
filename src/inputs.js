const { getInput } = require('@actions/core');

const inputs = {
  path:  getInput('path',  { required: true }),
  token: getInput('token', { required: true }),
}

module.exports = inputs;
