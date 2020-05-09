const github = require('@actions/github');
const checks = require('./checks');
const inputs = require('./inputs');

const repo = github.context.repo;

const ref = github.context.ref;

const sha = github.context.sha;

const getRunId = () => checks.find(repo, sha, inputs.name).then(run => run.id);

module.exports = { repo, ref, sha, getRunId };
