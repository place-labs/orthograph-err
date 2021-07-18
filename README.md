**This project is no longer maintained.**

Usage can be simplified by using Textlint directly with [problem matchers](https://github.com/actions/toolkit/blob/2f164000dcd42fb08287824a3bc3030dbed33687/docs/problem-matchers.md).

Please [see here](https://github.com/PlaceOS/docs/pull/73/commits/08376005211aadc825dc56843deb0fb1960b8895) for an example migration.

---

# Orthograph-err

> An orthography is a set of conventions for writing a language.
> It includes norms of spelling, hyphenation, capitalisation, word breaks, emphasis, and punctuation.

A GitHub Action for proofreading content.
It provides feedback on documentation, user guides and other text content within your project.
Using the wonderfully flexible [TextLint](https://textlint.github.io/) any orthographic errors will appear as inline annotations.

## Usage

Your repository should contain a [TextLint configuration file](https://textlint.github.io/docs/configuring.html).
This defines the active rules and desired writing style.

With this in place, include this action in any workflows that can need feedback.
PR's or commits to master / release branches are a good option for this.

```yaml
- uses: place-labs/orthograph-err@v1
  with:
    # File path with the content to review.
    # Default: {,!(node_modules)/**/}*.md
    path: ''

    # GitHub personal access token to update check status with. When issues are
    # found the associate commit with be annotate with these. This token MUST
    # have `check_write` access to the target repository. In most cases this can
    # can remain as the default (GitHub Actions).
    # Default: ${{ github.token }}
    token: ''
```

Issues will appear as inline annotations against their source.
Each enabled rules engine will receive it's own check, which may used for branch protection if desired.

For an example of this action in use, see [PlaceOS/docs](https://github.com/PlaceOS/docs).

## Supported Rules Engines

- [alex](https://github.com/textlint-rule/textlint-rule-alex)
- [common-misspellings](https://github.com/io-monad/textlint-rule-common-misspellings)
- [en-capitalisation](https://github.com/textlint-rule/textlint-rule-en-capitalization)
- [no-empty-section](https://github.com/azu/textlint-rule-no-empty-section)
- [no-exclamation-question-mark](https://github.com/azu/textlint-rule-no-exclamation-question-mark)
- [one-sentence-per-line](https://github.com/Lab41/textlint-rule-one-sentence-per-line)
- [period-in-list-item](https://github.com/textlint-rule/textlint-rule-period-in-list-item)
- [rousseau](https://github.com/textlint-rule/textlint-rule-rousseau)
- [spelling](https://github.com/nzt/textlint-rule-spelling)
- [terminology](https://github.com/sapegin/textlint-rule-terminology)
- [write-good](https://github.com/textlint-rule/textlint-rule-write-good)

## Filter Rules

- [allowlist](https://github.com/textlint/textlint-filter-rule-allowlist)

To add rules engines, or filters [fork this repository](https://github.com/place-labs/orthograph-err/fork), then `npm install <rule>`.

If it's a commonly useful rule, PR's are open <3.
