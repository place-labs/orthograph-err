const { writeFileSync } = require("fs");
const { resolve } = require("path");
const ncc = require('@zeit/ncc');

const package = require('../package.json');
const deps    = Object.keys(package.dependencies);
const rules   = deps.filter((x) => { x.startsWith("textlint-rule") });

const src  = resolve(__dirname, '../src/index.js');
const dist = resolve(__dirname, '../dist/index.js');

const options = {
  externals: rules,
  minify: true,
};

async function run() {
  const { code, map, assets } = await ncc(src, options);
  writeFileSync(dist, code);
}

run();
