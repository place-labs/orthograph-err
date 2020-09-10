const { getOctokit } = require('@actions/github');
const { token }  = require('./inputs');

const github = getOctokit(token);

module.exports = github;
