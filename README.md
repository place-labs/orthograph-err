# Orthograph-err

> An orthography is a set of conventions for writing a language.
> It includes norms of spelling, hyphenation, capitalization, word breaks, emphasis, and punctuation.

This action runs a set of proofreading tools over documentation, user guides and other text content using the wonderfully flexible [textlint](https://textlint.github.io/), flagging any orthograpic errors.

## Usage

Your repository should contain a [textlint configuration file](https://textlint.github.io/docs/configuring.html).

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

Issue will appear as inline annotations against their source.
Each enabled rules engine will receive it's own check, which may used for branch protection if desired.

For an example of this action in use, see [PlaceOS/docs](https://github.com/PlaceOS/docs).

## Supported Rules Engines

- [alex](https://github.com/textlint-rule/textlint-rule-alex)
- [common-misspellings](https://github.com/io-monad/textlint-rule-common-misspellings)
- [en-capitalization](https://github.com/textlint-rule/textlint-rule-en-capitalization)
- [no-empty-section](https://github.com/azu/textlint-rule-no-empty-section)
- [no-exclamation-question-mark](https://github.com/azu/textlint-rule-no-exclamation-question-mark)
- [one-sentence-per-line](https://github.com/Lab41/textlint-rule-one-sentence-per-line)
- [period-in-list-item](https://github.com/textlint-rule/textlint-rule-period-in-list-item)
- [rousseau](https://github.com/textlint-rule/textlint-rule-rousseau)
- [terminology](https://github.com/sapegin/textlint-rule-terminology)
- [write-good](https://github.com/textlint-rule/textlint-rule-write-good)

To add rules engines [fork this repo](https://github.com/place-labs/orthograph-err/fork), then `npm install <rule>`.

If it's a commonly useful rule, PR's are open <3.
