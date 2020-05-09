const github = require('./github');

const update = github.checks.update;

const list = async (repo, ref) => {
  const response = await github.checks.listForRef({...repo, ref});
  return response.data.check_runs;
}

const find = async (repo, ref, name) => {
  const runs = await list(repo, ref)
  return runs.find(run => run.name == name);
}

module.exports = { update, list, find };
