// LICENSE : MIT
"use strict";
const traverse = require("txt-ast-traverse").traverse;
const Map = require("map-like");

class Section {
    constructor(level) {
        this.level = level;
        this.nodes = [];
    }

    isSameLevel(level) {
        return level === this.level;
    }

    add(node) {
        this.nodes.push(node);
    }

    toArray() {
        return this.nodes.slice();
    }

    toSectionNode() {
        const nodes = this.toArray();
        const firstNode = nodes[0];
        const lastNode = nodes[nodes.length - 1];
        if (!firstNode || !lastNode) {
            return {
                type: "Section",
                children: []
            }
        }
        return {
            type: "Section",
            range: firstNode.position
                   ? [firstNode.position.start.offset, lastNode.position.end.offset]
                   : [firstNode.range[0], lastNode.range[1]],
            loc: {
                start: firstNode.position
                       ? firstNode.position.start.offset
                       : firstNode.loc.start,
                end: lastNode.position
                     ? lastNode.position.end.offset
                     : lastNode.loc.end
            },
            raw: nodes.map(node => node.raw).join(""),
            children: nodes
        };
    }
}

class Sections {
    constructor() {
        this.sectionMap = new Map();
    }

    getAllSections() {
        return this.sectionMap.values();
    }

    getSection(depth) {
        return this.sectionMap.get(depth);
    }

    /**
     * @param {number} depth
     * @returns {boolean}
     */
    hasSection(depth) {
        return this.sectionMap.has(depth)
    }

    /**
     * @param {Section} section
     */
    addSection(section) {
        this.sectionMap.set(section.level, section);
    }

    /**
     * @param {Object} node
     */
    addNodeToAllSections(node) {
        this.sectionMap.forEach(section => {
            section.add(node);
        });
    }

    /**
     * @param {number} depth
     * @returns {*}
     */
    popSection(depth) {
        const section = this.sectionMap.get(depth);
        this.sectionMap.delete(depth);
        return section;
    }
}

/**
 * create `sections` from `txtAST`
 * @param {Object} txtAST
 * @returns {Array[]} sections - the section is array of the section nodes
 */
module.exports = function(txtAST) {
    let traversingLevel = 0;
    let previousHeaderLevel = NaN;
    const sections = new Sections();
    const rootSection = new Section(0);
    sections.addSection(rootSection);
    const resultSections = [rootSection];
    // support txt-ast and mdast
    const headerType = /(Header|heading)/i;
    // remark and txtast
    const rootType = /(Document|Root)/i;

    traverse(txtAST, {
        enter(node) {
            if (headerType.test(node.type)) {
                if (!sections.hasSection(node.depth)) {
                    const newSection = new Section(node.depth);
                    sections.addSection(newSection);
                } else {
                    const prevSection = sections.popSection(node.depth);
                    resultSections.push(prevSection);
                    const newSection = new Section(node.depth);
                    sections.addSection(newSection);
                }
                previousHeaderLevel = traversingLevel;
            }
            if (traversingLevel === previousHeaderLevel) {
                sections.addNodeToAllSections(node);
            }
            traversingLevel++;
        },
        leave(node) {
            traversingLevel--;
            if (rootType.test(node.type)) {
                sections.getAllSections().forEach(section => {
                    if (resultSections.indexOf(section) === -1) {
                        resultSections.push(section);
                    }
                });
            }
        }
    });
    return resultSections.map(section => section.toSectionNode());
};
