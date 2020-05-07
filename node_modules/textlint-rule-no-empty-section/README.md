# textlint-rule-no-empty-section

textlint rule not allow to create empty section.

## Features

**OK** :green_heart:

```
# Header A

text.

# Header B

text.
```


**OK**: `Header 1` contains `Header 2`

```
# Header 1

## Header 2

text.
```

**NG** :negative_squared_cross_mark:

> Found empty header: `# Header2`

```
# Header A

text.

# Header B

```

## Section

This rule defined **section** as following:

The Markdown contents 
```
# Header A

text.

# Header B

text.

```

to be

```
------------|---- # Header A
            | 
Section1    |     text.
            |
------------|---- # Header B
            |
Section2    |     text.
            |
------------|---------------
```

A **section** is slitted by Header Node.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-no-empty-section

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "no-empty-section": true
    }
}
```

Via CLI

```
textlint --rule no-empty-section README.md
```


## Reference

- [text-testing/packages/select-section at master · azu/text-testing](https://github.com/azu/text-testing/tree/master/packages/select-section "text-testing/packages/select-section at master · azu/text-testing")

## Changelog

See [Releases page](https://github.com/azu/textlint-rule-no-empty-section/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/textlint-rule-no-empty-section/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
