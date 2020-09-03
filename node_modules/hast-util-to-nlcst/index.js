'use strict'

var vfileLocation = require('vfile-location')
var toString = require('nlcst-to-string')
var position = require('unist-util-position')
var phrasing = require('hast-util-phrasing')
var embedded = require('hast-util-embedded')
var whitespace = require('hast-util-whitespace')
var textContent = require('hast-util-to-string')
var is = require('hast-util-is-element')

module.exports = toNlcst

var source = ['code']
var ignore = ['script', 'style', 'svg', 'math', 'del']
var explicit = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']

var flowAccepting = [
  'body',
  'article',
  'section',
  'blockquote',
  'nav',
  'aside',
  'header',
  'footer',
  'address',
  'li',
  'dt',
  'dd',
  'figure',
  'figcaption',
  'div',
  'main',
  'caption',
  'td',
  'th',
  'form',
  'fieldset',
  'details',
  'dialog'
]

// Transform `tree` to nlcst.
function toNlcst(tree, file, Parser) {
  var parser
  var location
  var results
  var doc

  // Warn for invalid parameters.
  if (!tree || !tree.type) {
    throw new Error('hast-util-to-nlcst expected node')
  }

  if (!file || !file.messages) {
    throw new Error('hast-util-to-nlcst expected file')
  }

  // Construct parser.
  if (!Parser) {
    throw new Error('hast-util-to-nlcst expected parser')
  }

  if (!position.start(tree).line || !position.start(tree).column) {
    throw new Error('hast-util-to-nlcst expected position on nodes')
  }

  location = vfileLocation(file)
  doc = String(file)
  parser = 'parse' in Parser ? Parser : new Parser()

  // Transform hast to nlcst, and pass these into `parser.parse` to insert
  // sentences, paragraphs where needed.
  results = []

  find(tree)

  return {
    type: 'RootNode',
    children: results,
    position: {
      start: location.toPosition(0),
      end: location.toPosition(doc.length)
    }
  }

  function find(node) {
    var children = node.children

    if (node.type === 'root') {
      findAll(children)
    } else if (is(node) && !ignored(node)) {
      if (is(node, explicit)) {
        // Explicit paragraph.
        add(node)
      } else if (is(node, flowAccepting)) {
        // Slightly simplified version of: <https://html.spec.whatwg.org/#paragraphs>.
        implicit(flattenAll(children))
      } else {
        // Dig deeper.
        findAll(children)
      }
    }
  }

  function findAll(children) {
    var length = children.length
    var index = -1

    while (++index < length) {
      find(children[index])
    }
  }

  function flatten(node) {
    if (is(node, ['a', 'ins', 'del', 'map'])) {
      return flattenAll(node.children)
    }

    return node
  }

  function flattenAll(children) {
    var results = []
    var length = children.length
    var index = -1

    while (++index < length) {
      results = results.concat(flatten(children[index]))
    }

    return results
  }

  function add(node) {
    var result = ('length' in node ? all : one)(node)

    if (result.length !== 0) {
      results.push(parser.tokenizeParagraph(result))
    }
  }

  function implicit(children) {
    var length = children.length + 1
    var index = -1
    var viable = false
    var start = -1
    var child

    while (++index < length) {
      child = children[index]

      if (child && phrasing(child)) {
        if (start === -1) {
          start = index
        }

        if (!viable && !embedded(child) && !whitespace(child)) {
          viable = true
        }
      } else if (child && start === -1) {
        find(child)
        start = index + 1
      } else if (start !== -1) {
        ;(viable ? add : findAll)(children.slice(start, index))

        if (child) {
          find(child)
        }

        viable = false
        start = -1
      }
    }
  }

  // Convert `node` (hast) to nlcst.
  function one(node) {
    var type = node.type
    var tagName = type === 'element' ? node.tagName : null
    var change
    var replacement

    if (type === 'text') {
      change = true
      replacement = parser.tokenize(node.value)
    } else if (tagName === 'wbr') {
      change = true
      replacement = [parser.tokenizeWhiteSpace(' ')]
    } else if (tagName === 'br') {
      change = true
      replacement = [parser.tokenizeWhiteSpace('\n')]
    } else if (sourced(node)) {
      change = true
      replacement = [parser.tokenizeSource(textContent(node))]
    } else if (type === 'root' || !ignored(node)) {
      replacement = all(node.children)
    } else {
      return
    }

    if (!change) {
      return replacement
    }

    return patch(replacement, location, location.toOffset(position.start(node)))
  }

  // Convert all `children` (hast) to nlcst.
  function all(children) {
    var length = children && children.length
    var index = -1
    var result = []
    var child

    while (++index < length) {
      child = one(children[index])

      if (child) {
        result = result.concat(child)
      }
    }

    return result
  }

  // Patch a position on each node in `nodes`.
  // `offset` is the offset in `file` this run of content starts at.
  //
  // Note that nlcst nodes are concrete, meaning that their starting and ending
  // positions can be inferred from their content.
  function patch(nodes, location, offset) {
    var length = nodes.length
    var index = -1
    var start = offset
    var children
    var node
    var end

    while (++index < length) {
      node = nodes[index]
      children = node.children

      if (children) {
        patch(children, location, start)
      }

      end = start + toString(node).length

      node.position = {
        start: location.toPosition(start),
        end: location.toPosition(end)
      }

      start = end
    }

    return nodes
  }
}

function sourced(node) {
  var props = node.properties
  return is(node) && (is(node, source) || props.dataNlcst === 'source')
}

function ignored(node) {
  var props = node.properties
  return is(node) && (is(node, ignore) || props.dataNlcst === 'ignore')
}
