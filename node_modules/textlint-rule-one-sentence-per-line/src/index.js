const splitter = require("sentence-splitter")

/**
 * Get parents of node.
 * The parent nodes are returned in order from the closest parent to the outer ones.
 * @param node
 * @returns {Array}
 */
function getParents(node) {
  const result = []
  // child node has `parent` property.
  let parent = node.parent
  while (parent != null) {
    result.push(parent)
    parent = parent.parent
  }
  return result
}

/**
 * Return true if `node` is wrapped any one of `types`.
 * @param {TxtNode} node is target node
 * @param {string[]} types are wrapped target node
 * @returns {boolean|*}
 */
function isNodeWrapped(node, types) {
  const parents = getParents(node)
  const parentsTypes = parents.map(function(parent) {
    return parent.type
  })
  return types.some(function(type) {
    return parentsTypes.some(function(parentType) {
      return parentType === type
    })
  })
}

const reporter = context => {
  const { Syntax, RuleError, fixer, report, getSource } = context
  return {
    [Syntax.Paragraph](node) {
      // Titles aren't sembr since breaks do affect them
      if (isNodeWrapped(node, [Syntax.Header])) {
        return
      }
      const text = getSource(node)
      const split = splitter.split(text)

      // if there is only one sentence in the line, return early it's following sembr
      if (split.filter(x => x.type == "Sentence").length == 1) {
        return
      }
      // Sometimes, we might get a case where two lines are separated by whitespaces,
      // but are passed together. For example:
      //
      // Hello World!
      // My Name is Benjamin.
      //
      // Would yield ["Hello World!", "\n", "My name is Benjamin."] when split by sentence-splitter
      // This has two sentences in it but is proper sembr
      //
      // Similarly, we need to check even in the case where the new line is indented.
      // sentence-splitter treats this as a separate whitespace from the \n, so we just
      // need to see that every sentence has a newline after it some time before the
      // next sentence starts.

      // a placeholder variable
      let allSentencesHaveNewlines = true

      for (let node = 0; node < split.length; node++) {
        const element = split[node]

        // we only care about sentences
        if (element.type != "Sentence") {
          continue
        }

        // for each sentence, we're going to check util we find another sentence
        for (let index = 1; index < split.length - node; index++) {
          const nextElement = split[node + index]
          // check to see if the whitespace has a newline
          if (
            nextElement.type == "WhiteSpace" &&
            nextElement.raw.includes("\n")
          ) {
            break
          }
          // if not, and the next element is a sentence, we found a sentence on the same
          // line, so we shouldn't return early
          if (nextElement.type == "Sentence") {
            allSentencesHaveNewlines = false
          }
        }
      }
      // return early if we haven't found sentences on a new line.
      if (allSentencesHaveNewlines) {
        return
      }

      // insert the newlines
      const fixed = split
        .filter(x => x.type == "Sentence")
        .map(x => x.raw)
        .join("\n")

      // when we found more than one sentence per line, propose a fix
      report(
        node,
        new RuleError("More than one sentence per line", {
          fix: fixer.replaceText(node, fixed)
        })
      )
    }
  }
}

export default {
  linter: reporter,
  fixer: reporter
}
