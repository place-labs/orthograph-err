# Proofreader

This action runs a set of proofreader tools over documentation, user guides and
other text content using the beautiful, flexible
[textlint](https://textlint.github.io/).

## Usage

Your repository should contain a [textlint configuration
file](https://textlint.github.io/docs/configuring.html).

```yaml
- uses: place-labs/proofreader@master
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

Following a run and issue will appear as inline annotations against their
source. Each enabled rules engine will also receive it's own check, which may be
used for configuring branch protection if desired.

For an example of this action in use, see
[PlaceOS/docs](https://github.com/PlaceOS/docs).

## Supported Rules Engines

- [alex](https://github.com/textlint-rule/textlint-rule-alex)
- [common-misspellings](https://github.com/io-monad/textlint-rule-common-misspellings)
- [en-capitalization](https://github.com/textlint-rule/textlint-rule-en-capitalization)
- [no-empty-section](https://github.com/azu/textlint-rule-no-empty-section)
- [no-exclamation-question-mark](https://github.com/azu/textlint-rule-no-exclamation-question-mark)
- [period-in-list-item](https://github.com/textlint-rule/textlint-rule-period-in-list-item)
- [rousseau](https://github.com/textlint-rule/textlint-rule-rousseau)
- [terminology](https://github.com/sapegin/textlint-rule-terminology)
- [write-good](https://github.com/textlint-rule/textlint-rule-write-good)

To add rules engines [fork this
repo](https://github.com/place-labs/proofreader/fork), then `npm install
<rule>`.

If it's a commonly useful rule, PR's are open <3.
