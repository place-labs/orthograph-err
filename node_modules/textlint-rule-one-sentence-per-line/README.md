# textlint-rule-one-sentence-per-line

[![textlint rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/)

A fixable [textlint](https://github.com/textlint/textlint) rule adding a line break after each sentence, also known as [Semantic Line Breaks](https://sembr.org) (SemBr).

For example, consider the Gettysburg Address but with one paragraph per line:

```markdown
# Gettysburg Address

Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.

Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this.

But, in a larger sense, we can not dedicate—we can not consecrate—we can not hallow—this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us—that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion—that we here highly resolve that these dead shall not have died in vain—that this nation, under God, shall have a new birth of freedom—and that government of the people, by the people, for the people, shall not perish from the earth.
```

This can be pretty hard to read, especially without word wrapping.
More importantly, it is incredibly hard to use a version control system such as Git to track changes to the text.
Now take a look at the SemBr Gettysburg Address with one sentence per line:

```markdown
# Gettysburg Address

Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.

Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure.
We are met on a great battle-field of that war.
We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live.
It is altogether fitting and proper that we should do this.

But, in a larger sense, we can not dedicate—we can not consecrate—we can not hallow—this ground.
The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract.
The world will little note, nor long remember what we say here, but it can never forget what they did here.
It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced.
It is rather for us to be here dedicated to the great task remaining before us—that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion—that we here highly resolve that these dead shall not have died in vain—that this nation, under God, shall have a new birth of freedom—and that government of the people, by the people, for the people, shall not perish from the earth.
```

For more information on SemBr (which dates back to the legendary [Brian W. Kernighan](https://en.wikipedia.org/wiki/Brian_Kernighan)), take a look at this [blog post](https://rhodesmill.org/brandon/2012/one-sentence-per-line/).

## Install

If you don't have textlint installed, please see their [installation instructions](https://textlint.github.io/docs/getting-started.html).
Then, install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-one-sentence-per-line

## Usage

### Via `.textlintrc`(Recommended)

Set `"one-sentence-per-line"` to `true`:

```json
{
  "rules": {
    "one-sentence-per-line": true
  }
}
```

To fix errors, run

```
textlint --fix README.md
```

### Via CLI

To find errors:

```
textlint --rule one-sentence-per-line README.md
```

and then to fix them:

```
textlint --rule one-sentence-per-line README.md --fix
```

### Usage Suggestions

In case that we rely make a mistake splitting sentences into separate lines, please let us know by [filing an issue](https://github.com/Lab41/textlint-rule-one-sentence-per-line/issues).
In the mean time, we suggest using [`textlint-filter-rule-comments`](https://github.com/textlint/textlint-filter-rule-comments) to disable sentence splitting for the offending lines:

```markdown
<!-- textlint-disable one-sentence-per-line -->

These two sentences will be one the same line. This is because we disabled the rule.

<!-- textlint-enable one-sentence-per-line -->
```

Although the line breaks will not (hopefully!) change the rendered file, it may make the raw Markdown a little ugly.
To solve that, we recommend using [`prettier`](https://prettier.io) to clean up the outputted Markdown.

Finally, if you are using [Pandoc's Markdown](https://pandoc.org/MANUAL.html#pandocs-markdown) with citations, put the citations **inside** the period.
This will keep the citation on the same line as the sentence if you use the `--fix` option.
Don't worry!
Pandoc is smart enough to figure out whether to put your citation after the period if you style requires it in the rendered output.
For example:

```markdown
Do this [@Lee2018]. Don't do this.[@Lee2019] Also don't do this. [@Lee2020]
```

Will be changed to:

```markdown
Do this [@Lee2018].
Don't do this.[@Lee2019] Also don't do this.
[@Lee2020]
```

## Contribute

This repository's skeleton was generated by [`create-textlint-rule`](https://github.com/textlint/create-textlint-rule).

### Build

Builds source code for publish to the `lib` folder.
You can write ES2015+ source code in `src/` folder.

    npm run build

### Tests

Run test code in `test` folder.
Test textlint rule by [textlint-tester](https://github.com/textlint/textlint-tester).

    npm test

## License

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) ([summary](https://choosealicense.com/licenses/apache-2.0/))
