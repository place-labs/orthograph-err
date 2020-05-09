const { GitHub } = require('@actions/github');
const { token }  = require('./inputs');

const github = new GitHub(token);

module.exports = github;
