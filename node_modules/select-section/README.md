# select-section

Cut out sections from TxtAST or [mdast](https://github.com/syntax-tree/mdast).

## Section?

A **section** is slitted by Header Node.

This rule defined **section** as following:

The Markdown contents 
```
# Header1

text.

# Header2

text.

```

to be

```
------------|---- # Header 1
            | 
Section1    |     text.
            |
------------|---- # Header 2
            |
Section2    |     text.
            |
------------|---------------
```

### Same Level header



A **section** is slitted by Header Node.

This rule defined **section** as following:

The Markdown contents 
```
# Header1

text.

## Header2

text.

```

to be

```
--------------------------|---- # Header 1
                          | 
  Section1                |     text.
                          |
            --------------|---- ## Header 2
            -            -|
            -  Section2  -|     text.
            -            -|
--------------------------|---------------
```

Tree view:

```
└── _Section1_
    ├── # Header 1
    ├── text.
    └── _Section2_
        ├── ## Header 2
        └── text.
```

## Install

Install with [npm](https://www.npmjs.com/):

    npm install select-section

## Usage


Create "Section" node that compatible with [TxtAST](https://github.com/textlint/textlint/blob/master/docs/txtnode.md "TxtAST").

```js
const createSections = require("select-section");
const parse = require("markdown-to-ast").parse;
const AST = parse(`# Header
text1
text1

# Header

text2
text2`);
const results = createSections(AST);
/*
[
    {
        "type": "Section",
        "range": [
            0,
            20
        ],
        "loc": {
            "start": {
                "line": 1,
                "column": 0
            },
            "end": {
                "line": 3,
                "column": 5
            }
        },
        "raw": "# Headertext1\ntext1",
        "children": [
            {
                "type": "Header",
                "depth": 1,
                "children": [
                    {
                        "type": "Str",
                        "value": "Header",
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 2
                            },
                            "end": {
                                "line": 1,
                                "column": 8
                            }
                        },
                        "range": [
                            2,
                            8
                        ],
                        "raw": "Header"
                    }
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 8
                    }
                },
                "range": [
                    0,
                    8
                ],
                "raw": "# Header"
            },
            {
                "type": "Paragraph",
                "children": [
                    {
                        "type": "Str",
                        "value": "text1\ntext1",
                        "loc": {
                            "start": {
                                "line": 2,
                                "column": 0
                            },
                            "end": {
                                "line": 3,
                                "column": 5
                            }
                        },
                        "range": [
                            9,
                            20
                        ],
                        "raw": "text1\ntext1"
                    }
                ],
                "loc": {
                    "start": {
                        "line": 2,
                        "column": 0
                    },
                    "end": {
                        "line": 3,
                        "column": 5
                    }
                },
                "range": [
                    9,
                    20
                ],
                "raw": "text1\ntext1"
            }
        ]
    },
    {
        "type": "Section",
        "range": [
            22,
            43
        ],
        "loc": {
            "start": {
                "line": 5,
                "column": 0
            },
            "end": {
                "line": 8,
                "column": 5
            }
        },
        "raw": "# Headertext2\ntext2",
        "children": [
            {
                "type": "Header",
                "depth": 1,
                "children": [
                    {
                        "type": "Str",
                        "value": "Header",
                        "loc": {
                            "start": {
                                "line": 5,
                                "column": 2
                            },
                            "end": {
                                "line": 5,
                                "column": 8
                            }
                        },
                        "range": [
                            24,
                            30
                        ],
                        "raw": "Header"
                    }
                ],
                "loc": {
                    "start": {
                        "line": 5,
                        "column": 0
                    },
                    "end": {
                        "line": 5,
                        "column": 8
                    }
                },
                "range": [
                    22,
                    30
                ],
                "raw": "# Header"
            },
            {
                "type": "Paragraph",
                "children": [
                    {
                        "type": "Str",
                        "value": "text2\ntext2",
                        "loc": {
                            "start": {
                                "line": 7,
                                "column": 0
                            },
                            "end": {
                                "line": 8,
                                "column": 5
                            }
                        },
                        "range": [
                            32,
                            43
                        ],
                        "raw": "text2\ntext2"
                    }
                ],
                "loc": {
                    "start": {
                        "line": 7,
                        "column": 0
                    },
                    "end": {
                        "line": 8,
                        "column": 5
                    }
                },
                "range": [
                    32,
                    43
                ],
                "raw": "text2\ntext2"
            }
        ]
    }
]
*/
```

## Example

- Use in textlint: [azu/textlint-rule-no-empty-section: textlint rule not allow to create empty section.](https://github.com/azu/textlint-rule-no-empty-section "azu/textlint-rule-no-empty-section: textlint rule not allow to create empty section.")

## Changelog

See [Releases page](https://github.com/azu/text-testing/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/text-testing/issues).

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
